import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { DashboardLinks } from "../../constants/Links/DashboardLinks";
import SidebarLink from "./SidebarLink";

const Sidebar = ({ accountType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("Account type -> ", accountType);

  return (
    <div className="flex flex-col gap-y-6 w-full h-auto ">
      <div className="">
        {DashboardLinks?.map((link, index) => {
          if (link?.type && accountType !== link?.type) return null;
          return (
            <div className=" bg-gray-700 mb-2 rounded-lg hover:scale-105 duration-200  flex flex-col gap-y-2">
              <SidebarLink link={link} iconName={link?.icon} key={link?.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
