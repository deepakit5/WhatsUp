import {io} from "socket.io-client";

const SO_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(`${SO_URL}`, {
  auth: {token: localStorage.getItem("token")},
});

export default socket;
