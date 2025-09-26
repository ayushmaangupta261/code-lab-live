import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./StudentOverview.css";
import "../Instructor-Students/scrollbar.css";

// Custom hook to detect if the device is mobile based on a breakpoint
const useIsMobile = (breakpoint = 600) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

const MobileView = ({ user }) => (
  <div className="md:w-[100%] mx-auto  flex flex-col gap-y-4  text-white">
    <h1 className="text-xl font-bold mb-4 text-center">Student Overview</h1>

    <div className="gap-y-6 flex flex-col overflow-y-hidden  ">
      {/* Personal Details */}
      <section className="flex flex-col gap-y-1">
        <h2 className="text-lg font-semibold border-b text-green-300 border-gray-600 pb-2 mb-2">
          Personal Details
        </h2>
        <p className="flex gap-x-2 items-center">
          <strong>Full Name:</strong>{" "}
          <span className="text-sm md:text-lg">{user.fullName}</span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Email:</strong>{" "}
          <span className="text-sm md:text-lg">{user.email}</span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Mobile Number:</strong>{" "}
          <span className="text-sm md:text-lg">{user.mobileNumber}</span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Questions Solved:</strong>{" "}
          <span className="text-sm md:text-lg">
            {user?.questionsSolved?.length}
          </span>
        </p>
      </section>

      {/* College Details */}
      <section className="flex flex-col gap-y-1">
        <h2 className="text-lg text-green-300 font-semibold border-b border-gray-600 pb-2 mb-2">
          My College
        </h2>
        <p className="flex gap-x-2 items-center flex-wrap">
          <strong>Name:</strong>
          <span className="text-sm md:text-lg">
            {user.collegeId?.name
              ? user.collegeId.name.length > 12
                ? user.collegeId.name.slice(0, 25) + "..."
                : user.collegeId.name
              : "N/A"}
          </span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Email:</strong>{" "}
          <span className="text-sm md:text-lg">
            {user.collegeId?.email || "N/A"}
          </span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Students Enrolled:</strong>{" "}
          <span className="text-sm md:text-lg">
            {" "}
            {user.collegeId?.studentsEnrolled?.length || "N/A"}{" "}
          </span>
        </p>
      </section>

      {/* Instructor Details */}
      <section className="flex flex-col gap-y-1">
        <p className="text-lg text-green-300 font-semibold border-b  border-gray-600 pb-2 mb-2">
          My Instructor
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Instructor:</strong>{" "}
          <span className="text-sm md:text-lg">
            {user.instructor?.fullName}
          </span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Email:</strong>{" "}
          <span className="text-sm md:text-lg">{user.instructor?.email}</span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong>Mobile Number:</strong>{" "}
          <span className="text-sm md:text-lg">
            {user.instructor?.mobileNumber}
          </span>
        </p>
        <p className="flex gap-x-2 items-center">
          <strong className="">Subject:</strong>{" "}
          <span className="text-sm md:text-lg">{user.instructor?.subject}</span>
        </p>
      </section>
    </div>
  </div>
);

const DesktopView = ({ user }) => (
  <div className="w-[100%] text-white mx-auto flex flex-col overflow-hidden ">
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
      Student Overview
    </h1>

    <div className="flex  flex-col gap-y-5 w-[100%] xl:w-[95%] mx-auto max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 xl:pr-3 ">
      {/* Personal Details */}
      <div className="flex flex-col  gap-y-5 justify-center bg-gray-700 rounded-md py-2 px-5">
        <p className="text-xl font-semibold">Personal Details</p>
        <div>
          <div className="flex flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Full Name :</p>
            <p className="text-gray-300">{user.fullName}</p>
          </div>
          <div className="flex flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Email :</p>
            <p className="text-gray-300">{user.email}</p>
          </div>
          <div className="flex flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Mobile Number :</p>
            <p className="text-gray-300">{user.mobileNumber}</p>
          </div>
          <div className="flex items-center gap-x-5">
            <p className="text-lg font-semibold">Questions Solved :</p>
            <p className="text-gray-300">{user.questionsSolved.length}</p>
          </div>
        </div>
      </div>

      {/* College Details */}
      <div className="flex flex-col justify-center gap-y-5 bg-gray-700 rounded-md py-2 px-5">
        <p className="text-xl font-semibold">My College</p>
        <div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Name :</p>
            <p className="text-gray-300">{user.collegeId?.name || "N/A"}</p>
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Email :</p>
            <p className="text-gray-300">{user.collegeId?.email || "N/A"}</p>
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Student Enrolled :</p>
            <p className="text-gray-300">
              {user.collegeId?.studentsEnrolled?.length || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Instructor Details */}
      <div className="flex flex-col justify-center gap-y-5 bg-gray-700 rounded-md py-2 px-5">
        <p className="text-xl font-semibold">My Instructor</p>
        <div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Instructor :</p>
            <p className="text-gray-300">{user.instructor?.fullName}</p>
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Email :</p>
            <p className="text-gray-300">{user.instructor?.email}</p>
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-5">
            <p className="text-lg font-semibold">Mobile Number :</p>
            <p className="text-gray-300">{user.instructor?.mobileNumber}</p>
          </div>
          <div className="flex items-center gap-x-5">
            <p className="text-lg font-semibold">Subject :</p>
            <p className="text-gray-300">{user.instructor?.subject}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StudentOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const isMobile = useIsMobile();

  return isMobile ? (
    <div className="w-full flex justify-center">
      <MobileView user={user} />
    </div>
  ) : (
    <DesktopView user={user} />
  );
};

export default StudentOverview;
