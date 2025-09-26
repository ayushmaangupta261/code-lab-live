
import { spawn } from "@lydell/node-pty";
import ACTIONS from "../constants/Actions.js"; // Import action constants
import chaukidar from "chokidar";
import fs from "fs/promises"; // ✅ Import the correct module

const userSocketMap = {}; // Store socket-user mappings
const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();
const rooms = {}; // { roomId: { history: [], users: Set<socket.id> } }
export function initializeSocket(io) {
  function getAllConnectedClients(roomId) {
    if (!roomId || !io.sockets.adapter.rooms.has(roomId)) return [];
    return Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId) => ({
      socketId,
      email: userSocketMap[socketId] || "Unknown",
    }));
  }

  io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    socket.on(ACTIONS.JOIN, ({ roomId, email, fullName }) => {
      if (!roomId || !email) return;

      userSocketMap[socket.id] = email;
      socket.join(roomId);

      const clients = getAllConnectedClients(roomId);
      io.to(roomId).emit(ACTIONS.JOINED, { clients, email, socketId: socket.id, fullName });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      if (roomId) socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      if (socketId) io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // File Save
    socket.on(ACTIONS.FILE_CHANGE, async ({ path, content }) => {
      try {
        await fs.writeFile(`/app/projects/${path}`, content);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    });

    // File Delete
    socket.on(ACTIONS.DELETE_FILE, async ({ path }) => {
      try {
        const fullPath = `/app/projects/${path}`;
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) await fs.rm(fullPath, { recursive: true, force: true });
        else await fs.unlink(fullPath);
        io.emit("file:refresh");
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    });

    // Terminal Integration (Linux-friendly for Docker)
    try {
      const roomId = socket.handshake.query.roomId;
      const shell = "bash"; // Docker runs Linux

      const ptyProcess = spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: `/app/projects/${roomId}`, // Docker path
        env: process.env,
      });

      ptyProcess.onData((data) => socket.emit("output", data));

      socket.on("input", (data) => ptyProcess.write(data));
      socket.on("resize", ({ cols, rows }) => ptyProcess.resize(cols, rows));
      socket.on("disconnect", () => ptyProcess.kill());
    } catch (error) {
      console.error("Error initializing terminal:", error);
    }

    // Watch projects folder
    chokidar.watch("/app/projects").on("all", (event, path) => {
      io.emit("file:refresh", path);
    });


    //----------------------------------------------------------------------------------------------------

    // Handle user joining a call
    socket.on("join-call", ({ roomId, emailId }) => {
      if (!roomId || !emailId) return;

      console.log(`User -> ${emailId} joined room -> ${roomId}`);

      emailToSocketMapping.set(emailId, socket.id);
      socketToEmailMapping.set(socket.id, emailId);

      socket.join(roomId);

      // Notify other users in the room
      socket.broadcast.to(roomId).emit("joined-call", { emailId });
    });

    socket.on("join-board", ({ roomId, userId }) => {
      // Initialize room if it doesn't exist
      if (!rooms[roomId]) {
        rooms[roomId] = {
          history: [],
          users: new Map(), // use Map to associate socketId with userId
          cursors: {},
        };
      }

      // Save user to room
      rooms[roomId].users.set(socket.id, userId);
      socket.join(roomId);

      console.log(`User ${userId} joined room: ${roomId}`);

      // Send drawing history only to the new user
      socket.emit("history", { history: rooms[roomId].history });

      // Optional: Notify others that a new user joined (for cursors, presence, etc.)
      socket.to(roomId).emit("user-joined", { userId });
    });

    socket.on("draw", (data) => {
      const { roomId, x0, y0, x1, y1, color } = data;
      if (!rooms[roomId]) return;

      // Save to drawing history
      rooms[roomId].history.push({ x0, y0, x1, y1, color });

      console.log("Drwa -> ", data);

      // Broadcast to others
      socket.to(roomId).emit("draw", data);
    });

    socket.on("undo", ({ roomId, userId }) => {
      socket.to(roomId).emit("undo", { userId });
    });

    socket.on("redo", ({ roomId, userId }) => {
      socket.to(roomId).emit("redo", { userId });
    });

    socket.on("clear-canvas", ({ roomId }) => {
      if (!rooms[roomId]) return;

      rooms[roomId].history = [];
      socket.to(roomId).emit("clear-canvas");
    });

    socket.on("theme-change", ({ roomId, theme, username }) => {
      socket.to(roomId).emit("theme-change", { theme, username });
    });

    socket.on("cursor", (data) => {
      const { roomId, userId } = data;
      if (!rooms[roomId]) return;

      // Update user’s cursor in memory to prevent duplicates
      rooms[roomId].cursors[userId] = data;

      // Emit cursor data to others
      socket.to(roomId).emit("cursor", data);
    });

    socket.on("disconnect", () => {
      const emailId = socketToEmailMapping.get(socket.id);

      if (emailId) {
        emailToSocketMapping.delete(emailId);
      }

      socketToEmailMapping.delete(socket.id);
      console.log("A user disconnected:", socket.id);

      // Iterate through rooms this socket was part of
      const roomsLeft = Array.from(socket.rooms).filter((r) => r !== socket.id);

      roomsLeft.forEach((roomId) => {
        const room = rooms[roomId];
        if (room) {
          const userId = room.users.get(socket.id);

          // 🔴 Remove cursor if it exists
          if (userId && room.cursors[userId]) {
            delete room.cursors[userId];

            // Notify others to remove the cursor
            socket.to(roomId).emit("cursor-remove", { userId });
          }

          // Remove user from room map
          room.users.delete(socket.id);

          // 🧹 Clean up room if empty
          if (room.users.size === 0) {
            delete rooms[roomId];
          }
        }
      });
    });

    // socket.on("disconnect", () => {
    //   const emailId = socketToEmailMapping.get(socket.id);

    //   if (emailId) {
    //     emailToSocketMapping.delete(emailId);
    //   }

    //   socketToEmailMapping.delete(socket.id);
    //   console.log("A user disconnected:", socket.id);

    //   // Handle room cleanup
    //   const roomsLeft = Array.from(socket.rooms).filter((r) => r !== socket.id);
    //   roomsLeft.forEach((roomId) => {
    //     const room = rooms[roomId];
    //     if (room && io.sockets.adapter.rooms.get(roomId)?.size === 1) {
    //       delete rooms[roomId]; // Clean up if it's the last user in the room
    //     }
    //   });
    // });
  });
}

//----------------------------------------------------------------------================================================================================
