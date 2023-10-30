import Logo from "../assets/images/logo .png";
import { HiOutlineTableCells } from "react-icons/hi2";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { HiStar } from "react-icons/hi2";
import { AiOutlineSetting } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { User, UserDetails } from "../model/user";
import { FavoriteCircle } from "../model/circle";
import SearchBar from "./Searchbar";

interface SideBarProps {
  user: User;
  setUser: (user: User) => void;
  favoriteCircles: FavoriteCircle[];
  setFavoriteCircles: (circles: FavoriteCircle[]) => void;
  userDetails: UserDetails;
  setUserDetails: (userDetails: UserDetails) => void;
  circleId: number | null;
  setCircleId: (circleId: number | null) => void;
}

export default function SideBar({
  user,
  setUser,
  favoriteCircles,
  setFavoriteCircles,
  userDetails,
  setUserDetails,
  circleId,
  setCircleId,
}: SideBarProps): JSX.Element {
  const isSearchKpi: boolean = false;
  const navigate = useNavigate();

  async function handleLogout() {
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser({ id: "", email: "" });
    setCircleId(null);
    setFavoriteCircles([]);
    setUserDetails({ username: null, defaultCircleId: null });
    navigate("/");
  }
  const location = useLocation();
  const isLinkActive = (matchPath: string) => {
    return location.pathname === matchPath;
  };
  const getPath = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.includes("dashboard")) {
      return "dashboard";
    } else {
      return "circles";
    }
  };
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
            <div className="flex justify-center items-center self-stretch gap-4">
              <img className="w-14 h-14" src={Logo} alt="Pro Juventute logo" />
              <div className="text-2xl">KPI Monitor</div>
            </div>
            <div>
              <NavLink
                to={circleId ? `/kpi/circles/${circleId}` : "/kpi/circles"}
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
                <div className="font-medium">KPIs</div>
              </NavLink>
              <NavLink
                to={circleId ? `/kpi/dashboard/${circleId}` : "/kpi/dashboard"}
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
                <SearchBar
                  isSearchKpi={isSearchKpi}
                  setCircleId={setCircleId}
                  path={getPath()}
                />
                {favoriteCircles &&
                  favoriteCircles.map((circle, index) => (
                    <NavLink
                      onClick={() =>
                        setCircleId(circle.circle_user[0].circle_id)
                      }
                      to={`/kpi/${getPath()}/${
                        circle.circle_user[0].circle_id
                      }`}
                      className={({ isActive }) =>
                        " rounded-lg flex items-center p-4 gap-4 self-stretch  text-black" +
                        (isActive ||
                        isLinkActive(
                          `/kpi/dashboard/${circle.circle_user[0].circle_id}`
                        )
                          ? " bg-[#FBBB21]"
                          : "  hover:bg-gray-300")
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
                <NavLink
                  to="/kpi/settings"
                  className="text-xl flex items-center gap-2.5 p-4 self-stretch text-[#7C7E7E] hover:text-yellow-600"
                >
                  <span>
                    <AiOutlineSetting />
                  </span>
                  <div className="font-medium">Settings</div>
                </NavLink>
                <div
                  className="text-xl flex items-center gap-2.5 p-4 self-stretch text-[#7C7E7E] cursor-pointer hover:text-yellow-600"
                  onClick={handleLogout}
                >
                  <span>
                    <FiLogOut />
                  </span>
                  <div className="font-medium">Log out</div>
                </div>
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
