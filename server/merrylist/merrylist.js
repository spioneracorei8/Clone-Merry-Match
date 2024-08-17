import { Router } from "express";
import { supabase } from "../app.js";

const merryRouter = Router();

// get all user in merry match
merryRouter.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("merry_status").select("*");

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// get all user in merrylist page
merryRouter.get("/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { data, error } = await supabase
      .from("merry_status")
      .select("mer_id, user_id")
      .eq("mer_id", userId);

    if (error) throw error;

    const userIds = data.map((user) => user.user_id);
    const { data: usersData, error: usersDataError } = await supabase
      .from("users")
      .select(
        "user_id, name, birthDate, location, city, sexual_identity, sexual_preference, racial_preference, meeting_interest,merry_status(*),pictures(pic_url), hobbies_interests(hob_list)"
      )
      .in("user_id", userIds);

    if (usersDataError) throw usersDataError;

    const filteredUsersData = usersData
      .map((user) => {
        return {
          ...user,
          merry_status: user.merry_status.filter((status) => {
            return status.mer_id === userId;
          }),
        };
      })
      .filter((user) => user.merry_status.length > 0);
    res.json(filteredUsersData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// put user in merrylist by love of swipe right
merryRouter.put("/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const newUserId = parseInt(req.body.newUserId);

    if (userId === newUserId) {
      return res.json({ message: "You cannot add yourself" });
    } else {
      const { data: existingData } = await supabase
        .from("merry_status")
        .select("status_id")
        .eq("mer_id", userId)
        .eq("user_id", newUserId);

      if (existingData.length === 0) {
        const { error: updateError } = await supabase
          .from("merry_status")
          .insert([
            { mer_id: userId, user_id: newUserId, mer_status: "Not Match Yet" },
          ])
          .eq("mer_id", userId);

        if (updateError) throw updateError;
      }
      if (existingData.length > 0) {
        return res.json({ message: "This user has been in your merrylist" });
      }
      // select status_id form meery_status for updating to merry_list
      const { data, selectError } = await supabase
        .from("merry_status")
        .select("status_id")
        .eq("mer_id", userId);

      if (selectError) throw selectError;

      const statusIds = data
        .map((status) => status.status_id)
        .filter((id) => id !== null && id !== undefined);
      const newStatusIds = [...statusIds, data.status_id];
      const newAllStatusId = newStatusIds.filter(
        (id) => id !== null && id !== undefined
      );

      // Update the all_user field in the database
      const { error: insertError } = await supabase
        .from("merry_list")
        .update({ all_status_id: newAllStatusId })
        .eq("mer_id", userId);

      if (insertError) throw insertError;

      // when people swipe right together let merrymatch
      const { data: matching, error } = await supabase
        .from("merry_status")
        .select("*")
        .or(
          `and(mer_id.eq.${userId},user_id.eq.${newUserId}),and(mer_id.eq.${newUserId},user_id.eq.${userId}))`
        );

      if (error) {
        console.error(error);
      } else {
        console.log(matching);
      }

      if (matching && matching.length === 2) {
        for (let i = 0; i < matching.length; i++) {
          const { error: updateError } = await supabase
            .from("merry_status")
            .update({ mer_status: "MerryMatch" })
            .eq("status_id", matching[i].status_id);
          if (updateError) throw updateError;
        }
        // add mer_id to table match
        const { error: insertMatchError } = await supabase
          .from("match")
          .insert({ mer_id1: userId, mer_id2: newUserId });
        if (insertMatchError) throw insertError;
      }

      res.json({ message: "Merrylist has been updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// deleted user in merry_status
merryRouter.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const deleteUserId = req.body.deleteUserId;
    const { data, error } = await supabase
      .from("merry_status")
      .select("status_id")
      .eq("mer_id", userId)
      .eq("user_id", deleteUserId)
      .single();

    if (error) throw error;

    if (data) {
      const { error: deleteError } = await supabase
        .from("merry_status")
        .delete()
        .eq("mer_id", userId)
        .eq("user_id", deleteUserId);

      if (deleteError) throw deleteError;
    }

    const { data: selectData, error: selectError } = await supabase
      .from("merry_status")
      .select("status_id")
      .eq("mer_id", userId);

    if (selectError) throw selectError;

    const allStatusIds = selectData
      .map((status) => status.status_id)
      .filter((id) => id !== null && id !== undefined);

    // Update the all_user field in the database
    const { error: insertError } = await supabase
      .from("merry_list")
      .update({ all_status_id: allStatusIds })
      .eq("mer_id", userId);

    if (insertError) throw insertError;

    const { data: matching, error: matchingError } = await supabase
      .from("merry_status")
      .select("*")
      .or(
        `and(mer_id.eq.${userId},user_id.eq.${deleteUserId}),and(mer_id.eq.${deleteUserId},user_id.eq.${userId}))`
      );

    if (matchingError) {
      console.error(matchingError);
    } else {
      console.log(matching);
    }
    if (matching) {
      const { error: updateError } = await supabase
        .from("merry_status")
        .update({ mer_status: "Not Match Yet" })
        .eq("mer_id", deleteUserId);
      if (updateError) throw updateError;
      // delete match table
      const { error: deleteMatchError } = await supabase
        .from("match")
        .delete()
        .eq("mer_id2", deleteUserId);
      if (deleteMatchError) throw deleteMatchError;
    }

    res.json({
      message: `User ${deleteUserId} removed from Merry List ${userId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

export default merryRouter;
