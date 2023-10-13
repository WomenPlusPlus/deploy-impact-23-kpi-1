import { useNavigate } from "react-router-dom";
import { Kpi } from "../model/kpi";

interface ResultsProps {
  results: any[];
  setResults: (results: any[]) => void;
  setInput: (input: string) => void;
}

export default function SearchResultsList({
  results,
  setResults,
  setInput,
}: ResultsProps): JSX.Element {
  console.log("check results", results);
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 flex flex-col shadow rounded-md max-h-44 overflow-y-scroll">
      {results &&
        results.map((result) => {
          return (
            <div
              className="py-2.5 px-5 hover:bg-gray-200 cursor-pointer"
              key={result.kpi_id ? result.kpi_id : result.circle_id}
              onClick={(e) => {
                {
                  result.kpi_id
                    ? navigate(`/kpi/${result.kpi_id}`)
                    : navigate(`/kpi/circles/${result.circle_id}`);
                }
                setResults([]);
                setInput("");
              }}
            >
              {result.kpi_name ? result.kpi_name : result.circle_name}
            </div>
          );
        })}
    </div>
  );
}
