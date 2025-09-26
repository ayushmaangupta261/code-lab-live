import React from "react";
import LogIn from "../components/Auth/LogIn";
import SignUp from "../components/Auth/SignUp";
import character from "../assets/Auth/character.png";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

const Auth = () => {
  const [showLogIn, setShowLogIn] = useState(true);

  // Toggle login form visibility
  const toggleLogInForm = () => {
    setShowLogIn((prev) => !prev); // Toggle between LogIn and SignUp
  };

  console.log("Login form -> ", showLogIn);
  return (
    <div className="flex overflow-x-hidden xl:justify-between w-[100%] xl:w-[90%] lg:ml-auto shadow-2xl rounded-3xl ">
      {/* left */}
      <div className="flex w-[100%] xl:w-1/2 justify-center xl:justify-end  overflow-hidden">
        {/* Conditionally render SignUp or LogIn */}
        {showLogIn ? (
          <LogIn toggleLogInForm={toggleLogInForm} />
        ) : (
          <SignUp toggleLogInForm={toggleLogInForm} />
        )}
      </div>

      {/* right */}
      <div className="relative w-full  hidden xl:flex">
        {/* Image */}
        <img
          src={character}
          alt="Character"
          className="absolute top-0 right-0 w-auto h-full object-cover z-2 "
        />
      </div>
    </div>
  );
};

export default Auth;
