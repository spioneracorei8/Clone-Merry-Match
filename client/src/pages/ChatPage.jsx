import NavigationbarUser from "../components/NavigationbarUser";
import React, { useState, useEffect } from "react";
import useData from "../hook/useData";
import { useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import ProfilePopupMatching from "../components/ProfilePopupMatching";

function ChatPage() {
  const {
    chatMessage,
    sendingChatMessage,
    conversation,
  } = useData();
  const { state } = useLocation();
  const senderID = state.senderID;
  const receiverID = state.receiverID;
  const navigate = useNavigate();
  const [senderId, setSenderId] = useState(null)
  const [message, setMessege] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userMatch, setUserMatch] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message !== "" || event.key === "Enter") {
      sendingChatMessage(senderID, receiverID, message);
      chatMessage(senderID, receiverID);
      setMessege("");
    } else {
      alert("Enter message box");
    }
  };

  const getMerryList = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userDataFromToken = jwtDecode(token);
        const result = await axios.get(
          `http://localhost:3000/merrylist/${userDataFromToken.user_id}`
        );
        setSenderId(userDataFromToken);
        setUsersData(result.data);
      } catch (error) {
        console.error("Error decoding the token or fetching user data:", error);
      }
    }
  };

  const handleChat = (senderID, receiverID) => {
    try {
      navigate("/chat", { state: { senderID, receiverID } });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
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

  useEffect(() => {
    const timer = setTimeout(() => {
      chatMessage(senderID, receiverID);
    }, 1000)

    return () => clearTimeout(timer);
  }, [conversation]);

  useEffect(() => {
    chatMessage(senderID, receiverID);
    getMerryList();
    if (handleChat) {
      getMerryList()
    }
  }, []);

  useEffect(() => {
    if (usersData.length > 0) {
      const filteredData = usersData.filter((user) => {
        return user.merry_status.some(
          (status) => status.mer_status === "MerryMatch"
        );
      });
      setUserMatch(filteredData);
    }
  }, [usersData]);


  return (
    <>
      <NavigationbarUser />

      {showProfile && (
        <ProfilePopupMatching
          user={selectedUser}
          handleCloseProfile={handleCloseProfile}
          isMatching={isMatching}
        />
      )}

      <div className="font-nunito mx-auto w-[1440px] h-[936px] flex flex-row relative">
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
              ).length <= 2 &&
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
              }

              {usersData.filter(
                (user) => user.merry_status[0].mer_status === "MerryMatch"
              ).length > 2 &&

                <Swiper
                  spaceBetween={1} slidesPerView={2.5} grabCursor={true} initialSlide={0}
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
                        (user) => user.merry_status[0].mer_status === "MerryMatch"
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
              }
            </div>
          </div>
          <div className="w-[282px] mx-auto pt-[12px]">
            <h1 className="text-[#191C77] font-bold text-lg">
              Chat with Merry Match
            </h1>
            {userMatch.map((user, index) => (
              <div
                key={index}
                className="flex hover:bg-gray-100 hover:rounded-[16px] hover:cursor-pointer active:bg-gray-200 flex-row  py-3 "
                onClick={() => handleChat(senderId?.user_id, user?.user_id)}
              >
                <img
                  src={user.pictures[0]?.pic_url || null}
                  alt={user.name}
                  className="object-cover mx-[12px]  w-[60px] h-[60px] border-[1px] border-[#A62D82] rounded-full"
                />
                <div className="flex flex-col justify-center">
                  <p className="font-[400] text-[#2A2E3F] text-[16px]">
                    {user.name}
                  </p>
                  <p className="font-[500] text-[#646D89] text-[14px]">
                    Start chat with {user.name}!
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black flex flex-col justify-end col-span-3 w-full">
          <div className="w-full h-[836px] flex flex-row justify-center pt-[50px]  ">
            {userMatch
              .filter((user) => user.user_id === receiverID)
              .map((user, index) => (
                <div className="flex flex-col w-full" key={index}>
                  <div className="flex items-center justify-center">
                    <div className="w-[750px] h-[90px] flex flex-row justify-center  items-center bg-[#F4EBF2] border-[1px] border-[#DF89C6] rounded-2xl">
                      <img
                        src="/chat/merry match.svg"
                        alt="merry match"
                        className=" pr-[27px] animate-bounce"
                      />
                      <p className="text-[#64001D]">
                        {` Now you and ${user.name} are Merry Match! `}
                        <br />
                        You can messege something nice and make a good
                        conversation. Happy Merry!
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse h-full bg-black overflow-y-auto mx-14 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {conversation.map((message, index) => (
                      <div
                        key={index}
                        className={`${message.sender_id === senderID
                          ? "ml-auto max-w-md h-auto "
                          : "mr-auto max-w-md h-auto"
                          } my-3 relative`}
                      >
                        <div
                          className={`${message.sender_id === senderID
                            ? "bg-[#931475] text-white rounded-t-3xl rounded-l-3xl"
                            : "bg-[#ffcde6] text-black rounded-t-3xl rounded-r-3xl"
                            } p-4 `}
                        >
                          <p>{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="w-full h-[100px] bg-black border-t-[1px] flex flex-row border-gray-200 items-center justify-center ">
              <img
                src="/matching/mini_heart.svg"
                alt="upload image"
                className="w-[45px] h-[45px] mr-[10px]"
              />
              <input
                type="text"
                className="w-[908px] h-[50px] px-[15px] bg-black placeholder:italic placeholder:text-slate-400 focus:outline-none text-white rounded-lg"
                placeholder="Message here..."
                value={message}
                onChange={(event) => {
                  setMessege(event.target.value);
                }}
                style={{ wordWrap: "break-word" }}
              />
              <button type="submit">
                <img
                  src="/chat/send button.svg"
                  alt="send button"
                  className="w-[70px] h-[70px] ml-[10px]"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
