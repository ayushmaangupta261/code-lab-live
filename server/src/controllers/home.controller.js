import { Student } from "../models/student.model.js";
import { Instructor } from "../models/instructor.model.js";
import { Institute } from "../models/institute.model.js";

// Get total number of entries in all collections
const getEntityCounts = async (req, res) => {
  try {
    const [studentCount, instructorCount, instituteCount] = await Promise.all([
      Student.countDocuments(),
      Instructor.countDocuments(),
      Institute.countDocuments(),
    ]);

    if (!studentCount || !instructorCount || !instituteCount) {
      return res.status(400).json({
        message: "Nothing is found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        students: studentCount,
        instructors: instructorCount,
        institutes: instituteCount,
      },
    });
  } catch (error) {
    console.error("Error in getEntityCounts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch entity counts",
    });
  }
};

export { getEntityCounts };
