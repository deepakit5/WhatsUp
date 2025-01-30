import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {setActiveTab} from "../../redux/slices/user/settings.slice.js";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import {openDrawerLeft} from "../../redux/slices/chat/leftDrawer.slice.js";
import {logout} from "../../redux/slices/authentication/auth.slice.js";

const sidebarItems = [
  {
    id: "profileSettings",
    label: "Profile",
    icon: <PersonIcon fontSize="small" />,
  },
  {id: "privacy", label: "Privacy", icon: <LockIcon fontSize="small" />},
  {
    id: "notifications",
    label: "Notifications",
    icon: <NotificationsIcon fontSize="small" />,
  },
  {id: "theme", label: "Theme", icon: <DarkModeIcon fontSize="small" />},
  {id: "help", label: "Help", icon: <HelpOutlineIcon fontSize="small" />},
];

const SettingsSidebar = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          className={`flex items-center py-3 px-4 border-b border-gray-300 text-left hover:bg-gray-200 transition-all duration-300 
        
          `}
          onClick={() => dispatch(openDrawerLeft(item.id))}>
          <span className="mr-3">{item.icon}</span>
          <span className="text-xl">{item.label}</span>
        </button>
      ))}
      <button
        onClick={() => dispatch(logout())}
        className="flex items-center py-3 px-4 border-b border-gray-300 text-left hover:bg-gray-200 transition-all duration-300 ">
        <LogoutIcon fontSize="small" sx={{color: "red"}} />
        <p className=" ml-3 text-xl text-red-500">Log out</p>
      </button>
    </div>
  );
};

export default SettingsSidebar;
