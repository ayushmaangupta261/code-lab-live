import { Instructor } from "../models/instructor.model.js";
import { Question } from "../models/question.model.js";
import { Example } from "../models/example.model.js";
import { SampleCode } from "../models/sampleCode.model.js";
import { Institute } from "../models/institute.model.js";
import { Room } from "../models/room.model.js";
import { Solution } from "../models/solution.model.js";
import { Student } from "../models/student.model.js";

const generateInstructorTokens = async (instructorId) => {
  const instructor = await Instructor.findById(instructorId);
  if (!instructor) throw new Error("Instructor not found");

  const accessToken = instructor.generateAccessToken();
  const refreshToken = instructor.generateRefreshToken();

  instructor.accessToken = accessToken;
  instructor.refreshToken = refreshToken;
  await instructor.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerInstructor = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  const existing = await Instructor.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Instructor already exists" });
  }

  const instructor = await Instructor.create({
    fullName,
    email,
    password,
    accountType: "Instructor",
  });
  const { accessToken, refreshToken } = await generateInstructorTokens(
    instructor._id
  );

  const instructorData = instructor.toObject();
  delete instructorData.password;
  delete instructorData.refreshToken;
  instructorData.accessToken = accessToken;

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
    .json({ success: true, user: instructorData });
};

const loginInstructor = async (req, res) => {
  const { email, password } = req.body;

  const instructor = await Instructor.findOne({ email }).populate("collegeId");

  if (!instructor || !(await instructor.isPasswordCorrect(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateInstructorTokens(
    instructor._id
  );

  const instructorData = instructor.toObject();
  delete instructorData.password;
  delete instructorData.refreshToken;
  instructorData.accessToken = accessToken;

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
    .json({ success: true, user: instructorData });
};

const logoutInstructor = async (req, res) => {
  console.log("Req. body -> ", req.user);
  const instructor = await Instructor.findById(req?.user._id);
  if (!instructor)
    return res
      .status(400)
      .json({ success: false, message: "Already logged out" });

  instructor.accessToken = null;
  instructor.refreshToken = null;
  await instructor.save();

  res
    .status(200)
    .json({ success: true, message: "Instructor logged out successfully" });
};

// create a new Question
const createQuestion = async (req, res) => {
  try {
    const { question, sampleCode, examples } = req.body;
    const user = req.user;

    const {
      title,
      description,
      java,
      python,
      cpp,
      explanation,
      sampleInput,
      sampleOutput,
    } = req.body;

    console.log("🔹 Received Data:", req.body);

    // ✅ Convert comma-separated strings into arrays
    const toArray = (value) =>
      value ? value.split(",").map((str) => str.trim()) : [];

    // ✅ Convert all comma-separated fields into arrays
    const sampleInputArray = toArray(sampleInput);
    const sampleOutputArray = toArray(sampleOutput);
    const explanationArray = toArray(explanation);

    console.log("Input array -> ", sampleInputArray);
    console.log("Output array -> ", sampleOutputArray);
    console.log("explanation array -> ", explanationArray);

    const exampleInDB = await Example.create({
      input: sampleInputArray,
      output: sampleOutputArray,
      explanation: explanationArray,
    });

    if (!exampleInDB) {
      return res
        .status(500)
        .json({ message: "Failed to create example", success: false });
    }

    console.log("✅ Example ID ->", exampleInDB._id.toString());

    // 🔹 Create Sample Code Entry
    const sampleCodeInDB = await SampleCode.create({
      java: java,
      cpp: cpp,
      python: python,
    });

    if (!sampleCodeInDB) {
      return res
        .status(500)
        .json({ message: "Failed to create sample code", success: false });
    }

    console.log("✅ Sample Code ID ->", sampleCodeInDB._id.toString());

    // 🔹 Create Question Entry
    const questionInDB = await Question.create({
      title: title,
      description: description,
      images: null,
      sampleCode: sampleCodeInDB._id, // Store ObjectId directly
      example: exampleInDB._id, // Store ObjectId directly
      createdBy: user._id, // Store ObjectId directly
    });

    if (!questionInDB) {
      return res
        .status(500)
        .json({ message: "Failed to create question", success: false });
    }

    console.log("✅ Question Created Successfully!");

    const instructorInDB = await Instructor.findByIdAndUpdate(
      { _id: user._id },
      {
        $addToSet: { questions: questionInDB._id }, // ensures no duplicates
      },
      { new: true }
    );

    return res.status(201).json({
      message: "Question created successfully",
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in createQuestion:", error);
    return res.status(500).json({
      message: "Server error while creating question",
      success: false,
    });
  }
};

// get all colleges
const getAllCollegesList = async (req, res) => {
  try {
    const user = req.user;

    // console.log("User in clg list -> ", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorised access",
      });
    }

    const collegeList = await Institute.find();

    if (!collegeList) {
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
    console.log("Error in finding clg list -> ", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// edit details
// const editDetails = async (req, res) => {
//   try {
//     const { college, subject, mobileNumber } = req.body.data;

//     console.log("Req body -> ", req.body.data);

//     if (!college || !subject || !mobileNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "Provide all the details",
//       });
//     }

//     const user = req.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized in edit instructor",
//       });
//     }

//     // Fetch current instructor to get previous college
//     const currentInstructor = await Instructor.findById(user._id);

//     if (!currentInstructor) {
//       return res.status(404).json({
//         success: false,
//         message: "Instructor not found",
//       });
//     }

//     const previousCollegeId = currentInstructor.collegeId;

//     // If instructor is already in a different college, remove them from the old one
//     if (previousCollegeId && previousCollegeId.toString() !== college) {
//       // Remove instructor from previous institute
//       await Institute.findByIdAndUpdate(previousCollegeId, {
//         $pull: { instructorsPresent: user._id },
//       });
//     }

//     // Clear students enrolled under this instructor and update other fields
//     const instructorInDB = await Instructor.findByIdAndUpdate(
//       user._id,
//       {
//         $set: {
//           students: [],
//           questions: [],
//           collegeId: college,
//           mobileNumber: mobileNumber,
//           subject: subject,
//         },
//       },
//       { new: true }
//     )
//       .populate("collegeId")
//       .populate("questions")
//       .populate("students");

//     if (!instructorInDB) {
//       return res.status(500).json({
//         success: false,
//         message: "Error updating instructor",
//       });
//     }

//     delete instructorInDB.password;
//     delete instructorInDB.refreshToken;

//     console.log("Updated Instructor ->", instructorInDB);

//     // Add instructor to new college
//     const instituteInDB = await Institute.findByIdAndUpdate(
//       college,
//       { $addToSet: { instructorsPresent: user._id } },
//       { new: true }
//     );

//     console.log("Updated Institute ->", instituteInDB);

//     return res.status(200).json({
//       success: true,
//       message: "Instructor details updated successfully",
//       data: instructorInDB,
//     });
//   } catch (error) {
//     console.error("Error in editDetails:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while editing details",
//     });
//   }
// };

const editDetails = async (req, res) => {
  try {
    const { college, subject, mobileNumber } = req.body.data;

    if (!college || !subject || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Provide all the details",
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized in edit instructor",
      });
    }

    // Fetch current instructor
    const currentInstructor = await Instructor.findById(user._id);

    if (!currentInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const previousCollegeId = currentInstructor.collegeId;

    // If instructor switched college, remove from old college
    if (previousCollegeId && previousCollegeId.toString() !== college) {
      await Institute.findByIdAndUpdate(previousCollegeId, {
        $pull: { instructorsPresent: user._id },
      });
    }

    // **Remove instructor from all students that reference this instructor**
    await Student.updateMany(
      { instructor: user._id }, // Find students with this instructor
      { $unset: { instructor: "" } } // Remove the instructor field
    );

    // Update instructor details, clear students & questions arrays
    const instructorInDB = await Instructor.findByIdAndUpdate(
      user._id,
      {
        $set: {
          students: [],
          questions: [],
          collegeId: college,
          mobileNumber: mobileNumber,
          subject: subject,
        },
      },
      { new: true }
    )
      .populate("collegeId")
      .populate("questions")
      .populate("students");

    if (!instructorInDB) {
      return res.status(500).json({
        success: false,
        message: "Error updating instructor",
      });
    }

    delete instructorInDB.password;
    delete instructorInDB.refreshToken;

    // Add instructor to new college
    await Institute.findByIdAndUpdate(
      college,
      { $addToSet: { instructorsPresent: user._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Instructor details updated successfully",
      data: instructorInDB,
    });
  } catch (error) {
    console.error("Error in editDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while editing details",
    });
  }
};

// get my students
const getMyStudents = async (req, res) => {
  try {
    const user = req.user;

    const userInDB = await Instructor.findById(user._id).populate({
      path: "students",
      select: "fullName email mobileNumber questionsSolved room",
      // populate: [
      //   {
      //     path: "room",
      //     model: "Room", // Make sure this matches your Room model name
      //   },
      //   {
      //     path: "questionsSolved",
      //     model: "Solution", // Make sure this matches your Question model name
      //   },
      // ],
    });

    console.log("Students -> ", userInDB);

    if (!userInDB) {
      return res.status(400).json({
        success: false,
        message: "Error in finding enrolled students",
      });
    }

    return res.status(200).json({
      success: true,
      data: userInDB.students,
    });
  } catch (error) {
    console.log("Error in finding enrolled students");
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyQuestions = async (req, res) => {
  try {
    const user = req.user;

    // Check if user exists (optional if JWT auth already does this)
    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find questions where the current instructor is the creator
    // const questions = await Instructor.find(user._id);
    // // .populate({
    // //   path: "solvedBy",
    // //   model: "Student",
    // //   select: "fullName email", // Only get fullName and email of students
    // // });

    // const instructor = await Instructor.findById(user._id).populate({
    //   path: "questions",
    //   model: "Question",
    //   select: "title description studentsSolvedTheQuestions", // customize as needed
    //   populate: {
    //     path: "studentsSolvedTheQuestions",
    //     model: "User", // or "Student" depending on your schema
    //     select: "fullName email", // student details
    //   },
    // });

    // return res.status(200).json({
    //   success: true,
    //   instructor, // Send back the populated questions
    // });

    const instructor = await Instructor.findById(user._id).populate({
      path: "questions",
      model: "Question",
      select: "title description solvedBy", // get question info
      populate: {
        path: "solvedBy",
        model: "Student", // or "User" depending on your schema
        select: "fullName email", // get student info
      },
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }
    console.log("questions -> ", instructor.questions);

    // Return only the populated questions array
    return res.status(200).json({
      success: true,
      questions: instructor.questions,
    });
  } catch (error) {
    console.error("Error in getMyQuestions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve questions",
    });
  }
};

// get questions solved by the students
const getSolvedQuestionData = async (req, res) => {
  try {
    // user in the request
    const user = req.user;

    console.log("questions data");

    // validation on user
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    // question id
    const { questionId } = req.body;

    // validation on question
    if (!questionId) {
      return res.status(400).json({
        message: "Question ID is missing",
        success: false,
      });
    }

    // find questions solved
    const solvedQuestions = await Question.findById(questionId);
    if (!solvedQuestions) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // questions solved
    const question = await Question.findById(questionId)
      .populate("solvedBy", "fullName _id email mobileNumber")
      .exec();

    // validation
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    console.log("Question solved by students: -> ", question);

    // const studentsArray = question.solvedBy.map(
    //   (student) => ({
    //     id: student._id,
    //     fullName: student.fullName,
    //   })
    // );

    // // log the details
    // if (!studentsArray) {
    //   return res.status(404).json({
    //     message: "Error in studentsArray",
    //     success: false,
    //   });
    // }

    // console.log("Students solved the question: -> ", studentsArray);

    return res.status(200).json({
      message: "Solved questions by students",
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Error in getSolvedQuestions:", error);
    return res.status(500).json({
      message: "Server error while getting solved questions",
      success: false,
    });
  }
};

// get the rooms
const getRoomsByRoomIds = async (req, res) => {
  try {
    const { roomIds } = req.body;

    console.log("Room id -> ", roomIds);

    if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "roomIds array is required in request body",
      });
    }

    // Find rooms matching any of the roomIds in the array
    const rooms = await Room.find({ _id: { $in: roomIds } })
      .populate("students", "fullName email mobileNumber")
      .populate("instructor", "fullName email")
      .populate("college", "name address");

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rooms found for the given roomIds",
      });
    }

    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error("Error in getRoomsByRoomIds controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching rooms",
      error: error.message,
    });
  }
};

// controllers/solutionController.js
const getSolutionsByStudentId = async (req, res) => {
  try {
    const { studentId, questionId } = req.body;

    console.log("Student ID ->", studentId);
    console.log("Question ID ->", questionId);

    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID is required" });
    }

    // Build query object
    const query = { solvedBy: studentId };
    if (questionId) {
      query.questionId = questionId;
    }

    const solutions = await Solution.find(query)
      .populate("questionId", "title description")
      .populate("solvedBy", "fullName email");

    if (!solutions || solutions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No solutions found for this student",
      });
    }

    res.status(200).json({
      success: true,
      message: "Solutions fetched successfully",
      data: solutions,
    });
  } catch (error) {
    console.error("Error fetching student solutions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  registerInstructor,
  loginInstructor,
  logoutInstructor,
  createQuestion,
  getAllCollegesList,
  editDetails,
  getMyStudents,
  getMyQuestions,
  getRoomsByRoomIds,
  getSolvedQuestionData,
  getSolutionsByStudentId,
};
