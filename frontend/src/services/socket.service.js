import {io} from 'socket.io-client';

// Define the URL of your Socket.IO server
const SO_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SO_URL, {
  autoConnect: true, // Prevents automatic connection, so you can manually connect/disconnect
  transports: ['websocket'],
  auth: {
    // we can add any default authentication info if necessary, e.g., tokens
    token: localStorage.getItem('token'), // Assuming token is stored in localStorage
  },
});

console.log('\n\n\n-----socket.id in socket SERVICES : ', socket.id);
export default socket;

//
// In your situation, where some Socket.IO events are emitted from React components and others are listened to in thunks within slices, here's the best practice to handle this scenario efficiently:

// General Rule:
// Use socket.service.js as the central source of truth for the socket instance.
// Use socket.service.js for backend communication in slices or utility functions.

// Use useSocket.js only in React components that need lifecycle management or dynamic updates tied to React state.

// Context	      :        Use socket.service.js	                  Use useSocket.js
// -----------------------------------------------------------------------------------------
// Redux slices  :        ✅ For emitting/listening in thunks	  ❌ Not suitable for Redux slices
//
// Utility functions	:   ✅ Use directly	                      ❌ Hooks don’t apply
//
// React components	 :    ❌ Avoid for lifecycle-sensitive logic	✅ Tied to React lifecycle
//
// Real-time UI updates	: ❌ Not React-specific	                ✅ Updates state and handles cleanup
//
// One-off socket events:	✅ Simple and direct	                  ❌ Overhead unless lifecycle needed
