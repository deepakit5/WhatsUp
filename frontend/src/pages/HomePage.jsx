import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
// import ChatWindow from "../components/ChatWindow";
import LeftHalf from "../components/layout/LeftHalf.jsx";
import RightHalf from "../components/layout/RightHalf.jsx";

const HomePage = () => {
  // const navigate = useNavigate();
  // const user = useSelector((state) => state.user.currentUser);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  return (
    <>
      <div className=" w-full flex flex-grow  h-screen  ">
        <Sidebar />
        <LeftHalf />
        <RightHalf />
      </div>
    </>
  );
};

export default HomePage;
