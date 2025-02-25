import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {googleAuthCallback} from './authThunks'; // Import the thunk
import {useNavigate} from 'react-router-dom';

const GoogleAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, accessToken, loading, error} = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Dispatch the thunk when the component mounts
    dispatch(googleAuthCallback())
      .unwrap() // Unwrap the promise to handle success/failure
      .then(() => {
        // Redirect to the dashboard after successful login
        navigate('/');
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }, [dispatch, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {user ? <div>Welcome, {user.name}!</div> : <div>Redirecting...</div>}
    </div>
  );
};

export default GoogleAuthCallback;
