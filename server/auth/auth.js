import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NewUUID } from "../utils/util.js";
import { ConvertToThaiTime } from "../utils/util.js";
import multer from "multer";
import { PhotoFilter } from "../constant/file.js";
import { HOST } from "../constant/constant.js";
import { SUCCESS } from "../constant/status_code.js";
import { getPathFile } from "../utils/file.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let userId;

function genUUID() {
  userId = NewUUID();
}

const photosStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      genUUID();
      const uploadPath = path.join(__dirname, `../uploads/${userId}/`);

      await fs.promises.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uuid = NewUUID();
    const newFileName = uuid.replaceAll("-", "");
    cb(null, newFileName + file.originalname);
  },
});

const upload = multer({
  storage: photosStorage,
  fileFilter: PhotoFilter,
  limits: { fileSize: 7000000 },
});

const authRouter = Router();
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

authRouter.post("/register", upload.array("files", 5), async (req, res) => {
  const body = JSON.parse(req.body.body);
  const photos = req.files;

  body.photos.forEach((photo, index) => {
    photos.forEach((f) => {
      const fileIdx = parseInt(f.originalname.split(".")[0]);
      if (index === fileIdx) {
        const path = `${userId}/${f.filename}`;
        if (path !== null) {
          photo.status = "active";
        } else {
          photo.status = "inactive";
        }
        return (photo.path = path);
      }
    });
  });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(body.password, salt);
  try {
    // $transaction is a method that allows you to run multiple operations in a single transaction
    // if any of the operations fail, the entire transaction is rolled back
    // if this transaction have any error, it will throw an error
    // and not create data in the database
    const register = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: userId,
          username: body.username,
          password: hashPassword,
          name: body.name,
          birth_date: ConvertToThaiTime(new Date(body.birth_date)),
          location: body.location,
          city: body.city,
          email: body.email,
          sexual_identity: body.sexual_identity,
          sexual_preference: body.sexual_preference,
          racial_preference: body.racial_preference,
          meeting_interest: body.meeting_interest,
          hobbies: body.hobbies,
          created_at: ConvertToThaiTime(new Date()),
          updated_at: ConvertToThaiTime(new Date()),

          photo: {
            create: body.photos.map((photo) => ({
              id: NewUUID(),
              path: photo.path,
              status: photo.status !== undefined ? photo.status : "inactive",
              created_at: ConvertToThaiTime(new Date()),
              updated_at: ConvertToThaiTime(new Date()),
            })),
          },
        },
      });

      return user;
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        error,
        "error msg": "Username or email already exists",
      });
    } else if (error.code === "P2025") {
      return res.status(400).json({
        error: "Record not found",
      });
    } else {
      return res.status(500).json({
        error,
      });
    }
  }
  return res.status(200).json({
    status: SUCCESS,
  });
});

// // login
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      password: true,
      name: true,
      meeting_interest: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const photos = await prisma.photo.findMany({
    where: {
      user_id: user.id,
    },
  });

  photos.forEach((photo) => {
    photo.path = getPathFile(photo.path);
  });

  const hashedPassword = user.password;
  const isValidPassword = await bcrypt.compare(password, hashedPassword);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        last_logged_in: ConvertToThaiTime(new Date()),
      },
    });
  });

  const token = jwt.sign(
    {
      user_id: user.id,
      username: user.username,
      name: user.name,
      meeting_interest: user.meeting_interest,
      photos: photos,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  return res.json({ token });
});

authRouter.get("/username/:username", async (req, res) => {
  // Check if username already exists
  const { username } = req.params;
  console.log("us", username);
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });

  if (user) {
    return res.status(200).json({
      message: "Username has already exists",
      is_available: false,
    });
  }
  return res.status(200).json({
    message: "Username is available",
    is_available: true,
  });
});

export default authRouter;
