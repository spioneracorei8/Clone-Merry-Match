import { Spinner } from "@chakra-ui/react";

function Loading() {
 
  return (
    <div
      className="flex justify-center items-center fixed z-50 w-full h-auto p-4 bg-black bg-opacity-50 inset-0"
    >

    <Spinner
              thickness="10px"
              speed="0.5s"
              emptyColor="pink.200"
              color="pink.300"
              width={100}
              height={100}
              className="pop-up-spinner flex relative"
              />
 </div>
  );
}

export default Loading;
