import { Outlet, useOutletContext } from "react-router-dom";
import SearchBar from "./components/Searchbar";
import SideBar from "./components/Sidebar";
import { PiBell } from "react-icons/pi";
import { Circles } from "./model/circle";
import { KpiExtended } from "./model/kpi";
import { User, UserDetails } from "./model/user";

interface OutletContext {
  user: User;
  setUser: (user: User) => void;
  circles: Circles[];
  setCircles: (circles: Circles[]) => void;
  kpiDefinitions: KpiExtended[];
  userDetails: UserDetails;
  setUserDetails: (UserDetails: UserDetails) => void;
  fetchKpiDefinitions: () => Promise<void>;
}

export default function Layout() {
  const isSearchKpi: boolean = true;
  const {
    user,
    setUser,
    circles,
    setCircles,
    kpiDefinitions,
    userDetails,
    setUserDetails,
    fetchKpiDefinitions,
  }: OutletContext = useOutletContext();

  return (
    <div className="flex min-h-screen">
      <div className="w-min shadow-lg">
        <SideBar
          user={user}
          setUser={setUser}
          circles={circles}
          setCircles={setCircles}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
      </div>
      <div className="flex flex-col grow">
        <div className="flex items-start justify-between py-4 px-8 border-b border-[#D0D8DB] ">
          <div className="flex flex-col w-1/2">
            <SearchBar isSearchKpi={isSearchKpi} />
          </div>

          <div className="flex justify-end items-center gap-20 border-l border-[#D0D8DB] w-1/3 py-1.5">
            <span className="text-xl">
              <PiBell />
            </span>
            {user && (
              <div className="text-xl">
                {userDetails && userDetails.username
                  ? userDetails.username
                  : user.email}
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-[#F9F9FA] h-full p-8">
          <Outlet
            context={{
              setUser,
              circles,
              user,
              userDetails,
              setUserDetails,
              kpiDefinitions,
              fetchKpiDefinitions,
            }}
          />
        </div>
      </div>
    </div>
  );
}
