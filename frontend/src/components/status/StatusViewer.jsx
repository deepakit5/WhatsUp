import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchStatusSeenList, addReply} from '../features/statusSlice';
import socket from '../socket';

const StatusViewer = ({userId}) => {
  const dispatch = useDispatch();
  const {statuses, seenList} = useSelector((state) => state.status);
  const [replyText, setReplyText] = useState('');

  const handleStatusSeen = (statusId) => {
    socket.emit('statusViewed', {statusId, userId});
  };

  const handleReply = (statusId) => {
    dispatch(addReply({statusId, userId, text: replyText}));
    setReplyText('');
  };

  return (
    <div>
      {statuses.map((status) => (
        <div key={status._id} onClick={() => handleStatusSeen(status._id)}>
          {status.mediaUrls.map((url) => (
            <img key={url} src={url} alt="status" />
          ))}
          <p>{status.caption}</p>
          <div>
            <input
              type="text"
              placeholder="Reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button onClick={() => handleReply(status._id)}>Send</button>
          </div>
          <button onClick={() => dispatch(fetchStatusSeenList(status._id))}>
            View Seen List
          </button>
          {seenList.map((viewer) => (
            <div key={viewer._id}>{viewer.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StatusViewer;
