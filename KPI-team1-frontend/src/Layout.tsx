import { Outlet, useOutletContext } from "react-router-dom";
import SearchBar from "./components/Searchbar";
import SideBar from "./components/Sidebar";
import { PiBell } from "react-icons/pi";
import { Circle, FavoriteCircle } from "./model/circle";
import { KpiExtended } from "./model/kpi";
import { User, UserDetails } from "./model/user";

interface OutletContext {
  user: User;
  setUser: (user: User) => void;
  favoriteCircles: FavoriteCircle[];
  setFavoriteCircles: (circles: FavoriteCircle[]) => void;
  circles: Circle[];
  setCircles: (circles: Circle[]) => void;
  kpiDefinitions: KpiExtended[];
  userDetails: UserDetails;
  setUserDetails: (UserDetails: UserDetails) => void;
  fetchKpiDefinitions: () => Promise<void>;
  circleId: number | null;
  setCircleId: (circleId: number | null) => void;
}

export default function Layout() {
  const isSearchKpi: boolean = true;
  const {
    user,
    setUser,
    favoriteCircles,
    setFavoriteCircles,
    circles,
    setCircles,
    kpiDefinitions,
    userDetails,
    setUserDetails,
    fetchKpiDefinitions,
    circleId,
    setCircleId,
  }: OutletContext = useOutletContext();

  return (
    <div className="flex min-h-screen">
      <div className="w-min shadow-lg">
        <SideBar
          user={user}
          setUser={setUser}
          favoriteCircles={favoriteCircles}
          setFavoriteCircles={setFavoriteCircles}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          circleId={circleId}
          setCircleId={setCircleId}
        />
      </div>
      <div className="flex flex-col grow">
        <div className="flex items-start justify-between py-4 px-8 border-b border-[#D0D8DB] ">
          <div className="flex flex-col w-1/2">
            <SearchBar isSearchKpi={isSearchKpi} setCircleId={setCircleId} />
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
              favoriteCircles,
              circles,
              setCircles,
              user,
              userDetails,
              setUserDetails,
              kpiDefinitions,
              fetchKpiDefinitions,
              circleId,
              setCircleId,
            }}
          />
        </div>
      </div>
    </div>
  );
}
