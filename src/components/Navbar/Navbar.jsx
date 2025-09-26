import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../../services/operations/authApi";
import { logoutInstructor } from "../../services/operations/instructorApi";
import { logoutInstitute } from "../../services/operations/instituteAPI";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  console.log("User -> ", user);

  const handleLogOut = () => {
    if (!user) return;
    const role = user.accountType;

    if (role === "Instructor") {
      dispatch(logoutInstructor(user?.accessToken, navigate));
    } else if (role === "Institute") {
      dispatch(logoutInstitute(user?.accessToken, navigate));
    } else {
      dispatch(logout(user?.accessToken, navigate));
    }
  };

  return (
    <>
      {/* Top Navbar - visible on large screens only */}
      <div className="hidden lg:flex w-full justify-center fixed top-5 z-50">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[90%] max-w-screen-xl
                     bg-gray-500 bg-opacity-30 backdrop-blur-md text-blue-300
                     py-3 px-6 rounded-xl shadow-lg flex justify-between items-center"
        >
          {/* Logo */}
          <button
            className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text"
            onClick={() => navigate("/")}
          >
            Code Lab
          </button>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-x-6 items-center justify-center">
            <button
              className="text-lg hover:scale-110 transition-all duration-300"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <p
              className="text-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/about-us")}
            >
              About
            </p>
            {!user ? (
              <button
                className="text-lg hover:scale-110 transition-all duration-300"
                onClick={() => navigate("/auth")}
              >
                LogIn
              </button>
            ) : (
              <>
                <button
                  className="text-lg hover:scale-110 transition-all duration-300"
                  onClick={() => navigate("/dashboard/overview")}
                >
                  Dashboard
                </button>
                <button
                  className="text-lg hover:scale-110 transition-all duration-300"
                  onClick={handleLogOut}
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navbar - visible on mobile only */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden fixed bottom-3 md:bottom-8 inset-x-0 mx-auto w-[90%]
        bg-[#282a36] bg-opacity-80 backdrop-blur-md text-blue-300 
        flex justify-around py-3 rounded-full shadow-md z-50"
      >
        <button
          className="text-lg hover:scale-110 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <p
          className="text-lg hover:scale-110 transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/about-us")}
        >
          About
        </p>

        {!user ? (
          <button
            className="text-lg hover:scale-110 transition-all duration-300"
            onClick={() => navigate("/auth")}
          >
            LogIn
          </button>
        ) : (
          <>
            <button
              className="text-lg hover:scale-110 transition-all duration-300"
              onClick={() => navigate("/dashboard/overview")}
            >
              Profile
            </button>
            <button
              className="text-lg hover:scale-110 transition-all duration-300"
              onClick={handleLogOut}
            >
              Log Out
            </button>
          </>
        )}
      </motion.div>
    </>
  );
};

export default Navbar;
