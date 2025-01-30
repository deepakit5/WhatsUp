import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ChatCard from "./ChatCard";
import Loading from "../ui/Loading";
import {updateChatList} from "../../redux/slices/chat/chat.slice.js";

const ChatList = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const {chatsList, searchTerm, filteredChatsList, loading} = useSelector(
    (state) => state.chat
  );
  const [chattedList, setChattedList] = useState(chatsList);

  const {newMessage} = useSelector((state) => state.chatWindow);

  useEffect(() => {
    console.log("---- fetching chat list jsx of chat list");
    setChattedList(chatsList);
  }, [chatsList]);

  // for searching user name in chat list
  useEffect(() => {
    console.log("--- searchTerm: ", searchTerm);
    console.log("---  filteredChatsList.length", filteredChatsList.length);
    if (searchTerm && filteredChatsList.length > 0) {
      setChattedList(filteredChatsList);
      setMessage("");
    } else if (searchTerm && filteredChatsList.length === 0) {
      setChattedList([]);
      setMessage("No names matched. Check the spelling and try again!");
    } else {
      setChattedList(chatsList);
      setMessage("");
    }
  }, [searchTerm, filteredChatsList, chatsList]);
  //

  useEffect(() => {
    // Handle new message and reorder chat list
    if (newMessage) {
      console.log("New message received:", newMessage);

      // Check if the chat is already at the first position
      if (chatsList[0]?.chat._id === newMessage.chatId) {
        return; // Do nothing if the chat is already at the top
      }

      // Find the chat and reorder the list
      const chatIndex = chatsList.findIndex(
        (chat) => chat.chat._id === newMessage.chatId
      );

      if (chatIndex !== -1) {
        const updatedChatsList = [...chatsList];
        const [movedChat] = updatedChatsList.splice(chatIndex, 1); // Remove the chat
        updatedChatsList.unshift(movedChat); // Add it to the top

        // Dispatch the update to Redux only if there's a change
        dispatch(updateChatList(updatedChatsList));
      }
    }
  }, [newMessage, chatsList, dispatch]);

  return (
    <div className=" h-[80vh] flex flex-col  overflow-y-auto  ">
      {loading ? (
        <Loading text="Fetching Chats..." />
      ) : chattedList.length > 0 ? (
        chattedList.map((chat) => <ChatCard key={chat.chat._id} chat={chat} />)
      ) : (
        <div>No chats available</div>
      )}

      {message && <p className="text-center text-base p-8">{message} </p>}
      <div className="  p-10 ">
        <p className="text-center text-gray-200">Chats list end</p>
      </div>
    </div>
  );
};

export default ChatList;
