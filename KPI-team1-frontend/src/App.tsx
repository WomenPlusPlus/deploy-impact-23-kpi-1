import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { User } from "./model/user";

const initialUser: User = {
  id: "",
  email: "",
};

export default function App() {
  const [user, setUser] = useState<User>(initialUser);

  async function fetchUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email || "" });
      } else {
        console.error("User data not available");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [user.id]);

  return (
    <div className="flex">
      <div className="w-min">
        <Sidebar user={user} setUser={setUser} />
      </div>
      <div className="w-full">
        <Outlet context={{ setUser }} />
      </div>
    </div>
  );
}
