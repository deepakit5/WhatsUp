import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TextField, Button, Avatar, CircularProgress} from "@mui/material";
import {registerUser} from "../redux/slices/authentication/register.slice.js";
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {loading, error, user} = useSelector((state) => state.register);

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: null,
    email: "",
    password: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({...prev, avatar: file}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            type="tel"
            required
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            type="email"
            required
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            type="password"
            required
          />
          <div className="flex items-center space-x-4">
            <Avatar
              alt="Avatar"
              src={formData.avatar ? URL.createObjectURL(formData.avatar) : ""}
              className="w-12 h-12"
            />
            <Button variant="outlined" component="label">
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </Button>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
