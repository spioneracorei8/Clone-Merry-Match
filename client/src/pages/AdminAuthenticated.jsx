import { Routes, Route } from "react-router-dom";
import AdminDetailPage from "../admin/AdminDetailPage";
import ComplaintList from "../admin/ComplaintList";

function AdminAuthenticated() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ComplaintList />} />
        <Route path="/detail" element={<AdminDetailPage />} />
      </Routes>
    </>
  );
}

export default AdminAuthenticated;
