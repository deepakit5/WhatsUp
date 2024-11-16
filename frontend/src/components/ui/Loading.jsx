// Loading.jsx
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";

const Loading = ({text = "Loading...", size = 40}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-2  ">
      <CircularProgress size={size} color="primary" />
      {text && <p className="text-black text-base mt-2">{text}</p>}
    </div>
  );
};

// Prop types for the Loading component
Loading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.number,
};

export default Loading;
