import {io} from "socket.io-client";
// import dotenv from "dotenv";

// dotenv.config();

// this vite socket url coming from backend .env file that's why we use this syntax.
// import.meta.env.VITE_SOCKET_URL
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {token: localStorage.getItem("token")},
});

export default socket;
