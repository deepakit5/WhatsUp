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

const LastSeenAndOnline = ({containerRef}) => {
  const dispatch = useDispatch();
  const [lastSeenValue, setLastSeenValue] = useState("everyone-for-lastSeen");
  const [onlineValue, setOnlineValue] = useState("everyone-for-online");

  const {isOpen} = useSelector((state) => state.leftDrawer);

  const [selectedValue, setSelectedValue] = React.useState("everyone");

  const handleLastSeen = (event) => {
    setLastSeenValue(event.target.value);
  };
  const handleOnline = (event) => {
    setOnlineValue(event.target.value);
  };

  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("privacy"));
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
          <p className="text-xl"> Last Seen And Online </p>
        </div>

        <div className="p-4 mb-4 border   bg-white">
          <FormControl component="fieldset">
            <FormLabel id="radio-buttons-group-lastSeen">
              Who can see my last seen
            </FormLabel>
            <RadioGroup
              value={lastSeenValue}
              onChange={handleLastSeen}
              className="space-y-2">
              <FormControlLabel
                value="everyone-for-lastSeen"
                control={<Radio />}
                label="Everyone"
                className="text-gray-700"
              />
              <FormControlLabel
                value="my-contacts"
                control={<Radio />}
                label="My Contacts"
                className="text-gray-700"
              />
              <FormControlLabel
                value="my-contacts-except"
                control={<Radio />}
                label="My Contacts Except"
                className="text-gray-700"
              />
              <FormControlLabel
                value="nobody"
                control={<Radio />}
                label="Nobody"
                className="text-gray-700"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="p-4 border   bg-white">
          <FormControl component="fieldset">
            <FormLabel id="radio-buttons-group-online">
              Who can see when i'm online
            </FormLabel>
            <RadioGroup
              value={onlineValue}
              onChange={handleOnline}
              className="space-y-2">
              <FormControlLabel
                value="everyone-for-online"
                control={<Radio />}
                label="Everyone"
                className="text-gray-700"
              />
              <FormControlLabel
                value="same-as-last-seen"
                control={<Radio />}
                label="Same as last seen"
                className="text-gray-700"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </Slide>
  );
};

export default LastSeenAndOnline;
