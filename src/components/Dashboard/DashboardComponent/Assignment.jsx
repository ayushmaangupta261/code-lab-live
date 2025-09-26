import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignment, getCompletedAssignments } from "../../../services/operations/codeApi.js";
import AssignmentLoader from "./Loaders/Assignment.Loader.jsx";
import { useNavigate } from "react-router";
import checkMark from "../../../assets/Dashboard/checkmark.png";

export const Assignment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, authLoading } = useSelector((state) => state.auth);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (user && user.accessToken) {
        try {
          const response = await dispatch(getAllAssignment(user.accessToken));
          setAssignments(response?.data?.data || []);
        } catch (error) {
          console.error("Error fetching assignments:", error);
          setAssignments([]);
        }
      }
    };
    fetchAssignments();
  }, [user, dispatch]);

  const solvedAssignments = assignments.filter((a) => a.solved);
  const unsolvedAssignments = assignments.filter((a) => !a.solved);

  return (
    <div className="w-full h-full">
      {authLoading ? (
        <div className="flex flex-col gap-y-5 h-full justify-center items-center">
          <AssignmentLoader />
          <p className="text-lg">Please Wait...</p>
        </div>
      ) : (
        <div
          className="flex flex-col h-[95%] w-[95%] mx-auto items-center mt-5 pt-5 gap-y-5 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Header */}
          <div>
            <p className="text-xl font-semibold">Assignments</p>
          </div>

          {/* Unsolved Assignments */}
          {unsolvedAssignments.length > 0 && (
            <div className="w-[100%]">
              <p className="text-lg font-semibold mb-2">Unsolved</p>
              <div className="flex flex-col gap-y-3">
                {unsolvedAssignments.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between px-5 py-3 rounded-lg bg-slate-600 hover:bg-slate-700 cursor-pointer transition-all duration-300"
                  >
                    <p className="flex gap-x-2">
                      <span>Q {index + 1}.</span>
                      {assignment.title}
                    </p>
                    <button
                      className="bg-amber-300 text-black px-3 py-1 rounded-md hover:scale-95 transition-all duration-200"
                      onClick={() =>
                        navigate("/editor/submitSolution", {
                          state: { assignment },
                        })
                      }
                    >
                      Solve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solved Assignments */}
          {solvedAssignments.length > 0 && (
            <div className="w-[100%] mt-6">
              <p className="text-lg font-semibold mb-2">Solved</p>
              <div className="flex flex-col gap-y-3">
                {solvedAssignments.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between px-5 py-3 rounded-lg bg-slate-700 cursor-default"
                  >
                    <p className="flex gap-x-2">
                      <span>Q {index + 1}.</span>
                      {assignment.title}
                    </p>
                    <div className="flex w-[5rem] justify-between items-center">
                      <img src={checkMark} alt="solved" className="w-[1.5rem]" />
                      <p className="text-green-400">Solved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Assignments */}
          {assignments?.length === 0 && (
            <p className="text-md text-gray-300 mt-4">No assignments available.</p>
          )}
        </div>
      )}
    </div>
  );
};
