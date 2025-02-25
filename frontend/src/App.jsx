import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Cookies from 'js-cookie';

import {useSocket} from './hooks/useSocket.hook.js';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import './App.css';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import {setAuth} from './redux/slices/authentication/auth.slice.js';
import {fetchMyProfile} from './redux/slices/user/user.slice.js';

const App = () => {
  const dispatch = useDispatch();
  const {isAuthenticated, token} = useSelector((state) => state.auth);

  // Check for authToken on app load
  useEffect(() => {
    console.log('--- use effect in app .jsx is ruuning');
    const token = Cookies.get('accessToken');
    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage

      dispatch(setAuth({authen: true, token: token}));
      dispatch(fetchMyProfile());
    } else {
      console.log('---- token does not found!!!');
      dispatch(setAuth({authen: false, token: ''}));
    }
  }, [dispatch]);

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
          {/* <Route path="/login" element={<LoginPage />} /> */}

          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
