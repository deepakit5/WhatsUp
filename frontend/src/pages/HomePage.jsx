import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
// import ChatWindow from "../components/ChatWindow";
import LeftHalf from '../components/layout/LeftHalf.jsx';
import RightHalf from '../components/layout/RightHalf.jsx';
import {useSocket} from '../hooks/useSocket.hook.js';
import {chatWindowSocketListeners} from '../redux/slices/chat/chatWindow.slice.js';
import {chatWindowHeaderSocketListeners} from '../redux/slices/chat/chatWindowHeader.slice.js';
import {fetchChatList} from '../redux/slices/chat/chat.slice.js';
import {statusSocketListeners} from '../redux/slices/status.slice.js';

const HomePage = () => {
  const dispatch = useDispatch();

  const socket = useSocket();

  useEffect(() => {
    dispatch(fetchChatList());

    // initializing the socket.io listeners
    dispatch(chatWindowHeaderSocketListeners());

    dispatch(chatWindowSocketListeners());
    dispatch(statusSocketListeners());
  }, [dispatch]);

  return (
    <>
      <div className=" w-full flex flex-grow  h-screen  overflow-x-auto overflow-y-hidden ">
        <Sidebar />
        <LeftHalf />
        <RightHalf />
      </div>
    </>
  );
};

export default HomePage;
