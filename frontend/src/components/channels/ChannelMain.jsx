import {Slide} from '@mui/material';
import React from 'react';
import {useSelector} from 'react-redux';
import LogoCard from '../chats/LogoCard.jsx';
import SearchBar from '../chats/SearchBar.jsx';

const ChannelMain = ({containerRef}) => {
  const {isOpen} = useSelector((state) => state.leftDrawer);

  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={300}
      easing="ease"
      container={containerRef.current}>
      <div>
        {/* channel header */}
        {/* <div>
          <div className="flex items-center justify-between p-2 bg-gray-100    w-full  border-black ">
            <p className="font-bold text-2xl  ">Channels</p>
          </div>
          <SearchBar />
        </div> */}

        {/* channel list is here */}
        {/* <div className="  overflow-y-auto  h-full "></div> */}

        <div className="bg-gray-200 ">
          <p className="text-xl text-gray-600 p-5">
            This feature will be coming soon...
          </p>
        </div>
      </div>
    </Slide>
  );
};

export default ChannelMain;
