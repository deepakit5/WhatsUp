// This controller manages group creation, adding/removing users, and making users admins.

import {Group} from "../models/group.model.js";

// Create a new group and make the creator the default admin
export const createGroup = async (socket, io, data) => {
  const {groupName, creatorId, users} = data;

  try {
    const newGroup = new Group({
      groupName,
      creator: creatorId,
      admins: [creatorId], // Default admin is the creator
      users: [...users, creatorId],
    });

    await newGroup.save();
    io.emit("groupCreated", newGroup); // Notify all users of the new group
  } catch (error) {
    socket.emit("error", "Error creating group");
  }
};

// Add a user to a group
export const addUserToGroup = async (socket, io, data) => {
  const {groupId, userId} = data;

  try {
    const group = await Group.findById(groupId);
    if (!group) return socket.emit("error", "Group not found");

    group.users.push(userId);
    await group.save();

    io.to(groupId).emit("userAdded", {userId, groupId});
  } catch (error) {
    socket.emit("error", "Error adding user to group");
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (socket, io, data) => {
  const {groupId, userId} = data;

  try {
    const group = await Group.findById(groupId);
    if (!group) return socket.emit("error", "Group not found");

    group.users = group.users.filter((user) => user.toString() !== userId);
    await group.save();

    io.to(groupId).emit("userRemoved", {userId, groupId});
  } catch (error) {
    socket.emit("error", "Error removing user from group");
  }
};

// Make a user an admin
export const makeAdmin = async (socket, io, data) => {
  const {groupId, userId} = data;

  try {
    const group = await Group.findById(groupId);
    if (!group) return socket.emit("error", "Group not found");

    if (!group.admins.includes(userId)) {
      group.admins.push(userId);
      await group.save();

      io.to(groupId).emit("userMadeAdmin", {userId, groupId});
    }
  } catch (error) {
    socket.emit("error", "Error making user an admin");
  }
};
