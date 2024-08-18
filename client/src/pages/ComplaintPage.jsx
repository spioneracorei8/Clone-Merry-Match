import NavigationbarUser from "../components/NavigationbarUser";
import Footer from "../components/Footer";
import React from "react";
import { useState } from "react";
import useData from "../hook/useData";
import { useToast } from '@chakra-ui/react'
import Loading from "../components/Loading";
import { useAuth } from "../contexts/authentication";
function ComplaintPage() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState("")
  const toast = useToast()
  const { state } = useAuth()
  const { submitedComplaint } = useData()

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    await submitedComplaint(state?.user?.user_id, {
      title,
      description,
    });
    {
      toast({
        title: 'Your Complaint.',
        description: "Your complaint has been sent.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    }
    setIsLoading(false)
    setTitle("")
    setDescription("")
  };

  return (
    <>
      <NavigationbarUser />
      {isLoading && <Loading />}
      <div className="w-[1440px] mx-auto font-nunito">
        <div className="w-[1150px] mx-auto flex flex-row justify-between items-center h-auto py-5 bg-white ">

          <div className="flex flex-col">
            <p className="text-sm font-semibold text-[#7B4429] mt-[80px]">
              COMPLAINT
            </p>
            <h1 className="text-5xl font-extrabold text-[#A62D82] mb-5 leading-tight">
              If you have any trouble <br />
              Don't be afraid to tell us!
            </h1>
            <form
              onSubmit={handleSubmit}
              className="w-[548px]"
            >
              <div>
                <label className="block text-gray-600 text-base font-normal mt-3">
                  Issue
                </label>
                <input
                  className="shadow appearance-none border mt-[5px] rounded-[8px]  w-full h-[48px] py-2 px-3 text-gray-700 leading-tight focus:outline-red-500 focus:shadow-red-500 transition-all duration-500"
                  type="text"
                  name="Issue "
                  placeholder="Place Holder"
                  required
                  value={title}
                  onChange={(e) => (setTitle(e.target.value))}
                />
                <label className="block text-gray-600 text-base font-normal mt-8">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border mt-[5px] rounded-[8px]  w-full h-[196px] py-2 px-3 text-gray-700 leading-tight focus:outline-red-500 focus:shadow-red-500 transition-all duration-500"
                  type="text"
                  name="Description "
                  placeholder="Place Holder"
                  required
                  value={description}
                  onChange={(e) => (setDescription(e.target.value))}
                />

                <button
                  type="submit"
                  className="block h-12 bg-[#C70039] w-[102px]  transition-all duration-300 hover:bg-[#ff2563] text-white text-base font-bold rounded-full my-10"
                >
                  Submit
                </button>

              </div>
            </form>
          </div>
          <img
            src="/login/image (3).svg"
            alt="man"
            className="relative w-[450px] h-[677px]  mt-[80px]"
          />
        </div>
      </div>
      '
      <Footer />
    </>
  );
}

export default ComplaintPage;
