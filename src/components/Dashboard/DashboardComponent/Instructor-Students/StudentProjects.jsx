import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import "./scrollbar.css";
import { getStudentRooms } from "../../../../services/operations/instructorApi";

const StudentProjects = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth);
  const token = user?.user?.accessToken;

  const { studentName, roomIds } = location.state || {};
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!token) {
          toast.error("You must be logged in to view rooms");
          return;
        }
        if (roomIds && roomIds.length > 0) {
          const data = await dispatch(getStudentRooms(token, roomIds));
          if (data) {
            setRooms(data);
          }
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Failed to load rooms");
      }
    };

    fetchRooms();
  }, [dispatch, token, roomIds, location?.pathname]);

  return (
    <div className="w-full px-6 py-4 flex flex-col min-h-[80vh]">
      <h2 className="text-3xl font-bold text-center text-white mb-4">
        Projects of {studentName || "Student"}
      </h2>

      {rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[62vh] overflow-y-auto p-3 custom-scrollbar flex-grow">
          {rooms.map((room, index) => (
            <div
              key={room._id || index}
              className="bg-gray-800 p-4 rounded-xl shadow-md border border-indigo-500 h-[23rem] flex flex-col gap-y-3 transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
            >
              <h3 className="text-lg font-semibold text-green-400 mb-1">
                {room.projectName || "Untitled Project"}
              </h3>

              {room.college && (
                <div className="mb-1 flex flex-col gap-y-1">
                  <strong className="text-yellow-300 text-sm">College:</strong>
                  <div className="ml-3 bg-gray-700 px-2 py-0.5 rounded-md shadow-sm text-sm">
                    {room.college.name || "N/A"}
                  </div>
                </div>
              )}

              {room.students && room.students.length > 0 && (
                <div className="mb-1">
                  <strong className="text-yellow-300 text-sm">Students:</strong>
                  <ul className="mt-1 ml-3 list-inside text-gray-300 space-y-0.5 text-sm h-[7rem] pr-1 overflow-y-auto custom-scrollbar">
                    {room.students.map((student) => (
                      <li
                        key={student._id}
                        className="bg-gray-700 px-2 py-0.5 rounded-md shadow-sm text-center truncate"
                        title={student.fullName}
                      >
                        {student.fullName}
                      </li>
                    ))}

                  </ul>
                </div>
              )}

              {/* Join Button */}
              <button
                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors duration-300 text-sm"
                onClick={() =>
                  navigate(`/editor/${room.roomId}`, {
                    state: {
                      email: user?.user?.email,
                      projectName: room.projectName,
                      userType: "Instructor",
                      studentName,
                    },
                  })
                }
              >
                Join
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg animate-pulse flex-grow">
          No projects assigned to this student.
        </p>
      )}

      {/* Back Button at Bottom */}
      <button
        className="btn leaveBtn px-2 py-1 bg-green-500 text-black rounded-lg cursor-pointer hover:bg-green-400 hover:scale-105 duration-200 mt-6 w-full max-w-xs mx-auto"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default StudentProjects;
