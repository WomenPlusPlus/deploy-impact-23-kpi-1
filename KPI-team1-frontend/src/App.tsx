import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <>
      <div className=".ml-5">
        <Sidebar />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
