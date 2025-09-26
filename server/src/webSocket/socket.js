
import { spawn } from "@lydell/node-pty";
import ACTIONS from "../constants/Actions.js"; // Import action constants
import chokidar from "chokidar"; // ✅ fixed typo
import fs from "fs/promises";

const BASE_PROJECTS_DIR = "/app/projects"; // ✅ absolute path in Docker

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

    // Join a room
    socket.on(ACTIONS.JOIN, ({ roomId, email, fullName }) => {
      if (!roomId || !email) return;
      userSocketMap[socket.id] = email;
      socket.join(roomId);

      const clients = getAllConnectedClients(roomId);
      io.to(roomId).emit(ACTIONS.JOINED, {
        clients,
        email,
        socketId: socket.id,
        fullName,
      });
    });

    // Code changes
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      if (roomId) socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      if (socketId) io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Save file
    socket.on(ACTIONS.FILE_CHANGE, async ({ path, content }) => {
      try {
        const filePath = `${BASE_PROJECTS_DIR}/${path}`;
        await fs.mkdir(filePath.substring(0, filePath.lastIndexOf("/")), {
          recursive: true,
        }); // ensure folder exists
        await fs.writeFile(filePath, content);
        console.log(`File saved: ${filePath}`);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    });

    // Delete file/folder
    socket.on(ACTIONS.DELETE_FILE, async ({ path }) => {
      try {
        const fullPath = `${BASE_PROJECTS_DIR}/${path}`;
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.unlink(fullPath);
        }
        io.emit("file:refresh");
        console.log(`Deleted: ${fullPath}`);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    });

    // Terminal Integration
    (async () => {
      try {
        const roomId = socket.handshake.query.roomId;
        const shell = "/bin/sh"; // ✅ always available in Linux/Render

        // Ensure project dir exists
        const projectDir = `${BASE_PROJECTS_DIR}/${roomId}`;
        await fs.mkdir(projectDir, { recursive: true });

        const ptyProcess = spawn(shell, [], {
          name: "xterm-color",
          cols: 80,
          rows: 24,
          cwd: projectDir, // ✅ safe now
          env: process.env,
        });

        ptyProcess.onData((data) => socket.emit("output", data));

        socket.on("input", (data) => ptyProcess.write(data));
        socket.on("resize", ({ cols, rows }) => ptyProcess.resize(cols, rows));
        socket.on("disconnect", () => ptyProcess.kill());
      } catch (error) {
        console.error("Error initializing terminal:", error);
      }
    })();
    

    // Watch projects folder
    chokidar.watch(BASE_PROJECTS_DIR).on("all", (event, path) => {
      io.emit("file:refresh", path);
    });

    // ------------------- Whiteboard + Call stuff (unchanged) -------------------

    socket.on("join-call", ({ roomId, emailId }) => {
      if (!roomId || !emailId) return;

      console.log(`User -> ${emailId} joined room -> ${roomId}`);

      emailToSocketMapping.set(emailId, socket.id);
      socketToEmailMapping.set(socket.id, emailId);

      socket.join(roomId);

      socket.broadcast.to(roomId).emit("joined-call", { emailId });
    });

    socket.on("join-board", ({ roomId, userId }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          history: [],
          users: new Map(),
          cursors: {},
        };
      }

      rooms[roomId].users.set(socket.id, userId);
      socket.join(roomId);

      console.log(`User ${userId} joined room: ${roomId}`);

      socket.emit("history", { history: rooms[roomId].history });
      socket.to(roomId).emit("user-joined", { userId });
    });

    socket.on("draw", (data) => {
      const { roomId, x0, y0, x1, y1, color } = data;
      if (!rooms[roomId]) return;

      rooms[roomId].history.push({ x0, y0, x1, y1, color });
      console.log("Draw -> ", data);
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
      rooms[roomId].cursors[userId] = data;
      socket.to(roomId).emit("cursor", data);
    });

    socket.on("disconnect", () => {
      const emailId = socketToEmailMapping.get(socket.id);
      if (emailId) {
        emailToSocketMapping.delete(emailId);
      }
      socketToEmailMapping.delete(socket.id);
      console.log("A user disconnected:", socket.id);

      const roomsLeft = Array.from(socket.rooms).filter((r) => r !== socket.id);
      roomsLeft.forEach((roomId) => {
        const room = rooms[roomId];
        if (room) {
          const userId = room.users.get(socket.id);
          if (userId && room.cursors[userId]) {
            delete room.cursors[userId];
            socket.to(roomId).emit("cursor-remove", { userId });
          }
          room.users.delete(socket.id);
          if (room.users.size === 0) {
            delete rooms[roomId];
          }
        }
      });
    });
  });
}


//----------------------------------------------------------------------================================================================================
