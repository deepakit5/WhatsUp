import {FormLabel, Slide} from "@mui/material";
import React, {useState} from "react";
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

const StatusPrivacy = ({containerRef}) => {
  const dispatch = useDispatch();
  const [statusValue, setStatusValue] = useState("my-contacts-for-status");

  const {isOpen} = useSelector((state) => state.leftDrawer);

  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("privacy"));
  };

  const handleStatus = (event) => {
    setStatusValue(event.target.value);
  };

  return (
    <Slide
      in={isOpen}
      direction="left"
      timeout={300}
      easing="ease"
      container={containerRef.current}
      className="bg-gray-50">
      <div className="">
        <div className="flex m-2 mb-5 ">
          <button onClick={handleBack} className=" cursor-pointer mr-4 ">
            <FiArrowLeft />
          </button>
          <p className="text-xl">Status </p>
        </div>

        <div className="p-4 mb-4 border   bg-white">
          <FormControl component="fieldset">
            <FormLabel id="radio-buttons-group-status">
              Who can see my status updates on whatsUp
            </FormLabel>
            <RadioGroup
              value={statusValue}
              onChange={handleStatus}
              className="space-y-2">
              <FormControlLabel
                value="my-contacts-for-status"
                control={<Radio />}
                label="My Contacts"
                className="text-gray-700"
              />
              <FormControlLabel
                value="my-contacts-except-for-status"
                control={<Radio />}
                label="My Contacts Except..."
                className="text-gray-700"
              />
              <FormControlLabel
                value="only-share-with-for-status"
                control={<Radio />}
                label="Only share with..."
                className="text-gray-700"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </Slide>
  );
};

export default StatusPrivacy;
