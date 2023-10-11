import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { User } from "./model/user";
import { PiBell } from "react-icons/pi";
import { Circles } from "./model/circle";
import Searchbar from "./components/Searchbar";
import { Kpi } from "./model/kpi";
import SearchResultsList from "./components/SearchResultsList";
// import { EachKpi } from "./model/kpi";

const initialUser: User = {
  id: "",
  email: "",
};

export default function App() {
  const [user, setUser] = useState<User>(initialUser);
  const [circles, setCircles] = useState<Circles[]>([]);
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
        .select("circle_name, circle_user!inner(*)")
        .eq("circle_user.user_id", user.id);
      if (error) throw error;
      setCircles(data);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }
  useEffect(() => {
    fetchUser();
    getCircles();
  }, [user.id]);

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
          <Outlet context={{ setUser, circles }} />
        </div>
      </div>
    </div>
  );
}
