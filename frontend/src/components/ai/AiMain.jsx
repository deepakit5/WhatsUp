import React from "react";
import {useSelector} from "react-redux";

const AiMain = () => {
  const isDrawerOpen = useSelector((state) => state.leftDrawer.isOpen); // Access drawer state

  return <div>AiMain</div>;
};

export default AiMain;
