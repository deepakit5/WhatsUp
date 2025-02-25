import {useState, useEffect, useRef, forwardRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IoClose, IoPlay, IoPause} from 'react-icons/io5'; // Icons for play/pause/close
import Avatar from '@mui/material/Avatar';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  TextareaAutosize,
} from '@mui/material';
import {getStatusDayTime} from '../../utils/getStatusDayTime';
import ViewerList from './ViewerList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DisplayMyStatus = ({myStatuses, onClose}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  //   console.log('--- myStatuses: ', myStatuses);
  const {profileImage, username} = useSelector((state) => state.user);
  const {viewers} = useSelector((state) => state.status);
  const [open, setOpen] = useState(false);
  const totalStatuses = myStatuses.length;

  // 🟢 Initialize progress for all statuses (0% initially)
  const [progress, setProgress] = useState(new Array(totalStatuses).fill(0));

  const currentStatus = myStatuses[currentIndex];

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

  return (
    <div className="inset-0 z-50 fixed  items-center justify-center bg-black ">
      <div className="relative w-full p-2 overflow-visible">
        {/* Progress Bar */}
        <div className="  z-50 bg-transparent   w-2/4 mx-auto text-center  flex  justify-center gap-1 mb-1">
          {progress.map((p, i) => (
            <div key={i} className="flex-1 bg-gray-600 rounded-full h-2">
              <div
                className="h-2 bg-gray-300  rounded-full  transition-all duration-300 ease-linear"
                style={{width: `${p}%`}}></div>
            </div>
          ))}
        </div>

        {/* Header: Avatar, Name, Close Button */}
        <div className=" absolute z-50 bg-black bg-opacity-30   w-full px-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={profileImage} sx={{width: 45, height: 45}} />
            <div className=" text-gray-300 ml-3">
              <p className="font-medium text-xl">{username}</p>
              <p className="text-sm">
                {getStatusDayTime(currentStatus.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 bg-black hover:text-gray-100">
            <IoClose size={35} />
          </button>
        </div>

        <div className="z-50 flex justify-center gap-5   ">
          <div className=" w-3/4">
            {/* Status Content */}
            <div className=" flex justify-center mt-2 ">
              {currentStatus.type === 'image' ? (
                <div className="relative ">
                  <img
                    src={currentStatus.mediaUrl}
                    alt="Status"
                    // className=" max-h-[70vh]"
                    className=" h-[83vh]"
                  />
                  {currentStatus.caption && (
                    <p className="absolute bottom-11 p-1 w-full text-center text-white text-lg  bg-black opacity-70">
                      {currentStatus.caption}
                    </p>
                  )}

                  {/* visibiliy of viewer icon */}
                  <div className=" absolute bottom-1  w-full text-center ">
                    <div
                      className=" pt-0 text-white bg-black rounded-lg inline-block cursor-pointer "
                      onClick={() => {
                        setOpen(true);
                        setIsPaused(true);
                      }}>
                      <VisibilityIcon fontSize="small" className=" mx-1 " />
                      <span className=" text-xl mx-1">{viewers.length}</span>
                    </div>
                  </div>
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
          </div>

          {/* ------status viewers ----------x------------- */}
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpen(false)}
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle className=" !p-0">
              <div className="flex justify-items-center justify-between bg-green-500 ">
                <p className="text-2xl p-2 font-semibold">
                  Viewed by {viewers.length}
                </p>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon fontSize="large" />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent className="!p-0 overflow-visible">
              <ViewerList currentStatus={currentStatus} />
            </DialogContent>
          </Dialog>

          {/* ------------x---------------------x-- */}
        </div>
      </div>
    </div>
  );
};

export default DisplayMyStatus;
