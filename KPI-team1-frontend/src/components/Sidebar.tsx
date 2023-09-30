import Logo from "../assets/images/layer1.svg";
import { HiOutlineTableCells } from "react-icons/hi2";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { HiStar } from "react-icons/hi2";
import { AiOutlineSetting } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { User } from "../model/user";

interface SidebarProps {
  user: User;
  setUser: any;
}

export default function Sidebar({ user, setUser }: SidebarProps): JSX.Element {
  const navigate = useNavigate();

  async function handleLogout() {
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser({});
    navigate("/");
  }
  return (
    <div className="px-6 py-7 flex flex-col gap-8 font-custom">
      <div className="flex justify-center items-center self-stretch gap-4">
        <img className="w-8 h-8" src={Logo} alt="Pro Juventute logo" />
        <div className="text-2xl">KPI tracking</div>
      </div>
      <div>
        <div className="text-xl flex items-center gap-3 p-4 bg-customBlack rounded-lg text-customWhite self-stretch">
          <span>
            <HiOutlineTableCells />
          </span>
          <div className="font-medium">KPI's</div>
        </div>
        <div className="text-xl flex items-center gap-2.5 p-4 self-stretch text-customGrey">
          <span>
            <HiOutlinePresentationChartLine />
          </span>
          <div className="font-medium">Dashboard</div>
        </div>

        <div className="bg-customGrey2 flex flex-col py-6 px-4 items-center gap-4 rounded-lg my-10">
          <div className="bg-customWhite2 flex py-3 px-4 justify-between items-center rounded-lg border border-customWhite1">
            <input
              className="text-sm outline-0"
              type="text"
              placeholder="Search circle"
            />
            <span className="text-xl text-customGrey">
              <HiOutlineMagnifyingGlass />
            </span>
          </div>
          <div className="bg-customGrey1 rounded-lg flex items-center p-4 gap-4 self-stretch">
            <span className="text-xl text-customBlack1">
              <HiStar />
            </span>
            <div>Marketing Zurich</div>
          </div>
          <div className="flex items-center p-4 gap-4 self-stretch">
            <span className="text-xl text-customBlack1">
              <HiStar />
            </span>
            <div>Sales - Romandie</div>
          </div>
        </div>
        <hr />
        <div>
          <div className="text-xl flex items-center gap-2.5 p-4 self-stretch text-customGrey">
            <span>
              <AiOutlineSetting />
            </span>
            <div className="font-medium">Settings</div>
          </div>
          {user.id ? (
            <div
              className="text-xl flex items-center gap-2.5 p-4 self-stretch text-customGrey hover:cursor-pointer"
              onClick={handleLogout}
            >
              <span>
                <FiLogOut />
              </span>
              <div className="font-medium">Log out</div>
            </div>
          ) : (
            <div
              className="text-xl flex items-center gap-2.5 p-4 self-stretch text-customGrey hover:cursor-pointer"
              onClick={() => navigate("/login")}
            >
              <span>
                <FiLogIn />
              </span>
              <div className="font-medium">Log in</div>
            </div>
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
  );
}
