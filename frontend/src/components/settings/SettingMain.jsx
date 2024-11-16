import React from "react";
import {useSelector} from "react-redux";

const SettingMain = () => {
  const isDrawerOpen = useSelector((state) => state.leftDrawer.isOpen); // Access drawer state

  return <div>SettingMain</div>;
};

export default SettingMain;
