import {useEffect} from "react";
import socket from "../services/socket.service.js";

export const useSocket = () => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};
