import path from "path";
import fs from "fs";
import multer from "multer";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";

import { ConvertToThaiTime } from "../utils/util.js";
import { HOST } from "../constant/constant.js";
import { protect } from "../middlewares/protect.js";
import { NewUUID } from "../utils/util.js";
import { ImageFilter } from "../constant/file.js";
import {
  KEY_ERROR_MSG,
  MSG_INTERNAL_SERVER_ERROR,
  MSG_NOT_FOUND,
} from "../constant/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const userId = req.params.userId;
      const uploadPath = path.join(__dirname, `../uploads/${userId}/`);

      fs.readdir(uploadPath, (err, files) => {
        if (err) {
          cb(err);
        }
        files.forEach((f) => {
          // old files section
          const baseName = f.split(".")[0];
          const oldOriginalName = baseName.slice(-1);
          //
          // new file section
          const newOriginalName = file.originalname.split(".")[0];
          //
          if (oldOriginalName === newOriginalName) {
            const deleteFilePath = uploadPath + f;
            // fs.unlink -> delete file by path + name
            fs.unlink(deleteFilePath, (err) => {
              if (err) {
                cb(err);
              }
            });
          }
        });
      });
      // fs.promises.mkdir will creating new file if its exists will not creating new file
      await fs.promises.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const uuid = NewUUID();
    const newFileName = uuid.replaceAll("-", "");
    cb(null, newFileName + file.originalname);
  },
});

const upload = multer({
  storage: imagesStorage,
  fileFilter: ImageFilter,
  limits: { fileSize: 7000000 }, // 7mb
});

const usersRouter = Router();
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

usersRouter.get("/profile-pic/*", async (req, res) => {
  const img = path.join(__dirname, `../uploads/${req.params[0]}`);
  fs.access(img, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.status(200).sendFile(img);
    }
  });
});

usersRouter.use(protect);

// read user profile
usersRouter.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        name: true,
        birth_date: true,
        email: true,
        location: true,
        city: true,
        sexual_preference: true,
        sexual_identity: true,
        meeting_interest: true,
        racial_preference: true,
        about_me: true,
        hobbies: true,
        image: true,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      KEY_ERROR_MSG: MSG_INTERNAL_SERVER_ERROR,
      error: error,
    });
  }
});

// // update profile
usersRouter.put("/:userId", upload.array("files", 5), async (req, res) => {
  const userId = req.params.userId;
  const body = JSON.parse(req.body.body);
  const files = req.files;

  body.images.forEach((img, index) => {
    files.forEach((f) => {
      const fileIdx = parseInt(f.originalname.split(".")[0]);
      if (index === fileIdx) {
        const imgUrl = `${HOST}/user/profile-pic/${userId}/${f.filename}`;
        return (img.image_url = imgUrl);
      }
    });
  });

  try {
    const updatedUser = await prisma.$transaction(async (tx) => {
      const updateUser = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          name: body.name,
          birth_date: new Date(body.birth_date),
          location: body.location,
          city: body.city,
          email: body.email,
          sexual_identity: body.sexual_identity,
          sexual_preference: body.sexual_preference,
          racial_preference: body.racial_preference,
          meeting_interest: body.meeting_interest,
          about_me: body.about_me,
          hobbies: body.hobbies,
          updated_at: ConvertToThaiTime(new Date()),
          image: {
            update: body.images.map((img) => ({
              where: {
                id: img.id,
              },
              data: {
                image_url: img.image_url,
                updated_at: ConvertToThaiTime(new Date()),
              },
            })),
          },
        },
      });

      return updateUser;
    });

    const profilePics = await prisma.image.findMany({
      where: {
        user_id: userId,
      },
    });

    const firstProfilePicURL = profilePics.find(
      (pic) => pic.image_url !== null
    )?.image_url;

    const token = jwt.sign(
      {
        user_id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        profile_pictures: profilePics,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "User profile updated successfully!",
      token: token,
      pic_url: firstProfilePicURL,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      KEY_ERROR_MSG: MSG_INTERNAL_SERVER_ERROR,
      error: error,
    });
  }
});

// // Example search
// // GET /users?keyword=john&meeting_interest=male&min_age=20&max_age=30
// // {
// //   "keyword": "hobby",
// //   "meeting_interest": "Long-term commitment,Partners,Friends",
// //   "min_age": "20",
// //   "max_age": "50"
// // }

// // search default by user meeting interest and ages +-10 years and search by keyword & meeting interest & age
// usersRouter.get("/merrymatch/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const { keyword, meeting_interest, min_age, max_age } = req.query;
//     const { data: userData, error: userDataError } = await supabase
//       .from("users")
//       .select("birthDate, sexual_preference, meeting_interest")
//       .eq("user_id", userId);
//     console.log(userData);
//     if (userDataError) throw userDataError;
//     if (
//       typeof req.query === "undefined" ||
//       Object.keys(req.query).length === 0
//     ) {
//       const maxAge = 10;
//       const minBirthYear =
//         new Date(userData[0].birthDate).getFullYear() - maxAge;
//       const minBirthDate = new Date(
//         minBirthYear,
//         new Date().getMonth(),
//         new Date().getDate()
//       )
//         .toISOString()
//         .slice(0, 10);

//       const minAge = 10;
//       const maxBirthYear =
//         new Date(userData[0].birthDate).getFullYear() + minAge;
//       const maxBirthDate = new Date(
//         maxBirthYear,
//         new Date().getMonth(),
//         new Date().getDate()
//       )
//         .toISOString()
//         .slice(0, 10);

//       const { data: defaultData, error: defaultDataError } = await supabase
//         .from("users")
//         .select(
//           `user_id, username, name, birthDate, email, location, city, sexual_preference, sexual_identity, meeting_interest, racial_preference, about_me, pictures(pic_url), hobbies_interests(hob_list)`
//         )
//         .neq("user_id", userId)
//         .eq("sexual_identity", userData[0].sexual_preference)
//         .eq("meeting_interest", userData[0].meeting_interest)
//         .gte("birthDate", minBirthDate)
//         .lte("birthDate", maxBirthDate);
//       if (defaultDataError) throw defaultDataError;

//       // Don't show user that already in own merrylist
//       const { data: filterData, error: filterDataError } = await supabase
//         .from("merry_status")
//         .select("mer_id, user_id")
//         .eq("mer_id", userId);
//       if (filterDataError) throw filterDataError;
//       const alreadyUser = filterData.map((user) => user.user_id);
//       const filteredData = defaultData.filter(
//         (data) => !alreadyUser.includes(data.user_id)
//       );
//       // Don't show user in RejectList
//       const { data: getRejectUser, error: getRejectUserError } = await supabase
//         .from("merry_reject")
//         .select("user_id")
//         .eq("mer_id", userId);
//       if (getRejectUserError) throw getRejectUserError;
//       const rejectUser = getRejectUser.map((user) => user.user_id);
//       const NewDefaultUserData = filteredData.filter(
//         (data) => !rejectUser.includes(data.user_id)
//       );

//       return res.json(NewDefaultUserData);
//     }

//     // search with request
//     const maxAge = parseInt(max_age);
//     const minBirthYear = new Date().getFullYear() - maxAge;
//     const minBirthDate = `${minBirthYear}/${
//       new Date().getMonth() + 1
//     }/${new Date().getDate()}`;
//     const minAge = parseInt(min_age);
//     const maxBirthYear = new Date().getFullYear() - minAge;
//     const maxBirthDate = `${maxBirthYear}/${
//       new Date().getMonth() + 1
//     }/${new Date().getDate()}`;

//     const query = supabase
//       .from("users")
//       .select(
//         `user_id, username, name, birthDate, email, location, city, sexual_preference, sexual_identity, meeting_interest, racial_preference, about_me, pictures(pic_url), hobbies_interests(hob_list)`
//       )
//       .eq("sexual_identity", userData[0].sexual_preference)
//       .neq("user_id", userId);

//     if (keyword && meeting_interest && min_age && max_age) {
//       // Add keyword, meeting_interest and age filters
//       query
//         .ilike("hobbies_interests.hob_list", `%${keyword}%`)
//         .in("meeting_interest", meeting_interest.split(","))
//         .gte("birthDate", minBirthDate)
//         .lte("birthDate", maxBirthDate);
//     } else if (keyword && meeting_interest) {
//       // Add keyword and meeting_interest filters
//       query
//         .ilike("hobbies_interests.hob_list", `%${keyword}%`)
//         .in("meeting_interest", meeting_interest.split(","));
//     } else if (keyword && min_age && max_age) {
//       query
//         .ilike("hobbies_interests.hob_list", `%${keyword}%`)
//         .gte("birthDate", minBirthDate)
//         .lte("birthDate", maxBirthDate);
//     } else if (meeting_interest && min_age && max_age) {
//       query
//         .in("meeting_interest", meeting_interest.split(","))
//         .gte("birthDate", minBirthDate)
//         .lte("birthDate", maxBirthDate);
//     } else {
//       // Query with one filter
//       if (keyword) {
//         query.ilike("hobbies_interests.hob_list", `%${keyword}%`);
//       }
//       if (meeting_interest) {
//         query.in("meeting_interest", meeting_interest.split(","));
//       }
//       if (min_age && max_age) {
//         query.gte("birthDate", minBirthDate).lte("birthDate", maxBirthDate);
//       }
//     }

//     const { data, error } = await query;
//     const getHobbyData = data.filter((row) =>
//       row.hobbies_interests.some((hobby) => hobby.hob_list.includes(keyword))
//     );
//     if (error) {
//       console.log(error);
//       return res.status(500).send("Server error");
//     }

//     // Don't show user that already in own merrylist
//     const { data: filterData, error: filterDataError } = await supabase
//       .from("merry_status")
//       .select("mer_id, user_id")
//       .eq("mer_id", userId);
//     if (filterDataError) throw filterDataError;
//     const alreadyUser = filterData.map((user) => user.user_id);
//     const filteredData = getHobbyData.filter(
//       (data) => !alreadyUser.includes(data.user_id)
//     );
//     const filteredData2 = data.filter(
//       (data) => !alreadyUser.includes(data.user_id)
//     );
//     // Don't show user in RejectList
//     const { data: getRejectUser, error: getRejectUserError } = await supabase
//       .from("merry_reject")
//       .select("user_id")
//       .eq("mer_id", userId);
//     if (getRejectUserError) throw getRejectUserError;
//     const rejectUser = getRejectUser.map((user) => user.user_id);
//     const NewUserData1 = filteredData.filter(
//       (data) => !rejectUser.includes(data.user_id)
//     );
//     const NewUserData2 = filteredData2.filter(
//       (data) => !rejectUser.includes(data.user_id)
//     );

//     if (keyword) {
//       return res.json(NewUserData1);
//     } else {
//       return res.json(NewUserData2);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Server error");
//   }
// });

// ---------------delete user----------------------

// usersRouter.delete("/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const { error } = await supabase
//       .from("users")
//       .delete()
//       .eq("user_id", userId);

//     if (error) {
//       throw error;
//     }

//     const { error: error2 } = await supabase
//       .from("merry_list")
//       .delete()
//       .eq("mer_id", userId);

//     if (error2) {
//       throw error2;
//     }

//     res.json({ message: "Your account has been delete successfully." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

export default usersRouter;
