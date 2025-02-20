import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  setOpenStatusUpload,
  uploadStatus,
} from '../../redux/slices/status.slice.js';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {Delete, CloudUpload} from '@mui/icons-material';

const StatusUpload = () => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const dispatch = useDispatch();

  const {loading, openStatusUpload} = useSelector((state) => state.status);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('media', file));
    formData.append('caption', caption);
    dispatch(uploadStatus(formData));

    handleClose();
  };
  const handleClose = () => {
    dispatch(setOpenStatusUpload(false));

    // setOpenStatusUpload(false);
    setFiles([]);
    setCaption('');
  };

  return (
    <Dialog
      PaperProps={{
        className: 'w-md max-w-md  overflow-y-auto',
      }}
      open={openStatusUpload}
      onClose={handleClose}

      //
    >
      <div className="shadow-lg w-full z-50 ">
        <DialogTitle className="bg-green-400  ">Upload Status</DialogTitle>

        <DialogContent className="flex flex-col items-center mt-5">
          {/* File Input */}

          {/* Media Preview */}
          {files.length > 0 ? (
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              {files.map((file, index) => (
                <Box
                  key={index}
                  sx={{position: 'relative', width: 90, height: 90}}>
                  {file.type.startsWith('image') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      style={{width: '100%', height: '100%', borderRadius: 8}}
                    />
                  )}
                  {/* Remove Button */}
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      bgcolor: 'rgba(255,0,0,0.7)',
                      color: 'white',
                    }}
                    onClick={() => removeFile(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <Button
              className="max-w-60 "
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth>
              Choose Files
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          )}

          {/* Caption Input */}
          <TextField
            fullWidth
            label="Caption"
            variant="outlined"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{mt: 2}}
          />

          {/* Upload Button */}
          {/* <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{mt: 2}}
          onClick={handleSubmit}
          disabled={files.length === 0}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Upload Status'
          )}
        </Button> */}
        </DialogContent>

        <DialogActions className="bg-gray-100">
          <Button
            onClick={handleClose}
            className=" hover:text-white hover:bg-blue-600">
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:text-white hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={files.length === 0}

            //
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Upload '
            )}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default StatusUpload;
