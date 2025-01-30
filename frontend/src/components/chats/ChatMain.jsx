import React, {useEffect} from "react";
import LogoCard from "./LogoCard.jsx";
import SearchBar from "./SearchBar.jsx";
import ChatList from "./ChatList.jsx";
import {useDispatch, useSelector} from "react-redux";
import {Slide} from "@mui/material";
import {
  filterChats,
  setSearchTerm,
  fetchChatList,
} from "../../redux/slices/chat/chat.slice.js";

const ChatMain = ({containerRef}) => {
  const dispatch = useDispatch();
  const {isOpen} = useSelector((state) => state.leftDrawer);

  const {chatsList, loading, searchQuery} = useSelector((state) => state.chat);
  console.log("chats list value in chat-main.jsx: ", chatsList);

  const handleSearch = (searchTerm, searchContext) => {
    if (searchContext === "chatList") {
      console.log(`Searching in ${searchContext}: ${searchTerm}`);

      dispatch(filterChats(searchTerm));
    }
  };

  useEffect(() => {
    console.log("---- fetching chat listin chat main: ");

    return () => {
      console.log("second");

      dispatch(setSearchTerm(""));
    };
  }, []);

  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div className="flex flex-col h-full ">
        {/* chat header */}
        <div>
          <LogoCard />
          <SearchBar
            placeholder="Search chats..."
            onSearch={handleSearch}
            debounceDelay={100}
            searchContext="chatList" // Specify the context for this search
          />
        </div>
        {/* chat list */}
        <ChatList />
      </div>
    </Slide>
  );
};

export default ChatMain;
