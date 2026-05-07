import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { Home } from "../pages/Home.jsx";
import { Detail } from "../pages/announcement/Detail.jsx";
import {Filter} from "../pages/Filter.jsx";
import { AddAnnounce } from "../pages/announcement/AddAnnounce.jsx";
import { EditAnnounce } from "../pages/announcement/EditAnnounce.jsx";
import { Profile } from "../pages/profile/Profile.jsx";
import { PublicProfile } from "../pages/profile/PublicProfile.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import HistoryTable from "../pages/admin/HistoryTable.jsx";
import Publish from "../pages/admin/Publish.jsx";
import {About} from "../pages/About.jsx";
import TermsOfService from "../pages/Terms.jsx";
import PrivacyPolicy from "../pages/Privacy.jsx";
import NotificationDetail from "../pages/notification/NotificationDetail.jsx";
import PendingTable from "../pages/admin/PendingTable.jsx";
import ShareAnnounce from "../pages/admin/ShareAnnounce.jsx";
import { ResetPassword } from "../pages/auth/ResetPassword.jsx";
import Bookmarks from "../pages/Bookmarks.jsx";
import {Payment} from "../pages/Payment.jsx";
import SendNotification from "../pages/admin/SendNotification.jsx";
import AdminBadges from "../pages/admin/AdminBadges.jsx";
import AdminAssignBadge from "../pages/admin/AdminAssignBadge.jsx";
import EditProfile from "../pages/profile/EditProfile.jsx";
import NotFound from "../pages/auth/NotFound.jsx";
import RequireRole from "../components/RequireRole.jsx";
import RequireAuth from "../components/RequireAuth.jsx";
import Forbidden from "../pages/auth/Forbidden.jsx";
import RequireVerification from "../components/RequireVerification.jsx";
import MyAnnounce from "../pages/announcement/MyAnnounce.jsx";
import AdminAnnounceDetail from "../pages/admin/AdminAnnounceDetail.jsx";
import AdminManageRoles from "../pages/admin/AdminManageRoles.jsx";
import { EditAnnounceReject } from "../pages/announcement/EditAnnounceReject.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";

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
      { path: "/draft", element: <RequireAuth><MyAnnounce /></RequireAuth> },
      { path: "/edit-announce-reject/:id", element:<RequireRole allowedRoles={['ROLE_AGENT']}><RequireVerification><EditAnnounceReject /></RequireVerification></RequireRole> },
      { path: "/share-announce/:id", element: <ShareAnnounce /> },
      // catch-all สำหรับ path ที่ไม่ตรง
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_MODERATOR"]}>
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "announce/history", element: <HistoryTable /> },
      { path: "announce/published", element: <Publish /> },
      { path: "announce/pending", element: <PendingTable />},
      { path: "announce/details/:id", element: <AdminAnnounceDetail /> },
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