import Logo from "../assets/images/layer1.svg";
import { HiOutlineTableCells } from "react-icons/hi2";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { HiStar } from "react-icons/hi2";
import { AiOutlineSetting } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "../model/user";
import { useEffect, useState } from "react";

interface SidebarProps {
  user: User;
  setUser: any;
}

export default function Sidebar({ user, setUser }: SidebarProps): JSX.Element {
  const [circles, setCircles] = useState([""]);
  console.log(circles);

  async function handleLogout() {
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser({});
    setCircles([""]);
  }

  async function getCircleName() {
    try {
      const { data, error } = await supabase
        .from("circle")
        .select("circle_name, circle_user!inner(*)")
        .eq("circle_user.user_id", user.id);
      if (error) throw error;
      const getCircles = data.map((circle) => circle.circle_name);
      setCircles(getCircles);
      // console.log("check data", data);
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }
  useEffect(() => {
    getCircleName();
  }, [user.id]);

  return (
    <>
      <section className="max-h-screen my-auto">
        <button
          id="hamburger-button"
          className="text-3xl md:hidden cursor-pointer px-4"
        >
          &#9776;
        </button>
        <div className="hidden sm:block">
          <div className="px-4 pt-14 flex flex-col gap-8 font-custom">
            <NavLink
              to={"/"}
              className="flex justify-center items-center self-stretch gap-4"
            >
              <img className="w-8 h-8" src={Logo} alt="Pro Juventute logo" />
              <div className="text-2xl">KPI tracking</div>
            </NavLink>
            <div>
              <NavLink
                to={"/kpi"}
                className={({ isActive }) =>
                  "text-xl flex items-center gap-3 p-4 self-stretch" +
                  (isActive
                    ? " bg-[#FBBB21] rounded-lg"
                    : " hover:bg-customGrey1 hover:rounded-lg")
                }
              >
                <span>
                  <HiOutlineTableCells />
                </span>
                <div className="font-medium">KPI's</div>
              </NavLink>
              <NavLink
                to={"/dashboard"}
                className={({ isActive }) =>
                  "text-xl flex items-center gap-3 p-4 self-stretch mt-2.5" +
                  (isActive
                    ? " bg-[#FBBB21] rounded-lg"
                    : "  hover:bg-customGrey1 hover:rounded-lg")
                }
                // className="text-xl flex items-center gap-2.5 p-4 self-stretch text-[#7C7E7E]"
              >
                <span>
                  <HiOutlinePresentationChartLine />
                </span>
                <div className="font-medium">Dashboard</div>
              </NavLink>

              <div className="bg-[#F0F0F6] flex flex-col py-6 px-4 items-center gap-4 rounded-lg my-10">
                <div className="bg-[#FFF] flex py-3 px-4 justify-between items-center rounded-lg border border-[#D0D8DB]">
                  <input
                    className="text-sm outline-0"
                    type="text"
                    placeholder="Search circle"
                  />
                  <span className="text-xl text-[#7C7E7E]">
                    <HiOutlineMagnifyingGlass />
                  </span>
                </div>
                {circles[0] &&
                  circles.map((circle, index) => (
                    <NavLink
                      to={`/kpi/${circle}`}
                      // className="bg-customGrey1 rounded-lg flex items-center p-4 gap-4 self-stretch"
                      className={({ isActive }) =>
                        " rounded-lg flex items-center p-4 gap-4 self-stretch  text-black" +
                        (isActive ? " bg-[#FBBB21]" : "  hover:bg-gray-300")
                      }
                      key={index}
                    >
                      <span className="text-xl">
                        <HiStar />
                      </span>
                      <div>{circle}</div>
                    </NavLink>
                  ))}
              </div>
              <hr />
              <div>
                <div className="text-xl flex items-center gap-2.5 p-4 self-stretch text-[#7C7E7E]">
                  <span>
                    <AiOutlineSetting />
                  </span>
                  <div className="font-medium">Settings</div>
                </div>
                {user.id ? (
                  <NavLink
                    to={"/"}
                    className="text-xl flex items-center gap-2.5 p-4 self-stretch text-[#7C7E7E]"
                    onClick={handleLogout}
                  >
                    <span>
                      <FiLogOut />
                    </span>
                    <div className="font-medium">Log out</div>
                  </NavLink>
                ) : (
                  <NavLink
                    to={"/login"}
                    className="text-xl flex items-center gap-2.5 p-4 self-stretch text-[#7C7E7E]"
                  >
                    <span>
                      <FiLogIn />
                    </span>
                    <div className="font-medium">Log in</div>
                  </NavLink>
                )}
              </div>
              {user.id ? (
                <div className="mt-10 px-4">
                  <span>Welcome {user.email}</span>{" "}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section id="mobile-menu"></section>
    </>
  );
}
