import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { User } from "./model/user";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { PiBell } from "react-icons/pi";
import { Circles } from "./model/circle";

const initialUser: User = {
  id: "",
  email: "",
};

// const initialCircles: Circles = {
//   circle_name: "",
//   circle_user:
// }

// const initialCircleUser: CircleUser = {
//   circle_user_id: ;
//   circle_id: number;
//   user_id: string;
// }

export default function App() {
  const [user, setUser] = useState<User>(initialUser);
  const [circles, setCircles] = useState<Circles[]>([]);
  // console.log(circles);

  async function fetchUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email || "" });
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }

  async function getCircles() {
    try {
      const { data, error } = await supabase
        .from("circle")
        .select("circle_name, circle_user!inner(*)")
        .eq("circle_user.user_id", user.id);
      if (error) throw error;
      setCircles(data);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }
  useEffect(() => {
    fetchUser();
    getCircles();
  }, [user.id]);

  return (
    <div className="flex min-h-screen">
      <div className="w-min shadow-lg">
        <Sidebar
          user={user}
          setUser={setUser}
          circles={circles}
          setCircles={setCircles}
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between py-4 px-8 border-b border-[#D0D8DB] ">
          <div className="bg-[#FFF] flex py-3 px-4 justify-between items-center rounded-lg border border-[#D0D8DB] w-1/2">
            <input
              className="text-sm outline-0"
              type="text"
              placeholder="Type to search for KPI's"
            />
            <span className="text-xl text-[#7C7E7E]">
              <HiOutlineMagnifyingGlass />
            </span>
          </div>
          <div className="flex justify-end items-center gap-20 border-l border-[#D0D8DB] w-1/3 py-1.5">
            <span className="text-xl">
              <PiBell />
            </span>
            <div className="text-xl">{user.email}</div>
          </div>
        </div>
        <div className="w-full bg-[#F9F9FA] h-full p-8">
          <Outlet context={{ setUser, circles }} />
        </div>
      </div>
    </div>
  );
}
