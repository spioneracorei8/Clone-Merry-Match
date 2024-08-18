import { Link } from "react-router-dom/";
import NavigationbarNonUser from "../components/NavigationbarNonUser";
import { useAuth } from "../contexts/authentication";
import { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState("false");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { login } = useAuth();
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsError(false);
    setIsSubmitted(true);
    login({
      username,
      password,
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        setIsError(true);
      }
    });
  };

  return (
    <>
      <NavigationbarNonUser />
      <div className="w-[1440px] mx-auto font-nunito">
        <div className="w-[1150px] mx-auto flex flex-row justify-between items-center h-auto py-5 bg-white ">

          <img
            src="/login/image (3).svg"
            alt="man"
            className="relative w-[450px] h-[677px]  mt-[80px]"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-[#7B4429] mt-5">LOGIN</p>
            <h1 className="text-5xl font-extrabold text-[#A62D82] mb-5 leading-tight">
              Welcome back to <br /> Merry Match
            </h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-600 text-base font-normal mt-3">
                  Username
                </label>
                <input
                  className="shadow appearance-none border mt-[5px] rounded-[8px]  w-full h-[48px] py-2 px-3 text-gray-700 leading-tight focus:outline-red-500 focus:shadow-red-500 transition-all duration-500"
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  required
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                  value={username}
                />
                <label className="block text-gray-600 text-base font-normal mt-8">
                  Password
                </label>
                <input
                  className="shadow appearance-none border mt-[5px] rounded-[8px] w-full  h-[48px] py-2 px-3 text-gray-700 leading-tight focus:outline-red-500 focus:shadow-red-500 transition-all duration-500"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  value={password}
                />
                <div
                  className={`error-message-container h-5 text-red-600 pt-2 ${isError && isSubmitted ? "opacity-100" : "opacity-0"
                    } pointer-events-none`}
                >
                  Invalid username/password
                </div>
                <button
                  type="submit"
                  className="block h-12 bg-[#C70039] w-full  transition-all duration-300 hover:bg-[#ff2563] text-white text-base font-bold px-56 rounded-full my-10"
                >
                  Log in
                </button>
                <div className="my-6">
                  <span className="text-base font-normal">
                    Don't have an account?
                  </span>
                  <Link to="/register">
                    <button className="text-base font-bold text-red-500 border-b-2 border-transparent hover:border-[#A62D82] hover:text-[#A62D82] mx-3">
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
