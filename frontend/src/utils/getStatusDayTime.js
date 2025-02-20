import {formatDateTime} from './formatDateTime.js';

export const getStatusDayTime = (rawTime) => {
  const statusTime = new Date(rawTime); // Convert to Date
  const now = new Date();

  // Create Yesterday's Date
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const formattedTime = formatDateTime(statusTime, {time: true});

  if (statusTime.toDateString() === now.toDateString()) {
    return `Today at ${formattedTime}`;
    // setStatusUploadTime(`Today at ${formattedTime}`);
  } else if (statusTime.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formattedTime}`;
    // setStatusUploadTime(`Yesterday at ${formattedTime}`);
  } else {
    return `On ${statusTime.toLocaleDateString()} at ${formattedTime}`;
  }
};
