import {Checkbox, Slide} from "@mui/material";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  closeDrawer,
  openDrawerLeft,
} from "../../redux/slices/chat/leftDrawer.slice";
import {FiArrowLeft} from "react-icons/fi";

const NotificationSettings = ({containerRef}) => {
  const dispatch = useDispatch();

  const {isOpen} = useSelector((state) => state.leftDrawer);

  const [messageNotifications, setMessageNotifications] = useState(false);

  const [backgroundSync, setBackgroundSync] = useState(false);

  const [incomingSounds, setIncomingSounds] = useState(false);
  const [outgoingSounds, setOutgoingSounds] = useState(false);

  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("settings"));
  };

  const handleMessageNotifications = (event) => {
    setMessageNotifications(event.target.checked);
  };

  const handleBackgroundSync = (event) => {
    setBackgroundSync(event.target.checked);
  };

  const handleIncomingSounds = (event) => {
    setIncomingSounds(event.target.checked);
  };

  const handleOutgoingSounds = (event) => {
    setOutgoingSounds(event.target.checked);
  };

  return (
    <Slide
      in={isOpen}
      direction="left"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div className="">
        <div className="flex m-2 mb-5 ">
          <button onClick={handleBack} className=" cursor-pointer mr-4 ">
            <FiArrowLeft />
          </button>
          <p className="text-xl"> Notification Settings </p>
        </div>

        <div className="flex justify-between pr-5 ">
          <label className=" py-3 px-4 mr-5  border-b text-lg">
            Message notifications
          </label>

          <Checkbox
            checked={messageNotifications}
            onChange={handleMessageNotifications}
          />
        </div>

        <div className="flex justify-between pr-5 ">
          <label className=" py-3 px-4 mr-5  border-b text-lg">
            Background sync
          </label>

          <Checkbox checked={backgroundSync} onChange={handleBackgroundSync} />
        </div>

        <div className="flex justify-between pr-5 ">
          <label className=" py-3 px-4 mr-5  border-b text-lg">
            Incoming sounds
          </label>

          <Checkbox checked={incomingSounds} onChange={handleIncomingSounds} />
        </div>

        <div className="flex justify-between pr-5 ">
          <label className=" py-3 px-4 mr-5  border-b text-lg">
            Outgoing sounds
          </label>

          <Checkbox checked={outgoingSounds} onChange={handleOutgoingSounds} />
        </div>
      </div>
    </Slide>
  );
};

export default NotificationSettings;
