import {Drawer} from "@mui/material";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
// import leftDrawer from "leftDrawer.slice.js";

// import { openDrawer } from "../redux/drawerSlice"; // Import the action
import ChatMain from "../chats/ChatMain.jsx";
import StatusMain from "../status/StatusMain.jsx";
import ChannelMain from "../channels/ChannelMain.jsx";
import SettingMain from "../settings/SettingMain.jsx";
import ProfileMain from "../profile/ProfileMain.jsx";
import AiMain from "../ai/AiMain.jsx";
import {
  closeDrawer,
  openDrawer,
} from "../../redux/slices/chat/leftDrawer.slice.js";
import NewChat from "../chats/NewChat.jsx";
import AddGroupMembers from "../chats/AddGroupMembers.jsx";
import StarredMessages from "../chats/StarredMessages.jsx";
import SelectChats from "../chats/SelectChats.jsx";

import {TbRubberStamp} from "react-icons/tb";

const LeftHalf = () => {
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector((state) => state.leftDrawer.isOpen); // Access drawer state
  const content = useSelector((state) => state.leftDrawer.content); // Get which component to display
  const {user} = useSelector((state) => state.auth);

  // Function to render the appropriate component based on the content state
  const renderComponent = () => {
    switch (content) {
      // sidebar icons
      case "chats":
        return <ChatMain />;
      case "status":
        return <StatusMain />;
      case "channels":
        return <ChannelMain />;
      case "ai":
        return <AiMain />;
      case "settings":
        return <SettingMain />;
      case "profile":
        return <ProfileMain />;
      case "newChat":
        return <NewChat />;

      case "addGroupMembers":
        return <AddGroupMembers />;
      case "starredMessages":
        return <StarredMessages />;
      case "selectChats":
        return <SelectChats />;
      // case "logout":
      //   return <Logout />;

      default:
        return <ChatMain />;
      // return <div>Select a component from the sidebar component.</div>;
    }
  };

  // useEffect(() => {
  //   // Cleanup function to close the drawer when the component unmounts
  //   return () => {
  //     console.log("isDrawerOpen inside effect before dispatch: ", isDrawerOpen);

  //     dispatch(closeDrawer());
  //     console.log("isDrawerOpen inside effect after dispatch: ", isDrawerOpen);
  //   };
  // }, [content]);

  return (
    <div className="border-2 border-red-600 w-5/12 min-w-80 text-3xl bg-green-100 max-h-screen ">
      <div
        className={`relative left-0 top-0 h-full bg-orange-200 shadow-lg transform transition-transform duration-300    max-h-screen 
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} `}
        key={content} // Use content as the key to trigger a re-render
      >
        {renderComponent()}
      </div>
    </div>
  );
};

export default LeftHalf;
