import { Student } from "../models/student.model.js";
import { Institute } from "../models/institute.model.js";
import { Instructor } from "../models/instructor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { log } from "console";


// Token generator
const generateStudentTokens = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const accessToken = student.generateAccessToken();
  const refreshToken = student.generateRefreshToken();

  student.accessToken = accessToken;
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// Register
const registerStudent = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  const existing = await Student.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Student already exists" });
  }

  const student = await Student.create({
    fullName,
    email,
    password,
    accountType: "Student",
  });
  const { accessToken, refreshToken } = await generateStudentTokens(
    student._id
  );

  const studentData = student.toObject();
  delete studentData.password;
  delete studentData.refreshToken;
  studentData.accessToken = accessToken;

  await new Promise((resolve) => setTimeout(resolve, 5000));

  res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .json({ success: true, user: studentData });
};

// Login
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  console.log("Student -> ", req.body);

  const student = await Student.findOne({ email })
    .populate({
      path: "questionsSolved",
      select: "title description",
    }) // Full questions data
    .populate({
      path: "collegeId",
      select: "name email studentsEnrolled",
    })
    .populate({
      path: "instructor",
      select: "fullName email mobileNumber subject",
    });

  if (!student || !(await student.isPasswordCorrect(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateStudentTokens(
    student._id
  );

  const studentData = student.toObject();
  delete studentData.password;
  delete studentData.refreshToken;
  studentData.accessToken = accessToken;

  await new Promise((resolve) => setTimeout(resolve, 5000));

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .json({ success: true, user: studentData });
};

// Logout
const logoutStudent = async (req, res) => {
  const user = req.user;

  console.log("USer -> ", user);

  const student = await Student.findById(req.user._id);
  if (!student)
    return res
      .status(400)
      .json({ success: false, message: "Already logged out" });

  console.log("Logging out");

  student.accessToken = null;
  student.refreshToken = null;
  await student.save();

  res
    .status(200)
    .json({ success: true, message: "Student logged out successfully" });
};

// function to check auth status
const authStatus = async (req, res) => {
  try {
    const { user } = req;
    // console.log("User -> ,", user);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User is not loggedin",
      });
    }

    const userInDB = await User.findById(user._id);

    if (!userInDB) {
      return res.status(400).json({
        status: false,
        message: "User doesn't exist",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User Authenticated",
    });
  } catch (error) {
    console.log("Error in auth status ->", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get all colleges
const getAllCollegesListForStudents = async (req, res) => {
  try {
    const user = req.user;
    console.log("Fetching colleges");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Get all colleges and populate instructors
    const collegeList = await Institute.find()
      .select("name email subjects instructorsPresent") // select required fields
      .populate({
        path: "instructorsPresent",
        select: "fullName email subject", // populate only necessary instructor fields
      });

    if (!collegeList || collegeList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No colleges found",
      });
    }

    return res.status(200).json({
      success: true,
      data: collegeList,
    });
  } catch (error) {
    console.log("Error in finding college list -> ", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// edit details
const editStudentDetails = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body.data;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const { college, teacher, subject, mobileNumber } = data;

    if (!college || !teacher || !subject || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide college, teacher, subject, and mobile number",
      });
    }

    const existingStudent = await Student.findById(user._id);

    // Fetch current student data
    // If college or subject or teacher has changed, remove student from previous associations
    if (existingStudent.collegeId?.toString() !== college) {
      // Remove student from previous college
      await Institute.updateMany(
        { studentsEnrolled: existingStudent._id },
        { $pull: { studentsEnrolled: existingStudent._id } }
      );
    }

    if (existingStudent.instructor?.toString() !== teacher) {
      // Remove student from previous instructor
      await Instructor.updateMany(
        { students: existingStudent._id },
        { $pull: { students: existingStudent._id } }
      );
    }

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Remove student from previous instructor (if changed)
    if (existingStudent.instructor?.toString() !== teacher) {
      await Instructor.updateMany(
        { students: existingStudent._id },
        { $pull: { students: existingStudent._id } }
      );
    }

    // Remove student from previous college (if changed)
    if (existingStudent.collegeId?.toString() !== college) {
      await Institute.updateMany(
        { studentsEnrolled: existingStudent._id },
        { $pull: { studentsEnrolled: existingStudent._id } }
      );
    }

    // Update student document
    const updatedStudent = await Student.findByIdAndUpdate(
      user._id,
      {
        collegeId: college,
        instructor: teacher,
        subject,
        mobileNumber,
      },
      { new: true }
    );

    // Add to new instructor
    await Instructor.findByIdAndUpdate(
      teacher,
      { $addToSet: { students: updatedStudent._id } },
      { new: true }
    );

    // Add to new institute
    await Institute.findByIdAndUpdate(
      college,
      { $addToSet: { studentsEnrolled: updatedStudent._id } },
      { new: true }
    );

    // Populate instructor and college in final response
    const populatedStudent = await Student.findById(
      updatedStudent._id
    ).populate("collegeId instructor");

    return res.status(200).json({
      success: true,
      message: "Student details updated successfully",
      data: populatedStudent,
    });
  } catch (error) {
    console.error("Error updating student details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  registerStudent,
  loginStudent,
  authStatus,
  logoutStudent,
  getAllCollegesListForStudents,
  editStudentDetails,
};
