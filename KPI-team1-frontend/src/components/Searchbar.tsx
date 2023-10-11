import { useState } from "react";
import { supabase } from "../supabase";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { Kpi } from "../model/kpi";

interface SearchbarProps {
  setResults: (results: Kpi[]) => void;
}

export default function Searchbar({ setResults }: SearchbarProps): JSX.Element {
  const [input, setInput] = useState<string>("");

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

  const handleChange = (value: string) => {
    setInput(value);
    fetchAllKpis(value);
  };

  return (
    <div className="bg-[#FFF] flex py-3 px-4 justify-between items-center rounded-lg border border-[#D0D8DB] w-full">
      <input
        className="text-sm outline-0"
        type="text"
        placeholder="Type to search for KPI's"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      <span className="text-xl text-[#7C7E7E]">
        <HiOutlineMagnifyingGlass />
      </span>
    </div>
  );
}
