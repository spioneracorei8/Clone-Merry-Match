import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useData = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [merryMatchList, setMerryMatchList] = useState([]);
  const [conversation, setConversation] = useState([]);

  const getData = async (userId, data) => {
    try {
      setIsError(false);
      setIsLoading(true);
      await axios.get(`http://localhost:3000/users/merrymatch/${userId}`, data);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const submitedComplaint = async (userId, data) => {
    try {
      setIsError(false);
      setIsLoading(true);
      await axios.post(`http://localhost:3000/complaint/${userId}`, data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userId, data) => {
    try {
      setIsError(false);
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        data
      );
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.log("Error updating user profile:", error.response.data);
      setIsError(true);
      setIsLoading(false);
      return null;
    }
  };

  const deleteUserProfile = async (userId) => {
    try {
      setIsError(false);
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/users/${userId}`);
      navigate("/");
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const merryMatch = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/merrylist`);
      setMerryMatchList(response.data);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const userLoveSwipeRight = async (userId, data) => {
    try {
      setIsError(false);
      setIsLoading(true);

      const result = await axios.put(
        `http://localhost:3000/merrylist/${userId}`,
        data
      );

      setIsLoading(false);
      return result;
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      throw error;
    }
  };

  const userRejectSwipeLeft = async (userId, data) => {
  
    try {
      setIsError(false);
      setIsLoading(true);
      await axios.put(`http://localhost:3000/merryreject/${userId}`, data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const userClearRejected = async (userId) => {
    try {
      setIsError(false);
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/merryreject/${userId}`);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const deleteMerryMatch = async (userId, deleteUserId) => {
  
    try {
      setIsError(false);
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/merrylist/${userId}`, {
        data: { deleteUserId: deleteUserId },
      });
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const chatMessage = async (senderId, receiverId) => {
    try {
      setIsError(false);
      setIsLoading(true);

      const response = await axios.get(
        `http://localhost:3000/chat/${senderId}/${receiverId}`
      );
      setConversation(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const sendingChatMessage = async (senderId, receiverId, message) => {
    try {
      setIsError(false);
      setIsLoading(true);
      await axios.post(`http://localhost:3000/chat/${senderId}/${receiverId}`, {
        message,
      });
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    merryMatch();
  }, []);

  return {
    user,
    updateUserProfile,
    getData,
    deleteUserProfile,
    deleteMerryMatch,
    isError,
    isLoading,
    merryMatchList,
    userLoveSwipeRight,
    userRejectSwipeLeft,
    userClearRejected,
    submitedComplaint,
    chatMessage,
    conversation,
    sendingChatMessage,
  };
};

export default useData;
