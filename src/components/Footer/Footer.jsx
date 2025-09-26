import React from "react";
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-10 pb-[5rem] md:pb-[7rem] lg:pb-5 sm:px-6 md:px-8 overflow-x-hidden flex flex-col gap-y-6 justify-center items-center bg-[#222222] w-[100vw]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-7xl"
      >
        <div className="grid grid-cols-1 justify-between sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* First section */}
          <div className="space-y-4">
            <button
              className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text"
              onClick={() => navigate("/")}
            >
              Code Lab
            </button>
            <p className="text-dark2 text-justify text-sm sm:text-base">
              Welcome to CodeLab, your go-to online code editor! Designed with
              user-friendliness in mind, CodeLab offers an intuitive and
              seamless coding experience.
            </p>
          </div>

          {/* Second section */}
          <div className="flex gap-x-10 md:justify-evenly">
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold">Courses</h1>
              <ul className="space-y-2 text-sm sm:text-lg text-dark2">
                <li className="cursor-pointer hover:text-secondary duration-200">
                  Web Development
                </li>
                <li className="cursor-pointer hover:text-secondary duration-200">
                  Software Development
                </li>
                <li className="cursor-pointer hover:text-secondary duration-200">
                  Apps Development
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold">Links</h1>
              <ul className="space-y-2 text-sm sm:text-lg text-dark2">
                <li className="cursor-pointer hover:text-secondary duration-200">
                  Home
                </li>
                <li className="cursor-pointer hover:text-secondary duration-200">
                  Services
                </li>
                <li className="cursor-pointer hover:text-secondary duration-200">
                  About
                </li>
              </ul>
            </div>
          </div>

          {/* Third section */}
          <div className="space-y-4 flex flex-col lg:items-center max-w-md">
            <h1 className="text-xl sm:text-2xl font-bold">Get In Touch</h1>

            {/* Social icons */}
            <div className="flex space-x-6 pt-2 text-2xl text-white">
              <a
                href="https://chat.whatsapp.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp className="cursor-pointer hover:text-primary hover:scale-110 duration-200" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram className="cursor-pointer hover:text-primary hover:scale-110 duration-200" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube className="cursor-pointer hover:text-primary hover:scale-110 duration-200" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="text-sm text-gray-400 pt-6 text-center">
        Made with ❤️ by Ayushmaan Gupta
      </p>
    </div>
  );
};

export default Footer;
