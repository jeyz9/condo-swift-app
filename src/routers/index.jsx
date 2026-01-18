import { createBrowserRouter } from "react-router";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { AdminLayout } from "../layouts/AdminLayout.jsx";

import { Home } from "../pages/Home.jsx";
import { Detail } from "../pages/Detail.jsx";
import { Filter } from "../pages/Filter.jsx";
import { AddAnnounce } from "../pages/AddAnnounce.jsx";
import { EditAnnounce } from "../pages/EditAnnounce.jsx";
import { Profile } from "../pages/Profile.jsx";
import { PublicProfile } from "../pages/PublicProfile.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import HistoryTable from "../pages/HistoryTable.jsx";
import Publish from "../pages/Publish.jsx";
import {About} from "../pages/About.jsx";
import TermsOfService from "../pages/Terms.jsx";
import PrivacyPolicy from "../pages/Privacy.jsx";
import NotificationDetail from "../pages/NotificationDetail.jsx";
import PendingTable from "../pages/PendingTable.jsx";
import ShareAnnounce from "../pages/ShareAnnounce.jsx";
import { ResetPassword } from "../pages/ResetPassword.jsx";
import Bookmarks from "../pages/Bookmarks.jsx";
import {Payment} from "../pages/Payment.jsx";
import SendNotification from "../pages/SendNotification.jsx";
import AdminBadges from "../pages/AdminBadges.jsx";
import AdminAssignBadge from "../pages/AdminAssignBadge.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import NotFound from "../pages/NotFound.jsx";
import RequireRole from "../components/RequireRole.jsx";
import RequireAuth from "../components/RequireAuth.jsx";
import Forbidden from "../pages/Forbidden.jsx";
import RequireVerification from "../components/RequireVerification.jsx";
import VerifyEmail from "../pages/verifyEmail.jsx";
import Draft from "../pages/Draft.jsx";
import AdminAnnounceDetail from "../pages/AdminAnnounceDetail.jsx";
import AdminManageRoles from "../pages/AdminManageRoles.jsx";

const router = createBrowserRouter([
  // 🏠 Layout หลักสำหรับผู้ใช้ทั่วไป
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/detail/:id", element: <Detail /> },
      { path: "/filter", element: <Filter /> },
      { path: "/add-announce", element: <RequireRole allowedRoles={['ROLE_AGENT']}><RequireVerification><AddAnnounce /></RequireVerification></RequireRole> },
      { path: "/edit-announce/:id", element: <RequireRole allowedRoles={['ROLE_AGENT']}><RequireVerification><EditAnnounce /></RequireVerification></RequireRole> },
      { path: "/profile", element: <RequireAuth><Profile /></RequireAuth> },
      { path: "/profile/edit", element: <RequireAuth><EditProfile /></RequireAuth> },
      { path: "/public-profile/:userId", element: <PublicProfile /> },
      { path: "/about-us", element: <About /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/notifications/:notifyId", element: <RequireAuth><NotificationDetail /></RequireAuth>},
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/bookmarks", element: <RequireAuth><Bookmarks /></RequireAuth> },
      { path: "/forbidden", element: <Forbidden /> },
      { path: "/verify-email/verify", element: <VerifyEmail /> },
      { path: "/draft", element: <RequireAuth><Draft /></RequireAuth> },
      // catch-all สำหรับ path ที่ไม่ตรง
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <RequireRole allowedRoles={["ROLE_ADMIN"]}>
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "announce/history", element: <HistoryTable /> },
      { path: "announce/published", element: <Publish /> },
      { path: "announce/pending", element: <PendingTable />},
      { path: "announce/pending/:id", element: <AdminAnnounceDetail /> },
      // 👇 ถ้ามีหน้าอื่นในอนาคต เช่น:
      { path: "announce/details/:id", element: <ShareAnnounce /> },
      { path: "notifications/send", element: <SendNotification /> },
      { path: "badges/manage", element: <AdminBadges /> },
      { path: "badges/assign", element: <AdminAssignBadge /> },
      { path: "users/roles", element: <AdminManageRoles /> },
      // { path: "users", element: <ManageUsers /> },
      // admin-specific catch-all (ไม่ให้ตกไปหน้า public)
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;