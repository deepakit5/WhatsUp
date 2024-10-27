import {useState} from "react";

import "./App.css";
import {initializeSocketListeners} from "./store/slices/chatSlice";
import {useDispatch} from "react-redux";
import dotenv from "dotenv";
dotenv.config();

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize Socket.IO listeners for real-time updates
    initializeSocketListeners(dispatch);
  }, [dispatch]);

  return (
    <>
      <div>app</div>
    </>
  );
};

export default App;
