// NewChat.jsx

import {Avatar, Slide} from '@mui/material';

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// fetchUserList
import {fetchChatList, selectchat} from '../../redux/slices/chat/chat.slice'; // Adjust paths as per your structure
import {
  closeDrawer,
  openDrawerLeft,
} from '../../redux/slices/chat/leftDrawer.slice';
import {openDrawerRight} from '../../redux/slices/chat/rightDrawer.slice.js';
import SearchBar from './SearchBar.jsx';

import {FiArrowLeft} from 'react-icons/fi';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
  clearResults,
  searchUsers,
} from '../../redux/slices/chat/searchUser.slice.js';
import {selectUser} from '../../redux/slices/chat/chatWindow.slice.js';
import {debounce} from 'lodash';
import Loading from '../ui/Loading.jsx';

const NewChat = ({containerRef}) => {
  const dispatch = useDispatch();

  const {results, loading} = useSelector((state) => state.search);
  const {isOpen} = useSelector((state) => state.leftDrawer);

  const [invalidNumber, setInvalidNumber] = useState(false);

  const [userList, setUserList] = useState([]);

  const handleBack = () => {
    dispatch(closeDrawer());
    dispatch(openDrawerLeft('chats'));
  };

  const handleSearch = (query, searchContext) => {
    if (searchContext === 'newUserList') {
      // Add filtering logic for userList based on searchTerm

      if (query.trim()) {
        if (query.length === 10) {
          setInvalidNumber(false);
          dispatch(searchUsers(query)); // Perform the search
        } else {
          setInvalidNumber(true);
        }
      } else {
        dispatch(clearResults()); // Clear results if the input is empty
      }
    }
  };

  const handleSelectedUser = (user) => {
    dispatch(openDrawerRight('rightHalfMain'));

    dispatch(selectUser(user));
    console.log('dispatching selected chat in new chat ', user);
  };

  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      {/* <div>NewChat component is here</div> */}

      <div className="">
        <div className="flex m-2 mb-5 ">
          <button onClick={handleBack} className=" cursor-pointer mr-4 ">
            <FiArrowLeft />
          </button>
          <p className="text-xl"> New Chat </p>
        </div>

        <div className="mb-1   w-full ">
          <SearchBar
            searchContext="newUserList" // Specify the context for this search
            placeholder="Search by name or phone number..."
            onSearch={handleSearch}
            debounceDelay={700} // 900ms debounce delay
          />

          <button className="flex items-center py-4 px-4  w-full border-b border-gray-300 text-left hover:bg-gray-200 transition-all duration-300 ">
            <span className="mr-5">
              <GroupAddIcon />
            </span>
            <span className="text-xl">Create New Group</span>
          </button>
        </div>

        <div className="h-[50vh]  overflow-y-auto  max-h-full bg-gray-50 ">
          {invalidNumber && (
            <p className="text-base text-center"> Invalid Phone Number ! </p>
          )}

          {loading && <Loading text="Searching..." />}

          {results.length == 0 && (
            <p className="text-base text-center"> Not Found ! </p>
          )}

          <ul className="">
            {results.map((user) => (
              <li
                key={user._id} // Use item._id if MongoDB
                className=" flex items-center py-3 px-4 border-b gap-4 cursor-pointer   border-gray-300 text-left hover:bg-gray-200 transition-all duration-300  "
                onClick={() => handleSelectedUser(user)}>
                <Avatar
                  src={user.avatar || '/default-avatar.png'}
                  alt="Profile img"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <p className="text-lg font-medium">{user.username}</p>
                  <p className="text-sm font-normal text-gray-600  ">
                    {user.about}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Slide>
  );
};
export default NewChat;
