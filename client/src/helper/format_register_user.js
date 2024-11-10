import { registerUserModel as userModel } from "../models/user.js";

export function formatRegisterUser(params) {
  const user = {
    name: params?.name,
    username: params?.username,
    password: params?.password,
    birth_date: params?.birth_date,
    location: params?.location,
    city: params?.city,
    email: params?.email,
    sexual_identity: params?.sexual_identity,
    sexual_preference: params?.sexual_preference,
    racial_preference: params?.racial_preference,
    meeting_interest: params?.meeting_interest,
    hobbies: params?.hobbies,
  };
  const photos = params?.photos;
  return { user, photos };
}

