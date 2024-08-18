import { Link, useNavigate } from "react-router-dom";

function NavigationbarNonUser() {
  const navigate = useNavigate();

  const handleOnClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    navigate("/");
  };

  return (
    <header className="font-nunito relative z-30 w-screen shadow-md">
      <div className="w-screen  flex flex-row justify-between items-center py-5 bg-white mx-auto">
        <nav className="ml-[12%]">
          <Link to="/" className="text-black font-semibold text-4xl">
            Merry
          </Link>
          <Link to="/" className="text-red-500 font-bold text-4xl">
            Match
          </Link>
        </nav>
        <nav className="mr-[12%]">
          <ul className="flex flex-row items-center">
            <li className=" mr-[56px] text-base font-bold hover:text-[#191C77]">
              <Link to="/" onClick={(e) => handleOnClick(e, "why-merry")}>
                Why Merry Match?
              </Link>
            </li>
            <li className="mr-[56px] text-base font-bold hover:text-[#191C77]">
              <Link to="/" onClick={(e) => handleOnClick(e, "how-to")}>
                How to Merry
              </Link>
            </li>
            <Link to="/login">
              <button className="bg-[#C70039] transition-all duration-300 hover:bg-[#ff2563] text-white font-bold mx-5 px-6 py-2 rounded-full h-[66] ">
                Log In
              </button>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavigationbarNonUser;
