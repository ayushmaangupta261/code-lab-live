// import React, { useEffect, useState } from "react";
// import { getMyStudents } from "../../../services/operations/instructorApi";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import "./Instructor-Students/scrollbar.css";

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const user = useSelector((state) => state.auth);
//   console.log("USer in students -> ", students);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (!user?.user?.accessToken) {
//         console.warn("No access token found");
//         return;
//       }

//       try {
//         const response = await dispatch(getMyStudents(user.user.accessToken));
//         console.log("student in ui -> ", response);
//         if (Array.isArray(response)) {
//           setStudents(response);
//         } else {
//           console.warn("Unexpected response shape:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       }
//     };

//     fetchStudents();
//   }, [user?.user?.accessToken]);

//   return (
//     <div className="w-auto h-full px-5 py-2">
//       <h2 className="text-4xl text-white mb-12 text-center drop-shadow-lg">
//         Students
//       </h2>

//       {students.length === 0 ? (
//         <p className="text-center text-gray-300 text-lg animate-pulse">
//           No students found.
//         </p>
//       ) : (
//         <div
//           className="
//             flex flex-col items-center
//             sm:grid sm:grid-cols-2 md:grid-cols-3
//             gap-8 max-w-7xl mx-auto max-h-[65vh] overflow-y-auto overflow-x-hidden p-5
//             custom-scrollbar
//           "
//         >
//           <AnimatePresence>
//             {students.map((student) => (
//               <motion.div
//                 key={student._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.4, ease: "easeOut" }}
//                 whileHover={{
//                   scale: 1.05,
//                   boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
//                 }}
//                 className="
//                   bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer border border-transparent
//                   border-indigo-500 transition-all duration-300
//                   w-4/5 sm:w-auto
//                 "
//               >
//                 <h3 className="text-xl font-semibold mb-2 text-green-400">
//                   {student.fullName}
//                 </h3>
//                 <p className="text-gray-300 mb-1">
//                   <strong>Email:</strong> {student.email}
//                 </p>
//                 <p className="text-gray-300 mb-1">
//                   <strong>Mobile:</strong> {student.mobileNumber}
//                 </p>
//                 {/* <p className="text-indigo-400 font-medium mb-3">
//                   Questions Solved :{" "}
//                   <span className="font-bold">
//                     {student.questionsSolved?.length || 0}
//                   </span>
//                 </p> */}

//                 {/* Rooms */}
//                 <div className="mt-3">
//                   <p className="text-yellow-300 font-semibold mb-1">
//                     Active Projects:
//                   </p>
//                   <p className="text-white">
//                     {student.room?.length > 0
//                       ? student.room?.length
//                       : "No projects assigned"}
//                   </p>
//                 </div>

//                 {/* Buttons */}
//                 <div className="mt-4 flex gap-4 flex-wrap w-full">
//                   <button
//                     onClick={() =>
//                       navigate("/dashboard/student-projects", {
//                         state: {
//                           roomIds: student.room,
//                           studentName: student.fullName,
//                         },
//                       })
//                     }
//                     className="bg-indigo-600 hover:bg-indigo-700 w-full text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
//                   >
//                     View Projects
//                   </button>
//                   {/* {user?.user?.subject === "DSA" && (
//                     <button
//                       onClick={() =>
//                         navigate("/dashboard/solved-assignments", {
//                           state: {
//                             studentId: student._id,
//                             studentName: student.fullName,
//                           },
//                         })
//                       }
//                       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
//                     >
//                       View Questions
//                     </button>
//                   )} */}
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Students;

import React, { useEffect, useState } from "react";
import { getMyStudents } from "../../../services/operations/instructorApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Instructor-Students/scrollbar.css";
import "./Instructor-Students/3d.css"; // Ensure you create this with perspective
import toast from "react-hot-toast";

const Students = () => {
  const [students, setStudents] = useState([]);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.user?.accessToken) return;

      try {
        const response = await dispatch(getMyStudents(user.user.accessToken));
        if (Array.isArray(response)) {
          setStudents(response);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [user?.user?.accessToken]);

  // Mouse rotation logic
  const handleMouseMove = (e, index) => {
    const card = document.getElementById(`card-${index}`);
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / 10).toFixed(2);
    const rotateY = ((x - centerX) / 10).toFixed(2);

    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const handleMouseLeave = (index) => {
    const card = document.getElementById(`card-${index}`);
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div className="w-auto h-full px-5 py-2">
      <h2 className="text-4xl text-white mb-12 text-center drop-shadow-lg">
        Students
      </h2>

      {students.length === 0 ? (
        <p className="text-center text-gray-300 text-lg animate-pulse">
          No students found.
        </p>
      ) : (
        <div
          className="
            flex flex-col items-center
            sm:grid sm:grid-cols-2 md:grid-cols-3
            gap-8 max-w-7xl mx-auto max-h-[65vh] overflow-y-auto overflow-x-hidden p-5
            custom-scrollbar
          "
        >
          {students.map((student, index) => (
            <div className="perspective-1000" key={student._id}>
              <div
                id={`card-${index}`}
                className="
                  bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer border border-transparent 
                  border-indigo-500 transition-all duration-300 w-4/5 sm:w-auto
                "
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.3s ease-out",
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <h3 className="text-xl font-semibold mb-2 text-green-400">
                  {student.fullName}
                </h3>
                <p className="text-gray-300 mb-1">
                  <strong>Email:</strong> {student.email}
                </p>
                <p className="text-gray-300 mb-1">
                  <strong>Mobile:</strong> {student.mobileNumber}
                </p>

                <div className="mt-3">
                  <p className="text-yellow-300 font-semibold mb-1">
                    Active Projects:
                  </p>
                  <p className="text-white">
                    {student.room?.length > 0
                      ? student.room?.length
                      : "No projects assigned"}
                  </p>
                </div>

                <div className="mt-4 flex gap-4 flex-wrap w-full">
                  {student?.room?.length === 0 ? (
                    <button
                     
                      className="bg-gray-600 hover:bg-gray-700 w-full text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
                    >
                      No Projects
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate("/dashboard/student-projects", {
                          state: {
                            roomIds: student.room,
                            studentName: student.fullName,
                          },
                        })
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 w-full text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
                    >
                      View Projects
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
