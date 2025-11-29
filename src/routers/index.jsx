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

const router = createBrowserRouter([
  // 🏠 Layout หลักสำหรับผู้ใช้ทั่วไป
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/detail/:id", element: <Detail /> },
      { path: "/filter", element: <Filter /> },
      { path: "/add-announce", element: <AddAnnounce /> },
      { path: "/edit-announce/:id", element: <EditAnnounce /> },
      { path: "/profile", element: <Profile /> },
      { path: "/public-profile/:userId", element: <PublicProfile /> },
      { path: "/about-us", element: <About /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/notifications/:notifyId", element:<NotificationDetail />},
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/bookmarks", element: <Bookmarks /> },
      // { path: "/payment", element: <Payment /> },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "announce/history", element: <HistoryTable /> },
      { path: "announce/published", element: <Publish /> },
      { path: "announce/pending", element: <PendingTable />},
      // 👇 ถ้ามีหน้าอื่นในอนาคต เช่น:
      { path: "announce/details/:id", element: <ShareAnnounce /> },
      { path: "notifications/send", element: <SendNotification /> },
      // { path: "users", element: <ManageUsers /> },
    ],
  },
]);

export default router;
