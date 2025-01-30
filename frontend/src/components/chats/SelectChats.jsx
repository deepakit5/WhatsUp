import {Slide} from "@mui/material";
import React from "react";
import {useSelector} from "react-redux";

const SelectChats = ({containerRef}) => {
  const {isOpen} = useSelector((state) => state.leftDrawer);
  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div>SelectChats</div>
    </Slide>
  );
};

export default SelectChats;
