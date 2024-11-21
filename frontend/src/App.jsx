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
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
// import AppRouter from "./router/App.routes.jsx";

const App = () => {
  const {isAuthenticated} = useSelector((state) => state.auth);
  console.log("isAuthenticated: ", isAuthenticated);
  const socket = useSocket();
  console.log("socket-id: ", socket.id);

  return (
    <>
      {/* <AppRouter /> */}
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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
    </>
  );
};

export default App;
