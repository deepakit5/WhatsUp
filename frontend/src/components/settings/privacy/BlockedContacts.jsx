import {FormLabel, Slide} from "@mui/material";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  closeDrawer,
  openDrawerLeft,
} from "../../../redux/slices/chat/leftDrawer.slice";
import {FiArrowLeft} from "react-icons/fi";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";

const BlockedContacts = ({containerRef}) => {
  const dispatch = useDispatch();
  const [groupsValue, setGroupsValue] = useState("everyone-for-groups");

  const {isOpen} = useSelector((state) => state.leftDrawer);

  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("privacy"));
  };

  const handleGroups = (event) => {
    setGroupsValue(event.target.value);
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
          <p className="text-xl">Blocked Contacts </p>
        </div>

        <button
          className={` px-4  py-3  mb-4 w-full border flex items-center   border-b border-gray-300  hover:bg-gray-200 transition-all duration-300 
         
          `}
          onClick={() => dispatch(openDrawerLeft("a pop will open"))}>
          <span className="mr-3">{<PersonAddIcon />}</span>
          <span className="text-xl">Add blocked contact</span>
        </button>
        <div>chats list... is here</div>
      </div>
    </Slide>
  );
};

export default BlockedContacts;
