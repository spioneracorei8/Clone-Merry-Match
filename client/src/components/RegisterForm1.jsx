import CountryStateData from "../data/CountryStateData.json"

function RegisterForm1(props) {
  const countries = CountryStateData
  const cities = CountryStateData?.flatMap(country => country?.states)
  console.log(props);
  
  

  return (
    <div className="bg-[#FCFCFE] form-container px-[255px] py-8 h-[500px] w-[1440px] mx-auto">
      <h1 className="text-2xl text-[#A62D82] font-[700]  ">
        Basic Information
      </h1>
      <div className="info-container grid grid-cols-2 grid-rows-4 gap-5">
        <div>
          <h1>Name</h1>
          <label htmlFor="Name">
            <input
              className="border-[1px] border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
              type="text"
              name="name"
              value={props?.user?.name}
              onChange={(e) => props?.handleUpdateValue(e)}
              placeholder="Jon Snow"
            />
          </label>
        </div>
        <div>
          <h1>Date of birth</h1>
          <label htmlFor="Date">
            <input
              className=" border-[1px] text-[#9AA1B9] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
              type="date"
              name="birth_date"
              value={props?.user?.birth_date}
              onChange={(e) => props?.handleUpdateValue(e)}
              onClick={(e) => e.target.classList.add("text-black")}
            />
          </label>
        </div>
        <div>
          <h1>Location</h1>
          <select
            className=" border-[1px] text-[#9AA1B9] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px] "
            name="location"
            value={props?.user?.location}
            onChange={(e) => props?.handleUpdateValue(e)}
            onClick={(e) => e.target.classList.add("text-black")}
          >
            <option value="">Select your country</option>
            {countries
              ?.sort((a, b) => {
                return a > b ? 1 : -1;
              })
              ?.map((country, index) => (
                <option value={country?.country_name} key={index}>
                  {country?.country_name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <h1>City</h1>
          <select
            className=" border-[1px] text-[#9AA1B9] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px]  pl-[12px]"
            name="city"
            value={props?.user?.city}
            onChange={(e) => props?.handleUpdateValue(e)}
            onClick={(e) => e.target.classList.add("text-black")}
          >
            <option value="">Select your city</option>
            {cities
              ?.filter((city) => {
                const filterCountries = CountryStateData?.filter((country) => {
                  return country?.country_id === city?.country_id;
                });
                return filterCountries?.some(
                  (filterCountry) => filterCountry?.country_name === props?.user?.location
                );
              })
              ?.sort((a, b) => {
                return a > b ? -1 : 1;
              })
              ?.map((city, index) => {
                return (
                  <option value={city?.state_name} key={index}>
                    {city?.state_name}
                  </option>
                );
              })}
          </select>
        </div>

          <div>
            <h1>Username</h1>
            <label htmlFor="Username">
              <input
                className=" border-[1px] border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
                type="text"
                name="username"
                placeholder="At least 6 characters"
                value={props?.user?.username}
                onChange={(e) => props?.handleUpdateValue(e)}
              />
            </label>
          </div>

        <div>
          <h1>Email</h1>
          <label htmlFor="Email">
            <input
              className="border-[1px] border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
              type="email"
              name="email"
              placeholder="john_snow@email.com"
              value={props?.user?.email}
              onChange={(e) => props?.handleUpdateValue(e)}
            />
          </label>
        </div>
        <div>
          <h1>Password</h1>
          <label htmlFor="Password">
            <input
              className="border-[1px] border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={props?.user?.password}
              onChange={(e) => props?.handleUpdateValue(e)}
            />
          </label>
        </div>
        <div>
          <h1>Confirm password</h1>
          <label htmlFor="Confirm password">
            <input
              className="border-[1px] font-normal border-[#D6D9E4] rounded-lg w-[453px] h-[48px] py-[12px] pr-[16px] pl-[12px]"
              type="password"
              name="confirm_password"
              placeholder="At least 8 characters"
              value={props?.user?.confirm_password}
              onChange={(e) => props?.handleUpdateValue(e)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm1;
