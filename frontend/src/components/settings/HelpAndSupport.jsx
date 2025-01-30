import {Slide} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {FiArrowLeft} from "react-icons/fi";
import {
  closeDrawer,
  openDrawerLeft,
} from "../../redux/slices/chat/leftDrawer.slice";

const HelpAndSupport = ({containerRef}) => {
  const dispatch = useDispatch();

  const {isOpen} = useSelector((state) => state.leftDrawer);
  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft("settings"));
  };

  return (
    <Slide
      in={isOpen}
      direction="left"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div>
        <div className="flex m-2 mb-5  ">
          <button onClick={handleBack} className=" cursor-pointer mr-4 ">
            <FiArrowLeft />
          </button>
          <p className="text-xl">Help </p>
        </div>
        <div className="px-5">
          <p className="text-lg text-gray-700 mb-10 ">
            This is not original WhatsApp. It is WhatsUp developed for learning
            and educational purposes.
          </p>
          <p className="text-lg text-gray-700">
            Our offical email id for any help{" "}
            <a
              href="mailto:whatsup.helpteam@gmail.com"
              className="text-blue-500">
              whatsup.helpteam@gmail.com
            </a>{" "}
            click on it or directly email us to reach out our help team.
          </p>
          <p className="text-lg text-gray-700 mt-10">
            Our help team reply back to you within 24 hours(1-business day).
            <br />
            There are no other ways to connect with us.
          </p>
        </div>
      </div>
    </Slide>
  );
};

export default HelpAndSupport;
