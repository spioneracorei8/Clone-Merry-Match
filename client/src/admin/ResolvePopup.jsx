import React from "react";
import cross from "/icon/cross.svg";

function ResolvePopup(props) {
  const handleClosePopupResolve = () => {
    props.handleClose();
  };

  const handleConfirmPopupResolve = () => {
    props.handleConfirm();
  };

  return (
    <div
      className="flex justify-center items-center fixed z-50 w-full h-full bg-black bg-opacity-50 inset-0"
      onClick={handleClosePopupResolve}
    >
      <div
        className="flex relative max-w-full h-auto bg-white rounded-3xl "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col relative py-4">
          <h1 className="text-xl font-semibold pb-4 px-6 ">
            Resolve Complaint
          </h1>

          <button onClick={handleClosePopupResolve}>
            <img
              src={cross}
              alt="cross"
              className="w-4 h-4 flex absolute top-6 right-8"
            />
          </button>

          <div className="flex w-full border-[1px] border-gray-300 rounded-[1px] h-full"></div>

          <p className="text-gray-600 pl-6 pr-60 my-6">
            This complaint is resolved?
          </p>
          <div className="flex gap-5 px-6 pb-2">
            <button className="text-[#FFFFFF] bg-[#C70039] rounded-3xl p-3 font-semibold hover:bg-[#FF1659]" onClick={handleConfirmPopupResolve}>
              Yes, it has been resolved
            </button>
            <button
              className="text-[#95002B] bg-[#FFE1EA] rounded-3xl p-3 font-semibold hover:bg-[#FFB1C8]"
              onClick={handleClosePopupResolve}
            >
              No, it’s not
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResolvePopup;
