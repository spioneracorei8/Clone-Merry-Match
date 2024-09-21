import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { userInitialValue } from "../models/user.js";
import { instanceAttToken } from "../constant/AxiosInstance";
import { FormattedDate } from "../utils/util.js";

const useProfilePopup = () => {
  const [initialUser, setInitialUser] = useState(userInitialValue);

  const [countImgs, setCountImgs] = useState(0);

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
        setInitialUser({
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
          images: response?.data?.image,
        });
      } catch (error) {
        console.error("Error decoding the token or fetching user data:", error);
      }
    }
  };

  const userBirthDate = initialUser?.birth_date;
  const [userBirthDateYear, userBirthDateMonth, userBirthDateDay] =
    userBirthDate.split("-").map(Number);
  const ageInYears =
    year -
    userBirthDateYear -
    (month < userBirthDateMonth ||
    (month === userBirthDateMonth && day < userBirthDateDay)
      ? 1
      : 0);

  const imgsLength = initialUser?.images?.filter(
    (img) => img?.image_url !== null
  )?.length;
  const handleNextImage = () => {
    if (countImgs === imgsLength - 1) {
      setCountImgs(0);
    } else {
      setCountImgs(countImgs + 1);
    }
  };

  const handlePreviousImage = () => {
    if (countImgs === 0) {
      setCountImgs(imgsLength - 1);
    } else {
      setCountImgs(countImgs - 1);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return {
    initialUser,
    countImgs,
    ageInYears,
    handleNextImage,
    handlePreviousImage,
  };
};

export default useProfilePopup;
