import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  resetNewMessage,
  selectChat,
  selectUser,
} from '../../redux/slices/chat/chatWindow.slice.js'; // Assuming selectChat is an action to set the active chat
import {FaFileAlt} from 'react-icons/fa';
import {openDrawerRight} from '../../redux/slices/chat/rightDrawer.slice.js';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonIcon from '@mui/icons-material/Person';
import PollIcon from '@mui/icons-material/Poll';
import MicIcon from '@mui/icons-material/Mic';
import {PiStickerFill} from 'react-icons/pi';
import {formatDateTime} from '../../utils/formatDateTime.js';
import {Avatar} from '@mui/material';

const ChatCard = ({chat}) => {
  const dispatch = useDispatch();

  const [lastMsgId, setLastMsgId] = useState(chat.chat.lastMsgInfo.msgId);

  const [lastMsgType, setLastMsgType] = useState(chat.chat.lastMsgInfo.type);
  const [lastMsgText, setLastMsgText] = useState(chat.chat.lastMsgInfo.msg);
  const [lastMsgTime, setLastMsgTime] = useState(chat.chat.lastMsgInfo.time);
  const [unreadMsgCount, setUnreadMsgCount] = useState(null);

  const {userId} = useSelector((state) => state.user);
  const {unreadMessages} = useSelector((state) => state.chat);
  const {selectedChat, selectedUser, newMessage, messages, error} = useSelector(
    (state) => state.chatWindow
  );

  const isActiveChat = selectedChat?.chat._id === chat.chat._id;

  // Update unread message count
  useEffect(() => {
    const unreadCount = chat.chat.unreadMessages.length;
    if (unreadCount > 0) {
      const isSender =
        chat.chat.unreadMessages[unreadCount - 1].senderId === userId;

      if (!isSender) {
        // if last unread msg is not sent by this current user
        setUnreadMsgCount(unreadCount);
      } else {
        setUnreadMsgCount(0);
      }
    }
  }, []);

  // useEffect to handle new messages
  useEffect(() => {
    if (newMessage && newMessage.chatId === chat.chat._id) {
      setLastMsgType(newMessage.type);
      setLastMsgTime(newMessage.time);

      if (newMessage?.type === 'text') {
        setLastMsgText(newMessage.content);
      } else if (newMessage?.type === 'file') {
        setLastMsgText(newMessage.fileInfo.fileName);
      }

      const isSender = newMessage.senderId === userId;

      if (!isSender && !isActiveChat) {
        console.log('\n--- counting increased by +1 :');
        setUnreadMsgCount((prevCount) => prevCount + 1);
      }
    }

    // Reset unread messages if the chat becomes active
    if (isActiveChat) {
      console.log('setting set Unread MsgCount to 0: ');
      setUnreadMsgCount(0);
    }
  }, [newMessage, isActiveChat, chat.chat._id]);

  // }, [chat, messages, newMessage, userId, isActiveChat]);

  const handleSelectedUser = (chat) => {
    dispatch(openDrawerRight('rightHalfMain'));
    dispatch(selectChat(chat));
    setUnreadMsgCount(0);
    dispatch(resetNewMessage());
  };

  const renderLastMsg = () => {
    switch (lastMsgType) {
      case 'text':
        return <p className="text-gray-600 text-sm truncate">{lastMsgText}</p>;

      case 'image':
        return (
          <div className="text-sm text-gray-500 ">
            <span>
              <CameraAltIcon fontSize="small" />
            </span>
            <span> Photo </span>
          </div>
        );

      case 'video':
        return (
          <div className="text-sm text-gray-500 ">
            <span>
              <VideocamIcon fontSize="small" />
            </span>
            <span> Video </span>
          </div>
        );

      case 'audio':
        return (
          <div className="text-sm text-gray-500 ">
            <span>
              <MicIcon fontSize="small" />
            </span>
            <span> Audio </span>
          </div>
        );

      case 'file':
        return (
          <div className=" flex gap-1 text-sm text-gray-500 ">
            <span>
              <FaFileAlt fontSize="medium" />
            </span>
            <span> {lastMsgText} </span>
          </div>
        );

      case 'contact':
        return (
          <div>
            <span>
              <PersonIcon />
            </span>
            <span> contact name </span>
          </div>
        );

      case 'poll':
        return (
          <div>
            <span>
              <PollIcon />
            </span>
            <span> poll question </span>
          </div>
        );

      case 'sticker':
        return (
          <div>
            <span>
              <PiStickerFill />
            </span>
            <span> contact name </span>
          </div>
        );

      default:
        return <p className="text-sm text-gray-500">Unsupported msg type</p>;
    }
  };

  return (
    <div
      onClick={() => handleSelectedUser(chat)}
      className={` ${
        unreadMsgCount > 0 && !isActiveChat ? 'font-semibold' : 'font-normal'
      }   flex items-center p-2 pl-4 hover:bg-gray-200 cursor-pointer border-b border-gray-200  `}>
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <Avatar
          src={chat.user.avatar}
          alt="profile img"
          className="w-12 h-12 rounded-full"
        />
      </div>

      {/* Middle Section */}
      <div className="flex-1 flex flex-col ml-3   w-10 ">
        {/* User Name and Last Message */}
        <div className="flex justify-between">
          <p className="text-gray-700 text-xl ">{chat.user.username}</p>
        </div>

        {/* last message */}
        <div className=" ">{renderLastMsg()}</div>
      </div>

      {/* Right Section - Last Message Time & Unread Count */}
      <div className="flex flex-col   w-14 ">
        <div className="text-xs text-gray-500">{lastMsgTime}</div>

        <div>
          {/* // mute icon */}
          {unreadMsgCount > 0 && (
            <span className="bg-green-500 text-white text-sm  rounded-full w-5 h-5 flex items-center justify-center mt-1">
              {unreadMsgCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
