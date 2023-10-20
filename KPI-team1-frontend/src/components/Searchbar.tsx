import { useState } from "react";
import { supabase } from "../supabase";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { CircleName } from "../model/circle";
import { Kpi } from "../model/kpi";
import { GenericList } from "../generics/GenericList";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  isSearchKpi: boolean;
}

export default function SearchBar({
  isSearchKpi,
}: SearchBarProps): JSX.Element {
  const [input, setInput] = useState<string>("");
  const [circleResult, setCircleResult] = useState<CircleName[]>([]);
  const [kpiResult, setKpiResult] = useState<Kpi[]>([]);
  const navigate = useNavigate();

  async function fetchAllKpis(value: string) {
    try {
      let { data: kpi_definition, error } = await supabase
        .from("kpi_definition")
        .select("*");
      if (error) {
        throw error;
      }
      const results =
        kpi_definition &&
        kpi_definition.filter((kpi) => {
          return (
            value &&
            kpi &&
            kpi.kpi_name &&
            kpi.kpi_name.toLowerCase().includes(value.toLocaleLowerCase())
          );
        });
      if (results) setKpiResult(results);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async function fetchAllCircles(value: string) {
    try {
      const { data, error } = await supabase.from("circle").select("*");
      if (error) throw error;
      const results =
        data &&
        data.filter((circle) => {
          return (
            value &&
            circle &&
            circle.circle_name &&
            circle.circle_name.toLowerCase().includes(value.toLocaleLowerCase())
          );
        });
      if (results) setCircleResult(results);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  }

  const handleChange = (value: string) => {
    setInput(value);
    if (isSearchKpi) {
      fetchAllKpis(value);
    } else {
      fetchAllCircles(value);
    }
  };

  return (
    <div>
      <div className="bg-[#FFF] flex py-3 px-4 justify-between items-center rounded-lg border border-[#D0D8DB] w-full">
        <input
          className="text-sm outline-0 w-full"
          type="text"
          placeholder={
            isSearchKpi ? "Type to search for KPI's" : "Search circle"
          }
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
        <span className="text-xl text-[#7C7E7E]">
          <HiOutlineMagnifyingGlass />
        </span>
      </div>
      <div>
        <div className="bg-gray-100 flex flex-col shadow rounded-md max-h-44 overflow-y-scroll">
          <GenericList
            data={circleResult}
            onClick={(item) => {
              navigate(`/kpi/circles/${item.circle_id}`);
              setCircleResult([]);
              setInput("");
            }}
            renderItem={(item) => (
              <div className="py-2.5 px-5 hover:bg-gray-200 cursor-pointer">
                {item.circle_name}
              </div>
            )}
          />
        </div>
        <div className="bg-gray-100 flex flex-col shadow rounded-md max-h-44 overflow-y-scroll">
          <GenericList
            data={kpiResult}
            onClick={(item) => {
              navigate(`/kpi/${item.kpi_id}`);
              setKpiResult([]);
              setInput("");
            }}
            renderItem={(item) => (
              <div className="py-2.5 px-5 hover:bg-gray-200 cursor-pointer">
                {item.kpi_name}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
