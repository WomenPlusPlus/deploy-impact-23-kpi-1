import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../supabase";
import { AuthError } from "@supabase/supabase-js";

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
    <>
      {" "}
      <div className="flex flex-col items-center justify-center mt-10 gap-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 md:text-3xl">
          Log In
        </h1>
        <form
          className="w-1/3"
          onSubmit={(e: React.SyntheticEvent) => handleLogin(e)}
        >
          <div className="flex flex-col text-sm mb-5">
            <label className="font-bold mb-2 text-gray-800" htmlFor="email">
              Email
            </label>
            <input
              className="appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500 rounded-lg"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="error">{error?.message}</div>
          <div className="flex flex-col text-sm mb-7">
            <label className="font-bold mb-2 text-gray-800" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500 rounded-lg"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full shadow-sm rounded-lg bg-yellow-500 hover:bg-yellow-600 py-2 px-4">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
