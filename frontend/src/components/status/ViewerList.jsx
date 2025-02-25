import {useState} from 'react';
import {IconButton, Avatar, Paper} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import {getStatusDayTime} from '../../utils/getStatusDayTime';

const ViewerList = ({currentStatus}) => {
  // Get the viewer list for the currently playing status
  const viewers = currentStatus?.viewers || [];
  console.log('\n### viewers: ', viewers);
  return (
    <div className="   relative  min-w-64 min-h-80 bg-black">
      {viewers.length > 0 ? (
        <ul className=" text-gray-300">
          {viewers.map((viewer, index) => (
            <li
              key={index}
              className="p-2 border-b border-gray-500 flex items-center space-x-3">
              <Avatar src={viewer.viewerImg} />
              <div>
                <p className="text-xl font-medium">{viewer.viewerName}</p>
                <p className="text-sm text-gray-400">
                  {getStatusDayTime(viewer.viewedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-lg text-center pt-5">No viewers yet</p>
      )}
      {/* </Paper> */}
    </div>
  );
};

export default ViewerList;
