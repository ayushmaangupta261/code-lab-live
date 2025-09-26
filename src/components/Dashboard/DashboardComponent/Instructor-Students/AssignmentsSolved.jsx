import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { getSolvedQuestionsData } from "../../../../services/operations/instructorApi.js";
import "./scrollbar.css";

const AssignmentsSolved = () => {
  const { questionId } = useParams();
  const location = useLocation();
  const token = location.state?.token;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolvedData = async () => {
      try {
        const response = await dispatch(
          getSolvedQuestionsData(token, questionId)
        );
        console.log("Response in UI -> ", response);

        const questionData = response?.data;
        const solvedBy = questionData?.solvedBy;

        if (!solvedBy || solvedBy.length === 0) {
          toast("No students have solved this assignment yet.");
        }

        setQuestion({
          title: questionData?.title,
          description: questionData?.description,
        });

        setStudents(solvedBy || []);
      } catch (error) {
        console.error("Error fetching solved data:", error);
        toast.error("Error fetching solved question data");
      } finally {
        setLoading(false);
      }
    };

    if (questionId && token) {
      fetchSolvedData();
    }
  }, [questionId, token, dispatch]);

  if (loading)
    return <div className="p-4 text-lg text-gray-700">Loading...</div>;

  return (
    <div className="flex flex-col  w-[95%] mx-auto py-4 px-4 h-full">
      {/* Question Info */}
      {question && (
        <div className="bg-gray-700 rounded-2xl p-4 text-gray-100 ">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Q: {question.title}
          </h2>
          <p className="text-gray-300">{question.description}</p>
        </div>
      )}

      {/* Students Info */}
      <div className=" rounded-2xl shadow-md p-4 bg-gray-700 mt-5   ">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">
          Students Who Solved the Assignment
        </h3>

        {students.length > 0 ? (
          <div className="  p-2 h-[40vh] overflow-y-auto custom-scrollbar grid grid-cols-3 gap-x-3 gap-y-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="
                bg-gray-800 rounded-xl p-4 shadow-lg cursor-pointer border border-transparent 
                border-indigo-500 transition-all duration-300 w-[20rem] h-[12rem]  flex flex-col gap-y-2
              "
              >
                <p className="font-semibold text-lg text-green-400">
                  {student.fullName}
                </p>
                <p className="text-yellow-300">📧 {student.email}</p>
                <p className="text-yellow-300">📱 {student.mobileNumber}</p>

                <button
                  className="bg-indigo-600 hover:bg-indigo-700 mt-5 text-white cursor-pointer px-2 py-2 rounded-lg shadow-md transition duration-300"
                  onClick={() =>
                    navigate(`/dashboard/view-solution/${student?._id}`, {
                      state: { questionId, name: student.fullName },
                    })
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No students have solved this assignment yet.
          </p>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-3 ">
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

export default AssignmentsSolved;
