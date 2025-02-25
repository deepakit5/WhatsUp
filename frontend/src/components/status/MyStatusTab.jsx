import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  sendReply,
  setOpenStatusUpload,
} from '../../redux/slices/status.slice.js';
import {Dialog, IconButton, TextField, Button, Avatar} from '@mui/material';
import {ArrowForwardIos, Close} from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {getStatusDayTime} from '../../utils/getStatusDayTime.js';
import DisplayMyStatus from './DisplayMyStatus.jsx';
// import StatusDisplay from './StatusDisplay.jsx';

const MyStatusTab = () => {
  const dispatch = useDispatch();
  const [openDisplay, setOpenDisplay] = useState(false);

  //
  const {myStatuses, openStatusUpload} = useSelector((state) => state.status);
  console.log('--- myStatuses: ', myStatuses);

  const {profileImage} = useSelector((state) => state.user);

  return (
    <>
      <div
        onClick={() => {
          if (myStatuses.length > 0) {
            setOpenDisplay(true);
          } else {
            dispatch(setOpenStatusUpload(true));
          }
          //   handleStatusUpload();
        }}
        className=" shadow-md flex gap-4 px-4 py-5 w-full bg-white cursor-pointer">
        {myStatuses.length > 0 ? (
          <div className="relative ">
            <img
              src={myStatuses[0].mediaUrl}
              alt="profile img"
              className="w-12 h-12 rounded-full"
            />
          </div>
        ) : (
          <div className="relative ">
            <Avatar
              src={profileImage}
              sx={{width: 50, height: 50}}
              className="w-12 h-12 rounded-full"
            />

            <span className="absolute top-5 left-7  ">
              <AddCircleIcon
                fontSize="small"
                className="text-green-600 bg-white rounded-full"
              />
            </span>
          </div>
        )}

        {/* right part of my status tab */}
        <div>
          <p className="text-left text-lg ">
            My status (
            <span className="text-green-500"> {myStatuses.length} </span> )
          </p>
          {myStatuses.length > 0 ? (
            <p className="text-sm text-gray-700">
              {getStatusDayTime(myStatuses[0].createdAt)}
            </p>
          ) : (
            <p className="text-sm text-gray-600">click to add status update</p>
          )}
        </div>
      </div>

      {/* ------------x------------x-------- */}
      {openDisplay && (
        <DisplayMyStatus
          myStatuses={myStatuses}
          onClose={() => setOpenDisplay(false)}
        />
      )}
    </>
  );
};

export default MyStatusTab;
