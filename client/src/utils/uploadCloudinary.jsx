import axios from "axios";

export const uploadCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "merrymatch");
  formData.append("folder", "pictures");
  const { data } = await axios.post(
    "https://api.cloudinary.com/v1_1/dau3ttd20/image/upload",
    formData
  );
  const url = data?.secure_url;
  return { url };
};
