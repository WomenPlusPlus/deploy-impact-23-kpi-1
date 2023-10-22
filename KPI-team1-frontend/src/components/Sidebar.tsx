import Logo from "../assets/images/logo .png";
import { HiOutlineTableCells } from "react-icons/hi2";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { HiStar } from "react-icons/hi2";
import { AiOutlineSetting } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabase";
import { User, UserDetails } from "../model/user";
import { Circles } from "../model/circle";
import SearchBar from "./Searchbar";

interface SideBarProps {
  user: User;
  setUser: any;
  circles: Circles[];
  setCircles: (circles: Circles[]) => void;
  userDetails: UserDetails;
  setUserDetails: (userDetails: UserDetails) => void;
}

export default function SideBar({
  user,
  setUser,
  circles,
  setCircles,
  userDetails,
  setUserDetails,
}: SideBarProps): JSX.Element {
  const isSearchKpi: boolean = false;

  async function handleLogout() {
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser({});
    setCircles([]);
    setUserDetails({ username: null, defaultCircleId: null });
  }

  return (
    <>
      <section className="max-h-full my-auto">
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
              <img className="w-14 h-14" src={Logo} alt="Pro Juventute logo" />
              <div className="text-2xl">KPI tracking</div>
            </NavLink>
            <div>
              <NavLink
                to={"/kpi/circles"}
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
              >
                <span>
                  <HiOutlinePresentationChartLine />
                </span>
                <div className="font-medium">Dashboard</div>
              </NavLink>

              <div className="w-56 bg-[#F0F0F6] flex flex-col py-6 px-4 items-center gap-4 rounded-lg my-10">
                <SearchBar isSearchKpi={isSearchKpi} />
                {circles &&
                  circles.map((circle, index) => (
                    <NavLink
                      to={`/kpi/circles/${circle.circle_user[0].circle_id}`}
                      className={({ isActive }) =>
                        " rounded-lg flex items-center p-4 gap-4 self-stretch  text-black" +
                        (isActive ? " bg-[#FBBB21]" : "  hover:bg-gray-300")
                      }
                      key={index}
                    >
                      <span className="text-xl">
                        <HiStar />
                      </span>
                      <div>{circle.circle_name}</div>
                    </NavLink>
                  ))}
              </div>
              <hr />
              <div>
                {user?.id ? (
                  <NavLink
                    to="/settings"
                    className="text-xl flex items-center gap-2.5 p-4 self-stretch text-[#7C7E7E]"
                  >
                    <span>
                      <AiOutlineSetting />
                    </span>
                    <div className="font-medium">Settings</div>
                  </NavLink>
                ) : (
                  <></>
                )}
                {user?.id ? (
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
                <div className="mt-16 px-4">
                  <span>
                    Welcome{" "}
                    {userDetails && userDetails.username
                      ? userDetails.username
                      : user.email}
                  </span>
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
