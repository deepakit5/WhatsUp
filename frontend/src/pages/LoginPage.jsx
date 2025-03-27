// src/pages/LoginPage.js
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';
import {Container, Box, Typography, TextField, Button} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import bg from '../assets/images/bg-login.jpg';
// import axios from "axios";
import {useDispatch, useSelector} from 'react-redux';
import {
  // checkAuth,
  loginUser,
  // resetError,
  // resetSuccess,
  setAuth,
} from '../redux/slices/authentication/auth.slice.js';
import {fetchMyProfile} from '../redux/slices/user/user.slice.js';
import Loading from '../components/ui/Loading.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const {loading, isAuthenticated, error, success} = useSelector(
    (state) => state.auth
  );
  const B_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({email, password}));

    dispatch(fetchMyProfile());
  };

  // ---------- for Google-authentication ------

  // const handleGoogleSignIn = async () => {
  //   window.location.href = `${B_URL}/auth/google`;
  //   // window.open(`${B_URL}/auth/google`, '_self');
  // };

  const handleGoogleSignIn = async () => {
    try {
      const response = await axios.get(`${B_URL}/auth/google`, {
        withCredentials: true,
      });
      if (response.data.success) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <>
      <Container
        maxWidth="full"
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <Box
          maxWidth="md"
          sx={{
            width: '100%',
            height: '70vh',
            display: 'flex',
            boxShadow: 3,
            borderRadius: 2,
          }}>
          {/* Left Side - Login with Email */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
              bgcolor: 'background.default',
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
              <div className="mb-5">
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:underline text-sm ">
                  Forgot Password ?
                </Link>
              </div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{mt: 2}}
                type="submit">
                {loading ? <Loading text="verifying..." /> : 'Log In'}
              </Button>
            </form>
            <div className="flex justify-center items-center h-screen">
              <p className="text-gray-700 text-sm">
                If not registered before?
                <Link
                  to="/register"
                  className="text-blue-500 hover:underline text-base">
                  Register now
                </Link>
              </p>
            </div>
          </Box>

          {/* Right Side - Sign up with Google */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
              bgcolor: 'grey.100',
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
    </>
  );
};

export default LoginPage;
