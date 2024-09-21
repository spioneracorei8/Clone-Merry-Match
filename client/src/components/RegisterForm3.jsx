function RegisterForm3(props) {
  const handleImageClick = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      console.log(file);
      props.setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = file;
        return newImages;
      });
    };
    input.click();
  };

  const handleImageDrop = (event, index) => {
    event.preventDefault();
    const droppedIndex = event.dataTransfer.getData("text");
    if (droppedIndex === "") return;
    props.setImages((prevImages) => {
      const newImages = [...prevImages];
      const temp = newImages[index];
      newImages[index] = newImages[droppedIndex];
      newImages[droppedIndex] = temp;
      return newImages;
    });
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text", index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const deleteImage = (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    delete props.images[Object.keys(props.images)[index]];
    props.setImages({ ...props.images });
    const newImages = [...props.images];
    newImages[index] = null;
    props.setImages(newImages);
  };

  return (
    <div className="bg-[#FCFCFE] form-container px-[255px] w-[1440px] mx-auto py-8 h-[500px]">
      <h1 className="text-2xl text-[#A62D82] font-[700] mb-1">
        Profile pictures
      </h1>
      <h2 className="mb-5">Upload at least 2 photos</h2>

      <div className="grid grid-cols-5 grid-rows-1 gap-2">
        {props.images.map((image, index) => (
          <div key={index}>
            <div
              className="w-[167px] h-[167px] bg-[#F1F2F6] rounded-2xl cursor-pointer relative z-0 "
              onClick={() => handleImageClick(index)}
              onDrop={(event) => handleImageDrop(event, index)}
              onDragOver={(event) => handleDragOver(event)}
              draggable={image !== null}
              onDragStart={(event) => handleDragStart(event, index)}
              style={{
                backgroundImage: `url(${image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {image === null && (
                <div className="flex flex-col text-center justify-center items-center h-full transition-all duration-300  hover:scale-105 hover:bg-[#d0d0d0] hover:rounded-2xl active:scale-[0.8]">
                  <div>
                    <h1 className="text-[#7D2262] text-[30px]">+</h1>
                    <p className="text-[#7D2262] ">Upload photo</p>
                  </div>
                </div>
              )}

              {image !== null && (
                <button
                  className="absolute -right-2 -top-1 cursor-pointer z-10 block rounded-full bg-[#AF2758] text-white h-6 w-6"
                  onClick={(event) => deleteImage(event, index)}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegisterForm3;
