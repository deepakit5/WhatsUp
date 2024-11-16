import React from "react";
import {useSelector} from "react-redux";

const StatusMain = () => {
  const isDrawerOpen = useSelector((state) => state.leftDrawer.isOpen); // Access drawer state

  return <div>StatusMain</div>;
};

export default StatusMain;
