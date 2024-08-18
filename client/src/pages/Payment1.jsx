import { Link } from "react-router-dom";
import NavigationbarUser from "../components/NavigationbarUser";

function Payment1() {
  return (
    <>
      <NavigationbarUser />
      <div className="flex gap-10 font-nunito h-fit px-[150px] py-12 bg-[#FCFCFE]  w-[1440px] mx-auto">
        <div className="flex flex-col justify-between bg-[#F6F7FC] border-[1px] border-[#D6D9E4] rounded-[24px] w-[358px] h-[244px] py-[32px] px-[24px]">
          <div className="flex gap-5">
            <img
              src="/icon/box.png"
              className="w-[19.5px] h-[20.68px]"
            />
            <h1 className="text-xl text-[#646D89]">Merry Membership</h1>
          </div>
          <div className="flex justify-between">
            <p className="text-base text-[#646D89]">Package</p>
            <p className="text-base text-[#646D89]">Price (Monthly)</p>
          </div>
          <div className="border-[1px] border-[#D6D9E4]"></div>
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Basic</h2>
            <h2 className="text-xl font-bold">THB 59.00</h2>
          </div>
        </div>
        <div className="w-[548px] h-[554px] border-[1px] border-[#D6D9E4] rounded-[24px] ">
          <div className="flex justify-between bg-[#F6F7FC] py-[24px] px-[24px] rounded-t-[24px]">
            <h1>Credit Card</h1>
            <img src="/matching/Frame 427320879.svg" />
          </div>
          <div className="flex flex-col gap-6 py-[24px] px-[24px] border-b-[1px] border-[#D6D9E4] ">
            <div>
              <h1>Card number *</h1>
              <label htmlFor="Card number">
                <input
                  className="border-[1px] border-[#D6D9E4] rounded-lg w-[490px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                  type="text"
                  name="Card number"
                  placeholder="Number of card"
                />
              </label>
            </div>
            <div>
              <h1>Card owner *</h1>
              <label htmlFor="Card owner">
                <input
                  className="border-[1px] border-[#D6D9E4] rounded-lg w-[490px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                  type="text"
                  name="Card owner"
                  placeholder="Holder of card"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <div>
                <h1>Expiry date *</h1>
                <label htmlFor="Expiry date">
                  <input
                    className="border-[1px] border-[#D6D9E4] rounded-lg w-[239px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                    type="text"
                    name="Expiry date"
                    placeholder="MM/YY"
                  />
                </label>
              </div>
              <div>
                <h1>CVC/CVV *</h1>
                <label htmlFor="CVC/CVV">
                  <input
                    className="border-[1px] border-[#D6D9E4] rounded-lg w-[239px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                    type="text"
                    name="CVC/CVV"
                    placeholder="x x x"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-[24px] px-[30px] mt-5 ">
            <h1 className="text-[#C70039] font-bold hover:underline hover:text-[#FF1659] cursor-pointer">Cancel</h1>
            <Link to="/payment2" className="text-white bg-[#C70039] py-[12px] px-[24px] rounded-[99px] hover:bg-[#FF1659]">Payment Confirm</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment1;
