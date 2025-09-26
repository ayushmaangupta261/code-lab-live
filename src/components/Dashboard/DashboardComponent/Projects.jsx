// import React, { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createAndJoinRoom,
//   findRoomByEmail,
// } from "../../../services/operations/roomAPi";
// import deleteIcon from "../../../assets/Dashboard/delete.png";

// const Projects = () => {
//   const [roomId, setRoomId] = useState("");
//   const [projectName, setprojectName] = useState("");
//   const [showCreate, setShowCreate] = useState(true);
//   const [room, setRooms] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const [email, setemail] = useState(user?.email || "");

//   const createNewRoom = (e) => {
//     e.preventDefault();
//     const generateRoomId = uuidv4();
//     setRoomId(generateRoomId);
//     toast.success("Room created successfully");
//   };

//   const joinRoom = async () => {
//     if (!roomId || !email || !projectName) {
//       toast.error("Please fill both Room Id and Email");
//       return;
//     }

//     const response = await dispatch(
//       createAndJoinRoom(
//         { roomId, email, projectName, userId: user?._id },
//         user?.accessToken
//       )
//     );

//     if (response?.success) {
//       navigate(`/editor/${roomId}`, {
//         state: {
//           email,
//           projectName,
//         },
//       });

//       toast.success("Congratulations you are successfully joined");
//     } else {
//       toast.error("Error in creating room");
//     }
//   };

//   const handleInputEnter = (e) => {
//     if (e.key === "Enter") {
//       joinRoom();
//     }
//   };

//   useEffect(() => {
//     const findRooms = async () => {
//       try {
//         if (email) {
//           const response = await dispatch(
//             findRoomByEmail(email, user?.accessToken)
//           );
//           setRooms(response || []);
//         }
//       } catch (error) {
//         console.log("Error in ui -> ", error);
//       }
//     };

//     if (email.trim() !== "") {
//       findRooms();
//     }
//   }, [dispatch, email, user?.accessToken]);

//   return (
//     <div className="flex flex-col items-center justify-start text-gray-100 w-full px-4 py-5 sm:px-8">
//       <div className="w-full max-w-5xl flex flex-col">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3 sm:gap-0">
//           <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
//             Your Rooms
//           </h2>
//         </div>

//         {/* Room List */}
//         {room.length > 0 ? (
//           <ul className="space-y-3 flex flex-col h-[13rem] md:h-[18rem] overflow-y-auto pr-1 custom-scrollbar">
//             {room.map((r) => (
//               <li
//                 key={r._id}
//                 className="bg-gray-700 rounded-md p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
//               >
//                 <div className="flex-1">
//                   <p className="text-base sm:text-lg font-medium text-white">
//                     Project Name: {r?.projectName}
//                   </p>
//                   <p className="text-sm sm:text-base text-white hidden md:block">
//                     Room ID: {r.roomId}
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     Members: {r.students?.length || 0}
//                   </p>
//                   {r.instructor && (
//                     <p className="text-sm text-gray-400">
//                       Instructor: {r.instructor.fullName}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex justify-end sm:justify-start">
//                   <button
//                     className="bg-green-500 px-4 py-1.5 rounded-md text-black hover:bg-green-400 hover:scale-95 transition-all duration-200"
//                     onClick={() =>
//                       navigate(`/editor/${r.roomId}`, {
//                         state: {
//                           email,
//                           projectName: r.projectName,
//                           userType: "Student",
//                         },
//                       })
//                     }
//                   >
//                     Join
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-400 text-center">No rooms found.</p>
//         )}

//         {/* Create Room */}
//         {showCreate && (
//           <div className="mt-10 border-t border-gray-600 pt-5">
//             <p className="text-lg text-green-400 mb-4 text-center sm:text-left">
//               Or Create and Join a New Room
//             </p>
//             <div className="flex flex-col gap-y-3 w-full">
//               <input
//                 type="text"
//                 className="bg-gray-600 px-3 py-2 rounded-md text-sm w-full"
//                 placeholder="Room ID"
//                 value={roomId}
//                 onChange={(e) => setRoomId(e.target.value)}
//                 onKeyUp={handleInputEnter}
//               />
//               <div className="flex flex-col sm:flex-row gap-3 w-full">
//                 <input
//                   type="text"
//                   className="bg-gray-600 px-3 py-2 rounded-md text-sm flex-1"
//                   placeholder="Project Name"
//                   value={projectName}
//                   onChange={(e) => setprojectName(e.target.value)}
//                   onKeyUp={handleInputEnter}
//                 />
//                 <input
//                   type="text"
//                   className="bg-gray-600 px-3 py-2 rounded-md text-sm flex-1 cursor-not-allowed select-none"
//                   placeholder="Email"
//                   value={email}
//                   readOnly
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   className="bg-green-500 text-black px-6 py-2 rounded-md hover:bg-green-400 hover:scale-105 transition duration-200"
//                   onClick={joinRoom}
//                 >
//                   Join
//                 </button>
//               </div>
//               <p className="text-center text-sm text-gray-400">
//                 Or{" "}
//                 <span
//                   onClick={createNewRoom}
//                   className="text-green-400 cursor-pointer border-b border-green-400 hover:text-blue-400 hover:border-blue-400 transition duration-200"
//                 >
//                   Generate New Room ID
//                 </span>
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Projects;





import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createAndJoinRoom,
  findRoomByEmail,
} from "../../../services/operations/roomAPi.js";
import deleteIcon from "../../../assets/Dashboard/delete.png";

const Projects = () => {
  const [roomId, setRoomId] = useState("");
  const [projectName, setprojectName] = useState("");
  const [showCreate, setShowCreate] = useState(true);
  const [room, setRooms] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [email, setemail] = useState(user?.email || "");

  const createNewRoom = (e) => {
    e.preventDefault();
    const generateRoomId = uuidv4();
    setRoomId(generateRoomId);
    toast.success("Room created successfully");
  };

  const joinRoom = async () => {
    if (isMobile) {
      toast.error("Joining rooms is not allowed on mobile devices.");
      return;
    }

    if (!roomId || !email || !projectName) {
      toast.error("Please fill all the fields.");
      return;
    }

    const response = await dispatch(
      createAndJoinRoom(
        { roomId, email, projectName, userId: user?._id },
        user?.accessToken
      )
    );

    if (response?.success) {
      navigate(`/editor/${roomId}`, {
        state: {
          email,
          projectName,
        },
      });

      toast.success("Successfully joined the room!");
    } else {
      toast.error("Error in creating/joining the room.");
    }
  };

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const findRooms = async () => {
      try {
        if (email && !isMobile) {
          const response = await dispatch(
            findRoomByEmail(email, user?.accessToken)
          );
          setRooms(response || []);
        }
      } catch (error) {
        console.log("Error in UI -> ", error);
      }
    };

    if (email.trim() !== "") {
      findRooms();
    }
  }, [dispatch, email, user?.accessToken, isMobile]);

  return (
    <div className="flex flex-col items-center justify-start text-gray-100 w-full px-4 py-5 sm:px-8">
      <div className="w-full max-w-5xl flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
            Your Rooms
          </h2>
        </div>

        {/* Mobile Warning */}
        {isMobile && (
          <div className="bg-yellow-600 text-white p-3 rounded-md text-center mb-5">
            ⚠️ Access to rooms is not allowed on mobile devices. Please use a laptop or desktop.
          </div>
        )}

        {/* Room List */}
        {!isMobile && room.length > 0 ? (
          <ul className="space-y-3 flex flex-col h-[13rem] md:h-[18rem] overflow-y-auto pr-1 custom-scrollbar">
            {room.map((r) => (
              <li
                key={r._id}
                className="bg-gray-700 rounded-md p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-base sm:text-lg font-medium text-white">
                    Project Name: {r?.projectName}
                  </p>
                  <p className="text-sm sm:text-base text-white hidden md:block">
                    Room ID: {r.roomId}
                  </p>
                  <p className="text-sm text-gray-300">
                    Members: {r.students?.length || 0}
                  </p>
                  {r.instructor && (
                    <p className="text-sm text-gray-400">
                      Instructor: {r.instructor.fullName}
                    </p>
                  )}
                </div>
                <div className="flex justify-end sm:justify-start">

                  <button
                    className="bg-green-500 px-4 py-1.5 rounded-md text-black hover:bg-green-400 hover:scale-95 transition-all duration-200"
                    onClick={() =>
                      navigate(`/editor/${r.roomId}`, {
                        state: {
                          email,
                          projectName: r.projectName,
                          userType: "Student",
                        },
                      })
                    }
                  >
                    Join
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : !isMobile ? (
          <p className="text-gray-400 text-center">No rooms found.</p>
        ) : null}

        {/* Create Room */}
        {!isMobile &&
          (
            <div className="mt-5 border-t border-gray-600 pt-5">
              <p className="text-lg text-green-400 mb-4 text-center sm:text-left">
                Or Create and Join a New Room
              </p>
              <div className="flex flex-col gap-y-3 w-full">
                <input
                  type="text"
                  className="bg-gray-600 px-3 py-2 rounded-md text-sm w-full"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyUp={handleInputEnter}
                />
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    className="bg-gray-600 px-3 py-2 rounded-md text-sm flex-1"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setprojectName(e.target.value)}
                    onKeyUp={handleInputEnter}
                  />
                  <input
                    type="text"
                    className="bg-gray-600 px-3 py-2 rounded-md text-sm flex-1 cursor-not-allowed select-none"
                    placeholder="Email"
                    value={email}
                    readOnly
                  />
                </div>
                <div className="flex justify-end items-center gap-x-5">
                  <button
                    className={`px-6 py-2 rounded-md transition duration-200 ${isMobile
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-green-500 text-black hover:bg-green-400 hover:scale-105"
                      }`}
                    onClick={joinRoom}
                    disabled={isMobile}
                  >
                    Join
                  </button>
                  <span>Or{" "}</span>
                  <p className="text-center text-sm text-gray-400 ">

                    <span
                      onClick={createNewRoom}
                      className="text-green-400 cursor-pointer border-b border-green-400 hover:text-blue-400 hover:border-blue-400 transition duration-200"
                    >
                      Generate New Room ID
                    </span>
                  </p>
                </div>

              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Projects;
