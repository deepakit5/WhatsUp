import React, {useRef} from "react";
import {useSelector} from "react-redux";
import RightHalfMain from "../chats/rightHalf/RightHalfMain.jsx";
import bgImage from "../../assets/images/bgImage.jpg";

const RightHalf = () => {
  const content = useSelector((state) => state.rightDrawer.content); // Get which component to display

  const containerRef = useRef(null);

  // Function to render the appropriate component based on the content state
  const renderComponent = () => {
    switch (content) {
      // sidebar icons
      case "rightHalfMain":
        return <RightHalfMain containerRef={containerRef} />;

      default:
        return (
          <div
            style={{backgroundImage: `url(${bgImage})`}}
            className="w-full h-screen "></div>
        );
    }
  };

  return (
    <>
      <div className="border-l-2 border-gray-200  min-w-96 w-7/12 text-3xl   h-screen ">
        <div ref={containerRef}>{renderComponent()}</div>
      </div>
    </>
  );
};

export default RightHalf;
