import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TextField, Button, CircularProgress, Alert} from "@mui/material";
import {forgotPassword} from "../redux/slices/authentication/auth.slice.js";
import LoginPage from "./LoginPage.jsx";
import {toast} from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const {message, error, loading} = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-white p-6 shadow-lg rounded-md     min-w-96  w-1/3">
        <div className="mb-5  w-full">
          <p className="text-sm mb-5 ">Enter your registered Email: </p>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-5 ">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
