import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { instance } from "../constant/AxiosInstance";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    user: null,
  });

  const [userParam, setUserParam] = useState("");
  const [complaintStatus, setComplaintStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  console.log(state);
  const updateProfilePic = (picURL) => {
    setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState?.user,
        profile_pictures: [
          { ...prevState?.user?.profile_pictures[0], image_url: picURL },
          ...prevState?.user?.profile_pictures?.slice(1),
        ],
        // profile_pictures: [
        //   picURL,
        //   ...prevState?.user?.profile_pictures?.slice(1),
        // ],
      },
    }));
  };

  const login = async (data) => {
    try {
      const result = await instance.post("/auth/login", data);
      const token = result.data.token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);
      setState({ ...state, user: userDataFromToken });
      navigate("/");
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const register = async (data) => {
    try {
      const result = await instance.post(`/auth/register`, data);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ ...state, user: null });
    navigate("/");
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  if (isAuthenticated && !state.user) {
    const token = localStorage.getItem("token");
    const userDataFromToken = jwtDecode(token);
    setState({ ...state, user: userDataFromToken, loading: false });
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        setState,
        login,
        logout,
        register,
        isAuthenticated,
        updateProfilePic,
        userParam,
        setUserParam,
        isLoading,
        setIsLoading,
        setComplaintStatus,
        complaintStatus,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
