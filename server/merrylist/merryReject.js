import { Router } from "express";
import { supabase } from "../app.js";

const merryRejectRouter = Router();

//  reject user
merryRejectRouter.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const rejectUserId = req.body.rejectUserId;
    const { data: existingData } = await supabase
      .from("merry_reject")
      .select("reject_id")
      .eq("mer_id", userId)
      .eq("user_id", rejectUserId);

    if (existingData.length === 0) {
      const { error: insertError } = await supabase
        .from("merry_reject")
        .insert([{ mer_id: userId, user_id: rejectUserId }])
        .eq("mer_id", userId);
      if (insertError) throw insertError;

      res.json({ message: "MerryReject has been create successfully" });
    } else {
      res.status(409).json({ message: "Record already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// remove user from reject list
merryRejectRouter.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const { data, error } = await supabase
      .from("merry_reject")
      .select("*")
      .eq("mer_id", userId);

    console.log(data);
    if (error) throw error;
    if (data) {
      const { error: deleteError } = await supabase
        .from("merry_reject")
        .delete()
        .eq("mer_id", userId);
      if (deleteError) throw deleteError;
    }
    res.json({ message: "All users that you rejected will be back" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

export default merryRejectRouter;
