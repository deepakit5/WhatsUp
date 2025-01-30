import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  resetPassword,
  clearMessage,
} from "../redux/slices/authentication/auth.slice.js";

import {TextField, Button, CircularProgress, Alert} from "@mui/material";
import {useParams, useNavigate} from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {token} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {message, error, loading} = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Password must be same ");
      return;
    }
    setErrorMessage("");
    dispatch(resetPassword({token, password}));
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (message) {
      // Redirect to login page after successful reset
      console.log("redirecting to login page: ");
      navigate("/login");
    }
  }, [message, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-white p-6 shadow-lg rounded-md min-w-96  w-1/3">
        <div className="mb-5 w-full">
          <TextField
            label="New Password"
            variant="outlined"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
        </div>
        <div className="mb-5 w-full">
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            required
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4"
          />
        </div>
        {errorMessage && (
          <Alert severity="error" className="mb-4">
            {errorMessage}
          </Alert>
        )}
        <div className="mb-5 ">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Reset Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
