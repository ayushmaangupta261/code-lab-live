import React, { useState } from 'react'
import SignUp from './SignUp'
import LogIn from './LogIn'
import character from "../../assets/Auth/character.png"
import { RxCross2 } from "react-icons/rx";
import { setModal } from '../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'

const Template = () => {
    const [showLogIn, setShowLogIn] = useState(true);
    const dispatch = useDispatch();

    const toggleLogInForm = () => {
        setShowLogIn((prev) => !prev);
    };

    return (
        <div className='flex flex-col md:flex-row border md:h-[42rem] mx-auto rounded-3xl shadow-2xl bg-white overflow-hidden'>
            
            {/* Left: Login / Signup */}
            <div className='w-full md:w-1/2 flex justify-center items-center p-6'>
                {showLogIn ? (
                    <LogIn toggleLogInForm={toggleLogInForm} />
                ) : (
                    <SignUp toggleLogInForm={toggleLogInForm} />
                )}
            </div>

            {/* Right: Illustration */}
            <div className="relative  w-full md:w-1/2 h-[20rem] md:h-full bg-blue-200 rounded-b-3xl md:rounded-b-none md:rounded-r-3xl">
                {/* Background Image */}
                <img
                    src={character}
                    alt="Character"
                    className="absolute top-0 left-0 w-full h-full object-cover z-10 rounded-b-3xl md:rounded-b-none md:rounded-r-3xl"
                />

            
            </div>
        </div>
    );
}

export default Template;
