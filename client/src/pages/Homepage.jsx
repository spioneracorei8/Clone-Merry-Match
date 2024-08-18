import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import NavigationbarUser from "../components/NavigationbarUser";
import NavigationbarNonUser from "../components/NavigationbarNonUser";
import { useAuth } from "../contexts/authentication";

function Homepage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? <NavigationbarUser /> : <NavigationbarNonUser />}
      <div className="bg-[#160404]">
        <div className="font-nunito w-[1440px] mx-auto bg-[#160404]">
          <div className=" w-[1440px] ">
            <div className="w-full h-[758px] bg-[#160404] relative flex justify-center items-center">
              <img
                src="/homepage/image (1).svg"
                className="w-[357px] h-[500px] absolute left-40 bottom-0"
              />
              <div className="flex flex-col justify-center items-center gap-10">
                <h1 className="text-white text-6xl text-center font-nunito font-bold">
                  Make the <br />
                  first 'Merry'
                </h1>
                <h2 className="text-white text-center font-semibold text-xl ">
                  If you feel lonely, let's start meeting
                  <br />
                  new people in your area!
                  <br />
                  Don't forget to get Merry with us
                </h2>
                <Link to={!isAuthenticated ? "/login" : "/matching"}>
                  <button className="bg-[#c70039] hover:scale-125 transition-all duration-300 shadow-[2px_2px_12px_0_rgba(64, 50, 133, 0.16)] rounded-[99px] text-[#ffffff] h-[48px] w-[163px] mt-[5%] font-[700] hover:bg-[#FF1659]">
                    Start matching!
                  </button>
                </Link>
              </div>
              <img
                src="/homepage/image.svg"
                className="absolute right-40 -top-10 "
              />
              <img
                src="/homepage/Ellipse 2.svg"
                className="absolute right-20 top-[430px] "
              />
              <img
                src="/homepage/Ellipse 2.svg"
                className="absolute -left-3 top-24 animate-pulse"
              />
              <img
                src="/homepage/Image (2).svg"
                className="absolute right-32 top-[460px] animate-bounce"
              />
              <img
                src="/homepage/Ellipse 4.svg"
                className="absolute right-52 bottom-36 animate-ping"
              />

              <img
                src="/homepage/Ellipse 4.svg"
                className="absolute  bottom-6 animate-pulse"
              />

              <img
                src="/homepage/Ellipse 4.svg"
                className="absolute top-11 right-48 bottom-6 animate-ping"
              />

              <img
                src="/homepage/Ellipse 3.svg"
                className="absolute left-32 top-20 animate-pulse "
              />
              <img
                src="/homepage/Vector (7).svg"
                className="absolute right-[600px] top-36 animate-bounce "
              />
              <img
                src="/homepage/Vector (7).svg"
                className="absolute right-[1300px] bottom-36 animate-bounce "
              />
            </div>
            <div className="part-2-container flex w-full  h-[533px] bg-[#160404]">
              <div className="text-container-outer flex flex-col justify-center items-center w-1/2 h-full pl-40">
                <h1
                  id="why-merry"
                  className="text-[#DF89C6] pb-10 text-[46px] font-extrabold"
                >
                  Why Merry Match
                </h1>
                <div className="text-container-inner flex flex-col gap-5">
                  <p className="text-white text-left px-4">
                    Merry Match is a new generation of online dating website for
                    everyone.
                  </p>
                  <p className="text-white text-left px-4 ">
                    Whether you’re committed to dating, meeting new people,
                    expanding your social network, meeting locals while
                    traveling, or even just making a small chat with strangers.
                  </p>
                  <p className="text-white text-left px-4 ">
                    This site allows you to make your own dating profile,
                    discover new people, save favorite profiles, and let them
                    know that you’re interested.
                  </p>
                </div>
              </div>
              <div className="picture-container flex flex-col justify-center items-center w-1/2 h-full">
                <img
                  className="h-[348px] w-[546px]"
                  src="/homepage/vector (6).svg"
                />
              </div>
            </div>
            <div className="box-border">
              <div className="w-full h-[622px] mx-auto my-0 pt-10 bg-[#160404]">
                <div className="text-center">
                  <h1
                    id="how-to"
                    className="text-[#DF89C6] text-[46px] font-extrabold bg-rgba-pink pb-[48px] leading-[125%]"
                  >
                    How to Merry
                  </h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 mx-[11%]">
                  <div className="bg-[#2A0B21] flex flex-col items-center  rounded-[40px] w-[262px] h-[348px] p-[32px] transform transition duration-300 hover:scale-110">
                    <div className="bg-[#411032] w-[120px] h-[120px] rounded-full flex items-center justify-center mb-[42px]">
                      <img
                        src="/emotion1.svg"
                        alt="emotion"
                        className="w-[50px] "
                      />
                    </div>
                    <div>
                      <p className="text-white text-2xl font-bold mb-2 text-center">
                        Upload your cool picture
                      </p>
                    </div>
                    <div>
                      <p className="text-[#C8CCDB] text-base text-center">
                        Lorem ipsum is a placeholder text
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#2A0B21] flex flex-col items-center  text-white rounded-[40px] w-[262px] h-[348px] p-[32px] transform transition duration-300 hover:scale-110">
                    <div className="bg-[#411032] w-[120px] h-[120px] rounded-full flex items-center justify-center mb-[42px]">
                      <img
                        src="/emotion2.svg"
                        alt="emotion"
                        className="w-[50px]"
                      />
                    </div>
                    <div>
                      <p className=" text-white text-2xl font-bold mb-2 text-center">
                        Explore and find the one you like
                      </p>
                    </div>
                    <div>
                      <p className="text-[#C8CCDB] text-base text-center">
                        Lorem ipsum is a placeholder text
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#2A0B21] flex flex-col items-center  text-white rounded-[40px] w-[262px] h-[348px] p-[32px] transform transition duration-300 hover:scale-110">
                    <div className="bg-[#411032] w-[120px] h-[120px] rounded-full flex items-center justify-center mb-[42px]">
                      <img
                        src="/emotion3.svg"
                        alt="emotion"
                        className="w-[50px]"
                      />
                    </div>
                    <div>
                      <p className=" text-white text-2xl font-bold mb-2 text-center">
                        Click ‘Merry’ for get to know!
                      </p>
                    </div>
                    <div>
                      <p className="text-[#C8CCDB] text-base text-center">
                        Lorem ipsum is a placeholder text
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#2A0B21] flex flex-col items-center  text-white rounded-[40px] w-[262px] h-[348px] p-[32px] transform transition duration-300 hover:scale-110">
                    <div className="bg-[#411032] w-[120px] h-[120px] rounded-full flex items-center justify-center mb-[42px]">
                      <img
                        src="/emotion4.svg"
                        alt="emotion"
                        className="w-[50px]"
                      />
                    </div>
                    <div>
                      <p className=" text-white text-2xl font-bold mb-2 text-center">
                        Start chating and relationship
                      </p>
                    </div>
                    <div>
                      <p className="text-[#C8CCDB] text-base text-center">
                        Lorem ipsum is a placeholder text
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[570px] flex flex-col items-center justify-center mx-auto my-0  bg-[#160404] ">
              <div className="bg-match bg-cover w-[80%] h-[369px] mx-auto rounded-[32px] flex flex-col items-center justify-center">
                <div className="w-[588px]">
                  <h1 className="text-white text-[46px] font-extrabold mb-2 text-center">
                    Let’s start finding and matching someone new
                  </h1>
                </div>
                <Link to={!isAuthenticated ? "/login" : "/matching"}>
                  <button className="bg-[#FFE1EA] font-bold px-[24px] transition-all duration-300  hover:scale-125 py-[12px] text-base text-center rounded-[99px] mt-[40px]  hover:bg-[#FFB1C8] text-[#95002B]">
                    Start Matching!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Homepage;
