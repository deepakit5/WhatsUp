import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import {getStatusDayTime} from '../../utils/getStatusDayTime.js';
import DisplayStatus from './DisplayStatus.jsx';

const StatusList = () => {
  const {statusList} = useSelector((state) => state.status);
  const [selectedStatus, setSelectedStatus] = useState(null);

  console.log('--- statuslist: ', statusList);

  return (
    <div className=" mt-2 ">
      {statusList.map((status) => (
        <div
          key={status.senderId}
          onClick={() => setSelectedStatus(status)} // Set selected status
          className="border-b border-gray-500 bg-white  px-4 py-3 flex items-center space-x-4 cursor-pointer">
          <img
            src={status.statuses[0].mediaUrl}
            alt={<PersonIcon />}
            className="w-12 h-12 rounded-full "
          />
          <div className="">
            <p className="text-xl  text-gray-800">
              {status.senderName} (
              <span className="text-xl text-green-500 ">
                {status.statusCount}
              </span>
              )
            </p>

            {/* <div className="text-sm text-gray-500">{status.status}</div> */}
            <p className="text-sm text-gray-700">
              {getStatusDayTime(status.statuses[0].createdAt)}
            </p>
          </div>
        </div>
      ))}

      {/* Show StatusDisplay when a status is clicked */}
      {selectedStatus && (
        <DisplayStatus
          status={selectedStatus}
          onClose={() => setSelectedStatus(null)} // Function to close
        />
      )}
    </div>
  );
};

export default StatusList;
