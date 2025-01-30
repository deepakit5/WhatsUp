import {Button, FormControlLabel, Slide} from "@mui/material";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FiArrowLeft} from "react-icons/fi"; // Importing icons
import {
  closeDrawer,
  openDrawerLeft,
} from "../../redux/slices/chat/leftDrawer.slice";
import Checkbox from "@mui/material/Checkbox";

const privacyList = [
  {
    id: "lastSeenAndOnlinePrivacy",
    label: "Last seen and online",
  },
  {id: "profilePhotoPrivacy", label: "Profile photo"},
  {
    id: "aboutPrivacy",
    label: "About",
  },
  {id: "statusPrivacy", label: "Status"},
  {id: "groupsPrivacy", label: "Groups"},
  {id: "blockedContacts", label: "Blocked contacts"},
];

const PrivacySettings = ({containerRef}) => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(true);

  const {isOpen} = useSelector((state) => state.leftDrawer);

  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("settings"));
  };

  const handleCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Slide
      in={isOpen}
      direction="left"
      timeout={300}
      easing="ease"
      container={containerRef.current}
      className="">
      <div className="">
        <div className="flex m-2 mb-5 ">
          <button onClick={handleBack} className=" cursor-pointer mr-4 ">
            <FiArrowLeft />
          </button>
          <p className="text-xl"> Privacy Settings </p>
        </div>

        <div className="flex flex-col">
          {privacyList.map((item) => (
            <button
              key={item.id}
              className={`flex items-center py-3 px-4 border-b border-gray-300 text-left hover:bg-gray-200 transition-all duration-300 
         
          `}
              onClick={() => dispatch(openDrawerLeft(item.id))}>
              <span className="text-xl">{item.label}</span>
            </button>
          ))}

          <div className="flex justify-between pr-8 ">
            <label className=" py-3 px-4 mr-5  border-b text-xl">
              Read Receipts
            </label>

            <Checkbox
              checked={checked}
              onChange={handleCheckbox}
              className="mr-10 pr-10"
            />
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default PrivacySettings;
