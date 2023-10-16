import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { User, UserDetails } from "./model/user";
import { PiBell } from "react-icons/pi";
import { Circles } from "./model/circle";
import { KpiExtended } from "./model/kpi";
import Searchbar from "./components/Searchbar";
import SearchResultsList from "./components/SearchResultsList";

const initialUser: User = {
  id: "",
  email: "",
};

export default function App() {
  const [user, setUser] = useState<User>(initialUser);
  const [circles, setCircles] = useState<Circles[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const isSearchKpi: boolean = true;
  const [input, setInput] = useState<string>("");
  const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: null,
    defaultCircleId: null,
  });

  // TODO maybe move this functionality to LoginPage ?
  async function fetchUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email || "" });
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }

  async function getCircles() {
    try {
      const { data, error } = await supabase
        .from("circle")
        .select("circle_name, circle_user!inner(*)");
      if (error) throw error;
      setCircles(data);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }

  async function fetchUserDetails() {
    try {
      const { data, error } = await supabase
        .from("username_with_default_circle")
        .select("user_name, circle_id")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      console.log(data);
      setUserDetails({
        username: data.user_name,
        defaultCircleId: data.circle_id,
      });
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }

  const fetchKpiDefinitions = async () => {
    try {
      let { data: kpi_definition, error } = await supabase
        .from("kpi_definition_with_latest_values")
        .select("*");
      if (error) {
        throw error;
      }
      setKpiDefinitions(kpi_definition || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    getCircles();
    fetchKpiDefinitions();
    fetchUserDetails();
  }, [user.id]);

  return (
    <div className="flex min-h-screen">
      <div className="w-min shadow-lg">
        <Sidebar
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
            <Searchbar
              setResults={setResults}
              isSearchKpi={isSearchKpi}
              input={input}
              setInput={setInput}
            />
            <SearchResultsList
              results={results}
              setResults={setResults}
              setInput={setInput}
            />
          </div>

          <div className="flex justify-end items-center gap-20 border-l border-[#D0D8DB] w-1/3 py-1.5">
            <span className="text-xl">
              <PiBell />
            </span>
            <div className="text-xl">{user.email}</div>
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
            }}
          />
        </div>
      </div>
    </div>
  );
}
