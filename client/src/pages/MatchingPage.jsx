import { sendNotification } from "../utils/notification";
import NavigationbarUser from "../components/NavigationbarUser";
import React, { useState, useMemo, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import eye_button from "/matching/eye_button.svg";
import axios from "axios";
import jwtDecode from "jwt-decode";
import ProfilePopupMatching from "../components/ProfilePopupMatching";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import Loading from "../components/Loading";

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import useData from "../hook/useData";
import { useAuth } from "../contexts/authentication";
import mini_heart from "/matching/mini_heart.svg";
import { useNavigate } from "react-router-dom";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function MatchingPage() {
  const [matchingList, setMatchingList] = useState([]);
  const [childRefs, setChildRefs] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const [usersData, setUsersData] = useState([]);

  const [senderId, setSenderId] = useState(0);
  const [receiverId, setReceiverId] = useState(0);
  const { merryMatchList, userLoveSwipeRight, userRejectSwipeLeft } = useData();
  const { state } = useAuth();
  const navigate = useNavigate();
  const [matchingListPictures, setMatchingListPictures] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [meetingInterest, setMeetingInterest] = useState([]);
  const [firstMeetingInterest, setFirstMeetingInterest] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);
  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };
  const getMatchingProfile = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    if (token) {
      const userDataFromToken = jwtDecode(token);

      const result = await axios.get(
        `http://localhost:3000/users/merrymatch/${userDataFromToken.user_id}`
      );
      let matchingData = result.data;
      const newMatchingList = [];

      for (let i = 0; i < matchingData.length; i++) {
        newMatchingList.push(result.data[i]);
      }

      setMatchingList(newMatchingList);
      setCurrentIndex(newMatchingList.length - 1);
      setChildRefs(newMatchingList.map(() => React.createRef()));
      setFirstMeetingInterest(userDataFromToken.meeting_interest);
      setMeetingInterest([userDataFromToken.meeting_interest]);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token");
    event.preventDefault();

    if (token) {
      try {
        const userDataFromToken = jwtDecode(token);

        const params = {
          keyword: keyword,
          meeting_interest: meetingInterest.join(","),
          min_age: minAge,
          max_age: maxAge,
        };

        const result = await axios.get(
          `http://localhost:3000/users/merrymatch/${userDataFromToken.user_id}`,
          {
            params: params,
          }
        );

        let matchingData = result.data;
        const newMatchingList = [];

        for (let i = 0; i < matchingData.length; i++) {
          newMatchingList.push(result.data[i]);
        }

        setMatchingList(newMatchingList);
        setCurrentIndex(newMatchingList.length - 1);
        setChildRefs(newMatchingList.map(() => React.createRef()));
      } catch (error) {
        console.error("Error decoding the token or fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    getMatchingProfile();
  }, []);

  // ----------------------------
  const handleCheckboxChange = (event) => {
    const value = event.target.value;

    if (event.target.checked) {
      setMeetingInterest((prevMeetingInterest) => [
        ...prevMeetingInterest,
        value,
      ]);
    } else {
      setMeetingInterest((prevMeetingInterest) =>
        prevMeetingInterest.filter((item) => item !== value)
      );
    }
  };

  const handleRangeChange = (newRange) => {
    setMinAge(newRange[0]);
    setMaxAge(newRange[1]);
  };

  const handleMinChange = (event) => {
    setMinAge(parseInt(event.target.value));
  };

  const handleMaxChange = (event) => {
    setMaxAge(parseInt(event.target.value));
  };

  const handleClear = (event) => {
    event.preventDefault();
    setKeyword("");
    setMeetingInterest([]);
    window.location.reload();
  };

  const currentIndexRef = useRef(currentIndex);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < matchingList.length - 1;

  const canSwipe = currentIndex >= 0;

  const [merryMatch, setMerryMatch] = useState(false);
  const [showName, setShowName] = useState(true);
  const [showEye, setShowEye] = useState(true);

  const swiped = (direction, nameToDelete, index, userId) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    if (direction === "right") {
      handleSwipeRight(userId);
    } else if (direction === "left") {
      handleSwipeLeft(userId);
    }
  };

  const handleSwipeRight = async (userId) => {
    try {
      await userLoveSwipeRight(state?.user?.user_id, { newUserId: userId });
      const matchingUser = matchingList.find((item) => item.user_id === userId);
      const merryMatching = merryMatchList.find((match) => {
        return (
          match.user_id === state?.user?.user_id && match.mer_id === userId
        );
      });

      if (merryMatching) {
        setReceiverId(userId);
        setSenderId(state?.user?.user_id);
        setMerryMatch(true);
        setShowName(false);
        setShowEye(false);

        if (matchingUser) {
          const pictureUrl = matchingUser.pictures[0]?.pic_url;
          setMatchingListPictures(pictureUrl);
        }
      }
      await sendNotification(userId, state?.user?.user_id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwipeLeft = (userId) => {
    try {
      setMerryMatch(false);
      return userRejectSwipeLeft(state?.user?.user_id, {
        rejectUserId: userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSwiped = useMemo(
    () =>
      debounce((direction, nameToDelete, index, userId) => {
        setLastDirection(direction);
        updateCurrentIndex(index - 1);

        if (direction === "right") {
          handleSwipeRight(userId);
        } else if (direction === "left") {
          handleSwipeLeft(userId);
        }
      }, 200),
    []
  );

  const handleChat = (senderID, receiverID) => {
    try {
      navigate("/chat", { state: { senderID, receiverID } });
    } catch (error) {
      console.error(error);
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < matchingList.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const handleShowProfile = (user, isMatching) => {
    setIsMatching(isMatching);
    setSelectedUser(user);
    setShowProfile(!showProfile);
  };
  const handleCloseProfile = () => {
    setShowProfile(false);
    setIsMatching(false);
  };
  const handleUserContinueMatching = () => {
    setMerryMatch(false);
    setShowName(true);
    setShowEye(true);
    window.location.reload();
  };
  // -------------------------------------
  const getMerryList = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userDataFromToken = jwtDecode(token);

        const result = await axios.get(
          `http://localhost:3000/merrylist/${userDataFromToken.user_id}`
        );
        setUsersData(result.data);
      } catch (error) {
        console.error("Error decoding the token or fetching user data:", error);
      }
    }
  };
  useEffect(() => {
    getMerryList();
  }, []);

  return (
    <>
      <NavigationbarUser />
      {isLoading && <Loading />}
      {showProfile && (
        <ProfilePopupMatching
          user={selectedUser}
          handleCloseProfile={handleCloseProfile}
          isMatching={isMatching}
        />
      )}
      <div className="font-nunito mx-auto w-[1440px] h-[936px] flex flex-row relative">
        {merryMatch && (
          <div className="flex justify-center items-center  fixed z-50 w-full h-auto p-4 bg-[#350139] bg-opacity-50 inset-0">
            <div className="flex flex-col justify-center  items-center ml-[200px] mt-24 max-w-full h-auto pt-14 px-24 pb-20 rounded-3xl relative">
              <img
                src={matchingListPictures}
                alt=""
                className="h-[680px] w-[680px] object-cover bg-center rounded-3xl mr-7 mb-[192px]"
              />

              <div className="mb-10 z-50">
                <img
                  src={mini_heart}
                  alt="Mini heart"
                  className="absolute right-[445px] top-[390px]  animate-bounce z-50 "
                />

                <img
                  src={mini_heart}
                  alt="Mini heart"
                  className="absolute right-[410px] top-[390px] animate-bounce z-50"
                />
              </div>

              <h1
                className="text-red-500 font-black text-5xl pb-10 absolute top-[440px]"
                style={{
                  WebkitTextStrokeWidth: "2px",
                  WebkitTextStrokeColor: "white",
                }}
              >
                Merry Match
              </h1>
              <div className="flex justify-center items-center font-nonito">
                <button
                  className="bg-red-100 py-4 px-6 rounded-full mt-14 text-red-700 duration-300 transition-all hover:scale-125 hover:bg-[#ffb3ca]  hover:text-[#95002B] font-semibold text-base absolute top-[490px]"
                  onClick={() => handleChat(senderId, receiverId)}
                >
                  Start Conversation
                </button>
                <button
                  className="bg-red-100 py-4 px-6 rounded-full mt-14 text-red-700 font-semibold text-base absolute top-[560px] duration-300 transition-all hover:scale-125 hover:bg-[#ffb3ca]  hover:text-[#95002B]"
                  onClick={() => handleUserContinueMatching()}
                >
                  Continue Matching...
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="w-[316px]">
          <div className="w-[316px] border-b-[1px] border-gray-400">
            <div className="w-[282px] mx-auto py-[36px]">
              <div className="flex flex-col justify-center items-center p-6 gap-1 bg-[#F6F7FC] border-[1px] border-[#A62D82] rounded-2xl">
                <img src="/matching/vector (5).svg" alt="search heart" />
                <h1 className="text-[#95002B] font-bold text-xl">
                  Discover New Match
                </h1>
                <p className="text-[#646D89] text-center text-sm">
                  Start find and Merry to get know <br /> and connect with new
                  friend!
                </p>
              </div>
            </div>
          </div>
          <div className="w-[282px] mx-auto py-[36px]">
            <h1 className="text-[#191C77] font-bold text-lg">Merry Match!</h1>
            <div className="flex flex-row pt-1 gap-3 w-full h-[120px]">
              {usersData.filter(
                (user) => user.merry_status[0].mer_status === "MerryMatch"
              ).length <= 2 && (
                <div className="flex ">
                  {usersData
                    .filter(
                      (user) => user.merry_status[0].mer_status === "MerryMatch"
                    )
                    .map((user, index) => (
                      <div key={index}>
                        <button
                          className="relative mr-[16px]"
                          onClick={() => handleShowProfile(user)}
                        >
                          <img
                            src={user.pictures[0]?.pic_url || null}
                            alt={user.name}
                            className="w-[100px] object-cover h-[100px] border-[1px] rounded-2xl"
                          />
                          <img
                            src={"/matching/merry match.svg"}
                            className="absolute bottom-0 right-0"
                          />
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {usersData.filter(
                (user) => user.merry_status[0].mer_status === "MerryMatch"
              ).length > 2 && (
                <Swiper
                  spaceBetween={1}
                  slidesPerView={2.5}
                  grabCursor={true}
                  initialSlide={0}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  style={{ "--swiper-pagination-bottom": "-5px" }}
                  className="mySwiper"
                >
                  <div>
                    {usersData
                      .filter(
                        (user) =>
                          user.merry_status[0].mer_status === "MerryMatch"
                      )
                      .map((user, index) => (
                        <SwiperSlide key={index}>
                          <button
                            className="relative"
                            onClick={() => handleShowProfile(user)}
                          >
                            <img
                              src={user.pictures[0]?.pic_url || null}
                              alt={user.name}
                              className="w-[100px] object-cover h-[100px] border-[1px] rounded-2xl"
                            />
                            <img
                              src={"/matching/merry match.svg"}
                              className="absolute bottom-0 right-0"
                            />
                          </button>
                        </SwiperSlide>
                      ))}
                  </div>
                </Swiper>
              )}
            </div>
          </div>
          <div className="w-[282px] mx-auto pt-[12px]">
            <h1 className="text-[#191C77] font-bold text-lg">
              Chat with Merry Match
            </h1>
            {usersData
              .filter(
                (user) => user.merry_status[0].mer_status === "MerryMatch"
              )
              .map((user, index) => (
                <div
                  key={index}
                  className="flex hover:bg-gray-100 hover:rounded-[16px] hover:cursor-pointer active:bg-gray-200 flex-row justify-evenly py-2 "
                  onClick={() => handleChat(state?.user?.user_id, user.user_id)}
                >
                  <img
                    src={user.pictures[0]?.pic_url || null}
                    alt={user.name}
                    className="object-cover w-[60px] h-[60px] border-[1px] border-[#A62D82] rounded-full"
                  />
                  <div>
                    <p className="font-[400] text-[#2A2E3F] text-[16px]">
                      {user.name}
                    </p>
                    <p className="font-[500] text-[#646D89] text-[14px]">
                      {`Start chatting with ${user.name}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ------------------------section 2 ----------------------------  */}
        <div
          className="bg-[#160404] 
            flex flex-col justify-center col-span-3 w-[904px]  overflow-hidden"
        >
          <div className="relative w-[620px] h-[620px] rounded-[32px]">
            {matchingList.map((item, index) => (
              <TinderCard
                ref={childRefs[index]}
                className=" absolute top-0 left-32 w-full h-full rounded-[32px] bg-gradient-to-t from-[#390741] to-[#070941] cursor-grab active:cursor-grabbing"
                key={item.user_id}
                onSwipe={(dir) => {
                  debouncedSwiped(dir, item.name, index, item.user_id);
                  swiped(dir, item.name, index, item.user_id);
                }}
                onCardLeftScreen={() => outOfFrame(item.name, index)}
              >
                <div
                  style={{
                    backgroundImage:
                      "url(" + (item.pictures[0]?.pic_url || null) + ")",
                  }}
                  className="z-30 bg-cover bg-center card h-full w-full flex items-end px-4 py-3 text-white rounded-[32px] bg-gradient-to-t from-[#390741] to-[#070941]"
                >
                  {showName && (
                    <h3 className="z-40 pb-8 pl-3 font-bold text-3xl text-white pointer-events-none ">
                      {item.name} {calculateAge(item.birthDate)}
                    </h3>
                  )}
                  {showEye && (
                    <button
                      onClick={() => handleShowProfile(item)}
                      className="z-40 mb-8 ml-4 bg-white/[.2] rounded-full flex items-center justify-center w-8 h-8"
                    >
                      <div>
                        <img
                          src={eye_button}
                          alt="Eye"
                          className=" pointer-events-none"
                        />
                      </div>
                    </button>
                  )}
                </div>
                <div
                  style={{
                    backgroundImage:
                      "linear-gradient(360deg, #390741, rgba(7, 9, 65, 0) 70.71%)",
                  }}
                  className="z-20 rounded-[32px] bottom-0 absolute w-full h-2/6"
                />
              </TinderCard>
            ))}
          </div>
          <div className=" flex justify-center gap-2">
            <img
              src="/popup/action button.svg"
              className="transform hover:scale-110 transition duration-300  active:scale-90 cursor-pointer"
              onClick={() => swipe("left")}
            />

            <img
              src="/popup/action button (1).svg"
              className="transform hover:scale-110 transition duration-300 active:scale-90 cursor-pointer"
              onClick={() => swipe("right")}
            />
          </div>
        </div>
        {/* ------------------------section 3 ----------------------------  */}
        <form
          onSubmit={handleSubmit}
          className="w-[210px] flex flex-row justify-center"
        >
          <div className=" flex flex-col items-center  w-[188px] mx-auto>">
            <div className="flex flex-col gap-10 mb-[170px]">
              <div className="mt-6 flex flex-col gap-5">
                <h1 className="text-[#191C77] font-bold">Search by Keywords</h1>
                <input
                  placeholder="Search..."
                  type="text"
                  value={keyword}
                  className="py-3 border-[1px] w-[168px] px-[10px] border-[#CCD0D7] rounded-lg "
                  onChange={(event) => {
                    setKeyword(event.target.value);
                  }}
                />
              </div>

              <div className="flex flex-col gap-3 ">
                <h1 className="text-[#191C77] font-bold">
                  Relationship Interest
                </h1>
                <div className="flex">
                  {firstMeetingInterest === "Friends" ? (
                    <input
                      type="checkbox"
                      id="Friends"
                      name="Friends"
                      value="Friends"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                      onClick={() => setFirstMeetingInterest("")}
                      checked
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id="Friends"
                      name="Friends"
                      value="Friends"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                    />
                  )}
                  <label htmlFor="sex1" className="ml-[12px] text-[#646D89]">
                    Friends
                  </label>
                </div>
                <div className="flex mt-[16px]">
                  {firstMeetingInterest === "Partners" ? (
                    <input
                      type="checkbox"
                      id="Partners"
                      name="Partners"
                      value="Partners"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                      onClick={() => setFirstMeetingInterest("")}
                      checked
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id="Partners"
                      name="Partners"
                      value="Partners"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                    />
                  )}

                  <label htmlFor="sex2" className="ml-[12px] text-[#646D89]">
                    Partners
                  </label>
                </div>
                <div className="flex mt-[16px]">
                  {firstMeetingInterest === "Short-term commitment" ? (
                    <input
                      type="checkbox"
                      id="Short-term commitment"
                      name="Short-term commitment"
                      value="Short-term commitment"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                      onClick={() => setFirstMeetingInterest("")}
                      checked
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id="Short-term commitment"
                      name="Short-term commitment"
                      value="Short-term commitment"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                    />
                  )}

                  <label htmlFor="sex3" className="ml-[12px] text-[#646D89]">
                    Short-term
                  </label>
                </div>
                <div className="flex mt-[16px]">
                  {firstMeetingInterest === "Long-term commitment" ? (
                    <input
                      type="checkbox"
                      id="Long-term commitment"
                      name="Long-term commitment"
                      value="Long-term commitment"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                      onClick={() => setFirstMeetingInterest("")}
                      checked
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id="Long-term commitment"
                      name="Long-term commitment"
                      value="Long-term commitment"
                      className="w-[24px] h-[24px] rounded-lg accent-pink-500"
                      onChange={handleCheckboxChange}
                    />
                  )}

                  <label htmlFor="sex3" className="ml-[12px] text-[#646D89]">
                    Long-term
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <label htmlFor="age-range" className="text-[#191C77] font-bold">
                  Age Range
                </label>
                <div className="relative w-full">
                  <RangeSlider
                    aria-label={["min", "max"]}
                    colorScheme="pink"
                    defaultValue={[minAge, maxAge]}
                    min={18}
                    max={100}
                    onChange={handleRangeChange}
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between mt-[40px]">
                    <input
                      type="number"
                      id="min"
                      value={minAge}
                      onChange={handleMinChange}
                      min={18}
                      max={maxAge}
                      className="border-[1px] mr-[4px] border-[#D6D9E4] py-3 pr-4 pl-3 w-[85.5px] h-[48px] rounded-lg"
                    />
                    <div className="mt-[10px]"> - </div>
                    <input
                      type="number"
                      id="max"
                      value={maxAge}
                      onChange={handleMaxChange}
                      min={minAge}
                      max={100}
                      className="border-[1px] ml-[4px] border-[#D6D9E4] py-3 pr-4 pl-3 w-[85.5px] h-[48px] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[210px]  flex justify-center items-center border-t-[1px] border-gray-400">
              <div className="flex justify-center items-center w-[188px]  pt-6 ">
                <h1
                  onClick={handleClear}
                  className="py-3 px-6 text-[#C70039] hover:underline transition-all duration-300  hover:scale-105 hover:text-[#FF1659] hover:cursor-pointer"
                >
                  Clear
                </h1>
                <button
                  type="submit"
                  className="py-3 px-6 bg-[#C70039] rounded-[99px]  text-white transition-all duration-300  hover:scale-105 hover:bg-[#FF1659] "
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default MatchingPage;
