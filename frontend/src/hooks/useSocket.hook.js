// hooks/useSocket.js
import {useEffect, useState} from 'react';
import socket from '../services/socket.service.js';
import {useSelector} from 'react-redux';

export const useSocket = () => {
  // const token = useSelector((state) => state.auth.token);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    // it runs for every component who use usesocket hook
    console.log('--- use effect run in use socket hook .js :');
    // if (token) {
    // Update the socket's auth token
    // socket.auth = {token};
    // Connect to the Socket.IO server
    socket.connect();
    // Listen for the 'connect' event to ensure socket.id is defined
    socket.on('connect', () => {
      setSocketId(socket.id); // Store the socket ID in state or use as needed
    });

    socket.on('connect_error', (err) => {
      console.error(' Socket connection error:', err.message);
    });
    // } else {

    //   console.log('--- disconnecting from frontend side...: ');
    //   socket.disconnect();
    // }

    // Emit 'offline' event when the tab is closed
    const handleTabClose = () => {
      console.log('--- disconnecting due to tab closed...: ');

      socket.disconnect();
      socket.emit('disconnect');
    };
    window.addEventListener('beforeunload', handleTabClose);

    // // // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      // socket.off("connect"); // Remove the connect event listener
      console.log('--- disconnecting as clean up frontend side...: ');
    };
  }, []);

  return socket;
};
