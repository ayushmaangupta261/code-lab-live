import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyStudents } from "../../../../../services/operations/instructorApi.js";

const StudentsEnrolled = ({ toggleStudentsEnrolled }) => {
  const { user } = useSelector((state) => state.auth);
  const token = user?.accessToken;
  const dispatch = useDispatch();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const findEnrolledStudents = async () => {
      const response = await dispatch(getMyStudents(token));
      setStudents(response || []);
    };

    findEnrolledStudents();
  }, [dispatch, token]);

  return (
    <div className="text-white p-5 rounded-md mt-5  w-full ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Enrolled Students : {students?.length}
        </h3>
      </div>

      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-y-4  h-[20rem]  p-2 gap-x-4 overflow-y-auto">
          {students.map((student) => (
            <div
              key={student._id}
              className="
                bg-gray-700 rounded-xl h-[10rem] w-[19rem] p-4 shadow-lg cursor-pointer border border-transparent 
                border-indigo-500 transition-all duration-300  flex flex-col gap-y-2"
            >
              <p>
                <strong className="text-green-300">Name :</strong>{" "}
                {student.fullName}
              </p>
              <p>
                <strong className="text-green-300">Email :</strong>{" "}
                {student.email}
              </p>
              <p>
                <strong className="text-green-300">Mobile :</strong>{" "}
                {student.mobileNumber}
              </p>
              <p>
                <strong className="text-green-300">Questions Solved :</strong>{" "}
                {student.questionsSolved?.length || 0}
                <span>
                  {""} / {user.questions?.length || 0}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={toggleStudentsEnrolled}
          className=" px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default StudentsEnrolled;
