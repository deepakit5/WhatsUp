import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {formatDateTime} from '../../../utils/formatDateTime.js';
import SendIcon from '@mui/icons-material/Send';
import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MicIcon from '@mui/icons-material/Mic';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PollIcon from '@mui/icons-material/Poll';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import {useSocket} from '../../../hooks/useSocket.hook.js';
import {
  addMessage,
  addMessageLocally,
  sendMessageMedia,
} from '../../../redux/slices/chat/chatWindow.slice.js';

import {PDFDocument} from 'pdf-lib';
import {v4 as uuidv4} from 'uuid';
import {toast} from 'react-toastify';

const MessageInput = () => {
  const socket = useSocket(); // Initialize socket connection

  const [mediaUrl, setMediaUrl] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const [addBtnClicked, setAddBtnClicked] = useState(false);
  const currentUserId = useSelector((state) => state.user.userId);

  const {selectedChat, selectedUser} = useSelector((state) => state.chatWindow);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [pages, setPages] = useState(0);
  // const [caption, setCaption] = useState("");
  const [fileInfo, setFileInfo] = useState({
    fileType: '',
    fileSize: '',
    filePages: 0,
    caption: '',
  });

  const handleAddBtn = (e) => {
    setAddBtnClicked(!addBtnClicked);
    console.log('addBtnClicked in handle in chats: ', addBtnClicked);
  };

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`;
    } else if (sizeInBytes < 1048576) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1073741824) {
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
    }
  };

  const setSelectedFileInfo = async (selectedFile) => {
    const fileName = selectedFile.name;

    //  for File Extension
    const type = fileName
      .substring(fileName.lastIndexOf('.') + 1)
      .toUpperCase();

    // Format the file size
    const formattedSize = formatFileSize(selectedFile.size);

    let pages = null;
    if (selectedFile.type.includes('pdf')) {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        pages = pdfDoc.getPageCount(); // Extract page count
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
    // ------------------x--------
    setFileInfo({
      fileName: selectedFile.name,
      fileType: type,
      fileSize: formattedSize,
      filePages: pages, // Use the local variable
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
      setOpenPreview(true);

      setSelectedFileInfo(selectedFile);
    }
  };

  const renderPreview = () => {
    if (!selectedFile)
      return <Typography>Select a file to preview.</Typography>;

    const fileType = selectedFile.type.split('/')[0];

    switch (fileType) {
      case 'image':
        return <img src={fileUrl} alt="Preview" className="max-h-80" />;
      case 'video':
        return (
          <video controls className="max-h-80">
            <source src={fileUrl} type={selectedFile.type} />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="bg-green-200 w-3/4 h-16">
            <source src={fileUrl} type={selectedFile.type} />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return (
          <object
            data={fileUrl}
            type="application/pdf"
            width="100%"
            height="400">
            <p>It seems you don't have a PDF plugin for this browser.</p>
          </object>
        );
    }
  };

  const handleClose = () => {
    setMessage(''); // Clear input field
    setOpenPreview(false);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl); // Clean up URL object
    }
    setSelectedFile(null);
    setFileUrl(null);
  };

  const handleKeyDown = (e) => {
    // Check if Enter key is pressed without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents form submission or page refresh
      handleSend();
    }
    // If Shift + Enter is pressed, allow new line
    else if (e.key === 'Enter' && e.shiftKey) {
      return; // Allows the new line
    }
  };

  const handleSend = async () => {
    let msgType = '';
    if (selectedFile?.type.startsWith('image/')) {
      msgType = 'image';
    } else if (selectedFile?.type.startsWith('video/')) {
      msgType = 'video';
    } else if (selectedFile?.type.startsWith('audio/')) {
      msgType = 'audio';
    } else if (
      selectedFile?.type.startsWith('application/') ||
      selectedFile?.type.startsWith('text/')
    ) {
      msgType = 'file';
    } else {
      msgType = 'text';
    }

    if (msgType !== 'text' || (msgType === 'text' && message.trim())) {
      const newMessage = {
        tempId: uuidv4(), // Generate a unique temporary ID
        chatId: selectedChat?.chat?._id || null, // if new chat , chatid will empty
        content: message || selectedFile, // texts or media

        fileInfo: {
          fileName: fileInfo.fileName,
          fileSize: fileInfo.fileSize,
          fileType: fileInfo.fileType,
          filePages: fileInfo.filePages,
        },
        senderId: currentUserId, // Replace with the actual user ID from state or context
        receiverId: selectedChat?.user?._id || selectedUser?._id || null, // null is used for group chat , there is not single receiver in group chat
        status: 'pending', // Initial status
        type: msgType,
        time: formatDateTime(new Date(), {time: true}),
        date: formatDateTime(new Date(), {date: true}),
      };
      handleClose();
      dispatch(addMessageLocally(newMessage));

      if (newMessage.type !== 'text' && selectedFile) {
        const msgMediaUrl = await dispatch(
          sendMessageMedia(selectedFile)
        ).unwrap();

        if (msgMediaUrl) {
          const newMessage2 = {...newMessage, content: msgMediaUrl};

          socket.emit('sendMessage', newMessage2); // Emit message through socket
        }
      } else {
        socket.emit('sendMessage', newMessage); // Emit message through socket
      }
    } else {
      toast.error("Empty message can't be send.");
    }
  };

  return (
    <div className=" border-t pb-1  border-gray-300 flex items-end   w-full bg-slate-100">
      <div className="flex relative">
        {/* add plus button */}
        <div
          onClick={handleAddBtn}
          className={` flex items-center  transform transition-transform duration-500    ${
            addBtnClicked
              ? 'rotate-[135deg] bg-gray-300 rounded-full  '
              : 'rotate-0'
          }`}>
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </div>

        {/* Overlay to detect outside clicks */}
        {addBtnClicked && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setAddBtnClicked(false)}></div>
        )}

        {/* Animated Menu  for add icon */}
        <div
          className={`${
            addBtnClicked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          } transform origin-bottom-left transition-all duration-300 ease-out bg-white  rounded-lg shadow-lg absolute bottom-16  w-44 text-gray-700 text-base z-50 `}>
          <Paper elevation={8} square={false}>
            <ul className="py-2 ">
              {/* document */}
              <li className="hover:bg-gray-200  ">
                <ButtonBase className="w-full h-full ">
                  <label
                    htmlFor="file-input"
                    className="w-full h-full "
                    onClick={() => setAddBtnClicked(false)}>
                    <div className="flex">
                      <span className=" flex items-center pl-2  text-purple-500 ">
                        <DescriptionIcon />
                      </span>
                      <p className=" w-full  h-full p-2 pl-4  text-left">
                        Documents
                      </p>
                    </div>
                  </label>
                </ButtonBase>

                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  accept=".doc,.docx,.pdf,.xls,.xlsx,.csv,.txt"
                  onChange={handleFileChange}
                />
              </li>
              {/* photos */}
              <li className="hover:bg-gray-200  ">
                <ButtonBase className="w-full h-full">
                  <label
                    htmlFor="img-input"
                    className="w-full h-full "
                    onClick={() => setAddBtnClicked(false)}>
                    <div className="flex">
                      <span className="  flex items-center pl-2  text-blue-500">
                        <PhotoLibraryIcon />
                      </span>
                      <p className=" w-full  h-full p-2 pl-4  text-left">
                        Photos
                      </p>
                    </div>
                  </label>
                </ButtonBase>
                <input
                  type="file"
                  id="img-input"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  // onChange={(e) => console.log(e.target.files[0])} // Handle file selection
                />
              </li>
              {/* videos */}
              <li className="hover:bg-gray-200  ">
                <ButtonBase className="w-full h-full">
                  <label
                    htmlFor="video-input"
                    className="w-full h-full "
                    onClick={() => setAddBtnClicked(false)}>
                    <div className="flex">
                      <span className="  flex items-center pl-2  text-red-500">
                        <VideoCameraBackIcon />
                      </span>
                      <p className=" w-full  h-full p-2 pl-4  text-left">
                        Videos
                      </p>
                    </div>
                  </label>
                </ButtonBase>
                <input
                  type="file"
                  id="video-input"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </li>

              {/* audio */}
              <li className="hover:bg-gray-200  ">
                <ButtonBase className="w-full h-full">
                  <label
                    htmlFor="audio-input"
                    className="w-full h-full "
                    onClick={() => setAddBtnClicked(false)}>
                    <div className="flex">
                      <span className="  flex items-center pl-2  text-orange-500 ">
                        <LibraryMusicIcon />
                      </span>
                      <p className=" w-full  h-full p-2 pl-4  text-left">
                        Audio
                      </p>
                    </div>
                  </label>
                </ButtonBase>
                <input
                  type="file"
                  id="audio-input"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileChange}
                />
              </li>

              {/* poll */}
              <li className="hover:bg-gray-200  ">
                <ButtonBase
                  className="w-full h-full"
                  onClick={() => handleDrawer('addGroupMembers')}>
                  <span className=" pl-2  text-green-500">
                    <PollIcon />
                  </span>
                  <p className=" w-full  h-full p-2 pl-4  text-left">Poll</p>
                </ButtonBase>
              </li>
            </ul>
          </Paper>
        </div>
      </div>

      {/* preview and confirmation of uploading/sending media */}
      {openPreview && (
        <Dialog
          open={openPreview}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth>
          <DialogTitle className="bg-gray-100 flex justify-between">
            <p>File Preview</p> <p>{selectedFile.name}</p>
          </DialogTitle>
          <DialogContent className="flex flex-col items-center mt-5">
            {fileUrl ? renderPreview() : <p>No preview available</p>}
          </DialogContent>
          <DialogActions className="bg-gray-100">
            <Button
              onClick={handleClose}
              className=" hover:text-white hover:bg-blue-600">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              // onClick={handleSendMedia}
              className="bg-blue-500 hover:text-white hover:bg-blue-600">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <TextareaAutosize
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        maxRows={7}
        minRows={1}
        style={{
          resize: 'none', // Disable resizing
        }}
        className=" m-1 px-2 border p-2    rounded-lg focus:outline-none w-full  text-lg text-gray-700"
      />

      <div className="mr-4">
        <IconButton onClick={handleSend}>
          {message === '' ? (
            <MicIcon fontSize="medium" className="text-black mb-1" />
          ) : (
            <SendIcon fontSize="large" className="text-green-500" />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default MessageInput;
