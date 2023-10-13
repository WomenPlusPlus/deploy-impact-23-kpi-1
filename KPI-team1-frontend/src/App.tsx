import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
// import { User } from "./model/user";
// import { PiBell } from "react-icons/pi";
// import { Circles } from "./model/circle";
import Searchbar from "./components/Searchbar";
import { Kpi, KpiExtended } from "./model/kpi";
import SearchResultsList from "./components/SearchResultsList";
// import { EachKpi } from "./model/kpi";
import { User, UserDetails } from "./model/user";
// import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { PiBell } from "react-icons/pi";
import { Circles } from "./model/circle";

const initialUser: User = {
  id: "",
  email: "",
};

export default function App() {
  const [user, setUser] = useState<User>(initialUser);
  const [circles, setCircles] = useState<Circles[]>([]);
  // const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);

  const [results, setResults] = useState<Kpi[]>([]);
  // const periodicityOrder = [
  //   "daily",
  //   "weekly",
  //   "monthly",
  //   "quarterly",
  //   "yearly",
  // ];
  // const [kpiDefinitions, setKpiDefinitions] = useState<EachKpi[]>([]);

  // const fetchKpi = async () => {
  //   try {
  //     let { data: kpi_definition, error } = await supabase
  //       .from("circle")
  //       .select("circle_name, kpi_definition_with_latest_values!inner(*)")
  //       .eq("kpi_definition_with_latest_values.kpi_id", 1);

  //     if (error) {
  //       throw error;
  //     }
  //     setKpiDefinitions(kpi_definition || []);
  //     // findCircleName();

  //     console.log("check data for each kpi", kpi_definition);
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };
  // useEffect(() => {
  //   fetchKpi();
  // }, []);

  // const filteredKpiDefinitions = periodicityOrder.map((periodicity) =>
  //   kpiDefinitions.filter(
  //     (item) =>
  //       item.kpi_definition_with_latest_values[0].periodicity === periodicity
  //   )
  // );

  // if (filteredKpiDefinitions.length === 0) {
  //   return null;
  // }
  // const renderKpis = filteredKpiDefinitions.filter((kpi) => kpi.length !== 0);

  // console.log("check filter", renderKpis);
  const [userDetails, setUserDetails] = useState<UserDetails>();

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
      // .eq("circle_user.user_id", user.id);
      // .from("circle")
      // .select("*");
      // .select("circle_name, circle_user!inner(*)")
      // .eq("circle_user.user_id", user.id);
      if (error) throw error;
      setCircles(data);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }

  // const fetchKpiDefinitions = async () => {
  //   try {
  //     let { data: kpi_definition, error } = await supabase
  //       .from("kpi_definition_with_latest_values")
  //       .select("*");
  //     // .eq("circle_id", Number(selectedCircleId));

  //     if (error) {
  //       throw error;
  //     }
  //     setKpiDefinitions(kpi_definition || []);
  //     // findCircleName();

  //     console.log("check data", kpiDefinitions);
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };
  async function fetchUserDetails() {
    // TODO hardcoded for now - until DB is in order
    setUserDetails({ username: "I'm a user", defaultCircleId: "someId" });
  }

  useEffect(() => {
    fetchUser();
    getCircles();
    // fetchKpiDefinitions();
    fetchUserDetails();
  }, [user.id]);
  console.log("check all circles", circles);

  return (
    <div className="flex min-h-screen">
      <div className="w-min shadow-lg">
        <Sidebar
          user={user}
          setUser={setUser}
          circles={circles}
          setCircles={setCircles}
        />
      </div>
      <div className="flex flex-col grow">
        <div className="flex items-start justify-between py-4 px-8 border-b border-[#D0D8DB] ">
          <div className="flex flex-col w-1/2">
            <Searchbar setResults={setResults} />
            <SearchResultsList results={results} setResults={setResults} />
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
            context={{ setUser, circles, user, userDetails, setUserDetails }}
          />
        </div>
      </div>
    </div>
  );
}
