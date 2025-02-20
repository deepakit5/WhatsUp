import React, {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  deleteAllMessages,
  fetchChatHistory,
} from '../../../redux/slices/chat/chatWindow.slice';
import Message from './Message.jsx';
import {v4 as uuidv4} from 'uuid';

import {useSocket} from '../../../hooks/useSocket.hook.js';
import Loading from '../../ui/Loading.jsx';
import {formatDateTime} from '../../../utils/formatDateTime.js';
import bgImage from '../../../assets/images/bgImage.jpg';

const ChatWindow = () => {
  const socket = useSocket(); // Initialize socket connection
  const dispatch = useDispatch();
  const {selectedChat, selectedUser, messages, error, loading} = useSelector(
    (state) => state.chatWindow
  );
  const messageEndRef = useRef(null);

  // Function to scroll to the last element
  const scrollToBottom = () => {
    // messageEndRef.current?.scrollIntoView({behavior: "instant"}); // Instant scrolling
    messageEndRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    scrollToBottom(); // Scrolls to the last element whenever the component updates
    return () => {};
  }, [messages]); // Trigger scroll when messages update

  useEffect(() => {
    if (selectedChat) {
      dispatch(fetchChatHistory(selectedChat.chat._id));
    } else if (selectedUser) {
      dispatch(fetchChatHistory(selectedUser._id));
      return () => {
        dispatch(deleteAllMessages()); // Clear messages on unmount
      };
    }
  }, [selectedChat, selectedUser, dispatch]);

  return (
    <div
      style={{backgroundImage: `url(${bgImage})`}}
      className=" relative flex-1 overflow-y-auto ">
      <div className="px-10 ">
        {loading && <Loading text="fetching messages..." />}

        {messages && messages.length > 0 ? (
          messages.map((msg, index) => {
            // for display locally
            let currentMsgDate = msg.date;
            let prevMsgDate = index > 0 ? messages[index - 1].date : null;

            if (currentMsgDate === 'Invalid Date') {
              currentMsgDate = formatDateTime(new Date(Date.now()), {
                date: true,
              });
              // console.log('##### currentMsgDate: ', currentMsgDate);
            }

            const showDate = index === 0 || currentMsgDate !== prevMsgDate;

            return (
              <div key={msg.tempId} className="flex flex-col justify-center">
                {/* Display date if necessary */}
                {showDate && (
                  <span className="  font-medium text-center bg-yellow-400 text-gray-700 py-1 px-3 rounded-full my-2 w-24 text-sm mx-auto shadow">
                    {currentMsgDate}
                  </span>
                )}

                {/* Render the message */}
                <MemoizedMessage msg={msg} onImageLoad={scrollToBottom} />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">Message not found</p>
        )}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

// Memoized Message component to avoid unnecessary re-renders
const MemoizedMessage = React.memo(({msg, onImageLoad}) => {
  return <Message msg={msg} onImageLoad={onImageLoad} />;
});

export default ChatWindow;
