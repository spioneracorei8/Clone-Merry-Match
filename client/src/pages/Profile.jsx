import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavigationbarUser from "../components/NavigationbarUser";
import useData from "../hook/useData";
import ProfilePopup from "../components/ProfilePopup";
import DeletePopup from "../components/DeletePopup";
import jwtDecode from "jwt-decode";
import { useAuth } from "../contexts/authentication";
import Loading from "../components/Loading";
import CountryStateData from "../data/CountryStateData.json";
import {
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { instanceAttToken } from "../constant/AxiosInstance";
import { userInitialValue } from "../models/user.js";
import { FormattedDate } from "../utils/util.js";

function Profile() {
  const { updateUserProfile } = useData();
  const { state, loading, updateProfilePic } = useAuth();
  const [initialUser, setInitialUser] = useState({
    name: "",
    username: "",
    birth_date: "",
    location: "",
    city: "",
    email: "",
    sexual_identity: "",
    sexual_preference: "",
    racial_preference: "",
    meeting_interest: "",
    hobbies: [],
    about_me: "",
    images: Array(5).fill(null),
  });
  const [newHobbies, setNewHobbies] = useState("");
  const [newFileImgs, setNewFileImgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileUpdated, setProfileUpdated] = useState(false);

  const countries = CountryStateData;
  const cities = CountryStateData.flatMap((country) => country.states);

  const toast = useToast();
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (initialUser?.images?.length > 2) {
      let notNullImg = 0;
      initialUser?.images?.forEach((img) => {
        if (img?.image_url !== null) {
          notNullImg++;
        }
      });
      if (notNullImg <= 1) {
        toast({
          title: "Image must have 2 or more images.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setIsLoading(false);
        return;
      }
      if (!initialUser?.username) {
        toast({
          title: "Please enter username",
          position: "top",
          isClosable: true,
        });
      } else if (!initialUser?.name) {
        toast({
          title: "Please enter name",
          position: "top",
          isClosable: true,
        });
      } else {
        const response = await updateUserProfile(
          state?.user?.user_id,
          initialUser,
          newFileImgs
        );
        if (response && response.token) {
          localStorage.setItem("token", response.token);
          setProfileUpdated(true);
          updateProfilePic(response.pic_url);
          toast({
            title: "Profile updated.",
            description: "Your profile has been updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          window.location.reload();
        }
        setIsLoading(false);
      }
    }
  };

  const handleUpdateValue = (e) => {
    setInitialUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userDataFromToken = jwtDecode(token);
        const response = await instanceAttToken.get(
          `/user/${userDataFromToken.user_id}`
        );

        const formattedData = FormattedDate(response.data.birth_date);
        setInitialUser((prev) => ({
          ...prev,
          name: response.data.name,
          birth_date: formattedData,
          location: response.data.location,
          city: response.data.city,
          username: response.data.username,
          email: response.data.email,
          sexual_identity: response.data.sexual_identity,
          sexual_preference: response.data.sexual_preference,
          racial_preference: response.data.racial_preference,
          meeting_interest: response.data.meeting_interest,
          about_me: response.data.about_me,
          images: response.data.image,
          hobbies: response.data.hobbies,
        }));
        setIsLoading(false);
      } catch (error) {
        console.error("Error decoding the token or fetching user data:", error);
      }
    }
  };
  useEffect(() => {
    getUserProfile();
    setProfileUpdated(false);
  }, []);

  // ------------section 2 ---------------
  console.log(initialUser);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addNewHobbies();
    }
  };

  const maxHobbies = 10;
  const addNewHobbies = () => {
    if (newHobbies.trim() !== "") {
      if (initialUser?.hobbies?.length >= maxHobbies) {
        alert(`You can only add up to ${maxHobbies} hobbies.`);
        return;
      }
      const newHobby = [...initialUser?.hobbies];
      newHobby.push(newHobbies.trim());
      setInitialUser((prev) => ({
        ...prev,
        hobbies: newHobby,
      }));
      setNewHobbies("");
    }
  };

  const deleteHobby = (e, index) => {
    e.preventDefault();
    const newHobbies = [...initialUser?.hobbies];
    newHobbies.splice(index, 1);
    setInitialUser((prev) => ({
      ...prev,
      hobbies: newHobbies,
    }));
  };

  // ------------section 3 ---------------
  const handleImageClick = (index) => {
    const input = document.createElement("input");
    input.accept = "image/*";
    input.type = "file";
    input.multiple;

    input.onchange = (event) => {
      let file = event.target.files[0];
      const fileExtension = file.name.split(".").pop();
      const newFileName = `${index}.${fileExtension}`;
      const newFile = new File([file], newFileName, { type: file.type });
      setNewFileImgs((prev) => {
        return [...prev, newFile];
      });
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast({
          title: "Invalid file format.",
          description: "Only PNG and JPEG images are accepted.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      const newImages = [...initialUser?.images];
      newImages[index].image_url = URL.createObjectURL(file);
      setInitialUser((prev) => ({
        ...prev,
        images: newImages,
      }));
    };
    input.click();
  };

  const handleImageDrop = (event, index) => {
    event.preventDefault();
    const droppedIndex = event.dataTransfer.getData("text");
    if (droppedIndex === "") return;
    setInitialUser((prev) => {
      const newImages = [...prev.images];
      const temp = newImages[index];
      newImages[index] = newImages[droppedIndex];
      newImages[droppedIndex] = temp;
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text", index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const deleteImage = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    const newImages = [...initialUser?.images];
    if (newImages[index]) {
      newImages[index].image_url = null;
    }
    setInitialUser((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const [deleteAccount, setDeleteAccount] = useState(false);

  const handleDeleteAccount = (event) => {
    event.preventDefault();
    setDeleteAccount(!deleteAccount);
  };

  const handleClosePopupDelete = () => {
    setDeleteAccount(false);
  };

  const [showProfile, setShowProfile] = useState(false);
  const handleShowProfile = (event) => {
    event.preventDefault();
    setShowProfile(!showProfile);
  };
  const handleClosePopupProfile = () => {
    setShowProfile(false);
  };

  
  return (
    <>
      <NavigationbarUser />
      {isLoading && <Loading />}

      {deleteAccount && <DeletePopup handleClose={handleClosePopupDelete} />}
      {showProfile && <ProfilePopup handleClose={handleClosePopupProfile} />}

      <form
        onSubmit={(e) => handleUpdate(e)}
        className="w-screen bg-[#FCFCFE] "
      >
        <div className=" flex flex-col w-[1440px] mx-auto font-nunito h-fit px-[255px] py-12 bg-[#FCFCFE] ">
          <div className="w-full mx-auto bg-[#FCFCFE]">
            <div className="flex flex-row justify-between items-center w-full ">
              <div>
                <h2 className="text-[#7B4429] text-sm">Profile</h2>
                <h1 className="text-[#A62D82] text-[46px] font-extrabold">
                  Let’s make profile <br />
                  to let others know you
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-[#95002B] transition-all duration-300  hover:scale-105  bg-[#FFE1EA] py-3 px-6 rounded-[99px] hover:bg-[#FFB1C8]"
                  onClick={handleShowProfile}
                >
                  Preview Profile
                </button>
                <button
                  type="submit"
                  className="text-[#FFFFFF] transition-all duration-300  hover:scale-105  bg-[#C70039] py-3 px-6 rounded-[99px] hover:bg-[#FF1659]"
                >
                  Update Profile
                </button>
              </div>
            </div>
            <h1 className="text-2xl text-[#A62D82] font-[700]  mt-20 mb-5">
              Basic Information
            </h1>
            <div className="info-container grid grid-cols-2 grid-rows-4 gap-5">
              <div>
                <h1>Name</h1>
                <label htmlFor="Name">
                  <input
                    className="border-[1px] border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                    type="text"
                    name="name"
                    placeholder="Jon Snow"
                    onChange={(e) => handleUpdateValue(e)}
                    value={initialUser?.name}
                  />
                </label>
              </div>
              <div>
                <h1>Date of birth</h1>
                <label htmlFor="Date">
                  <input
                    className=" border-[1px]  font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                    type="date"
                    name="birth_date"
                    value={initialUser?.birth_date}
                    onChange={(e) => handleUpdateValue(e)}
                    onClick={(e) => e.target.classList.add("text-black")}
                  />
                </label>
              </div>
              <div>
                <h1>Location</h1>
                <select
                  className=" border-[1px]  font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px] "
                  name="location"
                  value={initialUser?.location}
                  onChange={(e) => handleUpdateValue(e)}
                  onClick={(e) => e.target.classList.add("text-black")}
                >
                  <option value="">Select your country</option>
                  {countries
                    .sort((a, b) => {
                      return a > b ? 1 : -1;
                    })
                    .map((country, index) => (
                      <option value={country.country_name} key={index}>
                        {country.country_name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <h1>City</h1>
                <select
                  className=" border-[1px]  font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
                  name="city"
                  value={initialUser?.city}
                  onChange={(e) => handleUpdateValue(e)}
                  onClick={(e) => e.target.classList.add("text-black")}
                >
                  <option value="">Select your city</option>
                  {cities
                    .filter((city) => {
                      const filterCountries = CountryStateData.filter(
                        (country) => {
                          return country.country_id === city.country_id;
                        }
                      );
                      return filterCountries.some(
                        (filterCountry) =>
                          filterCountry.country_name === initialUser?.location
                      );
                    })
                    .sort((a, b) => {
                      return a > b ? -1 : 1;
                    })
                    .map((city, index) => {
                      return (
                        <option value={city.state_name} key={index}>
                          {city.state_name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <h1>Username</h1>
                <label htmlFor="Username">
                  <input
                    className=" border-[1px] border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                    type="text"
                    name="username"
                    placeholder="At least 6 characters"
                    value={initialUser?.username}
                    disabled
                  />
                </label>
              </div>

              <div>
                <h1>Email</h1>
                <label htmlFor="Email">
                  <input
                    className="border-[1px] text-[#9AA1B9] border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                    type="email"
                    name="email"
                    placeholder="Jon Snow"
                    value={initialUser?.email}
                    disabled
                  />
                </label>
              </div>
            </div>

            {/*------------------------section 2 ---------------------------- */}

            <h1 className="text-2xl text-[#A62D82] font-[700]  mb-5">
              Identities and Interests
            </h1>

            <div className="info-container grid grid-cols-2 grid-rows-2 gap-5">
              <div>
                <h1>Sexual identities </h1>
                <select
                  className=" border-[1px]  font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
                  name="sexual_identity"
                  value={initialUser?.sexual_identity}
                  onChange={(e) => handleUpdateValue(e)}
                  onClick={(e) => e.target.classList.add("text-black")}
                >
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div>
                <h1>Sexual preferences</h1>
                <select
                  className=" border-[1px]  font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
                  name="sexual_preference"
                  value={initialUser?.sexual_preference}
                  onChange={(e) => handleUpdateValue(e)}
                  onClick={(e) => e.target.classList.add("text-black")}
                >
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <h1>Racial preferences</h1>
                <select
                  className=" border-[1px]  font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
                  name="racial_preference"
                  value={initialUser?.racial_preference}
                  onChange={(e) => handleUpdateValue(e)}
                  onClick={(e) => e.target.classList.add("text-black")}
                >
                  <option value="Asian">Asian</option>
                  <option value="European">European</option>
                  <option value="Caucasian">Caucasian</option>
                  <option value="African">African</option>
                  <option value="Black">Black</option>
                </select>
              </div>
              <div>
                <h1>Meeting interests</h1>
                <select
                  className=" border-[1px]  font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
                  name="meeting_interest"
                  value={initialUser?.meeting_interest}
                  onChange={(e) => handleUpdateValue(e)}
                  onClick={(e) => e.target.classList.add("text-black")}
                >
                  <option value="Friends">Friends</option>
                  <option value="Partners">Partners</option>
                  <option value="Long-term commitment">
                    Long-term commitment
                  </option>
                  <option value="Short-term commitment">
                    Short-term commitment
                  </option>
                </select>
              </div>
            </div>
            <div className=" mt-[50px] ">
              <h1>Hobbies / Interests (Maximum 10)</h1>
              <div className="w-full flex flex-row items-start justify-start border-[#D6D9E4] border-t-[1px] border-r-[1px] border-b-[1px] border-l-[1px] rounded-lg">
                {initialUser?.hobbies?.length > 0 && (
                  <div className="border-[1px] border-none rounded-lg p-[8px]  text-[#9AA1B9] text-sm">
                    <ul className="flex flex-row ">
                      {initialUser?.hobbies?.map((hobby, index) => (
                        <li
                          key={index}
                          className="bg-[#F4EBF2] border-[#D6D9E4] mr-2 rounded-lg p-[6px] text-[#7D2262] text-[14px] flex items-center"
                        >
                          {hobby}
                          <button
                            className="border-none bg-transparent text-[#7D2262] ml-4 cursor-pointer"
                            onClick={(e) => deleteHobby(e, index)}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <input
                  className="border-[1px] font-normal border-none rounded-lg py-[12px] px-[12px] focus:outline-none w-full"
                  type="text"
                  name="hobbies"
                  value={newHobbies}
                  onChange={(e) => {
                    setNewHobbies(e.target.value);
                  }}
                  onKeyPress={handleKeyPress}
                  style={{ wordWrap: "break-word" }}
                />
              </div>

              <div className="mt-[24px]">
                <h1>About me (Maximum 150 characters)</h1>
                <label htmlFor="About me">
                  <textarea
                    className="border-[1px] border-[#D6D9E4] rounded-lg w-[931px] h-[120px] py-[12px] pr-[16px] pl-[12px] "
                    type="text"
                    name="about_me"
                    value={initialUser?.about_me}
                    onChange={(e) => handleUpdateValue(e)}
                  />
                </label>
              </div>
            </div>

            {/*------------------------section 3 ---------------------------- */}

            <div className="bg-[#FCFCFE] form-container w-full py-8 h-[500px]">
              <h1 className="text-2xl text-[#A62D82] font-[700] mb-1">
                Profile pictures
              </h1>
              <h2 className="mb-5">Upload at least 2 photos</h2>
              <div className="grid grid-cols-5 grid-rows-1 gap-2">
                {initialUser?.images?.map((image, index) => (
                  <div key={index}>
                    <div
                      className="w-[167px] h-[167px] bg-[#F1F2F6] rounded-2xl cursor-pointer relative z-0 "
                      onClick={() => handleImageClick(index)}
                      onDrop={(event) => handleImageDrop(event, index)}
                      onDragOver={(event) => handleDragOver(event)}
                      draggable={image?.image_url !== null}
                      onDragStart={(event) => handleDragStart(event, index)}
                      style={{
                        backgroundImage: `url(${image?.image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {image?.image_url === null && (
                        <div className="flex flex-col text-center justify-center items-center h-full transition-all duration-300  hover:scale-105 hover:bg-[#d0d0d0] hover:rounded-2xl active:scale-[0.8]">
                          <div>
                            <h1 className="text-[#7D2262] text-[30px]">+</h1>
                            <p className="text-[#7D2262] ">Upload photo</p>
                          </div>
                        </div>
                      )}

                      {image?.image_url !== null && (
                        <button
                          className="absolute -right-2 -top-1 cursor-pointer z-10 block rounded-full bg-[#AF2758] text-white h-6 w-6"
                          onClick={(event) => deleteImage(event, index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-20 mr-5">
              <button
                className="hover:underline hover:text-red-600 active:text-red-800"
                onClick={handleDeleteAccount}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
}

export default Profile;
