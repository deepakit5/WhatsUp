import {useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {IoClose, IoPlay, IoPause} from 'react-icons/io5'; // Icons for play/pause/close
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import {IconButton, TextareaAutosize} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {getStatusDayTime} from '../../utils/getStatusDayTime';
import StatusContent from './StatusContent.jsx';

const DisplayStatus = ({status, onClose}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reply, setReply] = useState('');
  const dispatch = useDispatch();
  //   // console.log('--- status: ', status);

  const totalStatuses = status.statuses.length;

  // 🟢 Initialize progress for all statuses (0% initially)
  const [progress, setProgress] = useState(new Array(totalStatuses).fill(0));

  const currentStatus = status.statuses[currentIndex];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setProgress((prev) =>
          prev.map(
            (p, i) => (i === currentIndex ? Math.min(p + 1, 100) : p) // 🟢 Increment only the current segment
          )
        );
      }, 30); // 🟢 Controls speed of progress

      if (progress[currentIndex] >= 100) {
        clearInterval(interval);
        handleNext(); // 🟢 Move to next status when current one completes
      }

      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused, progress]);

  const handleNext = () => {
    if (currentIndex < totalStatuses - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress((prev) =>
        prev.map((p, i) => (i === currentIndex + 1 ? 0 : p))
      ); // Reset next status progress
    } else {
      onClose(); // Close when all statuses are done
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress((prev) =>
        prev.map((p, i) => (i === currentIndex - 1 ? 0 : p))
      ); // Reset previous status progress
    }
  };

  const handleReply = () => {
    if (reply.trim()) {
      // console.log('sending reply on status .....');
      //   dispatch(sendReply({statusId: currentStatus._id, text: reply}));
      setReply('');
    }
  };

  return (
    <div className="inset-0 z-50 fixed flex items-center justify-center bg-black ">
      <div className="relative max-w-[90vw]  rounded-lg  p-2 shadow-lg">
        {/* Header: Avatar, Name, Close Button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar src={status.senderImg} sx={{width: 45, height: 45}} />
            <div className=" text-gray-300 ml-3">
              <p className="font-medium text-xl">{status.senderName}</p>
              <p className="text-sm">
                {getStatusDayTime(currentStatus.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-100">
            <IoClose size={35} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex gap-1 ">
          {progress.map((p, i) => (
            <div key={i} className="flex-1 bg-gray-600 rounded-full h-2">
              <div
                className="h-2 bg-gray-300  rounded-full  transition-all duration-300 ease-linear"
                style={{width: `${p}%`}}></div>
            </div>
          ))}
        </div>

        {/* Status Content */}
        {/* <div className=" flex justify-center mt-5 ">
          {currentStatus.type === 'image' ? (
            <div className="relative  ">
              <img
                src={currentStatus.mediaUrl}
                alt="Status"
                className=" max-h-[65vh]"
              />
              {currentStatus.caption && (
                <p className="absolute bottom-1 p-2 w-full text-center text-white text-lg  bg-black opacity-70">
                  {currentStatus.caption}
                </p>
              )}
            </div>
          ) : (
            <div className="relative  ">
              <video
                src={currentStatus.mediaUrl}
                controls
                className=" max-h-[65vh]"></video>

              {currentStatus.caption && (
                <p className="absolute bottom-1 p-2 w-full text-center text-white text-lg  bg-black opacity-70">
                  {currentStatus.caption}
                </p>
              )}
            </div>
          )}
        </div> */}
        <div className="">
          <StatusContent currentStatus={currentStatus} />
        </div>

        {/* Controls: Previous, Play/Pause, Next */}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`${
              currentIndex === 0 && 'opacity-0'
            } 'rounded-full text-gray-500 hover:text-gray-100' `}>
            <ArrowCircleLeftRoundedIcon sx={{fontSize: 50}} />
          </button>
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="rounded-full  text-gray-500 hover:text-gray-100">
            {isPaused ? <IoPlay size={40} /> : <IoPause size={40} />}
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === totalStatuses - 1}
            className={`${
              currentIndex === totalStatuses - 1 && 'opacity-0'
            } 'rounded-full text-gray-500 hover:text-gray-100' `}>
            <ArrowCircleRightRoundedIcon sx={{fontSize: 50}} />
          </button>
        </div>

        {/* Reply Input */}
        <div className="flex items-center gap-3 mt-4">
          <TextareaAutosize
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a reply..."
            maxRows={3}
            minRows={1}
            style={{
              resize: 'none', // Disable resizing
            }}
            className=" flex-1 min-w-96  m-1 px-2 border p-2   rounded-lg focus:outline-none w-full  bg-black text-lg text-gray-200"
          />
          <button onClick={handleReply} className="ml-2 ">
            <SendRoundedIcon
              sx={{fontSize: 50}}
              className=" bg-green-500 p-1 text-black rounded-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayStatus;
