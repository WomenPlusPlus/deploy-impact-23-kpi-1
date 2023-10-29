import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../supabase";
import Logo from "../assets/images/logo .png";
import { FavoriteCircle } from "../model/circle";
import { UserDetails } from "../model/user";

interface OutletContext {
  setUser: any;
  circles: FavoriteCircle[];
  userDetails: UserDetails;
  setCircleId: (circleId: number) => void;
}

export default function LoginPage(): JSX.Element {
  const { setUser, circles, userDetails, setCircleId }: OutletContext =
    useOutletContext();
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
          userData && setUser(userData);
        } else {
          setError("Incorrect email or password. Please retry!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (userDetails && userDetails.defaultCircleId) {
      setCircleId(Number(userDetails.defaultCircleId));
      navigate(`/kpi/circles/${userDetails.defaultCircleId}`);
    } else if (circles.length > 0 && circles[0].circle_user?.length > 0) {
      setCircleId(circles[0].circle_user[0].circle_id);
      navigate(`/kpi/circles/${circles[0].circle_user[0].circle_id}`);
    }
  }, [userDetails, circles]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center justify-center w-2/3 md:w-1/3 min-w-fit px-9 pb-24 pt-28 shadow-2xl rounded-lg bg-white">
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
              required
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
              required
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
