import {Drawer, Slide} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import ChatMain from '../chats/ChatMain.jsx';
import StatusMain from '../status/StatusMain.jsx';
import ChannelMain from '../channels/ChannelMain.jsx';
import SettingMain from '../settings/SettingMain.jsx';
import ProfileMain from '../profile/ProfileMain.jsx';
import AiMain from '../ai/AiMain.jsx';

import NewChat from '../chats/NewChat.jsx';
import AddGroupMembers from '../chats/AddGroupMembers.jsx';
import StarredMessages from '../chats/StarredMessages.jsx';
import SelectChats from '../chats/SelectChats.jsx';
import PrivacySettings from '../settings/PrivacySettings.jsx';
import HelpAndSupport from '../settings/HelpAndSupport.jsx';
import NotificationSettings from '../settings/NotificationSettings.jsx';
import ThemeSettings from '../settings/ThemeSettings.jsx';
import LoginPage from '../../pages/LoginPage.jsx';
import ProfileSettings from '../settings/ProfileSettings.jsx';

// privacy settings imports----------
import AboutPrivacy from '../settings/privacy/AboutPrivacy.jsx';
import BlockedContacts from '../settings/privacy/BlockedContacts.jsx';
import GroupsPrivacy from '../settings/privacy/GroupsPrivacy.jsx';
import LastSeenAndOnline from '../settings/privacy/LastSeenAndOnline.jsx';
import ProfilePhotoPrivacy from '../settings/privacy/ProfilePhotoPrivacy.jsx';
import StatusPrivacy from '../settings/privacy/StatusPrivacy.jsx';

const LeftHalf = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.leftDrawer.in); // Access drawer state
  const content = useSelector((state) => state.leftDrawer.content);

  const containerRef = useRef(null);

  // Function to render the appropriate component based on the content state
  const renderComponent = () => {
    switch (content) {
      // sidebar icons
      case 'chats':
        return <ChatMain containerRef={containerRef} />;
      case 'status':
        return <StatusMain containerRef={containerRef} />;
      case 'channels':
        return <ChannelMain containerRef={containerRef} />;
      case 'ai':
        return <AiMain containerRef={containerRef} />;
      case 'settings':
        return <SettingMain containerRef={containerRef} />;
      case 'profile':
        return <ProfileMain containerRef={containerRef} />;

      // -------------------chats main------
      case 'newChat':
        return <NewChat containerRef={containerRef} />;
      case 'addGroupMembers':
        return <AddGroupMembers containerRef={containerRef} />;
      case 'starredMessages':
        return <StarredMessages containerRef={containerRef} />;
      case 'selectChats':
        return <SelectChats containerRef={containerRef} />;

      // ---------settingsMain  --------
      case 'profileSettings':
        return <ProfileMain containerRef={containerRef} />;
      // return <ProfileSettings containerRef={containerRef} />;
      case 'privacy':
        return <PrivacySettings containerRef={containerRef} />;
      case 'notifications':
        return <NotificationSettings containerRef={containerRef} />;

      case 'theme':
        return <ThemeSettings containerRef={containerRef} />;

      case 'help':
        return <HelpAndSupport containerRef={containerRef} />;
      // case "logout":
      //   return <LoginPage containerRef={containerRef} />;

      // ----inside privacy settings --------
      case 'lastSeenAndOnlinePrivacy':
        return <LastSeenAndOnline containerRef={containerRef} />;
      case 'profilePhotoPrivacy':
        return <ProfilePhotoPrivacy containerRef={containerRef} />;
      case 'aboutPrivacy':
        return <AboutPrivacy containerRef={containerRef} />;
      case 'statusPrivacy':
        return <StatusPrivacy containerRef={containerRef} />;
      case 'groupsPrivacy':
        return <GroupsPrivacy containerRef={containerRef} />;
      case 'blockedContacts':
        return <BlockedContacts containerRef={containerRef} />;

      default:
        return <ChatMain containerRef={containerRef} />;
    }
  };

  // useEffect(() => {
  //   // Cleanup function to close the drawer when the component unmounts
  //   return () => {
  //     // console.log("isDrawerOpen inside effect before dispatch: ", isDrawerOpen);

  //     dispatch(closeDrawer());
  //     // console.log("isDrawerOpen inside effect after dispatch: ", isDrawerOpen);
  //   };
  // }, [content]);

  return (
    <div className=" w-5/12 min-w-80 text-3xl h-screen   ">
      <div
        ref={containerRef}
        className="left half container relative  w-full  h-full overflow-hidden ">
        {renderComponent()}
      </div>
    </div>
  );
};

export default LeftHalf;
