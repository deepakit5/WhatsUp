import React from "react";
import ChatWindow from "./ChatWindow.jsx";
import MessageInput from "./MessageInput.jsx";
import ChatWindowHeader from "./ChatWindowHeader.jsx";

const RightHalfMain = ({containerRef}) => {
  return (
    <div container={containerRef.current} className="flex flex-col h-[99vh] ">
      {/* <div className="flex-none"> */}
      <ChatWindowHeader />
      {/* </div> */}

      {/* <div className="grow"> */}
      <ChatWindow />
      {/* </div> */}

      {/* <div className="flex-none"> */}
      <MessageInput />
      {/* </div> */}
    </div>
  );
};

export default RightHalfMain;
