import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import authMiddleware from "./middlewares/auth.middleware.js";

// Get the root directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"), // Go up one level to find the .env file
});

const app = express();

console.log(process.env.CORS_ORIGIN);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// importing the routes
import studentRoute from "./routes/student.routes.js";
import codeingRoutes from "./routes/code.routes.js";
import instituteRoutes from "./routes/institute.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import codeColaborationRoutes from "./routes/codeColaboration.route.js";
import instrucrtorRoutes from "./routes/instructor.routes.js";
import roomRoutes from "./routes/room.routes.js";
import homeRoutes from "./routes/home.routes.js";

// route declaration  
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/code", codeingRoutes);
app.use("/api/v1/institute", instituteRoutes);
app.use("/api/v1/ai-routes", aiRoutes);
app.use("/api/v1/code-collaboration", codeColaborationRoutes);
app.use("/api/v1/room", roomRoutes);

app.use("/api/v1/assignment", assignmentRoutes);
app.use("/api/v1/instructor", instrucrtorRoutes);

app.use("/api/v1/home-routes", homeRoutes);

export { app };
