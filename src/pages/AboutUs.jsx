import React from "react";
import Footer from "../components/Footer/Footer";

const AboutUs = () => {
  return (
    <div className="bg-[#121212] text-white w-full min-h-screen  flex flex-col items-center">

      {/* Hero Section */}
      <section className="text-center px-4  max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold">About Us</h1>
        <p className="text-lg mt-4 text-gray-300 max-w-3xl text-justify md:text-center mx-auto">
          At CodeLab, we believe in the power of technology to shape the future.
          Our mission is to create a dynamic and collaborative environment where
          developers, designers, and tech enthusiasts come together to innovate,
          learn, and grow...
        </p>
      </section>

      {/* Mission & Vision Section */}
      <div className="px-4 mt-7 max-w-7xl mx-auto  py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="text-center py-6 px-5 bg-gray-800 rounded-xl shadow">
            <h2 className="text-3xl font-semibold">Our Mission</h2>
            <p className="text-lg mt-4 text-gray-300 text-justify md:text-center">
              CodeLab is dedicated to empowering individuals through hands-on
              coding experiences...
            </p>
          </section>

          <section className="text-center py-6 px-5 bg-gray-700 rounded-xl shadow">
            <h2 className="text-3xl font-semibold">Our Vision</h2>
            <p className="text-lg mt-4 text-gray-300 text-justify md:text-center">
              We envision a future where technology is accessible to everyone...
            </p>
          </section>
        </div>
      </div>

      {/* What We Offer Section */}
       <div className="py-16 bg-black px-4 mt-10 w-[100vw] ">
        <h2 className="text-3xl text-center font-semibold">What we offer!</h2>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            "Live Coding Sessions: Interactive learning with expert mentors.",
            "Project-Based Learning: Hands-on experience with real-world challenges.",
            "Tech Community: A thriving network of like-minded developers.",
            "Career Growth: Guidance to help individuals transition into tech careers.",
          ].map((item, index) => (
            <li
              key={index}
              className="bg-gray-800 py-4 px-6 rounded-lg md:hover:scale-105 text-justify md:text-center transition-transform duration-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-800 px-4 w-[100vw] ">
        <h2 className="text-center text-3xl font-semibold">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          {[
            { name: "Ayushmaan Gupta", role: "CEO & Founder" },
            { name: "Shrishti Godamker", role: "CTO" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-gray-700 p-6 rounded-lg w-64 text-center"
            >
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Closing Message */}
      {/* <div className="text-center py-6">
        <p className="text-lg">
          Join CodeLab and be part of a movement that turns ideas into reality!
          🚀
        </p>
      </div> */}
    </div>
  );
};

export default AboutUs;
