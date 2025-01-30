import axiosInstance from "./axiosConfig";

export const fetchChats = async () => {
  const response = await axiosInstance.get("/chats");
  return response.data;
};
