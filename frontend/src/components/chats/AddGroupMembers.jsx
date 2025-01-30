import {Slide} from "@mui/material";
import React from "react";
import {useSelector} from "react-redux";

const AddGroupMembers = ({containerRef}) => {
  const {isOpen} = useSelector((state) => state.leftDrawer);

  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div>AddGroupMembers</div>
    </Slide>
  );
};

export default AddGroupMembers;
