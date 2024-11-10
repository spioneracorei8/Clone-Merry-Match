import { useEffect, useState } from "react";
import NavigationbarNonUser from "../components/NavigationbarNonUser";
import RegisterForm1 from "../components/RegisterForm1";
import RegisterForm2 from "../components/RegisterForm2";
import RegisterForm3 from "../components/RegisterForm3";
import { useAuth } from "../contexts/authentication";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useToast } from "@chakra-ui/react";
import { instance } from "../constant/AxiosInstance";
import { previewUserModel } from "../models/user";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentFormPage, setCurrentFormPage] = useState(1);
  const [user, setUser] = useState(previewUserModel);
  const [isLoading, setIsLoading] = useState(null);

  const toast = useToast();

  const emailRegex =
    /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;
  const isValidEmail = emailRegex.test(user.email);

  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();
  const userBirthDate = user?.birth_date;
  let ageInYears;
  // if (user?.birth_date != "") {
  //   const [userBirthDateYear, userBirthDateMonth, userBirthDateDay] =
  //     userBirthDate?.split("-")?.map(Number);
  //   ageInYears =
  //     year -
  //     userBirthDateYear -
  //     (month < userBirthDateMonth ||
  //     (month === userBirthDateMonth && day < userBirthDateDay)
  //       ? 1
  //       : 0);
  // }

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  console.log(user);

  const handleUpdateValue = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const checkUsername = async (username) => {
    try {
      const response = await instance.get(`/auth/username/${username}`);
      const data = response.data;
      const isAvailable = data?.is_available;
      if (isAvailable) {
        return setIsUsernameAvailable(!isAvailable);
      } else {
        return setIsUsernameAvailable(!isAvailable);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    if (user?.username !== "") {
      setTimeout(() => {
        checkUsername(user?.username);
      }, 2000);
    }
  }, [user?.username]);

  // # Validation
  const handleNextStep = async () => {
    if (currentFormPage === 3) {
      setIsLoading(true);
      let countNullPhoto = 0;
      for (let i = 0; i < user?.photos?.length; i++) {
        const photo = user?.photos[i];
        if (photo === null) {
          countNullPhoto = countNullPhoto + 1;
        }
      }
      if (countNullPhoto >= 4) {
        toast({
          title: "Please upload at least 2 photos.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setIsLoading(false);
      } else {
        await register(user);
        // toast({
        //   title: "Account created.",
        //   description: "Your account has been created.",
        //   status: "success",
        //   duration: 3000,
        //   isClosable: true,
        //   position: "top",
        // });
        // navigate("/login");

        setIsLoading(false);
      }
    } else {
      if (!user?.username) {
        toast({
          title: "Username.",
          description: "Please enter username.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (!user?.name) {
        toast({
          title: "Name.",
          description: "Please enter name.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (user?.username.length < 6) {
        toast({
          title: "Username.",
          description: "Please enter at least 6 characters.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (isUsernameAvailable) {
        toast({
          title: "Username.",
          description: "Username already exists",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (!user?.email || !isValidEmail) {
        toast({
          title: "Email.",
          description: "Please provide a valid email address.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (!user?.password) {
        toast({
          title: "Email.",
          description: "Please enter password.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (user?.password.length < 8) {
        toast({
          title: "Password.",
          description: "Please enter at least 8 characters.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (user?.password !== user?.confirm_password) {
        toast({
          title: "Password.",
          description: "Passwords do not match.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (ageInYears < 18) {
        toast({
          title: "Users must be at least 18 years or older",
          position: "top",
          isClosable: true,
        });
      } else {
        setCurrentFormPage(currentFormPage + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentFormPage === 1) {
      return null;
    } else {
      setCurrentFormPage(currentFormPage - 1);
    }
  };

  return (
    <div>
      <NavigationbarNonUser />
      {isLoading && <Loading />}
      <div className="bg-[#FCFCFE] font-nunito">
        <div className=" relative  h-fit px-[255px] py-12 bg-[#FCFCFE] flex items-center w-[1440px] mx-auto">
          <div className="bg-[#FAF1ED] absolute h-[100px] w-[100px] rounded-full top-[85px] left-[-19px]" />
          <div className="bg-[#7B4429] absolute h-[8px] w-[8px] rounded-full top-[210px] left-[81px]" />
          <div className="bg-[#FAF1ED] absolute h-[8px] w-[8px] rounded-full top-[605px] right-[1px]" />
          <div className="text-container flex flex-col w-1/2 h-1/3 pt-6 mt-[29px]">
            <h1 className="text-[#7B4429]">REGISTER</h1>
            <h2 className="text-[#A62D82] text-[46px] font-extrabold">
              Join us and start <br /> matching
            </h2>
          </div>
          <div
            className={`tabs-container rounded-2xl tabs-container flex w-1/2 h-full justify-items-center items-center ${
              currentFormPage === 2 ? "gap-6" : "gap-4"
            }`}
          >
            <div
              className={`border-4 border-[#E4E6ED] px-[16px] ${
                currentFormPage === 1 ? "w-auto" : "w-[80px]"
              } h-[80px] rounded-[16px] flex justify-evenly items-center transition duration-300  transform ${
                currentFormPage === 1 ? "scale-110" : ""
              } ${currentFormPage !== 1 ? "scale-100" : ""}`}
            >
              <div
                className={`w-[48px] h-[48px] rounded-[16px] bg-[#F1F2F6] flex flex-row justify-center items-center font-bold text-[24px] ${
                  currentFormPage === 1 ? "text-[#A62D82]" : "text-[#9AA1B9]"
                }`}
              >
                1
              </div>
              <div className={`${currentFormPage > 1 ? "hidden" : ""}`}>
                <div className="text-[12px] px-[16px] font-medium text-[#646D89]">
                  Step {currentFormPage}/3
                </div>
                <div className="text-base px-[16px] font-extrabold text-[#A62D82]">
                  Basic Information
                </div>
              </div>
            </div>
            <div
              className={`border-4 border-[#E4E6ED] px-[16px] ${
                currentFormPage === 2 ? "w-auto " : "w-[80px]"
              } h-[80px] rounded-[16px] flex justify-evenly items-center transition duration-300  transform ${
                currentFormPage === 2 ? "scale-110" : ""
              } ${currentFormPage !== 2 ? "scale-100" : ""}`}
            >
              <div
                className={`w-[48px] h-[48px] rounded-[16px] bg-[#F1F2F6] flex flex-row justify-center items-center font-bold text-[24px] ${
                  currentFormPage === 2 ? "text-[#A62D82]" : "text-[#9AA1B9]"
                }`}
              >
                2
              </div>
              <div className={`${currentFormPage != 2 ? "hidden" : ""}`}>
                <div className="text-[12px] px-[16px] font-medium text-[#646D89]">
                  Step {currentFormPage}/3
                </div>
                <div className="text-base px-[16px] font-extrabold text-[#A62D82]">
                  Identities and Interests
                </div>
              </div>
            </div>
            <div
              className={`border-4 border-[#E4E6ED] w-[80px] h-[80px] rounded-[16px] flex flex-row justify-center items-center ${
                currentFormPage === 3 ? "w-auto px-3" : "w-[80px]"
              } transition duration-300  transform ${
                currentFormPage === 3 ? "scale-110" : ""
              } ${currentFormPage !== 3 ? "scale-100" : ""}`}
            >
              <div
                className={`w-[48px] h-[48px] rounded-[16px] bg-[#F1F2F6] flex flex-row items-center  justify-center text-[#9AA1B9] font-bold text-[24px] ${
                  currentFormPage === 3 ? "text-[#A62D82]" : "text-[#9AA1B9]"
                }`}
              >
                3
              </div>
              <div className={`${currentFormPage != 3 ? "hidden" : ""}`}>
                <div className="text-[12px] px-[16px] font-medium text-[#646D89]">
                  Step {currentFormPage}/3
                </div>
                <div className="text-base px-[16px] font-extrabold text-[#A62D82]">
                  Upload Photos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <form onSubmit={handleSubmit}> */}
        {currentFormPage === 1 && (
          <RegisterForm1
            user={user}
            setUser={setUser}
            handleUpdateValue={handleUpdateValue}
          />
        )}
        {currentFormPage === 2 && (
          <RegisterForm2
            user={user}
            setUser={setUser}
            handleUpdateValue={handleUpdateValue}
          />
        )}
        {currentFormPage === 3 && (
          <RegisterForm3
            user={user}
            setUser={setUser}
            handleUpdateValue={handleUpdateValue}
          />
        )}
        {/* </form> */}

        <div className="relative z-30 w-full border-t-2">
          <div className="w-[77%] flex flex-row justify-between items-center h-auto py-5 bg-white mx-auto ">
            <nav className="">
              <a href="#" className=" font-[400] text-base text-[#646D89]">
                {currentFormPage}/3
              </a>
            </nav>
            <nav>
              <div className="flex flex-row mx-3">
                <div className="m-3 text-base font-bold hover:text-[#191C77]">
                  <button
                    onClick={handleBack}
                    className="text-[#C8CCDB] font-semibold mr-[17px] font-weight: bold; hover:text-[#191C77]"
                  >
                    Back
                  </button>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold  px-6 rounded-full"
                  onClick={handleNextStep}
                  type="submit"
                >
                  {currentFormPage === 3 ? "Confirm" : "Next step"}
                </button>
              </div>
            </nav>
          </div>
        </div>
        {/* <DraggableList /> */}
      </div>
    </div>
  );
}

export default RegisterPage;
