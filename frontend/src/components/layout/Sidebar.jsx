import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  closeDrawer,
  openDrawer,
} from "../../redux/slices/chat/leftDrawer.slice.js";

// material ui
import {Box, IconButton, Avatar, Drawer} from "@mui/material";

import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import WebStoriesOutlinedIcon from "@mui/icons-material/WebStoriesOutlined";
import WebStoriesIcon from "@mui/icons-material/WebStories";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import SensorOccupiedOutlinedIcon from "@mui/icons-material/SensorOccupiedOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonIcon from "@mui/icons-material/Person";

const Sidebar = () => {
  const dispatch = useDispatch();
  const [selectedIcon, setSelectedIcon] = useState("");
  const [showText, setShowText] = useState(false);

  const {profileImage} = useSelector((state) => state.user);

  // Each button/icon sends a different payload to indicate the component to display
  const handleDrawer = (componentName) => {
    dispatch(closeDrawer());

    setSelectedIcon(componentName);
    dispatch(openDrawer(componentName)); // Send component name as payload
  };

  // useEffect(() => {
  //   dispatch(fetchUserProfile(userId));
  // }, [dispatch, userId]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(closeDrawer());
  //   };
  // }, [componentName]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
      width="75px"
      bgcolor="#f5f5f5"
      zIndex="10">
      {/* Upper Div */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={2}
        gap={2}>
        <div className="flex">
          <IconButton
            onMouseEnter={() => setShowText("chats")}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer("chats")}>
            {selectedIcon === "chats" ? (
              <InsertCommentIcon fontSize="large" />
            ) : (
              <InsertCommentOutlinedIcon fontSize="medium" />
            )}
          </IconButton>
          <div>
            {showText === "chats" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 ">
                Chats
              </p>
            )}
          </div>
        </div>

        <div className="flex">
          <IconButton
            // style={{color: "green"}}
            onMouseEnter={() => setShowText("status")}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer("status")}>
            {selectedIcon === "status" ? (
              <WebStoriesIcon fontSize="large" />
            ) : (
              <WebStoriesOutlinedIcon
                style={{color: "green"}}
                fontSize="medium"
              />
            )}
          </IconButton>
          <div>
            {showText === "status" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 ">
                Status
              </p>
            )}
          </div>
        </div>

        <div className="flex">
          <IconButton
            onMouseEnter={() => setShowText("channels")}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer("channels")}>
            {selectedIcon === "channels" ? (
              <SensorOccupiedIcon fontSize="large" />
            ) : (
              <SensorOccupiedOutlinedIcon fontSize="medium" />
            )}
          </IconButton>
          <div>
            {showText === "channels" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 ">
                Channels
              </p>
            )}
          </div>
        </div>
        <div className="flex">
          <IconButton
            onMouseEnter={() => setShowText("ai")}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer("ai")}>
            {selectedIcon === "ai" ? (
              <AutoFixHighIcon fontSize="large" />
            ) : (
              <AutoFixHighOutlinedIcon fontSize="medium" />
            )}
          </IconButton>
          <div>
            {showText === "ai" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 ">
                AI
              </p>
            )}
          </div>
        </div>
      </Box>
      {/* Lower Div */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={2}
        gap={2}>
        <div className="flex">
          <IconButton
            onMouseEnter={() => setShowText("settings")}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer("settings")}>
            {selectedIcon === "settings" ? (
              <SettingsIcon fontSize="large" />
            ) : (
              <SettingsOutlinedIcon fontSize="medium" />
            )}
          </IconButton>
          <div>
            {showText === "settings" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 ">
                Settings
              </p>
            )}
          </div>
        </div>

        <div className="flex">
          <IconButton
            onMouseEnter={() => setShowText("profile")}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer("profile")}>
            {profileImage ? (
              <img
                src={profileImage}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <PersonIcon fontSize="large" /> // fallback icon if no profile image
            )}
          </IconButton>
          <div>
            {showText === "profile" && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 ">
                Profile
              </p>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Sidebar;
