import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import NavigationbarUser from "../components/NavigationbarUser";

function MerryPackage() {
  return (
    <>
      <NavigationbarUser />
      <div className="bg-[#FCFCFE]">
        <div className="flex flex-col font-nunito h-fit px-[150px] py-12 bg-[#FCFCFE]  w-[1440px] mx-auto">
          <div className="flex flex-row justify-start items-center w-full ">
            <div>
              <h2 className="text-[#7B4429] text-sm">Merry Membership</h2>
              <h1 className="text-[#A62D82] text-[46px] font-extrabold">
                Be part of Merry Membership <br />
                to make more Merry!
              </h1>
            </div>

          </div>
          <div className="flex flex-row justify-center mt-[16px]">
            <h1 className="text-[#d3627b] text-[46px] font-extrabold">
              Comming Soon...
            </h1>
          </div>
          <div className="flex gap-[24px] my-12">
            <div className="flex flex-col justify-between bg-white border-[1px] border-[#D6D9E4] p-[40px] rounded-[32px] w-[700px] h-[440px] transform transition duration-300 hover:scale-110">
              <img
                src="/matching/icon.svg"
                className="w-[60px] h-[60px]"
              />
              <h1 className="text-[32px] text-[#411032] font-bold">Basic</h1>
              <h2 className="text-[#2A2E3F] text-[20px]">
                THB 59.00
                <span className="text-[#9AA1B9] text-[16px] ">/Month</span>
              </h2>
              <div className="flex gap-5">
                <img
                  src="/matching/Vector.svg"
                  className="w-[15.28px] h-[15.28px]"
                />
                <span className="text-[#424C6B]">

                  ‘Merry’ more than a daily limited
                </span>
              </div>
              <div className="flex gap-5">
                <img
                  src="/matching/Vector.svg"
                  className="w-[15.28px] h-[15.28px]"
                />
                <span className="text-[#424C6B]"> Up to 25 Merry per day </span>
              </div>
              <div className="border-[1px] border-[#D6D9E4]"></div>
              <Link to="/payment1" className="text-center bg-[#FFE1EA] py-[12px] px-[24px] text-[#95002B] rounded-[99px] font-bold hover:bg-[#FFB1C8]">
                Choose Package
              </Link>
            </div>
            <div className="flex flex-col justify-between bg-white border-[1px] border-[#D6D9E4] p-[40px] rounded-[32px] w-[700px] h-[440px] transform transition duration-300 hover:scale-110">
              <img
                src="/matching/icon (1).svg"
                className="w-[60px] h-[60px]"
              />
              <h1 className="text-[32px] text-[#411032] font-bold">Platinum</h1>
              <h2 className="text-[#2A2E3F] text-[20px]">
                THB 99.00
                <span className="text-[#9AA1B9] text-[16px] ">/Month</span>
              </h2>
              <div className="flex gap-5">
                <img
                  src="/matching/Vector.svg"
                  className="w-[15.28px] h-[15.28px]"
                />
                <span className="text-[#424C6B]">

                  ‘Merry’ more than a daily limited
                </span>
              </div>
              <div className="flex gap-5">
                <img
                  src="/matching/Vector.svg"
                  className="w-[15.28px] h-[15.28px]"
                />
                <span className="text-[#424C6B]"> Up to 45 Merry per day</span>
              </div>
              <div className="border-[1px] border-[#D6D9E4]"></div>
              <Link to="/payment1" className="text-center bg-[#FFE1EA] py-[12px] px-[24px] text-[#95002B] rounded-[99px] font-bold hover:bg-[#FFB1C8]">
                Choose Package
              </Link>
            </div>
            <div className="flex flex-col justify-between bg-white border-[1px] border-[#D6D9E4] p-[40px] rounded-[32px] w-[700px] h-[440px] transform transition duration-300 hover:scale-110">
              <img
                src="/matching/icon (2).svg"
                className="w-[60px] h-[60px]"
              />
              <h1 className="text-[32px] text-[#411032] font-bold">Premium</h1>
              <h2 className="text-[#2A2E3F] text-[20px]">
                THB 149.00
                <span className="text-[#9AA1B9] text-[16px] ">/Month</span>
              </h2>
              <div className="flex gap-5">
                <img
                  src="/matching/Vector.svg"
                  className="w-[15.28px] h-[15.28px]"
                />
                <span className="text-[#424C6B]">

                  ‘Merry’ more than a daily limited
                </span>
              </div>
              <div className="flex gap-5">
                <img
                  src="/matching/Vector.svg"
                  className="w-[15.28px] h-[15.28px]"
                />
                <span className="text-[#424C6B]"> Up to 70 Merry per day</span>
              </div>
              <div className="border-[1px] border-[#D6D9E4]"></div>
              <Link to="/payment1" className="text-center bg-[#FFE1EA] py-[12px] px-[24px] text-[#95002B] rounded-[99px] font-bold hover:bg-[#FFB1C8]">
                Choose Package
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MerryPackage;
