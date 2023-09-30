import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="grid grid-cols-5 ">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-4">
        <Outlet />
      </div>
    </div>
  );
}
