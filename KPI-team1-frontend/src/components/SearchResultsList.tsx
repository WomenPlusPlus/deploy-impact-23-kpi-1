import { useNavigate } from "react-router-dom";
import { Kpi } from "../model/kpi";

interface ResultsProps {
  results: Kpi[];
  setResults: (results: Kpi[]) => void;
}

export default function SearchResultsList({
  results,
  setResults,
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
              key={result.kpi_id}
              onClick={(e) => {
                navigate(`/kpi/${result.kpi_id}`);
                setResults([]);
              }}
            >
              {result.kpi_name}
            </div>
          );
        })}
    </div>
  );
}
