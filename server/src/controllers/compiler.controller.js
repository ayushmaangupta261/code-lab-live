// // import fs from "fs";
// // import path from "path";
// // import { Solution } from "../models/solution.model.js";
// // import compiler from "compilex";

// // const options = { stats: true };
// // compiler.init(options);

// // const compileCode = async (req,res) => {
// //   try {
// //     const { code, input, lang } = req.body;
// //     if (!code || !lang) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: "Code and language are required" });
// //     }

// //     let envData = { OS: "windows" };
// //     if (lang === "cpp") envData.cmd = "g++";
// //     if (lang === "java") envData.cmd = "javac";

// //     // Create the temp directory if it doesn't exist
// //     const tempDir = path.resolve("temp");
// //     if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// //     // File path is fixed: temp/temp.code
// //     const filePath = path.join(tempDir, `temp.${lang}`);

// //     // Overwrite the file with the new code
// //     fs.writeFileSync(filePath, code, "utf8");

// //     console.log(`📁 Code saved at: ${filePath}`);

// //     const callback = async (data) => {
// //       console.log("🔹 Full Response from Compilation ->", data);

// //       if (data.error) {
// //         return res.status(400).json({ success: false, output: data.error });
// //       }

// //       console.log("✅ Extracted Output ->", data.output);

// //       return res.status(200).json({ success: true, result: data.output });
// //     };

// //     // Compile using compilex
// //     if (lang === "java") {
// //       input
// //         ? compiler.compileJavaWithInput(envData, code, input, callback)
// //         : compiler.compileJava(envData, code, callback);
// //     } else if (lang === "cpp") {
// //       input
// //         ? compiler.compileCPPWithInput(envData, code, input, callback)
// //         : compiler.compileCPP(envData, code, callback);
// //     } else if (lang === "python") {
// //       input
// //         ? compiler.compilePythonWithInput(envData, code, input, callback)
// //         : compiler.compilePython(envData, code, callback);
// //     } else {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: "Unsupported language" });
// //     }
// //   } catch (error) {
// //     console.error("❌ Compilation error:", error);
// //     return res
// //       .status(500)
// //       .json({ success: false, message: "Server error during compilation" });
// //   }
// // };

// // export { compileCode };




// import fs from "fs";
// import path from "path";
// import { exec } from "child_process";

// const compileCode = async (req, res) => {
//   try {
//     const { code, lang } = req.body; // Only code and language
//     if (!code || !lang) {
//       return res.status(400).json({ success: false, message: "Code and language are required" });
//     }

//     // Ensure temp directory exists
//     const tempDir = path.resolve("temp");
//     if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//     // Determine file name and class/exe name
//     let fileName, className, exePath;
//     if (lang === "java") {
//       fileName = "Solution.java";
//       className = "Solution"; // Must match the class name inside Java code
//     } else if (lang === "cpp") {
//       fileName = "Solution.cpp";
//       exePath = path.join(tempDir, "Solution.exe");
//     } else if (lang === "python") {
//       fileName = "Solution.py";
//     } else {
//       return res.status(400).json({ success: false, message: "Unsupported language" });
//     }

//     const filePath = path.join(tempDir, fileName);

//     // Save the code to file
//     fs.writeFileSync(filePath, code, "utf8");
//     console.log(`📁 Code saved at: ${filePath}`);

//     const callback = (data) => {

//       console.log("Data -> ", data);

//       if (data.error) return res.status(400).json({ success: false, output: data.error });

//       console.log("Data -> ", data);

//       return res.status(200).json({ success: true, result: data.output });
//     };

//     // Execute without input
//     if (lang === "java") {
//       const compileCmd = `javac "${filePath}"`;
//       const runCmd = `java -cp "${tempDir}" ${className}`;

//       exec(compileCmd, (err, stdout, stderr) => {
//         if (err || stderr) return callback({ error: stderr || err.message });
//         exec(runCmd, (err2, stdout2, stderr2) => {
//           if (err2 || stderr2) return callback({ error: stderr2 || err2.message });
//           callback({ output: stdout2 });
//         });
//       });
//     } else if (lang === "cpp") {
//       const compileCmd = `g++ ${filePath} -o ${exePath}`;
//       const runCmd = `${exePath}`;

//       exec(compileCmd, (err, stdout, stderr) => {
//         if (err || stderr) return callback({ error: stderr || err.message });
//         exec(runCmd, (err2, stdout2, stderr2) => {
//           if (err2 || stderr2) return callback({ error: stderr2 || err2.message });
//           callback({ output: stdout2 });
//         });
//       });

//     } else if (lang === "python") {
//       const runCmd = `python "${filePath}"`;
//       exec(runCmd, (err, stdout, stderr) => {
//         if (err || stderr) return callback({ error: stderr || err.message });
//         callback({ output: stdout });
//       });
//     }


//   } catch (error) {
//     console.error("❌ Compilation error:", error);
//     return res.status(500).json({ success: false, message: "Server error during compilation" });
//   }
// };

// export { compileCode };








import fs from "fs";
import path from "path";
import { exec } from "child_process";

const compileCode = async (req, res) => {
  try {
    const { code, lang } = req.body; // Only code and language
    if (!code || !lang) {
      return res
        .status(400)
        .json({ success: false, message: "Code and language are required" });
    }

    // Ensure temp directory exists
    const tempDir = path.resolve("temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // Determine file name and class/exe name
    let fileName, className, exePath;
    if (lang === "java") {
      fileName = "Solution.java";
      className = "Solution"; // Must match the class name inside Java code
    } else if (lang === "cpp") {
      fileName = "Solution.cpp";
      exePath = path.join(tempDir, "Solution.out");
    } else if (lang === "python") {
      fileName = "Solution.py";
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported language" });
    }

    const filePath = path.join(tempDir, fileName);

    // Save the code to file
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`📁 Code saved at: ${filePath}`);

    const callback = (data) => {
      if (data.error)
        return res.status(400).json({ success: false, output: data.error });

      return res.status(200).json({ success: true, result: data.output });
    };

    // Execute without input
    if (lang === "java") {
      const compileCmd = `javac "${filePath}"`;
      const runCmd = `java -cp "${tempDir}" ${className}`;

      exec(compileCmd, { timeout: 5000 }, (err, stdout, stderr) => {
        if (err || stderr)
          return callback({ error: stderr || err.message });
        exec(runCmd, { timeout: 5000 }, (err2, stdout2, stderr2) => {
          if (err2 || stderr2)
            return callback({ error: stderr2 || err2.message });
          callback({ output: stdout2 });
        });
      });
    } else if (lang === "cpp") {
      const compileCmd = `g++ "${filePath}" -o "${exePath}"`;
      const runCmd = `${exePath}`;

      exec(compileCmd, { timeout: 5000 }, (err, stdout, stderr) => {
        if (err || stderr)
          return callback({ error: stderr || err.message });
        exec(runCmd, { timeout: 5000 }, (err2, stdout2, stderr2) => {
          if (err2 || stderr2)
            return callback({ error: stderr2 || err2.message });
          callback({ output: stdout2 });
        });
      });
    } else if (lang === "python") {
      // Use python3 inside Ubuntu container
      const runCmd = `python3 "${filePath}"`;
      exec(runCmd, { timeout: 5000 }, (err, stdout, stderr) => {
        if (err || stderr) return callback({ error: stderr || err.message });
        callback({ output: stdout });
      });
    }
  } catch (error) {
    console.error("❌ Compilation error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during compilation" });
  }
};

export { compileCode };
