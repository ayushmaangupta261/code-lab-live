import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import StudentsEnrolled from "./InstructorOverviewComponent/StudentsEnrolled";
import MyQuestions from "./InstructorOverviewComponent/MyQuestions";

const InstructorOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [showStudentsEnrolled, setShowStudentsEnrolled] = useState(false);
  const [showMyQuestions, setShowMyQuestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  console.log("user -> ", user)

  // Detect mobile screen width dynamically
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!user || user.accountType !== "Instructor") return null;

  const toggleStudentsEnrolled = () => {
    setShowStudentsEnrolled((prevState) => !prevState);
  };

  const toggleMyQuestions = () => {
    setShowMyQuestions((prevState) => !prevState);
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isWideEnough = screenWidth >= 1235;



  // === Mobile View ===
  if (isMobile) {
    return (
      <div className="w-full  py-6 text-white ">
        <>
          <h1 className="text-2xl font-bold text-center mb-6">
            Instructor Overview
          </h1>

          <div className=" rounded-lg mx-auto space-y-4 shadow-lg mt-[5rem]">
            <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
              Personal Details
            </h2>

            <div className="flex flex-col space-y-3 text-gray-300  ">
              {[
                ["Full Name ", user.fullName],
                [
                  "Email ",
                  user.email?.slice(0, 19) +
                  (user.email?.length > 10 ? "..." : ""),
                ],
                ["Mobile Number ", user.mobileNumber],
                ["Subject ", user.subject],
                ["Questions Created ", user.questions?.length || 0],
                ["Students Enrolled ", user.students?.length || 0],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-gray-700 pb-2 gap-x-2"
                >
                  <span className="font-semibold">{label}:</span>
                  <span className="break-words">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      </div>
    );
  }

  // === Desktop View ===
  return (
    <div className="w-full px-6 py-8 -mt-[3rem] lg:mt-0 text-white mx-auto">
      {showStudentsEnrolled ? (
        isWideEnough ? (
          <StudentsEnrolled toggleStudentsEnrolled={toggleStudentsEnrolled} />
        ) : (
          <div className="text-center text-red-400 font-semibold">
            Please use a wider screen device to view enrolled
            students.
          </div>
        )
      ) : showMyQuestions ? (
        isWideEnough ? (
          <MyQuestions toggleMyQuestions={toggleMyQuestions} />
        ) : (
          <div className="text-center text-red-400 font-semibold">
            Please use a wider screen device to view your
            questions.
          </div>
        )
      ) : (
        <div className="flex flex-col gap-y-6 w-full max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">
            Instructor Overview
          </h1>

          {/* Personal Details */}
          <div className="bg-gray-700 p-4 rounded-lg flex flex-col gap-y-3">
            <p className="text-xl font-semibold border-b border-gray-600 pb-2">
              Personal Details
            </p>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col lg:flex-row gap-x-4">
                <strong className="w-40">Full Name:</strong>
                <span>{user.fullName}</span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-4">
                <strong className="w-40">Email:</strong>
                <span>{user.email}</span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-4">
                <strong className="w-40">Mobile Number:</strong>
                <span>{user.mobileNumber}</span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-4">
                <strong className="w-40">Subject:</strong>
                <span>{user.subject}</span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-4">
                <strong className="w-40">Questions Created:</strong>
                <span>{user.questions?.length || 0}</span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-4">
                <strong className="w-40">Students Enrolled:</strong>
                <span>{user.students?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={toggleStudentsEnrolled}
              className="bg-green-600 hover:bg-green-700 transition-all px-6 py-2 rounded-md font-semibold"
            >
              View Students Enrolled
            </button>
            <button
              onClick={toggleMyQuestions}
              className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-2 rounded-md font-semibold"
            >
              View My Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorOverview;
