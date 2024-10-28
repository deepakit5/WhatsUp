// useEffect(() => {
//   // Initialize Socket.IO listeners for real-time updates
//   initializeSocketListeners(dispatch);
// }, [dispatch]);

// src/App.jsx
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
// import authSlice from "./redux/slices/auth.slice.js";
import {useSocket} from "./hooks/useSocket.hook.js";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state) => state.auth);
  console.log("isAuthenticated: ", isAuthenticated);
  const socket = useSocket();

  // useEffect(() => {
  //   dispatch(checkAuthStatus()); // Check if user is logged in on component mount
  // }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && socket) {
      socket.connect(); // Connect to socket only if authenticated
    }
  }, [isAuthenticated, socket]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
