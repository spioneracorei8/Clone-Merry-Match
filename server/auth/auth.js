import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NewUUID } from "../utils/util.js";
import { ConvertToThaiTime } from "../utils/util.js";
const authRouter = Router();
const prisma = new PrismaClient({
  log: ['query'], 
});

authRouter.post("/register", async (req, res) => {
  const {
    username,
    password,
    name,
    birth_date,
    location,
    city,
    email,
    sexual_identity,
    sexual_preference,
    racial_preference,
    meeting_interest,
    hobbies,
    images,
  } = req.body;
  console.log("req.body", req.body);  
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    // $transaction is a method that allows you to run multiple operations in a single transaction
    // if any of the operations fail, the entire transaction is rolled back
    // if this transaction have any error, it will throw an error
    // and not create data in the database
    const regsiteredUser = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          id: NewUUID(),
          username,
          password: hashPassword,
          name,
          birth_date: ConvertToThaiTime(new Date(birth_date)),
          location,
          city,
          email,
          sexual_identity,
          sexual_preference,
          racial_preference,
          meeting_interest,
          hobbies,
          created_at: ConvertToThaiTime(new Date()),
          updated_at: ConvertToThaiTime(new Date()),
          
          image: {
            create: images
            .map(image => ({
              id: NewUUID(),
              image_url: image,
              created_at: ConvertToThaiTime(new Date()),
              updated_at: ConvertToThaiTime(new Date()),
            }))
          },
        }
      })

      return createdUser
    })

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        error,
        "error msg": 'Username or email already exists',
      });
    } else if (error.code === 'P2025') {
      return res.status(400).json({
        error: 'Record not found',
      });
    } else {
      return res.status(500).json({
        error,
      });
    }
  }
  return res.status(200).json({ 
    message: "New User has been registed successfully",
  });
});

// // login
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // const { data: admindata } = await supabase
  //   .from("admins")
  //   .select()
  //   .eq("admin_username", username);
  // console.log(admindata);
  // if (admindata.length === 1) {
  //   const storedPassword = admindata[0].admin_password;

  //   if (storedPassword === password) {
  //     const token = jwt.sign(
  //       {
  //         admin_id: admindata[0].admin_id,
  //         admin_username: admindata[0].admin_username,
  //         role: admindata[0].role,
  //       },
  //       process.env.SECRET_KEY,
  //       { expiresIn: "1h" }
  //     );
  //     return res.json({ token });
  //   }
  // }

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

    const images = await prisma.image.findMany({
      where: {
        user_id: user.id,
      },
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
  })

  const token = jwt.sign(
    {
      user_id: user.id,
      username: user.username,
      name: user.name,
      meeting_interest: user.meeting_interest,
      profile_pictures: images,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  )
  return res.json({ token });

  // const { data: userdata, error } = await supabase
  //   .from("users")
  //   .select("user_id, username, name, password, meeting_interest")
  //   .eq("username", username);

  // if (error || !userdata || userdata.length === 0) {
  //   res.status(401).send("Invalid credentials");
  //   return;
  // }

  // const storedPassword = userdata[0].password;

  // if (!storedPassword) {
  //   res.status(401).send("Invalid credentials");
  //   return;
  // }

  // // const isValidPassword = await bcrypt.compare(password, storedPassword);

  // if (!isValidPassword) {
  //   res.status(401).send("Invalid password");
  //   return;
  // }

  // const { error: updateError } = await supabase
  //   .from("users")
  //   .update({ last_logged_in: new Date().toISOString() })
  //   .eq("user_id", userdata[0].user_id);

  // const { data: profilePic } = await supabase
  //   .from("pictures")
  //   .select("*")
  //   .eq("user_id", userdata[0].user_id)
  //   .limit(1);

  // if (updateError) {
  //   console.log(updateError);
  //   res.status(500).send("Server error");
  // } else {
  //   const token = jwt.sign(
  //     {
  //       user_id: userdata[0].user_id,
  //       username: userdata[0].username,
  //       name: userdata[0].name,
  //       profilePic: profilePic[0].pic_url,
  //       meeting_interest: userdata[0].meeting_interest,
  //     },
  //     process.env.SECRET_KEY,
  //     { expiresIn: "1h" }
  //   );
  // }
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
      "message": "Username has already exists",
      "is_available": false,
    });
  }
  return res.status(200).json({
    "message": "Username is available",
    "is_available": true,
  });

});

export default authRouter;
