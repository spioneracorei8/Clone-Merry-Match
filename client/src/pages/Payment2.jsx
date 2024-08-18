import { Link } from "react-router-dom";
import NavigationbarUser from "../components/NavigationbarUser";

function Payment2() {
  return (
    <>
      <NavigationbarUser />
      <div className="flex gap-20 font-nunito h-fit px-[150px] py-12 bg-[#FCFCFE]  w-[1440px] mx-auto">
        <div className="flex flex-col justify-around">
          <img src="/matching/Vector (12).svg" className="w-[64px] h-[64px]" />
          <h2 className="text-[#7B4429] text-sm">AYMENT SUCCESS</h2>
          <h1 className="text-[#A62D82] text-[46px] font-extrabold">
            Welcom Merry Membership! <br />
            Thank you for joining us
          </h1>
          <div className="flex gap-[8px]">
            <Link to="/" className="bg-[#FFE1EA] text-[#95002B] py-[12px] px-[24px] rounded-[99px] font-bold hover:bg-[#FFB1C8]">Back to home</Link>
            <button className="bg-[#C70039] text-white py-[12px] px-[24px] rounded-[99px] font-bold hover:bg-[#FF1659]">Check Membership</button>
          </div>
        </div>
        <div className="flex flex-col justify-around p-[40px] w-[357px] h-[454px] bg-gradient-to-r from-[#742138] to-[#A878BF] rounded-[32px]">
          <img
            src="/matching/icon (2).svg"
            className="w-[60px] h-[60px]"
          />
          <h1 className="text-[32px] text-white font-bold">Premium</h1>
          <h2 className="text-white text-[20px]">
            THB 149.00
            <span className="text-white text-[16px] ">/Month</span>
          </h2>
          <div className="flex gap-5">
            <img
              src="/matching/Vector.svg"
              className="w-[15.28px] h-[15.28px]"
            />
            <span className="text-white">

              ‘Merry’ more than a daily limited
            </span>
          </div>
          <div className="flex gap-5">
            <img
              src="/matching/Vector.svg"
              className="w-[15.28px] h-[15.28px]"
            />
            <span className="text-white"> Up to 70 Merry per day</span>
          </div>
          <div className="border-[1px] border-[#D6D9E4]"></div>
          <div className="flex justify-between text-white">
            <h1 >Start Membership</h1>
            <h1>01/04/2022 </h1>
          </div>
          <div className="flex justify-between text-white">
            <h1>Next billing</h1>
            <h1>01/05/2022 </h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment2;
