import React from "react";
import {useSelector} from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import {useSocket} from "./hooks/useSocket.hook.js";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import "./App.css";

const App = () => {
  const {isAuthenticated} = useSelector((state) => state.auth);
  console.log("isAuthenticated: ", isAuthenticated);
  const socket = useSocket();
  console.log("socket-id: ", socket.id);

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
