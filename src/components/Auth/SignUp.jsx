import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import google from "../../assets/Auth/google.png";
import github from "../../assets/Auth/github.png";
import { registerUser } from "../../services/operations/authApi";
import { registerInstitute } from "../../services/operations/instituteAPI";
import { registerInstructor } from "../../services/operations/instructorApi.js";
import "./authLoader.css";

const SignUp = ({ toggleLogInForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const accountType = useWatch({
    control,
    name: "accountType",
    defaultValue: "Student",
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const submitForm = (data) => {
    switch (accountType) {
      case "Student":
        dispatch(registerUser(data));
        break;
      case "Instructor":
        dispatch(registerInstructor(data));
        break;
      case "Institute":
        dispatch(registerInstitute(data));
        break;
      default:
        console.warn("Unknown account type:", accountType);
    }

    reset();
  };

  return (
    <div className="flex md:w-[95%] justify-center items-center h-[40rem] xl:w-[25rem] py-3 px-3 xl:ml-5">
      {authLoading ? (
        <div className="card h-[5rem] flex justify-center items-center">
          <div className="loader">
            <div className="words">
              <span className="word">Verifying</span>
              <span className="word">Processing</span>
              <span className="word">Signning Up</span>
              <span className="word">Please Wait</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-[100%]">
          <div className="flex flex-col">
            <p>Hey There !!!</p>
            <p className="text-4xl font-semibold">Sign Up</p>
          </div>

          {/* Form */}
          <div className="flex flex-col w-[100%] gap-y-2 mt-7">
            <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-y-3">
              {/* Account Type */}
              <div className="flex flex-col">
                <p>Account Type:</p>
                <div className="flex justify-between px-1 py-1 rounded-xl xl:rounded-full bg-richblack-800 w-[20rem]">
                  {["Student", "Instructor", "Institute"].map((type) => (
                    <label
                      key={type}
                      className={`cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                        accountType === type
                          ? "bg-blue-400 text-richblack-5 font-medium border-blue-600"
                          : "text-richblack-200 border-black"
                      }`}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("accountType")}
                        defaultChecked={type === "Student"}
                        className="hidden"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col w-full">
                <label>
                  {accountType === "Institute" ? "Name of Institute:" : "Full Name:"}
                </label>
                <div className="relative xl:w-[20rem]">
                  <input
                    type="text"
                    {...register("fullName", { required: true })}
                    className={`bg-gray-500 w-full rounded-md h-[2rem] px-3 hover:scale-105 duration-200 ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.fullName && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 text-sm">
                      Full Name is required
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col xl:w-[20rem]">
                <label>Email:</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-gray-500 w-full rounded-md h-[2rem] px-1 hover:scale-105 duration-200"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label>Password:</label>
                <div className="relative xl:w-[20rem]">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className={`bg-gray-500 w-full rounded-md h-[2rem] px-3 pr-10 hover:scale-105 duration-200 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex justify-center items-center"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                  {errors.password && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label>Confirm Password:</label>
                <div className="relative xl:w-[20rem]">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                    })}
                    className={`bg-gray-500 w-full rounded-md h-[2rem] px-3 pr-10 hover:scale-105 duration-200 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex justify-center items-center"
                  >
                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                  {errors.confirmPassword && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex mt-2 justify-center xl:w-[20rem]">
                <button
                  type="submit"
                  className="bg-amber-400 text-black px-2 py-2 rounded-md w-full hover:scale-95 duration-200 cursor-pointer"
                >
                  SignUp
                </button>
              </div>
            </form>
          </div>

          {/* OAuth Section */}
          <div className="flex flex-col xl:w-[20rem] mt-10  items-center justify-center gap-y-3">
            {/* <p className="text-sm">
              or <span className="text-blue-400 select-none">SignUp with</span>
            </p>
            <div className="flex items-center justify-between gap-x-10">
              <button className="w-[5rem] h-[3rem] border border-blue-300 bg-white flex justify-center items-center rounded-3xl hover:scale-105 duration-200 cursor-pointer">
                <img src={google} alt="Google" className="w-[30%]" />
              </button>
              <button className="w-[5rem] h-[3rem] border border-blue-300 bg-white flex justify-center items-center rounded-3xl hover:scale-105 duration-200 cursor-pointer">
                <img src={github} alt="GitHub" className="w-[30%]" />
              </button>
            </div> */}
            <p className="text-sm">
              Already have an account?{" "}
              <button
                className="text-pink-500 hover:scale-95 duration-200 cursor-pointer"
                onClick={toggleLogInForm}
              >
                LogIn
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
