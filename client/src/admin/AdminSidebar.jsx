import { useAuth } from "../contexts/authentication";

function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <div className="font-nunito flex bg-[#F6F7FC] h-screen">
      <div className="bg-white flex flex-col justify-between items-center w-72 h-full ">
        <div className="flex flex-col justify-around items-center p-6  mb-14">
          <div>
            <span className="text-black font-semibold text-4xl">Merry</span>
            <span className="text-red-500 font-bold text-4xl">Match</span>
          </div>
          <p className="text-[#646D89]">Admin Panel Control</p>
        </div>
        <div className="flex  items-start h-full w-full ">
          <div className="flex justify-center gap-5 p-6 w-full cursor-pointer hover:bg-[#F1F2F6]">
            <img src="/admin/!!!.svg" alt="!" />

            <button className="text-[#424C6B] font-bold">Complaint</button>
          </div>

        </div>
        <div className="flex  gap-5 p-6 mb-32 w-full border-t-[1px] border-[#D6D9E4] item-center justify-center cursor-pointer">
          <img src="/admin/logout.svg" alt="logout" />

          <a
            href="/"
            className="text-[#424C6B] font-bold hover:text-[#FFB1C8] hover:underline"
            onClick={() => {
              logout();
            }}
          >
            Log Out
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
