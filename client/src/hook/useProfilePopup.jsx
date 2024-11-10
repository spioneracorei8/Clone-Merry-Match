import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { previewUserModel } from "../models/user.js";
import { instanceAttToken } from "../constant/AxiosInstance";
import { FormattedDate } from "../utils/util.js";

const useProfilePopup = () => {
  const [user, setUser] = useState(previewUserModel);
  const [countPhotos, setCountPhotos] = useState(0);

  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();

  const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userDataFromToken = jwtDecode(token);

        const response = await instanceAttToken.get(
          `/user/${userDataFromToken.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const formattedData = FormattedDate(response.data.birth_date);
        setUser({
          name: response?.data?.name,
          username: response?.data?.username,
          birth_date: formattedData,
          location: response?.data?.location,
          city: response?.data?.city,
          email: response?.data?.email,
          sexual_identity: response?.data?.sexual_identity,
          sexual_preference: response?.data?.sexual_preference,
          racial_preference: response?.data?.racial_preference,
          meeting_interest: response?.data?.meeting_interest,
          hobbies: response?.data?.hobbies,
          about_me: response?.data?.about_me,
          photos: response?.data?.photos,
        });
      } catch (error) {
        console.error("Error decoding the token or fetching user data:", error);
      }
    }
  };

  const userBirthDate = user?.birth_date;
  const [userBirthDateYear, userBirthDateMonth, userBirthDateDay] =
    userBirthDate.split("-").map(Number);
  const ageInYears =
    year -
    userBirthDateYear -
    (month < userBirthDateMonth ||
    (month === userBirthDateMonth && day < userBirthDateDay)
      ? 1
      : 0);

  const photosLength = user?.photos?.filter(
    (photo) => photo?.path !== null
  )?.length;
  const handleNextImage = () => {
    if (countPhotos === photosLength - 1) {
      setCountPhotos(0);
    } else {
      setCountPhotos(countPhotos + 1);
    }
  };

  const handlePreviousImage = () => {
    if (countPhotos === 0) {
      setCountPhotos(photosLength - 1);
    } else {
      setCountPhotos(countPhotos - 1);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return {
    user,
    countPhotos,
    ageInYears,
    handleNextImage,
    handlePreviousImage,
  };
};

export default useProfilePopup;
