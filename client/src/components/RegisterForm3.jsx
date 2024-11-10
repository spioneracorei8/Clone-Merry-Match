function RegisterForm3(props) {
  const handleImageClick = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      const previewPhoto = URL.createObjectURL(file);
      props?.setUser?.((prevPhotos) => {
        const newPhotos = [...prevPhotos?.photos];
        newPhotos[index] = file;
        return {
          ...prevPhotos,
          photos: newPhotos,
        };
      });
      props?.setUser?.((prevPrePhotos) => {
        const newPhotos = [...prevPrePhotos?.preview_photos];
        newPhotos[index] = previewPhoto;
        return {
          ...prevPrePhotos,
          preview_photos: newPhotos,
        };
      });
    };
    input.click();
  };

  const handleImageDrop = (event, index) => {
    event.preventDefault();
    const droppedIndex = event.dataTransfer.getData("text");
    if (droppedIndex === "") return;
    props?.setUser((prev) => {
      const [photos, previewPhotos] = [
        [...prev?.photos],
        [...prev?.preview_photos],
      ];
      const photoTemp = photos[index];
      photos[index] = photos[droppedIndex];
      photos[droppedIndex] = photoTemp;
      const previewPhotoTemp = previewPhotos[index];
      previewPhotos[index] = previewPhotos[droppedIndex];
      previewPhotos[droppedIndex] = previewPhotoTemp;
      return {
        ...prev,
        photos,
        preview_photos: previewPhotos,
      };
    });
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text", index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const deletePhoto = (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    const photos = [...props?.user?.photos];
    photos[index] = null;
    props?.setUser((prev) => ({
      ...prev,
      photos: photos,
      preview_photos: photos,
    }));
  };

  return (
    <div className="bg-[#FCFCFE] form-container px-[255px] w-[1440px] mx-auto py-8 h-[500px]">
      <h1 className="text-2xl text-[#A62D82] font-[700] mb-1">
        Profile pictures
      </h1>
      <h2 className="mb-5">Upload at least 2 photos</h2>

      <div className="grid grid-cols-5 grid-rows-1 gap-2">
        {props?.user?.preview_photos?.map((photo, index) => (
          <div key={index}>
            <div
              className="w-[167px] h-[167px] bg-[#F1F2F6] rounded-2xl cursor-pointer relative z-0 "
              onClick={() => handleImageClick(index)}
              onDrop={(event) => handleImageDrop(event, index)}
              onDragOver={(event) => handleDragOver(event)}
              draggable={photo !== null}
              onDragStart={(event) => handleDragStart(event, index)}
              style={{
                backgroundImage: `url(${photo})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {photo === null && (
                <div className="flex flex-col text-center justify-center items-center h-full transition-all duration-300  hover:scale-105 hover:bg-[#d0d0d0] hover:rounded-2xl active:scale-[0.8]">
                  <div>
                    <h1 className="text-[#7D2262] text-[30px]">+</h1>
                    <p className="text-[#7D2262] ">Upload photo</p>
                  </div>
                </div>
              )}

              {photo !== null && (
                <button
                  className="absolute -right-2 -top-1 cursor-pointer z-10 block rounded-full bg-[#AF2758] text-white h-6 w-6"
                  onClick={(event) => deletePhoto(event, index)}
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
