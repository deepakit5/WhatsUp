// EditableProfile.js
import React, {useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
  updateProfile,
  setProfileField,
  updateProfileImg,
} from "../../redux/slices/user/user.slice.js";
import Loading from "../ui/Loading.jsx";
import {
  Drawer,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import PersonIcon from "@mui/icons-material/Person";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const ProfileMain = ({containerRef}) => {
  const dispatch = useDispatch();

  const [showText, setShowText] = useState(false);
  const {profileImage, username, email, about, phoneNumber, loading} =
    useSelector((state) => state.user);
  const {isOpen} = useSelector((state) => state.leftDrawer);

  const [isEditing, setIsEditing] = useState({
    profileImage: false,
    username: false,
    about: false,
    email: false,
    phoneNumber: false,
  });

  const [newProfile, setNewProfile] = useState({
    profileImage,
    username,
    about,
    email,
    phoneNumber,
  });

  const handleEditClick = (field) => {
    setIsEditing((prevState) => ({...prevState, [field]: true}));
  };

  const handleSaveClick = (field) => {
    dispatch(setProfileField({field, value: newProfile[field]}));
    setIsEditing((prevState) => ({...prevState, [field]: false}));
    dispatch(updateProfile(newProfile)); // Save to database
  };

  const handleInputChange = (field, value) => {
    setNewProfile((prevProfile) => ({...prevProfile, [field]: value}));
  };

  // for profile image view, update , delete
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [openImg, setOpenImg] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const previewURL = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewURL(previewURL);
      setOpenImg(true);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleClose = () => {
    setOpenImg(false);
    if (previewURL) {
      URL.revokeObjectURL(previewURL); // Clean up URL object
    }
    setSelectedFile(null);
    setPreviewURL(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Dispatch action to upload file to Cloudinary and update Redux store
    dispatch(updateProfileImg(selectedFile));
    setOpenImg(false);
  };

  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div className="h-[89vh]">
        <div className="  p-2 bg-gray-100    w-full  border-black ">
          <p className="font-bold text-2xl  ">Profile</p>
        </div>
        <div className=" h-full   overflow-y-scroll ">
          {/* Profile Image */}
          <div className=" border-black  w-full  flex  justify-center  ">
            <div className="relative border border-blue-800    cursor-pointer w-64 h-64  mt-7 mb-7 rounded-full ">
              <img
                src={profileImage || <PersonIcon />}
                alt="Profile"
                className="w-full  h-full
               rounded-full object-cover"
              />
              {loading && (
                <div className="absolute top-0 left-0 w-full h-full rounded-full  bg-opacity-70 bg-white ">
                  <Loading />
                </div>
              )}
              {/* Hover Div */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full text-sm bg-black text-white flex  flex-col  items-center justify-center opacity-0 hover:opacity-65 transition-opacity duration-300
            
            ">
                <AddAPhotoIcon />
                CHANGE PROFILE PHOTO
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  className=" outline outline-offset-2   absolute top-0 left-0 w-full h-full rounded-full  cursor-pointer opacity-0  "
                />
              </div>
            </div>

            {/* preview and confirmation of uploading profile picture */}
            {openImg && (
              <Dialog
                open={openImg}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth>
                <DialogTitle className="bg-gray-100">
                  Profile Picture Preview
                </DialogTitle>
                <DialogContent className="flex flex-col items-center">
                  {previewURL ? (
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="max-h-80 max-w-full rounded border"
                    />
                  ) : (
                    <p>No preview available</p>
                  )}
                </DialogContent>
                <DialogActions className="bg-gray-100">
                  <Button
                    onClick={handleClose}
                    className=" hover:text-white hover:bg-blue-600">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="bg-blue-500 hover:text-white hover:bg-blue-600">
                    Upload
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </div>

          {/* Username */}
          <div className="border  border-b-gray-300   pl-5  pr-5 bg-gray-100 ">
            <p className="text-base mt-2">Your Name:</p>
            <div className="flex justify-between w-full">
              {isEditing.username ? (
                <input
                  type="text"
                  value={newProfile.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="w-full mr-2  mb-2 outline-none bg-transparent border-blue-500 border-b-2 text-xl      "
                />
              ) : (
                <span className="text-xl">{username}</span>
              )}

              <div className="relative   ">
                {isEditing.username ? (
                  <IconButton
                    onMouseEnter={() => setShowText("saveUsername")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleSaveClick("username")}>
                    <DoneIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onMouseEnter={() => setShowText("editUsername")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleEditClick("username")}>
                    <EditIcon />
                  </IconButton>
                )}

                <div className="absolute bottom-10">
                  {showText === "editUsername" && (
                    <p className="  bg-black text-gray-200 rounded-xl pl-2 pr-2   text-base  ">
                      Edit
                    </p>
                  )}

                  {showText === "saveUsername" && (
                    <p className=" bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                      Save
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="border  border-b-gray-300   pl-5  pr-5 bg-gray-100 ">
            <p className="text-base  mt-2">About:</p>
            <div className="flex justify-between w-full">
              {isEditing.about ? (
                <input
                  type="text"
                  value={newProfile.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  className="w-full mr-2  mb-2 outline-none bg-transparent border-blue-500 border-b-2 text-xl "
                />
              ) : (
                <span className="text-xl">{about}</span>
              )}

              <div className="relative">
                {isEditing.about ? (
                  <IconButton
                    onMouseEnter={() => setShowText("saveAbout")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleSaveClick("about")}>
                    <DoneIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onMouseEnter={() => setShowText("editAbout")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleEditClick("about")}>
                    <EditIcon />
                  </IconButton>
                )}

                <div className="absolute bottom-10">
                  {showText === "editAbout" && (
                    <p className=" bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                      Edit
                    </p>
                  )}

                  {showText === "saveAbout" && (
                    <p className=" bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                      Save
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Phone Number  phoneNumber */}
          <div className="border  border-b-gray-300   pl-5  pr-5 bg-gray-100 ">
            <p className="text-base  mt-2">Phone Number:</p>
            <div className="flex justify-between w-full">
              {isEditing.phoneNumber ? (
                <input
                  type="text"
                  value={newProfile.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="w-full mr-2  mb-2 outline-none bg-transparent border-blue-500 border-b-2 text-xl    "
                />
              ) : (
                <span className="text-xl">{phoneNumber}</span>
              )}

              <div className="relative">
                {isEditing.phoneNumber ? (
                  <IconButton
                    onMouseEnter={() => setShowText("savePhoneNumber")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleSaveClick("phoneNumber")}>
                    <DoneIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onMouseEnter={() => setShowText("editPhoneNumber")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleEditClick("phoneNumber")}>
                    <EditIcon />
                  </IconButton>
                )}

                <div className="absolute bottom-10">
                  {showText === "editPhoneNumber" && (
                    <p className=" bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                      Edit
                    </p>
                  )}

                  {showText === "savePhoneNumber" && (
                    <p className=" bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                      Save
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email  email */}
          <div className=" border  border-b-gray-300   pl-5  pr-5 bg-gray-100 ">
            <p className="text-base  mt-2">Email:</p>
            <div className="flex justify-between w-full">
              {isEditing.email ? (
                <input
                  type="text"
                  value={newProfile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full mr-2  mb-2 outline-none bg-transparent border-blue-500 border-b-2 text-xl    "
                />
              ) : (
                <span className="text-xl">{email}</span>
              )}

              <div className="relative">
                {isEditing.email ? (
                  <IconButton
                    onMouseEnter={() => setShowText("saveEmail")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleSaveClick("email")}>
                    <DoneIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onMouseEnter={() => setShowText("editEmail")}
                    onMouseLeave={() => setShowText(false)}
                    onClick={() => handleEditClick("email")}>
                    <EditIcon />
                  </IconButton>
                )}

                <div className="absolute bottom-10">
                  {showText === "editEmail" && (
                    <p className=" bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                      Edit
                    </p>
                  )}

                  {showText === "saveEmail" && (
                    <p className=" bg-black text-gray-200 rounded-xl pl-2 pr-2 text-base  ">
                      Save
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default ProfileMain;
