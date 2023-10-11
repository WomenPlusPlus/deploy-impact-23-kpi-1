import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import KpiPage from "./pages/KpiPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import EachKpi from "./pages/EachKpi.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/kpi/circles/:circleId", element: <KpiPage /> },
      { path: "/kpi/:kpiId", element: <EachKpi /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
