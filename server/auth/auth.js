import { Router } from "express";
import { supabase } from "../app.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const {
    username,
    password,
    name,
    birthDate,
    location,
    city,
    email,
    sexual_identity,
    sexual_preference,
    racial_preference,
    meeting_interest,
    hobby,
    image,
  } = req.body;
  console.log(req.body);

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: hashPassword,
  });
  if (error) {
    console.log(error);
    res.status(400).send(error.message);
    return;
  } else {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username: username,
          password: hashPassword,
          name: name,
          birthDate: birthDate,
          location: location,
          city: city,
          email: email,
          sexual_identity: sexual_identity,
          sexual_preference: sexual_preference,
          racial_preference: racial_preference,
          meeting_interest: meeting_interest,
          created_at: new Date().toISOString(),
          last_logged_in: new Date().toISOString(),
          mer_id: null,
        },
      ])
      .select("user_id");
    if (error) {
      console.log(error);
      return res.status(500).send(error.message);
    } else {
      const userId = data[0].user_id;
      const { data: merData, error: merError } = await supabase
        .from("merry_list")
        .insert([
          {
            mer_id: userId,
          },
        ]);
      if (merError) {
        return res.status(500).send(merError.message);
      }

      const { data: insertMer, error: insertMerError } = await supabase
        .from("users")
        .update([
          {
            mer_id: userId,
            // mer_limit: 20,
          },
        ])
        .eq("user_id", userId);
      if (insertMerError) {
        return res.status(500).send(insertMerError.message);
      }

      const hobbyList = req.body.hobby?.slice(0, 10) || [];
      if (hobbyList.length > 0) {
        const { data: hobbyData, error: hobbyError } = await supabase
          .from("hobbies_interests")
          .insert(
            hobbyList.map((hobby) => {
              return {
                user_id: userId,
                hob_list: hobby,
              };
            })
          );

        if (hobbyError) {
          return res.status(500).send(hobbyError.message);
        }
      }
    }

    const userId = data[0].user_id;
    const { data: insertData, error: insertError } = await supabase
      .from("pictures")
      .insert(
        image.map((url) => {
          return {
            user_id: userId,
            pic_url: url.url,
          };
        })
      );
    if (insertError) {
      return res.status(500).send(insertError.message);
    }
  }
  return res.json({ message: "New User has been registed successfully" });
});

// login
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data: admindata } = await supabase
    .from("admins")
    .select()
    .eq("admin_username", username);
  console.log(admindata);
  if (admindata.length === 1) {
    const storedPassword = admindata[0].admin_password;

    if (storedPassword === password) {
      const token = jwt.sign(
        {
          admin_id: admindata[0].admin_id,
          admin_username: admindata[0].admin_username,
          role: admindata[0].role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.json({ token });
    }
  }

  const { data: userdata, error } = await supabase
    .from("users")
    .select("user_id, username, name, password,meeting_interest")
    .eq("username", username);

  if (error || !userdata || userdata.length === 0) {
    res.status(401).send("Invalid credentials");
    return;
  }

  const storedPassword = userdata[0].password;

  if (!storedPassword) {
    res.status(401).send("Invalid credentials");
    return;
  }

  const isValidPassword = await bcrypt.compare(password, storedPassword);

  if (!isValidPassword) {
    res.status(401).send("Invalid password");
    return;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ last_logged_in: new Date().toISOString() })
    .eq("user_id", userdata[0].user_id);

  const { data: profilePic } = await supabase
    .from("pictures")
    .select("*")
    .eq("user_id", userdata[0].user_id)
    .limit(1);

  if (updateError) {
    console.log(updateError);
    res.status(500).send("Server error");
  } else {
    const token = jwt.sign(
      {
        user_id: userdata[0].user_id,
        username: userdata[0].username,
        name: userdata[0].name,
        profilePic: profilePic[0].pic_url,
        meeting_interest: userdata[0].meeting_interest,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }
});

authRouter.get("/username/:username", async (req, res) => {
  // Check if username already exists
  const { username } = req.params;
  const { data: existingUsername, error: existingUsernameError } =
    await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .limit(1);
  if (existingUsernameError) {
    console.log(existingUsernameError);
    return res.status(500).send(existingUsernameError.message);
  }
  return res.json(existingUsername);
});

export default authRouter;
