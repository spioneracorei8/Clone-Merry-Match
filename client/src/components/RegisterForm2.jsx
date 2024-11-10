import { useToast } from "@chakra-ui/react";

function RegisterForm2(props) {
  const toast = useToast();
  const maxHobbies = 10;
  console.log(props);

  const addHobbyLists = () => {
    if (props?.user?.hobby?.trim() !== "") {
      if (props?.user?.hobbies?.length >= maxHobbies) {
        toast({
          title: `You can only add up to ${maxHobbies} hobbies.`,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      const newHobbies = [...props?.user?.hobbies];
      newHobbies.push(props?.user?.hobby?.trim());
      props?.setUser?.((prev) => ({
        ...prev,
        hobbies: newHobbies,
      }));
      props?.setUser?.((prev) => ({
        ...prev,
        hobby: "",
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHobbyLists();
    }
  };

  const deleteHobby = (index) => {
    const newHobbyLists = [...props.hobbyLists];
    newHobbyLists.splice(index, 1);
    props.setHobbyLists(newHobbyLists);
  };

  return (
    <div className="bg-[#FCFCFE] form-container px-[255px] w-[1440px] mx-auto py-8 h-[500px]">
      <h1 className="text-2xl text-[#A62D82] font-[700]  mt-[20px]">
        Identities and Interests
      </h1>
      <div className="info-container grid grid-cols-2 grid-rows-2 gap-5">
        <div>
          <h1>Sexual identities </h1>
          <select
            className=" border-[1px] text-[#9AA1B9] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
            name="sexual_identity"
            value={props?.user?.sexual_identity}
            onChange={(e) => props?.handleUpdateValue(e)}
            onClick={(e) => e.target.classList.add("text-black")}
          >
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Male">Male</option>
          </select>
        </div>
        <div>
          <h1>Sexual preferences</h1>
          <select
            className=" border-[1px] text-[#9AA1B9] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
            name="sexual_preference"
            value={props?.user?.sexual_preference}
            onChange={(e) => props?.handleUpdateValue(e)}
            onClick={(e) => e.target.classList.add("text-black")}
          >
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <h1>Racial preferences</h1>
          <select
            className=" border-[1px] text-[#9AA1B9] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
            name="racial_preference"
            value={props?.user?.racial_preference}
            onChange={(e) => props?.handleUpdateValue(e)}
            onClick={(e) => e.target.classList.add("text-black")}
          >
            <option value="Asian">Asian</option>
            <option value="European">European</option>
            <option value="Caucasian">Caucasian</option>
            <option value="African">African</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
          </select>
        </div>
        <div>
          <h1>Meeting interests</h1>
          <select
            className=" border-[1px] text-[#9AA1B9] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
            name="meeting_interest"
            value={props?.user?.meeting_interest}
            onChange={(e) => props?.handleUpdateValue(e)}
            onClick={(e) => e.target.classList.add("text-black")}
          >
            <option value="Partners">Partners</option>
            <option value="Long-term commitment">Long-term commitment</option>
            <option value="Short-term commitment">Short-term commitment</option>
            <option value="Friends">Friends</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col  mt-[50px]">
        <h1>Hobbies / Interests (Maximum 10)</h1>

        <div className="w-full flex flex-row items-start justify-start border-[#D6D9E4] border-t-[1px] border-r-[1px] border-b-[1px] border-l-[1px] rounded-lg">
          {props?.user?.hobbies?.length > 0 && (
            <div className="border-[1px] border-none rounded-lg p-[8px]  text-[#9AA1B9] text-sm">
              <ul className="flex flex-row ">
                {props?.user?.hobbies?.map((hobby, index) => (
                  <li
                    key={index}
                    className="bg-[#F4EBF2] border-[#D6D9E4] mr-2 rounded-lg p-[6px] text-[#7D2262] text-[14px] flex items-center"
                  >
                    {hobby}
                    <button
                      className="border-none bg-transparent text-[#7D2262] ml-4 cursor-pointer"
                      onClick={() => deleteHobby(index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            className="border-[1px] font-normal border-none rounded-lg py-[12px] px-[12px] focus:outline-none w-full"
            type="text"
            name="hobby"
            value={props?.user?.hobby}
            onChange={(e) => {
              props?.handleUpdateValue(e);
            }}
            onKeyPress={(e) => handleKeyPress(e)}
            style={{ wordWrap: "break-word" }}
          />
        </div>
      </div>
    </div>
  );
}

export default RegisterForm2;
