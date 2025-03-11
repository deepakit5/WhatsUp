import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

import {useSocket} from './hooks/useSocket.hook.js';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import './App.css';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import {checkAuth, setAuth} from './redux/slices/authentication/auth.slice.js';
import {fetchMyProfile} from './redux/slices/user/user.slice.js';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate correctly
  const {isAuthenticated, loadingAutoLogin, token} = useSelector(
    (state) => state.auth
  );

  console.log('value of isAuthenticated: ', isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Programmatic navigation to the homepage
    }
  }, [isAuthenticated]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
