import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import CreateAndJoinPage from './pages/CreateAndJoinPage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import SubmitSolution from './components/Editor/SubmitSolution.jsx';
import About from './pages/AboutUs.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';

// Dashboard Components
import Overview from './components/Dashboard/DashboardComponent/Overview.jsx';
import Assignment from './components/Dashboard/DashboardComponent/Assignment.jsx';
import DailySchedule from './components/Dashboard/DashboardComponent/DailySchedule.jsx';
import QuestionsSolved from './components/Dashboard/DashboardComponent/QuestionsSolved.jsx';
import Jobs from './components/Dashboard/DashboardComponent/Jobs.jsx';
import JobUpdates from './components/Dashboard/DashboardComponent/JobUpdates.jsx';
import Settings from './components/Dashboard/DashboardComponent/Settings.jsx';
import Notification from './components/Dashboard/DashboardComponent/Notification.jsx';
import Projects from './components/Dashboard/DashboardComponent/Projects.jsx';
import CreateQuestion from './components/Dashboard/DashboardComponent/CreateQuestion.jsx';
import ViewSolvedQuestions from './components/Dashboard/DashboardComponent/ViewSolvedQuestions.jsx';
import Students from './components/Dashboard/DashboardComponent/Students.jsx';
import AssignmentsSolved from './components/Dashboard/DashboardComponent/Instructor-Students/AssignmentsSolved.jsx';
import StudentProjects from './components/Dashboard/DashboardComponent/Instructor-Students/StudentProjects.jsx';
import Questions from './components/Dashboard/DashboardComponent/Questions.jsx';
import ViewSolution from './components/Dashboard/DashboardComponent/Instructor-Students/ViewSolution.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/create-and-join" element={<CreateAndJoinPage />} />
      <Route path="/editor/:roomId" element={<EditorPage />} />
      <Route path="/editor/submitSolution" element={<SubmitSolution />} />
      <Route path="/about-us" element={<About />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<Overview />} />
        <Route path="assignments" element={<Assignment />} />
        <Route path="daily-schedule" element={<DailySchedule />} />
        <Route path="questions-solved" element={<QuestionsSolved />} />
        <Route path="create-question" element={<CreateQuestion />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="job-updates" element={<JobUpdates />} />
        <Route path="notification" element={<Notification />} />
        <Route path="projects" element={<Projects />} />
        <Route path="settings" element={<Settings />} />
        <Route path="instructor-projects" element={<Students />} />
        <Route path="solved-assignments/:questionId" element={<AssignmentsSolved />} />
        <Route path="student-projects" element={<StudentProjects />} />
        <Route path="questions-Solved/view-solved-questions" element={<ViewSolvedQuestions />} />
        <Route path="my-questions" element={<Questions />} />
        <Route path="view-solution/:studentId" element={<ViewSolution />} />
      </Route>
    </Routes>
  );
};

export default App;
