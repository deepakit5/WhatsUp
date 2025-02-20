import React, {useEffect, useRef, useState} from 'react';
import {Drawer, Dialog, IconButton, Paper, ButtonBase} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import {useDispatch} from 'react-redux';
import {openDrawerLeft} from '../../redux/slices/chat/leftDrawer.slice';
import {logout} from '../../redux/slices/authentication/auth.slice';

const LogoCard = () => {
  const dispatch = useDispatch();
  const [selectedIcon, setSelectedIcon] = useState('');
  const [showText, setShowText] = useState(false);

  const [threeDotClicked, setThreeDotClicked] = useState(false);

  // Each button/icon sends a different payload to indicate the component to display
  const handleDrawer = (componentName) => {
    setSelectedIcon(componentName);
    dispatch(openDrawerLeft(componentName));
  };

  const handleThreeDots = () => {
    setThreeDotClicked(!threeDotClicked);
    // console.log("threeDotClicked in handle in logo card: ", threeDotClicked);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200">
      <p className="font-bold text-2xl  ">Chats</p>

      {/* Right - Icons */}
      <div className="flex items-center space-x-2">
        {/* New Chat Icon */}
        <div className="flex">
          <IconButton
            onMouseEnter={() => setShowText('newChat')}
            onMouseLeave={() => setShowText(false)}
            onClick={() => handleDrawer('newChat')}>
            {selectedIcon === 'newChat' ? (
              <AddCommentOutlinedIcon fontSize="large" />
            ) : (
              <AddCommentOutlinedIcon fontSize="medium" />
            )}
          </IconButton>
          <div>
            {showText === 'newChat' && (
              <p className="absolute bg-black text-gray-200 rounded-xl pl-2 pr-2 text-sm z-50 ">
                New Chat
              </p>
            )}
          </div>
        </div>

        {/*  3 dot icon----- -------- */}
        <div className="flex relative">
          <div
            className={` ${threeDotClicked && ' bg-gray-300 rounded-full  '} `}>
            <IconButton
              onMouseEnter={() => setShowText('chatOptions')}
              onMouseLeave={() => setShowText('')}
              onClick={handleThreeDots}>
              <MoreVertIcon />
            </IconButton>
          </div>
          <div>
            {showText === 'chatOptions' && (
              <p className="absolute right-5 top-10 bg-black text-gray-200 rounded-xl pl-2 pr-2 text-sm z-50 ">
                More Options
              </p>
            )}
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
            } transform origin-top-right transition-all duration-300 ease-out bg-blue-500  rounded-lg shadow-lg absolute top-10 right-1 w-40 text-gray-700 text-base z-50`}>
            <Paper elevation={4} square={false}>
              <ul className="py-2 ">
                <li className=" hover:bg-gray-200 ">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('addGroupMembers')}>
                    <p className=" w-full  h-full p-2 pl-4   text-left ">
                      New Group
                    </p>
                  </ButtonBase>
                </li>
                <li className=" hover:bg-gray-200">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('starredMessages')}>
                    <p className=" w-full  h-full p-2 pl-4   text-left ">
                      Starred Message
                    </p>
                  </ButtonBase>
                </li>

                <li className=" hover:bg-gray-200">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => handleDrawer('selectChats')}>
                    <p className=" w-full  h-full p-2 pl-4   text-left ">
                      Select Chats
                    </p>
                  </ButtonBase>
                </li>
                <li className=" hover:bg-gray-200">
                  <ButtonBase
                    className="w-full h-full"
                    onClick={() => dispatch(logout())}>
                    <p className=" w-full  h-full p-2 pl-4   text-left  text-red-500 ">
                      Logout
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

export default LogoCard;
