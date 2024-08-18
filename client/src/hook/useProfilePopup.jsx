import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
const useProfilePopup = () => {

    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [sexualIdentity, setSexualIdentity] = useState("");
    const [sexualPreference, setSexualPreference] = useState("");
    const [racialPreference, setRacialPreference] = useState("");
    const [meetingInterest, setMeetingInterest] = useState("");
    const [hobbyLists, setHobbyLists] = useState([]);
    const [info, setInfo] = useState("");
    const [images, setImages] = useState([null, null, null, null, null]);
    const [countImage, setCountImage] = useState(0)


    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();
    const userBirthDate = birthDate;
    const [userBirthDateYear, userBirthDateMonth, userBirthDateDay] =
        userBirthDate.split("-").map(Number);
    const ageInYears =
        year -
        userBirthDateYear -
        (month < userBirthDateMonth ||
            (month === userBirthDateMonth && day < userBirthDateDay)
            ? 1
            : 0);

    const getUserProfile = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const userDataFromToken = jwtDecode(token);

                const result = await axios.get(
                    `http://localhost:3000/users/${userDataFromToken.user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setName(result.data[0].name);
                setBirthDate(result.data[0].birthDate);
                setLocation(result.data[0].location);
                setCity(result.data[0].city);
                setSexualIdentity(result.data[0].sexual_identity);
                setSexualPreference(result.data[0].sexual_preference);
                setRacialPreference(result.data[0].racial_preference);
                setMeetingInterest(result.data[0].meeting_interest);
                setInfo(result.data[0].about_me);

                let newHobbyList = [];
                let hobbyData = result.data[0].hobbies_interests;

                for (let i = 0; i < hobbyData.length; i++) {
                    newHobbyList.push(hobbyData[i].hob_list);
                }
                setHobbyLists(newHobbyList);

                let newImageList = [];
                let imageData = result.data[0].pictures;

                for (let i = 0; i < imageData.length; i++) {
                    newImageList.push(imageData[i].pic_url);
                }
                setImages(newImageList);


            } catch (error) {
                console.error("Error decoding the token or fetching user data:", error);
            }
        }
    }

    const handleNextImage = () => {
        if (countImage === images.length - 1) {
            setCountImage(0);
        } else {
            setCountImage(countImage + 1);
        }
    };

    const handlePreviousImage = () => {
        if (countImage === 0) {
            setCountImage(images.length - 1);
        } else {
            setCountImage(countImage - 1);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    return {
        name,
        location,
        city,
        sexualIdentity,
        sexualPreference,
        racialPreference,
        meetingInterest,
        hobbyLists,
        info,
        images,
        countImage,
        ageInYears,
        handleNextImage,
        handlePreviousImage,
    };
}

export default useProfilePopup