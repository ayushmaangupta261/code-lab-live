import fs from "fs/promises"; // ✅ promise version of fs

import path from "path";
import { Room } from "../models/room.model.js";
import { Student } from "../models/student.model.js"; // Ensure you're importing the Mongoose model
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";


// Get the directory name equivalent of __dirname in ES Modules

// const createAndJoinRoom = async (req, res) => {
//   try {
//     const { roomId, email, projectName, userId } = req.body.data;

//     if (!roomId || !email || !projectName || !userId) {
//       return res.status(400).json({ message: "roomId and email are required" });
//     }

//     console.log("Data -> ", req.body.data);

//     const StudentInDB = await Student.findOne({ email });
//     if (!StudentInDB) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     let existingRoom = await Room.findOne({ roomId });

//     if (existingRoom) {
//       const alreadyPresent = existingRoom.students.some(
//         (studentId) => studentId.toString() === StudentInDB._id.toString()
//       );

//       if (!alreadyPresent) {
//         existingRoom.students.push(StudentInDB._id);
//         await existingRoom.save();
//       }

//       const populatedRoom = await Room.findById(existingRoom._id)
//         .populate("students", "fullName email _id")
//         .populate("instructor", "fullName email _id");

//       console.log("Sending response in already present");

//       return res.status(200).json({
//         message: "Student added to existing room",
//         roomData: populatedRoom,
//         success: true,
//       });
//     } else {
//       // Create a new room and create folder for the roomId

//       // Create folder with the roomId inside server/projects
//       // const projectFolderPath =
//       //   "D:/Web Development/compiler/code/server/projects/" + roomId;
//       // console.log("Hardcoded Path -> ", projectFolderPath); // Check resolved path

//       // // Create the directory if it doesn't exist

//       // if (!fs.existsSync(projectFolderPath)) {
//       //   console.log("Folder does not exist. Creating...");
//       //   fs.mkdirSync(projectFolderPath, { recursive: true });
//       // } else {
//       //   console.log("Folder already exists.");
//       // }

//       const __filename = fileURLToPath(import.meta.url);
//       const __dirname = dirname(__filename);

//       // Go two levels up from current directory
//       const projectFolderPath = resolve(__dirname, "../../projects", roomId);

//       try {
//         if (!fs.existsSync(projectFolderPath)) {
//           console.log(
//             "Folder does not exist. Creating... -> ",
//             projectFolderPath
//           );
//           fs.mkdirSync(projectFolderPath, { recursive: true });
//         } else {
//           console.log("Folder already exists.");
//         }
//       } catch (err) {
//         console.error("Error while checking/creating folder:", err.message);
//       }

//       const newRoom = await Room.create({
//         roomId,
//         students: [StudentInDB._id],
//         instructor: StudentInDB?.instructor,
//         college: StudentInDB?.collegeId,
//         projectName: projectName,
//       });

//       const populatedRoom = await Room.findById(newRoom._id)
//         .populate("students", "fullName email -_id")
//         .populate("instructor", "fullName email -_id");

//       console.log("Sending response in new");

//       return res.status(201).json({
//         message: "Room created and Student added",
//         room: populatedRoom,
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.error("Error creating room:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

// const createAndJoinRoom = async (req, res) => {
//   try {
//     const { roomId, email, projectName, userId } = req.body.data;

//     if (!roomId || !email || !projectName || !userId) {
//       return res.status(400).json({ message: "roomId, email, projectName, and userId are required" });
//     }

//     console.log("Data -> ", req.body.data);

//     const StudentInDB = await Student.findOne({ email });
//     if (!StudentInDB) return res.status(404).json({ message: "Student not found" });

//     let existingRoom = await Room.findOne({ roomId });

//     if (existingRoom) {
//       const alreadyInRoom = existingRoom.students.some(
//         (studentId) => studentId.toString() === StudentInDB._id.toString()
//       );

//       if (!alreadyInRoom) {
//         existingRoom.students.push(StudentInDB._id);
//         await existingRoom.save();
//       }

//       if (!StudentInDB.room.includes(existingRoom._id)) {
//         StudentInDB.room.push(existingRoom._id);
//         await StudentInDB.save();
//       }

//       const populatedRoom = await Room.findById(existingRoom._id)
//         .populate("students", "fullName email _id")
//         .populate("instructor", "fullName email _id");

//       return res.status(200).json({
//         message: "Student added to existing room",
//         roomData: populatedRoom,
//         success: true,
//       });
//     } else {
//       // Docker-friendly folder path
//       const projectFolderPath = resolve("/app/projects", roomId);

//       try {
//         await fs.mkdir(projectFolderPath, { recursive: true });
//         console.log("Folder created or already exists -> ", projectFolderPath);
//       } catch (err) {
//         console.error("Error creating folder:", err.message);
//       }

//       const newRoom = await Room.create({
//         roomId,
//         students: [StudentInDB._id],
//         instructor: StudentInDB?.instructor,
//         college: StudentInDB?.collegeId,
//         projectName,
//       });

//       if (!StudentInDB.room.includes(newRoom._id)) {
//         StudentInDB.room.push(newRoom._id);
//         await StudentInDB.save();
//       }

//       const populatedRoom = await Room.findById(newRoom._id)
//         .populate("students", "fullName email -_id")
//         .populate("instructor", "fullName email -_id");

//       return res.status(201).json({
//         message: "Room created and Student added",
//         room: populatedRoom,
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.error("Error creating room:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };





const createAndJoinRoom = async (req, res) => {
  try {
    const { roomId, email, projectName, userId } = req.body.data;
    if (!roomId || !email || !projectName || !userId)
      return res.status(400).json({ message: "roomId, email, projectName, and userId are required" });

    const StudentInDB = await Student.findOne({ email });
    if (!StudentInDB) return res.status(404).json({ message: "Student not found" });

    let existingRoom = await Room.findOne({ roomId });

    if (existingRoom) {
      if (!existingRoom.students.includes(StudentInDB._id)) {
        existingRoom.students.push(StudentInDB._id);
        await existingRoom.save();
      }

      if (!StudentInDB.room.includes(existingRoom._id)) {
        StudentInDB.room.push(existingRoom._id);
        await StudentInDB.save();
      }

      const populatedRoom = await Room.findById(existingRoom._id)
        .populate("students", "fullName email _id")
        .populate("instructor", "fullName email _id");

      return res.status(200).json({ message: "Student added to existing room", roomData: populatedRoom, success: true });
    } else {
      // 🔥 Create folder in root/projects/<roomId>
      // const projectFolderPath = `projects/${roomId}`;
      const projectFolderPath = path.resolve("/app/projects", roomId);

      console.log("Path -> ", projectFolderPath);

      try {
        await fs.mkdir(projectFolderPath, { recursive: true });
        console.log("Folder created -> ", projectFolderPath);
      } catch (err) {
        console.error("Error creating folder:", err);
      }

      const newRoom = await Room.create({
        roomId,
        students: [StudentInDB._id],
        instructor: StudentInDB?.instructor,
        college: StudentInDB?.collegeId,
        projectName,
      });

      if (!StudentInDB.room.includes(newRoom._id)) {
        StudentInDB.room.push(newRoom._id);
        await StudentInDB.save();
      }

      const populatedRoom = await Room.findById(newRoom._id)
        .populate("students", "fullName email -_id")
        .populate("instructor", "fullName email -_id");

      return res.status(201).json({ message: "Room created and Student added", room: populatedRoom, success: true });
    }
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};




// const findRoomByEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log("Email body -> ", req.body);

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // Find the student by email
//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Find all rooms where the student is present
//     const rooms = await Room.find({ students: student._id })
//       .populate("students", "fullName email _id")
//       .populate("instructor", "fullName email _id");

//     if (!rooms || rooms.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No rooms found for this student" });
//     }

//     console.log("Returning room data");

//     return res.status(200).json({
//       message: "Rooms found",
//       rooms: rooms,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error finding room:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

const findRoomByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.room || student.room.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms found for this student" });
    }

    console.log("Rooms -> ", student.room);

    // Assuming student.room contains ObjectIds
    const rooms = await Room.find({ _id: { $in: student.room } })
      .populate("students", "fullName email _id")
      .populate("instructor", "fullName email _id");

    return res.status(200).json({
      message: "Rooms found",
      rooms,
      success: true,
    });
  } catch (error) {
    console.error("Error finding rooms:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export { createAndJoinRoom, findRoomByEmail };
