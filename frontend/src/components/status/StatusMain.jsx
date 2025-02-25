import {ButtonBase, IconButton, Input, Paper, Slide} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FilterOutlinedIcon from '@mui/icons-material/FilterOutlined';

import AddIcon from '@mui/icons-material/Add';
import {openDrawerLeft} from '../../redux/slices/chat/leftDrawer.slice';
// import sendTextStatus from './SendTextStatus.jsx';
import StatusUpload from './StatusUpload.jsx';
import {
  fetchMyStatuses,
  fetchStatusList,
  setOpenStatusUpload,
  uploadStatus,
} from '../../redux/slices/status.slice.js';
import MyStatusTab from './MyStatusTab.jsx';
import StatusList from './StatusList.jsx';

const StatusMain = ({containerRef}) => {
  const {isOpen} = useSelector((state) => state.leftDrawer);
  const dispatch = useDispatch();
  const [selectedIcon, setSelectedIcon] = useState('');

  const [showText, setShowText] = useState(false);
  const [threeDotClicked, setThreeDotClicked] = useState(false);
  const [addStatusClicked, setAddStatusClicked] = useState(false);
  //
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');

  const {myStatuses, openStatusUpload} = useSelector((state) => state.status);

  // const [openStatusUpload, setOpenStatusUpload] = useState(false);
  // Each button/icon sends a different payload to indicate the component to display
  const handleDrawer = (componentName) => {
    dispatch(openDrawerLeft(componentName)); // Send component name as payload
  };

  const handleAddStatus = () => {
    setAddStatusClicked(!addStatusClicked);
  };

  const handleThreeDots = () => {
    setThreeDotClicked(!threeDotClicked);
    console.log('threeDotClicked in handle: ', threeDotClicked);
  };

  useEffect(() => {
    dispatch(fetchMyStatuses());
    dispatch(fetchStatusList());

    return () => {};
  }, []);

  return (
    <>
      <Slide
        in={isOpen}
        direction="right"
        timeout={300}
        easing="ease"
        container={containerRef.current}>
        <div className="bg-gray-100">
          {/* first heading line  */}
          <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-300">
            <p className="font-bold text-2xl  ">Status</p>

            {/* Right - Icons */}
            <div className="flex items-center space-x-2">
              {/* add status Icon */}
              <div className="flex relative">
                <div
                  className={` ${
                    addStatusClicked && ' bg-gray-300 rounded-full'
                  }`}>
                  <IconButton
                    onMouseEnter={() => setShowText('addStatus')}
                    onMouseLeave={() => setShowText(false)}
                    onClick={handleAddStatus}>
                    <AddIcon />
                  </IconButton>
                </div>
                <div>
                  {showText === 'addStatus' && (
                    <p className="absolute right-6 top-9 bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base z-50 ">
                      Add status
                    </p>
                  )}
                </div>

                {/* Overlay to detect outside clicks */}
                {addStatusClicked && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAddStatusClicked(false)}></div>
                )}

                {/* Animated Menu  for plus */}
                <div
                  className={`${
                    addStatusClicked
                      ? 'scale-100 opacity-100'
                      : 'scale-0 opacity-0'
                  } transform origin-top-right transition-all duration-300 ease-out bg-white  rounded-lg shadow-lg absolute  top-10 right-1 w-44 text-gray-700 text-base z-50`}>
                  <Paper elevation={4} square={false}>
                    <ul className="py-2 ">
                      <li className="  hover:bg-gray-200 ">
                        <ButtonBase className="w-full h-full">
                          <span className="pl-2">
                            <FilterOutlinedIcon />
                          </span>
                          {/* <Input>Photos & videos</Input> */}
                          <label
                            htmlFor="fileInput"
                            onClick={() => {
                              setAddStatusClicked(false);
                              dispatch(setOpenStatusUpload(true));
                            }}
                            className=" w-full  h-full p-2 pl-4  text-left cursor-pointer ">
                            Photos & videos
                          </label>
                        </ButtonBase>
                      </li>

                      <li className=" flex hover:bg-gray-200 ">
                        <ButtonBase
                          className="w-full h-full"
                          onClick={() => <sendTextStatus />}>
                          <span className="pl-2">
                            <EditOutlinedIcon />
                          </span>
                          <p className=" w-full  h-full p-2 pl-4  text-left">
                            Text
                          </p>
                        </ButtonBase>
                      </li>
                    </ul>
                  </Paper>
                </div>
              </div>

              {/* 3 dot icon-------------- */}
              <div className="flex  relative">
                <div
                  className={` ${
                    threeDotClicked && ' bg-gray-300 rounded-full'
                  }`}>
                  <IconButton
                    onMouseEnter={() => setShowText('statusOptions')}
                    onMouseLeave={() => setShowText('')}
                    onClick={handleThreeDots}>
                    <MoreVertIcon />
                  </IconButton>
                </div>

                <div>
                  {showText === 'statusOptions' && (
                    <p className="absolute right-5 top-9 bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base z-50 ">
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
                    threeDotClicked
                      ? 'scale-100 opacity-100'
                      : 'scale-0 opacity-0'
                  } transform origin-top-right transition-all duration-300 ease-out     rounded-lg shadow-lg absolute  top-10 right-1 w-36 text-gray-700 text-base bg-blue-500 z-50 `}>
                  <Paper elevation={4} square={false}>
                    <ul className="py-2 ">
                      <li className=" hover:bg-gray-200 ">
                        <ButtonBase
                          className="w-full h-full"
                          onClick={() => handleDrawer('statusPrivacy')}>
                          <p className=" w-full  h-full p-2 pl-4   text-left ">
                            Status privacy
                          </p>
                        </ButtonBase>
                      </li>
                    </ul>
                  </Paper>
                </div>
              </div>
            </div>
          </div>

          {/* my status tab */}
          <MyStatusTab />

          <StatusList />
        </div>
      </Slide>

      {/* ------------status preview before upload ----- */}
      {openStatusUpload && <StatusUpload />}
    </>
  );
};

export default StatusMain;
