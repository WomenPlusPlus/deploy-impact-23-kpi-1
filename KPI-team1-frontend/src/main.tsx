import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import KpiPage from "./pages/KpiPage.tsx";
import EachKpi from "./pages/EachKpi.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import UserDetailsPage from "./pages/SettingsPage.tsx";
import Layout from "./Layout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LoginPage /> },
      {
        path: "/kpi",
        element: <Layout />,
        children: [
          { path: "circles/:circleId", element: <KpiPage /> },
          { path: "circles", element: <KpiPage /> },
          { path: ":kpiId", element: <EachKpi /> },
          { path: "dashboard/:circleId", element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "settings", element: <UserDetailsPage /> },
        ],
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
