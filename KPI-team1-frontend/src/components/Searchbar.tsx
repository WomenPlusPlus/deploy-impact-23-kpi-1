import { useState } from "react";
import { supabase } from "../supabase";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

interface SearchbarProps {
  setResults: (results: any) => void;
  isSearchKpi: boolean;
  input: string;
  setInput: (input: string) => void;
}

export default function Searchbar({
  setResults,
  isSearchKpi,
  input,
  setInput,
}: SearchbarProps): JSX.Element {
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
      if (results) setResults(results);
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
      if (results) setResults(results);
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
    <div className="bg-[#FFF] flex py-3 px-4 justify-between items-center rounded-lg border border-[#D0D8DB] w-full">
      <input
        className="text-sm outline-0"
        type="text"
        placeholder={isSearchKpi ? "Type to search for KPI's" : "Search circle"}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      <span className="text-xl text-[#7C7E7E]">
        <HiOutlineMagnifyingGlass />
      </span>
    </div>
  );
}
