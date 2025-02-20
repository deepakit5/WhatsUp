import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {saveAs} from 'file-saver';
import {useDispatch, useSelector} from 'react-redux';
import {ButtonBase, IconButton, Paper, Tooltip} from '@mui/material';
import Popper from '@mui/material/Popper';

import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import Loading from '../../ui/Loading.jsx';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import DownloadIcon from '@mui/icons-material/Download';

// -------------------x---------
import {FaFile} from 'react-icons/fa6';
import {FaFilePdf} from 'react-icons/fa6';
import {FaFilePowerpoint} from 'react-icons/fa6';
import {FaFileLines} from 'react-icons/fa6';
import {FaFileExcel} from 'react-icons/fa6';
import {FaFileWord} from 'react-icons/fa6';
import {FaFileZipper} from 'react-icons/fa6';
import {FaFileAudio} from 'react-icons/fa6';
import {toast} from 'react-toastify';
// -------------x---------------
import {deleteMessage} from '../../../redux/slices/chat/chatWindow.slice.js';
import {useSocket} from '../../../hooks/useSocket.hook.js';

const Message = ({msg, onImageLoad}) => {
  const socket = useSocket(); // Initialize socket connection
  const dispatch = useDispatch();

  const currentUserId = useSelector((state) => state.user.userId);
  const isSender = msg.senderId === currentUserId;
  const [msgOptionClicked, setMsgOptionClicked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (typeof msg.content === 'string') {
      setFileUrl(msg.content);
    } else if (typeof msg.content === 'object') {
      setFileUrl(URL.createObjectURL(msg.content));
    } else {
      // console.log("setting file null: ");
      setFileUrl(null);
    }
  }, [msg, msg.content]);

  useEffect(() => {
    if (
      msg.senderId !== currentUserId &&
      (msg.status === 'saved' || msg.status === 'delivered')
    ) {
      // console.log("--- message read emitting...");
      socket.timeout(1000).emit('message-read', {
        messageId: msg._id,
        chatId: msg.chatId,
        senderId: msg.senderId,
      });
    }
  }, [msg, socket]);

  const downloadFile = (fileUrl, fileName) => {
    saveAs(fileUrl, fileName || 'downloaded-file');
  };

  const renderContent = () => {
    switch (msg.type) {
      case 'text':
        return fileUrl ? (
          <span className="  break-words  text-base mx-2 mr-5 text-gray-800">
            {fileUrl}
          </span> //// fileUrl also stores text as string
        ) : (
          <p className="text-base text-gray-500 italic md:w-60 ">
            <DoNotDisturbIcon /> <span> Text not available </span>
          </p>
        );
      case 'image':
        return fileUrl ? (
          <div>
            <img
              src={fileUrl}
              alt="message img"
              onLoad={onImageLoad} // Call the scroll function after image loads
              className="max-h-[50vh] md:max-w-xs  rounded-md"
            />
          </div>
        ) : (
          <p className="text-base text-gray-500 italic md:w-60 ">
            <DoNotDisturbIcon /> <span> Image not available </span>
          </p>
        );
      case 'video':
        return fileUrl ? (
          <video
            controls
            crossOrigin="anonymous"
            className="max-h-[50vh] md:max-w-sm  rounded-md">
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-base text-gray-500 italic md:w-60 ">
            <DoNotDisturbIcon /> <span> video not available </span>
          </p>
        );
      case 'audio':
        return fileUrl ? (
          <div className="flex ">
            <div className="text-orange-600 mt-4  border-r-gray-400 w-10 h-full  ">
              <FaFileAudio />
            </div>

            <audio controls className="mr-2 mt-4   max-h-[50vh]  md:max-w-lg ">
              <source src={fileUrl} type="audio/x-m4a" className="bg-red-300" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        ) : (
          <p className="text-base text-gray-500 italic md:w-60 ">
            <DoNotDisturbIcon /> <span> Audio not available </span>
          </p>
        );
      case 'file':
        return fileUrl ? (
          <>
            <div className=" " style={{overflow: 'hidden'}}>
              {msg.fileInfo.fileType === 'PDF' && (
                <object
                  // style={{overflow: "hidden"}}
                  className="w-72 h-24 border-0  overflow-hidden"
                  data={fileUrl}
                  type="application/pdf">
                  <p>It seems you don't have a PDF plugin for this browser.</p>
                </object>
              )}

              <div className="w-72 px-1 py-2 bg-green-300 flex justify-between items-center">
                <div className="flex">
                  {/*    //switch case inside jsx for file icon
                   */}
                  {(() => {
                    switch (msg.fileInfo.fileType) {
                      case 'PDF':
                        return (
                          <span className="text-red-600 mr-2">
                            <FaFilePdf />
                          </span>
                        );

                      case 'DOC':
                      case 'DOCX':
                        return (
                          <span className="text-blue-600 mr-2">
                            <FaFileWord />
                          </span>
                        );

                      case 'PPT':
                      case 'PPTX':
                        return (
                          <span className="text-fuchsia-600 mr-2">
                            <FaFilePowerpoint />
                          </span>
                        );

                      case 'TXT':
                        return (
                          <span className="text-slate-500 mr-2">
                            <FaFileLines />
                          </span>
                        );

                      case 'XLS':
                      case 'XLSX':
                        return (
                          <span className="text-green-600 mr-2">
                            <FaFileExcel />
                          </span>
                        );

                      case 'ZIP':
                      case '7Z':
                      case 'RAR':
                      case 'GZ':
                        return (
                          <span className="text-yellow-600 mr-2">
                            <FaFileZipper />
                          </span>
                        );

                      default:
                        return (
                          <span className="text-gray-600 mr-2">
                            <FaFile />
                          </span>
                        );
                    }
                  })()}

                  {/* //------file details ---------------     */}

                  <div className=" ">
                    <p className="text-left w-48 text-sm break-words  break-all truncate">
                      {msg.fileInfo.fileName || 'no name'}
                    </p>
                    <div className="flex text-xs gap-1">
                      {msg.fileInfo.fileType === 'PDF' && (
                        <>
                          <pre className="font-sans font-semibold ">
                            {msg.fileInfo.filePages} pages
                          </pre>
                          <span className="font-extrabold">•</span>
                        </>
                      )}

                      <pre className="font-sans font-normal">
                        {msg.fileInfo.fileType}
                      </pre>
                      <span className="font-extrabold">•</span>
                      <pre className="font-sans font-semibold">
                        {msg.fileInfo.fileSize}
                      </pre>
                    </div>
                  </div>
                </div>

                {msg.status === 'pending' ? (
                  <Loading text="" size={30} />
                ) : (
                  <div
                    onClick={() => downloadFile(fileUrl, msg.fileInfo.fileName)}
                    className="cursor-pointer text-gray-500 text-center w-10 h-10 rounded-full border border-gray-500  mr-1  ">
                    <IconButton>
                      <DownloadIcon fontSize="medium" />
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-base text-gray-500 italic md:w-60 ">
            <DoNotDisturbIcon /> <span> File not available </span>
          </p>
        );
      default:
        return (
          <p className="text-base text-gray-500 italic md:w-60 ">
            <DoNotDisturbIcon /> <span> Unsupported message type </span>{' '}
          </p>
        );
    }
  };

  // for mui popper
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set the element to anchor the Popper
    setMsgOptionClicked(true);
  };

  const handleClose = () => {
    setMsgOptionClicked(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // ---------x---------------

  const handleDeleteMsgForEveryone = (msg) => {
    setMsgOptionClicked(false);
    if (msg.status === 'pending') {
      // console.log("--------- deleting msg locally...");
      dispatch(deleteMessage(msg.tempId));
    } else {
      try {
        const msgInfo = {
          messageId: msg._id,
          receiverId: msg.receiverId,
          chatId: msg.chatId,
          content: msg.content,
        };
        // console.log("msg to be deleted: ", msgInfo);
        // console.log("Socket connected:", socket.connected); // Should be true
        // console.log("Socket ID:", socket.id); // Should not be undefined

        socket
          .timeout(3000)
          .emit('deleteMsgForEveryone', msgInfo, (err, res) => {
            if (err) {
              // console.error("message deletion failed");
            } else {
              if (res && res.status === 'done') {
                dispatch(deleteMessage(msg._id));
                // console.log(`Message ${msg.content} deleted successfully.`);
              }
            }
          });
      } catch (error) {
        // console.error("Error in the  deleting message:", error);
      }
    }
  };

  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} my-1   `}>
      <div
        className={` px-1 relative group pt-1  max-w-full rounded-lg shadow-md ${
          isSender ? 'bg-green-200' : 'bg-gray-100'
        }`}>
        {/* down arrow icon */}
        <div className="flex relative ">
          <div
            className={` z-30 border-green-800 border absolute top-0 right-0 size-7 flex rounded-full  justify-center items-center  opacity-0 group-hover:opacity-100   shadow-md bg-green-100  ${
              msgOptionClicked && '  bg-gray-300  '
            } `}>
            {/* handleMsgOptions */}
            <IconButton onClick={handleOpen} size="small">
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Overlay to detect outside clicks */}
          {msgOptionClicked && (
            <div className="fixed inset-0 z-40" onClick={handleClose}></div>
          )}

          {/* Animated Menu  for 3 dot */}

          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-end"
            modifiers={[
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'clippingParents', // Prevent overflow relative to parent
                },
              },
              {
                name: 'flip',
                options: {
                  fallbackPlacements: ['top', 'left'], // Try other placements if needed
                },
              },
            ]}
            style={{zIndex: 50}}>
            <div
            // className={`${
            //   msgOptionClicked ? "scale-100 opacity-100" : "scale-0 opacity-0"
            // } transform origin-top-right transition-all duration-300 ease-out  rounded-lg shadow-lg absolute top-7 right-1 w-40 text-gray-700 text-base z-50`}
            // //sadf
            >
              <Paper elevation={4} square={false}>
                <ul className="py-2 ">
                  {isSender && (
                    <li className=" hover:bg-gray-200 ">
                      <ButtonBase
                        className="w-full h-full"
                        onClick={() => {
                          handleDeleteMsgForEveryone(msg);
                          handleClose();
                        }}>
                        <p className=" w-full  h-full p-2 pl-4   text-left ">
                          Delete for everyone
                        </p>
                      </ButtonBase>
                    </li>
                  )}
                </ul>
              </Paper>
            </div>
          </Popper>
        </div>

        <div className=" flex flex-col relative max-w-md">
          {renderContent()}

          {msg.status === 'pending' &&
            (msg.type === 'image' || msg.type === 'video') && (
              <div className="z-50 w-full absolute top-1/3  ">
                <Loading text="load" />
              </div>
            )}

          {/* time and status */}
          <div className=" h-5 flex   justify-end items-center  text-xs">
            <span className="text-gray-500 ml-4 mr-1">{msg.time}</span>

            {isSender && (
              <span className="messageStatus status text-gray-500 mr-1 font-thin py-0 ">
                {msg.status === 'saved' ? (
                  <DoneIcon fontSize="small" />
                ) : msg.status === 'delivered' ? (
                  <DoneAllIcon fontSize="small" />
                ) : msg.status === 'read' ? (
                  <DoneAllIcon fontSize="small" className=" text-blue-500  " />
                ) : (
                  <QueryBuilderOutlinedIcon className="!w-4  " />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  msg: PropTypes.shape({
    senderId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'image', 'video', 'audio', 'file'])
      .isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['pending', 'saved', 'delivered', 'read'])
      .isRequired,
  }).isRequired,
};

export default Message;
