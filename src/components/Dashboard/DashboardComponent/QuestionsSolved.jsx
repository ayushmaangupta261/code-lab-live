import React, { useEffect, useState } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { getCompletedAssignments } from "../../../services/operations/codeApi.js";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import checkMark from "../../../assets/Dashboard/checkmark.png";

const QuestionsSolved = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const findCompletedAssignments = async () => {
      if (!user) {
        toast.error("Unauthorized");
        return;
      }

      try {
        const response = await dispatch(
          getCompletedAssignments(user?.user?.accessToken)
        );
        setSolvedQuestions(response?.questionsSolved);
        setTotalQuestions(response?.totalQuestions);
      } catch (error) {
        console.log("Error in fetching questions");
      }
    };

    findCompletedAssignments();
  }, []);

  return (
    <div className="w-full h-full md:p-4">
      {/* Intro section */}
      <div className="text-center text-gray-200 ">
        <p className="text-xl md:text-2xl font-semibold">Assignments Completed</p>
      </div>

      {/* Gauge and Stats Section */}
      <div className="flex flex-row justify-evenly items-center md:gap-10  sm:gap-6 mt-10 sm:w-[70%] max-w-4xl mx-auto bg-gray-600 p-5 rounded-md shadow">
        {/* Gauge */}
        <div className="h-[5rem] sm:h-[10rem]  ">
          <Gauge
            value={solvedQuestions?.length || 0}
            valueMax={totalQuestions || 0} // must be > 0
            startAngle={-110}
            endAngle={110}
            text={({ value, valueMax }) => `${value} / ${valueMax}`}
            sx={(theme) => ({
              [`& .MuiGauge-valueText`]: {
                fill: "#ffffff",
                fontSize: "1.5rem",
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: theme.palette.text.disabled,
              },
            })}
            className="sm:w-40 h-[5rem] sm:h-[10rem]"
          />


        </div>

        {/* Text Stats */}
        <div className="text-white  text-sm md:text-lg">
          <ul className="space-y-2">
            <li><strong>Solved:</strong> {solvedQuestions.length}</li>
            <li><strong>Total Questions:</strong> {totalQuestions}</li>
          </ul>
        </div>
      </div>

      {/* Solved Questions List */}
      <div className="flex flex-col justify-center mt-10 gap-y-4 w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-x-3 text-white">
          <img src={checkMark} alt="check" className="w-6 h-6" />
          <p className="text-lg font-medium">Solved Questions</p>
        </div>

        {/* Question List */}
        <div className="flex flex-col gap-y-3 overflow-y-auto max-h-[16rem] pr-2 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-400 rounded-md">
          {solvedQuestions?.length > 0 ? (
            solvedQuestions.map((question, index) => (
              <div
                key={question._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 rounded-lg bg-slate-700 text-white"
              >
                <p className="mb-2 sm:mb-0">
                  <span className="font-semibold">Q {index + 1}.</span>{" "}
                  {question?.questionId?.title}
                </p>
                <button
                  className="bg-amber-300 text-black px-3 py-1 rounded-md hover:scale-95 transition-all duration-200 mt-2 sm:mt-0"
                  onClick={() =>
                    navigate("view-solved-questions", {
                      state: { question },
                    })
                  }
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No solved questions yet.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default QuestionsSolved;
