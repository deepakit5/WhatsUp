import React from "react";
import {useSelector} from "react-redux";
// import SettingsLayout from "./SettingsLayout.jsx";
// import SlideExample from "./SlideExample.jsx";
import SearchBar from "../chats/SearchBar.jsx";
import SettingsSidebar from "./SettingsSidebar.jsx";
// import SettingsContent from "./SettingsContent.jsx";
import {Slide} from "@mui/material";

const SettingMain = ({containerRef}) => {
  const {isOpen} = useSelector((state) => state.leftDrawer); // Access drawer state
  const {profileImage, username, about} = useSelector((state) => state.user);

  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={500}
      easing="ease"
      container={containerRef.current}>
      <div>
        {/* <SettingsLayout /> */}
        {/* <SlideExample /> */}
        <div className="flex items-center justify-between p-2 bg-gray-100  w-full    border-black ">
          <p className="font-bold text-2xl  ">Settings</p>
        </div>

        <SearchBar />

        <div className="h-[80vh]  overflow-y-auto  max-h-screen bg-gray-50 pl-">
          <div className=" 1st card flex  items-center   border-b-gray-300 border-b  ">
            <div className="image-container  w-24 h-24  bg-blue-400   rounded-full object-cover  cursor-pointer m-3 ">
              <img
                src={profileImage}
                alt="profile image"
                className="w-24 h-24 object-cover  rounded-full "
              />
            </div>
            <div>
              <p className="text-xl">{username}</p>
              <p className="text-base ">{about}</p>
            </div>
          </div>
          <SettingsSidebar />
          {/* <SettingsContent /> */}
        </div>
      </div>
    </Slide>
  );
};

export default SettingMain;
