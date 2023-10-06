import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../supabase";
import { AuthError } from "@supabase/supabase-js";
import Logo from "../assets/images/layer1.svg";

interface OutletContext {
  setUser: any;
}

export default function LoginPage(): JSX.Element {
  const { setUser }: OutletContext = useOutletContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthError>();

  const navigate = useNavigate();

  async function handleLogin(e: React.SyntheticEvent) {
    try {
      e.preventDefault();
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error);
      if (data) {
        const userData = {
          id: data.user?.id || "",
          email: data.user?.email || "",
        };
        setUser(userData); // Update the user state in the App component
        navigate("/kpi");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-col items-center justify-center w-2/3 md:w-2/6 min-w-fit px-9 pb-16 pt-20 shadow-lg rounded-lg bg-white">
        <div className="flex justify-center items-center self-stretch gap-4">
          <img src={Logo} alt="Pro Juventute logo" />
          <div className="text-2xl">KPI tracking</div>
        </div>
        <form
          className="w-full pt-10"
          onSubmit={(e: React.SyntheticEvent) => handleLogin(e)}
        >
          <div className="flex flex-col text-sm mb-5">
            <input
              className="appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-[#ADBCF2] focus:border-2 rounded-lg"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="error">{error?.message}</div>
          <div className="flex flex-col text-sm mb-7">
            <input
              className="appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-[#ADBCF2] focus:border-2 rounded-lg"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full shadow-sm rounded-lg bg-[#FBBB21] hover:bg-yellow-600 py-2 px-4">
            Login
          </button>
          <div className="mt-8 text-center">Forget Password?</div>
        </form>
      </div>
    </div>
  );
}
