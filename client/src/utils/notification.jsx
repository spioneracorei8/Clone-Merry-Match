import axios from "axios";

const notification = async (userId) => {
  try {
    const result = await axios.get(
      `http://localhost:3000/notification/${userId}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const sendNotification = async (senderId, recipientId) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/notification/${senderId}`,
      {
        senderId: senderId,
        recipientId: recipientId,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

async function markNotificationAsRead(notiId) {
  try {
    const response = await axios.patch(
      `http://localhost:3000/notification/${notiId}`
    );
    console.log(response.data); // The updated notification record
  } catch (error) {
    console.error(error);
  }
}

export { notification, sendNotification, markNotificationAsRead };
