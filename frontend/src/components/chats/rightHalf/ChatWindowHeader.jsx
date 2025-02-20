import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import {openDrawerRight} from '../../../redux/slices/chat/rightDrawer.slice';
import {Avatar, Button, ButtonBase, IconButton, Paper} from '@mui/material';

const ChatWindowHeader = () => {
  const {selectedChat, selectedUser} = useSelector((state) => state.chatWindow);

  const {onlineUserId, isOnline} = useSelector(
    (state) => state.chatWindowHeader
  );

  const [threeDotClicked, setThreeDotClicked] = useState(false);

  // Each button/icon sends a different payload to indicate the component to display
  const user = selectedChat ? selectedChat.user : selectedUser;

  const handleDrawer = (componentName) => {
    dispatch(openDrawerRight(componentName)); // Send component name as payload
  };

  const handleThreeDots = () => {
    setThreeDotClicked(!threeDotClicked);
  };

  return (
    <div className="chat-header h-18 flex  justify-between border-b  p-2  bg-slate-100">
      <div className="flex w-full  ">
        <img
          src={user.avatar}
          alt={'P'}
          className="header-avatar w-10 h-10 rounded-full mr-3 ml-2 mt-1"
        />

        <div className="header-info ">
          <p className="text-lg w-[140px]  md:w-[370px]  truncate    ">
            {user.username}
          </p>

          <p className="text-base text-gray-600 ml-1">
            {user._id === onlineUserId
              ? isOnline
              : user.isOnline
              ? 'online'
              : 'offline'}
          </p>
        </div>
      </div>

      <div className="header-actions flex gap-1">
        <IconButton>
          <CallIcon />
        </IconButton>
        <IconButton>
          <VideocamIcon />
        </IconButton>
        <IconButton>
          <SearchIcon />
        </IconButton>

        {/*  3 dot icon------------- */}
        <div className="flex relative">
          <div
            className={` flex items-center ${
              threeDotClicked && 'bg-gray-300 rounded-full'
            }`}>
            <IconButton onClick={handleThreeDots}>
              <MoreVertIcon />
            </IconButton>
          </div>

          {/* Overlay to detect outside clicks */}
          {threeDotClicked && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setThreeDotClicked(false)}></div>
          )}

          {/* Animated Menu  for 3 dot */}
          <div
            className={`${
              threeDotClicked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            } transform origin-top-right transition-all duration-300 ease-out bg-white  rounded-lg shadow-lg absolute top-12 right-1 w-52 text-gray-700 text-base z-50`}>
            <Paper elevation={4} square={false}>
              <ul className="py-2 ">
                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">
                      Contact info
                    </p>
                  </ButtonBase>
                </li>

                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">
                      Select messages
                    </p>
                  </ButtonBase>
                </li>
                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">
                      Mute notifications
                    </p>
                  </ButtonBase>
                </li>

                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">
                      Disappearing messages
                    </p>
                  </ButtonBase>
                </li>

                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">
                      Close chat
                    </p>
                  </ButtonBase>
                </li>
                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">
                      Report
                    </p>
                  </ButtonBase>
                </li>
                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">Block</p>
                  </ButtonBase>
                </li>
                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left">
                      Clear chat
                    </p>
                  </ButtonBase>
                </li>
                <li className="hover:bg-gray-200  ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4  text-left  text-red-500">
                      Delete chat
                    </p>
                  </ButtonBase>
                </li>
              </ul>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowHeader;
