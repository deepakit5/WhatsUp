import {FormLabel, Slide} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  closeDrawer,
  openDrawerLeft,
} from "../../../redux/slices/chat/leftDrawer.slice";
import {FiArrowLeft} from "react-icons/fi";

import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";

const AboutPrivacy = ({containerRef}) => {
  const dispatch = useDispatch();
  const [aboutValue, setAboutValue] = useState("everyone-for-about");

  const {isOpen} = useSelector((state) => state.leftDrawer);

  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("privacy"));
  };

  const handleAbout = (event) => {
    setAboutValue(event.target.value);
  };

  return (
    <Slide
      in={isOpen}
      direction="left"
      timeout={300}
      easing="ease"
      container={containerRef.current}
      className="bg-gray-50 w-full">
      {/*  */}

      <div className="  h-full">
        <div className="flex m-2 mb-5 ">
          <button onClick={handleBack} className=" cursor-pointer mr-4 ">
            <FiArrowLeft />
          </button>
          <p className="text-xl">About </p>
        </div>

        <div className="p-4 mb-4 border   bg-white">
          <FormControl component="fieldset">
            <FormLabel id="radio-buttons-group-about">
              Who can see my about
            </FormLabel>
            <RadioGroup
              value={aboutValue}
              onChange={handleAbout}
              className="space-y-2">
              <FormControlLabel
                value="everyone-for-about"
                control={<Radio />}
                label="Everyone"
                className="text-gray-700"
              />
              <FormControlLabel
                value="my-contacts-for-about"
                control={<Radio />}
                label="My Contacts"
                className="text-gray-700"
              />
              <FormControlLabel
                value="my-contacts-except-for-about"
                control={<Radio />}
                label="My Contacts Except"
                className="text-gray-700"
              />
              <FormControlLabel
                value="nobody-for-about"
                control={<Radio />}
                label="Nobody"
                className="text-gray-700"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </Slide>
  );
};

export default AboutPrivacy;
