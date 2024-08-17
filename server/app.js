import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import express from "express";
import authRouter from "./auth/auth.js";
import usersRouter from "./users/users.js";
import merryRouter from "./merrylist/merrylist.js";
import merryRejectRouter from "./merrylist/merryReject.js";
import chatRouter from "./merrylist/chat.js";
import complaintRouter from "./complaint/complaint.js";
import { protect } from "./middlewares/protect.js";
import notificationRouter from "./notification/notification.js";

dotenv.config();

export const supabase = createClient(
  "https://lulfbwiluepkywyznarx.supabase.co",
  process.env.SERVICE_KEY
);

async function init() {
  const app = express();
  const port = 3000;

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));

  app.use("/auth", authRouter);
  app.use("/users", protect, usersRouter);
  app.use("/merrylist", protect, merryRouter);
  app.use("/merryreject", protect, merryRejectRouter);
  app.use("/chat", protect, chatRouter);
  app.use("/complaint", protect, complaintRouter);
  app.use("/notification", protect, notificationRouter);

  app.listen(port, () => {
    console.log("Server listening on port 3000");
  });
}

init();
