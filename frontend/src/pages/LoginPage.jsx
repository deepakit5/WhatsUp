// src/pages/LoginPage.js
import React, {useState} from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Dialog,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import bg from "../assets/images/bg-login.jpg";
// import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../redux/slices/authentication/auth.slice.js";
import {fetchMyProfile} from "../redux/slices/user/user.slice.js";
// import dotenv from "dotenv";
// dotenv.config();

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const {loading, error, user} = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({email, password}));

    dispatch(fetchMyProfile());
  };

  const handleGoogleSignIn = () => {
    // Handle Google Sign-in
    console.log("this function is disabled now.");
    Alert(
      "this feature is disabled for some time. kindly enter email and password."
    );
  };

  return (
    <Container
      maxWidth="full"
      sx={{
        height: "100vh",
        // width: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <Box
        maxWidth="md"
        sx={{
          width: "100%",
          height: "70vh",
          display: "flex",
          boxShadow: 3,
          borderRadius: 2,
          // overflow: "hidden",
        }}>
        {/* Left Side - Login with Email */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            bgcolor: "background.default",
          }}>
          <Typography variant="h5" gutterBottom>
            Log in with Email
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{mt: 2}}
              type="submit">
              Log In
            </Button>
          </form>
        </Box>

        {/* Right Side - Sign up with Google */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            bgcolor: "grey.100",
          }}>
          <Typography variant="h5" gutterBottom>
            Sign up with Google
          </Typography>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{mt: 2}}>
            Continue with Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
