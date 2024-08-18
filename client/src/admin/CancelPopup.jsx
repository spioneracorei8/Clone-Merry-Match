import React from "react";
import cross from "/icon/cross.svg";

function CancelPopup(props) {
  const handleClosePopupCancel = () => {
    props.handleClose();
  };


  const handleConfirmPopupCancel = () => {
    props.handleConfirm();
  };

  return (
    <div
      className="flex justify-center items-center fixed z-50 w-full h-full bg-black bg-opacity-50 inset-0"
      onClick={handleClosePopupCancel}
    >
      <div
        className="flex relative max-w-full h-auto bg-white rounded-3xl "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col relative py-4">
          <h1 className="text-xl font-semibold pb-4 px-6 ">
            Cancel Complaint
          </h1>

          <button onClick={handleClosePopupCancel}>
            <img
              src={cross}
              alt="cross"
              className="w-4 h-4 flex absolute top-6 right-8"
            />
          </button>

          <div className="flex w-full border-[1px] border-gray-300 rounded-[1px] h-full"></div>

          <p className="text-gray-600 pl-6 pr-60 my-6">
            Do you sure to cancel this conplaint?
          </p>
          <div className="flex gap-5 px-6 pb-2">
            <button className="text-[#95002B] bg-[#FFE1EA] rounded-3xl p-3 font-semibold hover:bg-[#FFB1C8]" onClick={handleConfirmPopupCancel}>
              Yes, cancel this complaint
            </button>
            <button
              className="text-[#FFFFFF] bg-[#C70039] rounded-3xl p-3 font-semibold hover:bg-[#FF1659]"
              onClick={handleClosePopupCancel}
            >
              No, give me more time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelPopup;
