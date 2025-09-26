import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import {
  compileCode,
  submitAssignment,
} from "../../../services/operations/codeApi.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ViewSolvedQuestions = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("java");

  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const assignment = location.state?.question || {};

  const handleCompile = async () => {
    try {
      const response = await dispatch(
        compileCode({ code, input, lang: language })
      );
      setOutput(response?.result ? "Accepted" : "No output received.");
    } catch (error) {
      setOutput("Error compiling code.");
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        submitAssignment(
          {
            code,
            language,
            assignmentId: assignment?.questionId?._id,
            input,
          },
          user?.user?.accessToken
        )
      );
    } catch (error) {
      // Optional: handle error
    }
  };

  const handleChangeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(assignment.sampleCode?.[0]?.[selectedLanguage] || "");
  };

  useEffect(() => {
    if (assignment) {
      setLanguage(assignment.language || "java");
      setCode(assignment.code || "");
    }
  }, [assignment]);

  return (
    <div className="mx-auto w-[100%]   md:max-w-[1280px] md:p-4 h-auto flex flex-col gap-4">
      {/* Theory Section */}
      <div className="overflow-y-auto bg-slate-700 text-white rounded-md p-4 shadow-md max-h-[30vh] min-h-[150px]">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-green-300">Title:</h2>
          <p className="break-words">
            {assignment?.questionId?.title || "No Title"}
          </p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-bold text-yellow-300 mb-1">
            Description
          </h2>
          <p className="text-sm sm:text-base">
            {assignment?.questionId?.description || "No Description"}
          </p>
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex flex-col flex-grow gap-4  ">
        {/* Language Selector & Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-700 p-4 rounded-md text-white">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              className="border p-2 rounded bg-slate-800 text-white"
              value={language}
              onChange={handleChangeLanguage}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
            <button
              className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400 transition"
              onClick={handleCompile}
            >
              Run
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-[5rem] sm:w-auto hover:bg-blue-400 transition"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          {/* Output */}
          <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <label className="font-semibold">Output:</label>
            <p className="p-2 border rounded bg-gray-100 text-black h-[2rem] min-w-[8rem] text-center flex justify-center items-center">
              {output}
            </p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-full px-2 sm:px-4 ">
          <CodeMirror
            value={code}
            height="15rem" // slightly reduced for small screens
            width="100%"
            theme={dracula}
            extensions={[
              language === "java"
                ? java()
                : language === "python"
                ? python()
                : cpp(),
            ]}
            onChange={(value) => setCode(value)}
            className="border rounded text-sm sm:text-base "
          />
        </div>

        {/* Marks */}
        <div className="ml-2 mt-3 text-white">
          <p>
            Marks Obtained:{" "}
            {assignment.marks !== undefined ? assignment.marks : "N/A"}/10
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewSolvedQuestions;
