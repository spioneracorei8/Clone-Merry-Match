import { useState } from "react";

function ProfilePopupMatching({ user, handleCloseProfile, isMatching }) {
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };
  const {
    name,
    city,
    location,
    birthDate,
    sexual_identity: sexualIdentity,
    sexual_preference: sexualPreference,
    racial_preference: racialPreference,
    meeting_interest: meetingInterest,
    hobbies_interests: hobbyLists,
    pictures,
    about_me,
  } = user;

  const ageInYears = calculateAge(birthDate);

  const handleNextImage = () => {
    if (countImage === pictures.length - 1) {
      setCountImage(0);
    } else {
      setCountImage(countImage + 1);
    }
  };

  const handlePreviousImage = () => {
    if (countImage === 0) {
      setCountImage(pictures.length - 1);
    } else {
      setCountImage(countImage - 1);
    }
  };

  const [countImage, setCountImage] = useState(0);

  if (!user || !pictures) {
    return null;
  }

  return (
    <div
      className="flex justify-center items-center fixed z-50 w-full h-auto p-4 bg-black bg-opacity-50 inset-0"
      onClick={handleCloseProfile}
    >
      <div
        className="flex relative max-w-full h-auto bg-white gap-20 pt-14 px-24 pb-20 rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col justify-start items-center ">
          {pictures.map((image, index) => {
            return (
              <img
                src={image.pic_url}
                alt={`${name} image`}
                className={`w-[350px] object-cover h-[420px] rounded-3xl ${index === countImage ? "block" : "hidden"
                  }`}
                key={index}
              />
            );
          })}
          <div className="w-full flex justify-between items-center relative pl-2 ">
            <p>
              {countImage + 1}/
              <span className="text-gray-400">{pictures.length}</span>
            </p>
            {isMatching && (
              <div className="flex absolute -top-10 left-[4.25rem]">
                <button>
                  <img src="/popup/action button (3).svg" alt="Close picture" />
                </button>
                <button>
                  <img src="/popup/action button (2).svg" alt="Heart picture" />
                </button>
              </div>
            )}
            <div className="flex mt-[16px] mr-[16px] ">
              <button onClick={handlePreviousImage}>
                <img
                  src="/popup/Vector (10).svg"
                  className="mr-[32px]"
                  alt="Left arrow "
                />
              </button>
              <button onClick={handleNextImage}>
                <img src="/popup/Vector (9).svg" alt="Right arrow" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9 relative">
          <button
            className="absolute -right-20 -top-12 text-gray-400"
            onClick={handleCloseProfile}
          >
            ✕
          </button>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <h1 className="text-3xl font-black">{name}</h1>
              <h1 className="text-3xl font-black text-gray-500">
                {ageInYears}
              </h1>
            </div>
            <div className="flex flex-row gap-5">
              <img src="/popup/Vector (11).svg" alt="Some" className="h-6" />
              <h4 className="text-lg font-medium text-gray-500">
                {city}, {location}
              </h4>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex space-x-16">
              <h3 className="text-gray-700">Sexual identities</h3>
              <h3 className="text-gray-500">{sexualIdentity}</h3>
            </div>
            <div className="flex space-x-[2.9rem]">
              <h3 className="text-gray-700">Sexual preferences</h3>
              <h3 className="text-gray-500">{sexualPreference}</h3>
            </div>
            <div className="flex space-x-[3.2rem]">
              <h3 className="text-gray-700">Racial preferences</h3>
              <h3 className="text-gray-500">{racialPreference}</h3>
            </div>
            <div className="flex space-x-14">
              <h3 className="text-gray-700">Meeting interests</h3>
              <h3 className="text-gray-500">{meetingInterest}</h3>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-xl">About me</h1>
            <p className="text-gray-700">{about_me}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Hobbies and interests</h1>
            <div>
              <ul className="flex flex-wrap w-80 h-auto">
                {hobbyLists.map((hobbies, index) => {
                  return (
                    <li
                      key={index}
                      className="bg-[#F4EBF2]  rounded-lg p-[8px] text-[#7D2262] border-[1px] border-pink-400 text-[14px] mr-2 mb-2 flex items-center"
                    >
                      {hobbies?.hob_list || null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopupMatching;
