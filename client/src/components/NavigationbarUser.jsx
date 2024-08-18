import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authentication";
import React, { useState, useEffect } from "react";
import { notification, markNotificationAsRead } from "../utils/notification";
import jwtDecode from "jwt-decode";
import ProfilePopupMatching from "./ProfilePopupMatching";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image,
  MenuDivider,
} from "@chakra-ui/react";

function NavigationbarUser() {
  const [showProfile, setShowProfile] = useState(false);
  const { logout, state } = useAuth();
  const [userData, setUserData] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userDataFromToken = jwtDecode(token);
      const userId = userDataFromToken.user_id;
      const notify = await notification(userId);
      setNotifications(notify);
    }
  };

  const handleShowProfile = (user) => {
    setUserData(user);
    setShowProfile(!showProfile);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      {showProfile && (
        <ProfilePopupMatching
          handleCloseProfile={handleCloseProfile}
          user={userData}
        />
      )}
      <header className="font-nunito relative z-30 w-screen shadow-md">
        <div className="w-screen  flex flex-row justify-between items-center py-5 bg-white mx-auto">
          <nav className="ml-[12%]">
            <Link to="/" className="text-black font-semibold text-4xl">
              Merry
            </Link>
            <Link to="/" className="text-red-500 font-bold text-4xl">
              Match
            </Link>
          </nav>
          <nav className="mr-[12%]">
            <ul className="flex flex-row items-center">
              <li className="mr-[56px] text-base font-bold hover:text-[#191C77]">
                <a href="/matching">Start Matching!</a>
              </li>
              <li className="mr-[56px] text-base font-bold hover:text-[#191C77] ">
                <Link to="/merrypackage">Merry Membership</Link>
              </li>
              <Menu width="204px">
                <MenuButton
                  as={Button}
                  colorScheme="white"
                  _hover={{ scale: 125 }}
                >
                  <div>
                    <Image
                      src="/nav-bar/bell.svg"
                      alt="Notifications"
                      className="w-[48px] h-[48px] rounded-full cursor-pointer object-cover transition-all duration-300 hover:scale-125"
                    />
                  </div>
                </MenuButton>
                <MenuList borderRadius={12} width="254px" alignItems="center">
                  {notifications?.every((item) => item.noti_read) ? (
                    <MenuItem alignItems="center"> 
                      <div className="flex items-center px-[8px]">
                        <p className="block px-4 py-2 text-sm text-gray-700 ">
                          No new notification
                        </p>
                      </div>
                    </MenuItem>
                  ) : (
                    notifications?.map((item, index) => (
                      <MenuItem
                        _hover={{ borderRadius: 12 }}
                        key={index}
                        alignItems="center"
                      >
                        <div className="flex items-center px-[8px]">
                          <img
                            src={item.user.pictures[0].pic_url}
                            className="w-[32px] h-[32px] rounded-full bg-auto "
                            alt=""
                          />
                          <a
                            onClick={() => {
                              handleShowProfile(item.user);
                              markNotificationAsRead(item.noti_id);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 "
                          >
                            {item.noti_message}
                          </a>
                        </div>
                      </MenuItem>
                    ))
                  )}
                </MenuList>
              </Menu>

              <Menu width="204px">
                <MenuButton
                  as={Button}
                  colorScheme="white"
                  _hover={{ scale: 125 }}
                >
                  <div>
                    <Image
                      src={state?.user?.profilePic || null}
                      alt="Profile"
                      className="w-[48px] h-[48px] rounded-full cursor-pointer object-cover transition-all duration-300 hover:scale-125"
                    />
                  </div>
                </MenuButton>

                <MenuList borderRadius={12} width="204px" alignItems="center">
                  <MenuItem _hover={{ borderRadius: 12 }} alignItems="center">
                    <div className="flex items-center px-[8px]">
                      <img
                        src="/nav-bar/Vector.svg"
                        className="w-[13px] h-[13px] "
                        alt=""
                      />
                      <a
                        href="/profile"
                        className="block px-4 py-2  text-gray-700 "
                      >
                        Profile
                      </a>
                    </div>
                  </MenuItem>
                  <MenuItem _hover={{ borderRadius: 12 }}>
                    <div className="flex items-center px-[8px] ">
                      <img
                        src="/nav-bar/Vector2.png"
                        className="w-[13px] h-[13px] "
                        alt="icon"
                      />
                      <a
                        href="/merrylist"
                        className="block px-4 py-2  text-gray-700 "
                      >
                        Merry list
                      </a>
                    </div>
                  </MenuItem>

                  <MenuItem _hover={{ borderRadius: 12 }}>
                    <div className="flex items-center px-[8px] ">
                      <img
                        src="/nav-bar/Vector (3).svg"
                        className="w-[13px] h-[13px] "
                        alt="icon"
                      />
                      <a
                        href="/complaint"
                        className="block px-4 py-2  text-gray-700 "
                      >
                        Complaint
                      </a>
                    </div>
                  </MenuItem>

                  <MenuDivider />
                  <MenuItem _hover={{ borderRadius: 12 }}>
                    <div className="flex items-center px-[8px] border-gray ">
                      <img
                        src="/nav-bar/Vector (4).svg"
                        className="w-[13px] h-[13px] "
                        alt="icon"
                      />
                      <a
                        href="/"
                        className="block px-4 py-2  text-gray-700 "
                        onClick={() => {
                          logout();
                        }}
                      >
                        Log Out
                      </a>
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default NavigationbarUser;
