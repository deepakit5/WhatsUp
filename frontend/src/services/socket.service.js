import {io} from "socket.io-client";

// Define the URL of your Socket.IO server
const SO_URL = import.meta.env.VITE_SOCKET_URL;
// Initialize the Socket.IO client with desired options
const socket = io(SO_URL, {
  autoConnect: false, // Prevents automatic connection, so you can manually connect/disconnect
  transports: ["websocket"],
  auth: {
    // we can add any default authentication info if necessary, e.g., tokens
    token: localStorage.getItem("token"), // Assuming token is stored in localStorage
  },
});

export default socket;
