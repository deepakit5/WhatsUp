import React, {useEffect, useRef, useState} from "react";
import {Drawer, Dialog, IconButton} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import {useDispatch} from "react-redux";
import {openDrawer} from "../../redux/slices/chat/leftDrawer.slice";
import {logout} from "../../redux/slices/authentication/auth.slice";

const LogoCard = () => {
  const dispatch = useDispatch();
  const [selectedIcon, setSelectedIcon] = useState("");
  const [showText, setShowText] = useState(false);
  const [isOpenChatOpt, setIsOpenChatOpt] = useState(false);

  // Each button/icon sends a different payload to indicate the component to display
  const handleDrawer = (componentName) => {
    setSelectedIcon(componentName);
    dispatch(openDrawer(componentName)); // Send component name as payload
  };

  const handleChatOpt = () => {
    setIsOpenChatOpt(!isOpenChatOpt);
  };

  // Close menu when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200">
      <p className="font-bold text-2xl  ">Chats</p>

      {/* Right - Icons */}
      <div className="flex items-center space-x-2">
        {/* New Chat Icon */}
        <div className="flex">
          <IconButton
            // style={{color: "green"}}
            onMouseEnter={() => setShowText("newChat")}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer("newChat")}>
            {selectedIcon === "newChat" ? (
              <AddCommentOutlinedIcon fontSize="large" />
            ) : (
              <AddCommentOutlinedIcon
                style={{color: "green"}}
                fontSize="medium"
              />
            )}
          </IconButton>
          <div>
            {showText === "newChat" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                New Chat
              </p>
            )}
          </div>
        </div>
        {/* -------------------------- */}
        <div className="flex">
          <IconButton
            // style={{color: "green"}}
            onMouseEnter={() => setShowText("chatOptions")}
            onMouseLeave={() => setShowText(false)}
            onClick={handleChatOpt}>
            <MoreVertIcon />
          </IconButton>
          <div>
            {showText === "chatOptions" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                More Options
              </p>
            )}
          </div>
        </div>
        {/* Animated Menu */}
        <div
          className={`${
            isOpenChatOpt ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } transform origin-top-right transition-all duration-300 ease-out bg-white  rounded-lg shadow-lg absolute top-12 right-5 w-40 text-gray-700 text-base`}>
          <ul className="">
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleDrawer("addGroupMembers")}>
              New Group
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleDrawer("starredMessages")}>
              Starred Message
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleDrawer("selectChats")}>
              Select Chats
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => dispatch(logout())}>
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
