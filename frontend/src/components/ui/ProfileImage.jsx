// my profile image component

import React, {useState} from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const profileImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewURL(null);
  };

  const handleUpload = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewURL(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input
        type="file"
        id="file-input"
        className=""
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-input"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Choose File
      </label>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-gray-100">File Preview</DialogTitle>
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
          <Button onClick={handleClose} className="text-red-500">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="bg-blue-500 text-white hover:bg-blue-600">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default profileImage;
