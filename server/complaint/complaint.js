import { Router } from "express";
import { supabase } from "../app.js";

const complaintRouter = Router();

complaintRouter.get("/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const { keyword, status } = req.query;
    const { data: adminData, error: adminDataError } = await supabase
      .from("admins")
      .select("role")
      .eq("admin_id", adminId);
    if (adminDataError) throw adminDataError;
    if (adminData[0].role === "admin") {
      if (
        typeof req.query === "undefined" ||
        Object.keys(req.query).length === 0
      ) {
        const { data: complaintData, error: complaintDataError } =
          await supabase
            .from("complaint")
            .select("*, users(name)")
            .order("com_date", { ascending: false });
        if (complaintDataError) throw complaintDataError;
        return res.json(complaintData);
      }
      // Get by search
      const query = supabase
        .from("complaint")
        .select(`*,users(name)`)
        .order("com_date", { ascending: false });
      if (keyword && status) {
        query.ilike("users.name", `%${keyword}%`).eq("com_status", status);
      } else {
        if (keyword) {
          query.ilike("users.name", `%${keyword}%`);
        }
        if (status) {
          query.eq("com_status", status);
        }
      }
      const { data: complaintData, error: complaintDataError } = await query;
      if (complaintDataError) throw complaintDataError;
      if (keyword) {
        const filteredComplaintData = complaintData.filter(
          (item) =>
            item.users &&
            item.users.name &&
            item.users.name.toLowerCase().includes(keyword.toLowerCase())
        );
        return res.json(filteredComplaintData);
      }
      return res.json(complaintData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// choose one specific complaint
complaintRouter.get("/:adminId/:complaintId", async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const complaintId = req.params.complaintId;
    const { data: complaintData, error: complaintDataError } = await supabase
      .from("complaint")
      .select(`*, resolve(res_action_date),users(name)`)
      .eq("com_id", complaintId)
      .not("resolve.res_action_date", "is", null);
    if (complaintDataError) throw complaintDataError;

    if (
      complaintData[0].com_status !== "Resolved" &&
      complaintData[0].com_status !== "Cancel"
    ) {
      const { error: updateStatusError } = await supabase
        .from("complaint")
        .update([
          {
            com_status: "Pending",
          },
        ])
        .eq("com_id", complaintId);
      if (updateStatusError) throw updateStatusError;
    }
    return res.json(complaintData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// example post
// {
//   "title": "มีบัคจ้า",
//   "description": "ไม่สามารถสมัครMemberได้",
//   "status": "New"
// *status has: "New", "Pending", "Resolved", "Cancel"
// }
// user write complaint
complaintRouter.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, description } = req.body;
    const timeCreate = new Date().toISOString();
    const { error: insertError } = await supabase.from("complaint").insert([
      {
        user_id: userId,
        com_title: title,
        com_description: description,
        com_status: "New",
        com_date: timeCreate,
      },
    ]);
    if (insertError) throw insertError;
    return res.json({ message: "Your complaint has been post successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// admin resolve or cancel complain
complaintRouter.put("/:adminId/:complaintId", async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const complaintId = req.params.complaintId;
    const status = req.body.status;
    const resolveOrCancelDate = new Date().toISOString();
    const { data: adminData, error: adminDataError } = await supabase
      .from("admins")
      .select("role")
      .eq("admin_id", adminId);
    if (adminDataError) throw adminDataError;
    if (adminData[0].role === "admin") {
      const { error: updateError } = await supabase
        .from("complaint")
        .update([{ com_status: status }])
        .eq("com_id", complaintId);
      if (updateError) throw updateError;

      const { data: statusData, error: statusDataError } = await supabase
        .from("complaint")
        .select("com_status")
        .eq("com_id", complaintId);
      if (statusDataError) throw statusDataError;

      const { data: resolveData, error: resolveDataError } = await supabase
        .from("resolve")
        .select("com_id")
        .eq("com_id", complaintId);
      if (resolveDataError) throw resolveDataError;
      if (
        statusData[0].com_status === "Resolved" ||
        statusData[0].com_status === "Cancel"
      ) {
        if (resolveData.length === 0) {
          const { error: insertError } = await supabase.from("resolve").insert([
            {
              com_id: complaintId,
              admin_id: adminId,
              res_action_date: resolveOrCancelDate,
            },
          ]);
          if (insertError) throw insertError;
        } else {
          const { error: updateError } = await supabase
            .from("resolve")
            .update({ admin_id: adminId, res_action_date: resolveOrCancelDate })
            .eq("com_id", complaintId);
          if (updateError) throw updateError;
        }
      }
    }
    return res.json({ message: "Complaint has been updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// ---------------delete complaint----------------------
// In figma there has no delete. All complaint that was resolved has been showed. Change only status
complaintRouter.delete("/:adminId/:complaintId", async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const complaintId = req.params.complaintId;
    const { data: adminData, error: adminDataError } = await supabase
      .from("admins")
      .select("role")
      .eq("admin_id", adminId);
    if (adminDataError) throw adminDataError;
    if (adminData[0].role === "admin") {
      const { error: deleteError } = await supabase
        .from("complaint")
        .delete()
        .eq("com_id", complaintId);
      if (deleteError) throw deleteError;
      return res.json({ message: "Complaint has been deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

export default complaintRouter;
