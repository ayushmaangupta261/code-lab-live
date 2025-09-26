import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md"; // email icon
import { MdClose } from "react-icons/md"; // close icon
import "./StudentOverview.css";
import { useEffect } from "react";

// Import statements remain unchanged

const InstituteOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showInstructors, setShowInstructors] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);

  const studentCount = useCountUp(user?.studentsEnrolled?.length || 0);
  const instructorCount = useCountUp(user?.instructorsPresent?.length || 0);
  const subjectCount = useCountUp(user?.subjects?.length || 0);

  function useCountUp(target, duration = 500) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const increment = target / (duration / 10);
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.ceil(start));
        }
      }, 10);
      return () => clearInterval(interval);
    }, [target, duration]);
    return count;
  }

  const handleCopy = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      setCopied(true);
      toast.success("College ID copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const closeModal = () => {
    setShowStudents(false);
    setShowInstructors(false);
    setShowSubjects(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 text-white px-4 md:px-8 overflow-y-auto scrollbar-hide">
      {/* Institute Name */}
      <div className="text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl py-5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block">
          {user?.name}
        </p>
        <div className="flex justify-center items-center gap-2 flex-wrap text-center">
          <MdEmail className="text-2xl md:text-3xl text-emerald-400" />
          <span className="text-xs md:text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full shadow-sm transition-all hover:bg-gray-600">
            {user?.email}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col md:flex-row justify-around bg-gray-800 py-6 mt-6 rounded-xl shadow-md gap-y-6 md:gap-y-0 md:gap-x-4">
        {/* Students */}
        <div
          className="text-center cursor-pointer w-full md:w-1/3"
          // onClick={() => setShowStudents((prev) => !prev)}
        >
          <div className="flex justify-center items-center gap-2">
            <p className="text-2xl font-semibold">{studentCount}</p>
            <p className="text-xl">+</p>
          </div>
          <p className="text-sm text-gray-400 tracking-widest">
            Students Enrolled
          </p>
        </div>

        {/* Instructors */}
        <div
          className="text-center cursor-pointer w-full md:w-1/3"
          // onClick={() => setShowInstructors((prev) => !prev)}
        >
          <div className="flex justify-center items-center gap-2">
            <p className="text-2xl font-semibold">{instructorCount}</p>
            <p className="text-xl">+</p>
          </div>
          <p className="text-sm text-gray-400 tracking-widest">Faculties</p>
        </div>

        {/* Subjects */}
        <div
          className="text-center cursor-pointer w-full md:w-1/3"
          // onClick={() => setShowSubjects((prev) => !prev)}
        >
          <div className="flex justify-center items-center gap-2">
            <p className="text-2xl font-semibold">{subjectCount}</p>
            <p className="text-xl">+</p>
          </div>
          <p className="text-sm text-gray-400 tracking-widest">
            Subjects Offered
          </p>
        </div>
      </div>

      {/* Modal Template */}
      {showStudents || showInstructors || showSubjects ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <button
            className="absolute top-5 right-5 text-2xl text-white bg-gray-600 rounded-full px-2 py-2 hover:scale-95 transition-all duration-200"
            onClick={closeModal}
          >
            <MdClose />
          </button>

          <div className="bg-gray-800 p-6 rounded-md max-w-xs sm:max-w-md md:max-w-lg w-full relative overflow-hidden">
            <p className="text-xl font-semibold mb-3">
              {showStudents
                ? "Students List"
                : showInstructors
                ? "Instructors List"
                : "Subjects List"}
            </p>

            <div className="h-60 overflow-y-auto custom-scrollbar pr-3">
              <ul className="flex flex-col gap-y-2">
                {showStudents &&
                  user?.studentsEnrolled.map((student, index) => (
                    <li
                      key={index}
                      className="bg-gray-700 px-3 py-2 rounded-md text-gray-100"
                    >
                      <p>{student.fullName}</p>
                      <p className="text-sm text-gray-300">
                        Questions Solved: {student?.questionsSolved?.length}
                      </p>
                    </li>
                  ))}
                {showInstructors &&
                  user?.instructorsPresent.map((instructor, index) => (
                    <li
                      key={index}
                      className="bg-gray-700 px-3 py-2 rounded-md text-gray-100"
                    >
                      <p>{instructor.fullName}</p>
                      <p className="text-sm text-gray-400">
                        Subject: {instructor.subject}
                      </p>
                    </li>
                  ))}
                {showSubjects &&
                  user?.subjects.map((subject, index) => (
                    <li
                      key={index}
                      className="bg-gray-700 px-3 py-2 rounded-md text-gray-100"
                    >
                      <p>{subject}</p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {/* College ID */}
      <div className="mx-auto flex flex-col items-center mt-10 text-center">
        <p className="text-xl md:text-2xl font-medium mb-2">College ID</p>
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-700 px-4 py-2 rounded-md">
          <span className="text-xs md:text-base font-mono break-all">
            {user?._id}
          </span>
          <button
            onClick={handleCopy}
            className="text-emerald-400 hover:text-emerald-300 transition-all"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstituteOverview;
