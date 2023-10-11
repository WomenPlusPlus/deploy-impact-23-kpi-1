import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import KpiPage from "./pages/KpiPage.tsx";
// import EachCircleKpi from "./pages/EachCircleKpi.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import UserDetailsPage from "./pages/UserDetailsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/kpi/:circleId", element: <KpiPage /> },
      // { path: "/kpi/:circlename", element: <EachCircleKpi /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/settings", element: <UserDetailsPage /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
