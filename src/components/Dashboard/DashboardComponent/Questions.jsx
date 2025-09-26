import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyQuestions } from "../../../services/operations/instructorApi";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.user?.accessToken);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!token) {
          toast.error("You must be logged in to view questions");
          setLoading(false);
          return;
        }

        const response = await dispatch(getMyQuestions(token));
        console.log("Response in UI -> ", response);

        if (response) {
          setQuestions(response);
        } else {
          console.log("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Something went wrong while fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token, dispatch]);

  // 3D hover handlers
  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left; // Mouse X within button
    const y = e.clientY - rect.top; // Mouse Y within button

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / 8).toFixed(2);
    const rotateY = ((x - centerX) / 8).toFixed(2);

    button.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = (e) => {
    const button = e.currentTarget;
    button.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div className="md:p-6 text-white mx-auto ">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Questions</h2>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-400 text-center">No questions found.</p>
      ) : (
        <ul className="space-y-3 p-4 flex flex-col max-h-[65vh] overflow-y-auto custom-scrollbar">
          {questions.map((q) => (
            <li
              key={q._id}
              className="bg-gray-800 p-4 rounded-md border border-gray-600"
            >
              <p className="font-medium">{q.title}</p>
              <p className="text-sm text-gray-400 mt-1">{q.description}</p>
              <p className="text-sm text-green-400 mt-2">
                Solved By: {q.solvedBy?.length || 0} students
              </p>

              <button
                onClick={() =>
                  navigate(`/dashboard/solved-assignments/${q._id}`, {
                    state: { token },
                  })
                }
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-md text-white font-semibold transition-transform duration-300"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "800px",
                  cursor: "pointer",
                }}
              >
                View Solutions
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Questions;
