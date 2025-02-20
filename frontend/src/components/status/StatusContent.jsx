// it is just display a single status created for separate emission of status-seen event

import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useSocket} from '../../hooks/useSocket.hook';

const StatusContent = ({currentStatus}) => {
  // console.log('@@## currentStatus: ', currentStatus);
  const socket = useSocket();
  const {username, userId, profileImage} = useSelector((state) => state.user);

  useEffect(() => {
    // console.log('--- status-seen emitting...');
    socket.timeout(1000).emit('status-seen', {
      statusId: currentStatus._id,
      viewerId: userId,
      viewerName: username,
      viewerImg: profileImage,
    });
  }, [currentStatus._id]);

  return (
    <div className=" flex justify-center mt-5 ">
      {currentStatus.type === 'image' ? (
        <div className="relative  ">
          <img
            src={currentStatus.mediaUrl}
            alt="Status"
            className=" max-h-[60vh]"
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
            className=" max-h-[60vh]"></video>

          {currentStatus.caption && (
            <p className="absolute bottom-1 p-2 w-full text-center text-white text-lg  bg-black opacity-70">
              {currentStatus.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusContent;
