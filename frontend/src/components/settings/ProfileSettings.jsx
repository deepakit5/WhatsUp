import {Slide} from "@mui/material";
import React from "react";
import {useSelector} from "react-redux";

const ProfileSettings = ({containerRef}) => {
  const {isOpen} = useSelector((state) => state.leftDrawer);

  return (
    <Slide
      in={isOpen}
      direction="left"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div className="bg-slate-500">Profile Settings</div>
    </Slide>
  );
};

export default ProfileSettings;
