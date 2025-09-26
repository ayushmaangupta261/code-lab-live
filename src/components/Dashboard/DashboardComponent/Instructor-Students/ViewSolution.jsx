import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSolutionsByStudentId } from "../../../../services/operations/instructorApi";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import "./scrollbar.css";

const ViewSolution = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const questionId = location.state?.questionId;
  const studentName = location.state?.name;
  const navigate  = useNavigate()

  console.log("Question id -> ", questionId);

  const dispatch = useDispatch();
  const [solutions, setSolutions] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSolutions = async () => {
      const data = await dispatch(
        getSolutionsByStudentId(user?.accessToken, studentId, questionId)
      );
      if (data) {
        setSolutions(data);
      }
    };

    if (studentId && user?.accessToken && questionId) {
      fetchSolutions();
    }
  }, [studentId, user?.accessToken, questionId, dispatch]);

  const getLanguageExtension = (lang) => {
    if (lang === "java") return java();
    if (lang === "cpp") return cpp();
    if (lang === "python") return python();
    return java(); // default fallback
  };

  return (
    <div className="w-[95%] mx-auto py-6  overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-300">
        Solutions by : {studentName}
      </h2>

      {solutions.length === 0 ? (
        <p className="text-gray-400 text-center">
          No solutions submitted by this student.
        </p>
      ) : (
        <div className="space-y-8">
          {solutions.map((solution, index) => (
            <div
              key={solution._id}
              className="p-5 border border-gray-600 rounded-lg bg-[#1e1e2f] h-[28rem] text-white shadow-md"
            >
              <div className="mb-4 flex flex-col gap-y-1">
                <h3 className="text-xl font-semibold text-yellow-300">
                  {index + 1}. {solution?.questionId?.title || "No Title"}
                </h3>
                <p className="mt-1">
                  <span className="font-medium text-blue-300">Language:</span>{" "}
                  {solution.language}
                </p>
                <p>
                  <span className="font-medium text-purple-300">Marks:</span>{" "}
                  {solution.marks}/10
                </p>
                <p>
                  <span className="font-medium text-pink-300">Status:</span>{" "}
                  {solution.accepted ? "Accepted ✅" : "Not Accepted ❌"}
                </p>
              </div>

              <CodeMirror
                value={solution.code || ""}
                height="17rem"
                theme={dracula}
                extensions={[getLanguageExtension(solution.language)]}
                editable={false}
                className="border border-gray-700 rounded custom-scrollbar"
              />
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-2 mx-auto flex justify-center">
        <button
          onClick={() => navigate(-1)}
          className=" px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewSolution;
