import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../supabase";
import Logo from "../assets/images/logo .png";
import { Circles } from "../model/circle";

interface OutletContext {
  setUser: any;
  circles: Circles[];
}

export default function LoginPage(): JSX.Element {
  const { setUser, circles }: OutletContext = useOutletContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleLogin(e: React.SyntheticEvent) {
    try {
      e.preventDefault();
      let { data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data) {
        if (data.user) {
          const userData = {
            id: data.user.id,
            email: data.user.email,
          };
          setUser(userData); // Update the user state in the App component
          navigate(`/kpi/${circles[0]?.circle_user[0]?.circle_id}`);
        }
        setError("Incorrect email or password. Please retry!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-col items-center justify-center w-2/3 md:w-2/6 min-w-fit px-9 pb-16 pt-20 shadow-lg rounded-lg bg-white">
        <div className="flex justify-center items-center self-stretch gap-4">
          <img className="w-14 h-14" src={Logo} alt="Pro Juventute logo" />
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
          <div className="flex flex-col text-sm mb-5">
            <input
              className="appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-[#ADBCF2] focus:border-2 rounded-lg"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-sm text-red-600 mb-3">{error}</div>
          <button className="w-full shadow-sm rounded-lg bg-[#FBBB21] hover:bg-yellow-600 py-2 px-4">
            Login
          </button>
          <div className="mt-8 text-center">Forget Password?</div>
        </form>
      </div>
    </div>
  );
}
