import { Router } from "express";
import {
  getAllCollegesList,
  editDetails,
  createQuestion,
  registerInstructor,
  loginInstructor,
  logoutInstructor,
  getMyStudents,
  getMyQuestions,
  getRoomsByRoomIds,
  getSolvedQuestionData,
  getSolutionsByStudentId,
} from "../controllers/instructor.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

//auth
router.route("/register-instructor").post(registerInstructor);
router.route("/login-instructor").post(loginInstructor);
router.route("/logout-instructor").post(authMiddleware, logoutInstructor);

// get all institute route
router.route("/get-all-college-list").get(authMiddleware, getAllCollegesList);
router.route("/edit-details").post(authMiddleware, editDetails);
router.route("/post-question").post(authMiddleware, createQuestion); // add middleware
router.route("/get-my-students").post(authMiddleware, getMyStudents);
router.route("/get-my-questions").post(authMiddleware, getMyQuestions);

router.route("/find-room-by-email").post(authMiddleware, getRoomsByRoomIds);
router
  .route("/get-solved-question-data")
  .post(authMiddleware, getSolvedQuestionData);

router
  .route("/get-solution-by-studentId")
  .post(authMiddleware, getSolutionsByStudentId);

export default router;
