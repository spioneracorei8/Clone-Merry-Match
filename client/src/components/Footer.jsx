function Footer() {
  return (
    <footer className="font-nunito absolute w-full h-auto py-5 bg-[#F6F7FC] mt-[70px]">
      <div className="flex flex-col items-center justify-center">
        <div>
          <span className="text-black font-semibold text-4xl">Merry</span>
          <span className="text-red-500 font-bold text-4xl">Match</span>
        </div>
        <div className="text-[#646D89] py-2 pb-5 text-xl font-semibold">
          New generation of online dating website for everyone
        </div>
        <hr className="w-3/4 mx-auto border-b-1 my-3" />
        <div className="text-[#9AA1B9] text-sm">
          Copyright ©2023 merrymatch.com All rights reserved
        </div>
      </div>
      <div className="flex flex-row items-center justify-center py-2">
        <a href="https://" target="blank">
          <img
            src="../../icon/fb.svg"
            alt="facebook icon"
            className="w-12 m-2"
          ></img>
        </a>
        <a href="https://" target="blank">
          <img
            src="../../icon/ig.svg"
            alt="instagram icon"
            className="w-12 m-2 "
          ></img>
        </a>
        <a href="https://" target="blank">
          <img
            src="../../icon/tw.svg"
            alt="twitter icon"
            className="w-12 m-2"
          ></img>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
