import { Router } from "express";
import { supabase } from "../app.js";

const notificationRouter = Router();

// get notification
notificationRouter.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const { data: notifications, error: notificationsError } = await supabase
      .from("notification")
      .select(`*`)
      .eq("noti_recipient", userId)
      .eq("noti_read", false);
    if (notificationsError) throw notificationsError;

    const allSender = notifications.map((sender) => sender.noti_sender);

    const notificationsWithUserData = [];

    for (let i = 0; i < allSender.length; i++) {
      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select(
          "user_id, username, name, birthDate, email, location, city, sexual_preference, sexual_identity, meeting_interest, racial_preference, about_me, pictures(pic_url), hobbies_interests(hob_list)"
        )
        .eq("user_id", allSender[i]);
      if (userDataError) throw userDataError;

      const combinedData = {
        ...notifications[i],
        user: userData[0],
      };

      notificationsWithUserData.push(combinedData);
    }
    res.status(200).json(notificationsWithUserData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// send notification
notificationRouter.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // recipient is user_id of user that was subscribed
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name")
      .eq("user_id", userId);
    if (userError) throw userError;

    const recipientId = req.body.recipientId;

    // If user subscribe back
    const { data: statusData, error: statusDataError } = await supabase
      .from("merry_status")
      .select("mer_status")
      .or(
        `and(mer_id.eq.${userId},user_id.eq.${recipientId}),and(mer_id.eq.${recipientId},user_id.eq.${userId}))`
      );
    // console.log("statusData:", statusData);
    if (statusDataError) throw statusDataError;
    // console.log(statusData);
    if (statusData[0].mer_status === "MerryMatch") {
      const { data: insertMatchedData, error: insertMatchedDataError } =
        await supabase.from("notification").insert([
          {
            noti_sender: userId,
            noti_message: `You and ${userData[0].name} have matched with each others.`,
            noti_recipient: recipientId,
            noti_read: false,
          },
        ]);
      if (insertMatchedDataError) throw insertMatchedDataError;
      // Insert new notification to table
      if (insertMatchedData && insertMatchedData.length > 0) {
        const payload = {
          event: "NEW_NOTIFICATION",
          data: insertMatchedData[0],
        };
        await supabase
          .from("notification")
          .eq(recipientId, recipientId)
          .emit(payload);
      }
    } else {
      // Insert new notification to table
      const { data: insertData, error: insertError } = await supabase
        .from("notification")
        .insert([
          {
            noti_sender: userId,
            noti_message: `${userData[0].name} has matched with your profile.`,
            noti_recipient: recipientId,
            noti_read: false,
          },
        ]);
      if (insertError) throw insertError;

      // Send real-time update to subscribed clients
      if (insertData && insertData.length > 0) {
        const payload = { event: "NEW_NOTIFICATION", data: insertData[0] };
        await supabase
          .from("notification")
          .eq(recipientId, recipientId)
          .emit(payload);
      }
    }

    res
      .status(200)
      .json({ message: `Your notification has been sent successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

notificationRouter.patch("/:notiId", async (req, res) => {
  try {
    const notiId = req.params.notiId;
    const { error: updateNotificationError } = await supabase
      .from("notification")
      .update([{ noti_read: true }])
      .eq("noti_id", notiId)
      .single();
    if (updateNotificationError) throw updateNotificationError;
    res.json({ message: "Notification has been read" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

export default notificationRouter;
