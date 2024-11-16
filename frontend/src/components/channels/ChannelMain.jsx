import React from "react";
import {useSelector} from "react-redux";

const ChannelMain = () => {
  const isDrawerOpen = useSelector((state) => state.leftDrawer.isOpen); // Access drawer state

  return <div>ChannelMain</div>;
};

export default ChannelMain;
