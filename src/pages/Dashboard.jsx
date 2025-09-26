import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import Sidebar from "../components/Dashboard/Sidebar";
import { Menu, X } from "lucide-react";
import "../components/Dashboard/DashboardComponent/Instructor-Students/scrollbar.css";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-[100%]  pt-4 px-4 md:px-6 bg-[#121212] -mt-[1.5rem] overflow-x-hidden overflow-y-hidden">
      {/* Mobile Header */}
      <div className="xl:hidden flex justify-between items-center mb-4 relative">
        <p className="text-[#a486ff] text-lg">{user?.fullName}</p>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white p-2"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Sidebar dropdown for mobile, aligned to right */}
        <div
          className={`fixed top-[4rem] right-4 px-5 py-3 w-[15rem] bg-gray-800 z-50 rounded-xl transform origin-top transition-all duration-300 ease-in-out xl:hidden ${
            isSidebarOpen
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-0 pointer-events-none"
          }`}
        >
          <Sidebar
            accountType={user?.accountType}
            onLinkClick={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden h-[38rem] xl:flex flex-row gap-4 max-w-[95%] mx-auto mt-4 overflow-hidden">
        <aside className="w-[15%] bg-gray-800 px-4 py-6 rounded-xl">
          <div className="mb-6 text-left">
            <p className="text-[#a486ff] text-shadow-glow text-lg break-words">
              {user?.fullName}
            </p>
          </div>
          <div className="h-[1px] bg-gray-500 my-4"></div>
          <nav className="flex flex-col gap-y-3">
            <Sidebar accountType={user?.accountType} />
          </nav>
        </aside>

        <main className="w-[85%] bg-[#282a36] rounded-xl p-4 overflow-x-auto overflow-y-hidden">
          <Outlet context={user} />
        </main>
      </div>

      {/* Mobile Main Content */}
      <div className="xl:hidden h-[38rem] mt-4 w-[100%]   overflow-hidden">
        <main className="w-[100%]  md:bg-[#282a36] h-full rounded-xl">
          <Outlet context={user} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
