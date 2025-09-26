
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store/index.js";
import Home from "./pages/Home.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import CreateAndJoinPage from "./pages/CreateAndJoinPage.jsx";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import Projects from "./components/Dashboard/DashboardComponent/Projects.jsx";
import Overview from "./components/Dashboard/DashboardComponent/Overview.jsx";
import { Assignment } from "./components/Dashboard/DashboardComponent/Assignment.jsx";
import DailySchedule from "./components/Dashboard/DashboardComponent/DailySchedule.jsx";
import QuestionsSolved from "./components/Dashboard/DashboardComponent/QuestionsSolved.jsx";
import Jobs from "./components/Dashboard/DashboardComponent/Jobs.jsx";
import { JobUpdates } from "./components/Dashboard/DashboardComponent/JobUpdates.jsx";
import Settings from "./components/Dashboard/DashboardComponent/Settings.jsx";
import Notification from "./components/Dashboard/DashboardComponent/Notification.jsx";
import SubmitSolution from "./components/Editor/SubmitSolution.jsx";
import CreateQuestion from "./components/Dashboard/DashboardComponent/CreateQuestion.jsx";
import About from "./pages/AboutUs.jsx";

import ViewSolvedQuestions from "./components/Dashboard/DashboardComponent/ViewSolvedQuestions.jsx";
import Students from "./components/Dashboard/DashboardComponent/Students.jsx";
import AssignmentsSolved from "./components/Dashboard/DashboardComponent/Instructor-Students/AssignmentsSolved.jsx";
import StudentProjects from "./components/Dashboard/DashboardComponent/Instructor-Students/StudentProjects.jsx";
import Questions from "./components/Dashboard/DashboardComponent/Questions.jsx";
import ViewSolution from "./components/Dashboard/DashboardComponent/Instructor-Students/ViewSolution.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/create-and-join",
        element: <CreateAndJoinPage />,
      },
      {
        path: "/editor/:roomId",
        element: <EditorPage />,
      },
      {
        path: "/editor/submitSolution",
        element: <SubmitSolution />,
      },
      {
        path: "/about-us",
        element: <About />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/dashboard/overview",
            element: <Overview />,
          },
          {
            path: "/dashboard/assignments",
            element: <Assignment />,
          },
          {
            path: "/dashboard/daily-schedule",
            element: <DailySchedule />,
          },
          {
            path: "/dashboard/questions-solved",
            element: <QuestionsSolved />,
          },
          {
            path: "/dashboard/create-question",
            element: <CreateQuestion />,
          },
          {
            path: "/dashboard/jobs",
            element: <Jobs />,
          },
          {
            path: "/dashboard/job-updates",
            element: <JobUpdates />,
          },
          {
            path: "/dashboard/notification",
            element: <Notification />,
          },
          {
            path: "/dashboard/projects",
            element: <Projects />,
          },
          {
            path: "/dashboard/settings",
            element: <Settings />,
          },
          {
            path: "/dashboard/instructor-projects",
            element: <Students />,
          },
          {
            path: "/dashboard/solved-assignments/:questionId",
            element: <AssignmentsSolved />,
          },
          {
            path: "/dashboard/student-projects",
            element: <StudentProjects />,
          },
          {
            path: "/dashboard/questions-Solved/view-solved-questions",
            element: <ViewSolvedQuestions />,
          },
          {
            path: "/dashboard/my-questions",
            element: <Questions />,
          },
          {
            path: "/dashboard/view-solution/:studentId",
            element: <ViewSolution />,
          },
        ],
      },
      ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />

    <Toaster
      position="top-right"
      reverseOrder={false}
      containerStyle={{
        marginTop: "1rem",
        marginRight: "1rem",
      }}
          />
  </Provider>
);
