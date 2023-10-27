import { useEffect, useState } from "react";
import ModalRightSide from "../../components/ModalRightSide";
import { KpiExtended, KpiValue } from "../../model/kpi";
import { supabase } from "../../supabase";
import KpiValuesModalSection from "./KpiValuesModalSection";
import KpiHistoryModalSection from "./KpiHistoryModalSection";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  kpiDefinitions: KpiExtended[];
  fetchKpiDefinitions: () => void;
}
const KpiDetailModalPage = ({
  isOpen,
  onRequestClose,
  kpiId,
  circleId,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  kpiId: number;
  circleId: number;
}): JSX.Element => {
  const [selectView, setSelectView] = useState<"values" | "history">("values");
  const [kpiDefinition, setKpiDefinition] = useState<KpiExtended | null>(null);
  const [kpiValues, setKpiValues] = useState<KpiValue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { kpiDefinitions, fetchKpiDefinitions }: OutletContext =
    useOutletContext();

  const PRETTY_UNIT: {
    [key: string]: string;
  } = {
    boolean: "True/False",
    numeric: "Count",
    "%": "Percentage",
  };
  const fetchKpiValues = async () => {
    try {
      setIsLoading(true);
      if (kpiId) {
        let { data: kpi_values, error } = await supabase
          .from("kpi_values_period_standardized")
          .select("*")
          .eq("kpi_id", kpiId)
          .eq("circle_id", circleId);

        if (error) {
          throw error;
        }
        setKpiValues(kpi_values || []);
        setIsLoading(false);
      }
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (kpiDefinitions) {
      setKpiDefinition(
        kpiDefinitions.find(
          (kpi) => kpi.kpi_id === kpiId && kpi.circle_id === circleId
        ) || null
      );
    }
  }, [kpiDefinitions, kpiId]);

  useEffect(() => {
    fetchKpiValues();
  }, [kpiId]);

  const renderModalContent = () => {
    if (!kpiDefinition) {
      return null;
    }
    return (
      <>
        {kpiDefinition ? (
          <>
            <div className="text-center text-2xl font-light">
              KPI - {kpiDefinition.kpi_name}
            </div>
            <div className="text-center text-sm font-light">
              <span>
                {kpiDefinition.cumulative ?? null
                  ? kpiDefinition.cumulative
                    ? "cumulative entries"
                    : "absolute entries"
                  : null}{" "}
              </span>
              <span>
                {kpiDefinition.formula ? kpiDefinition.formula : null}{" "}
              </span>
              <span>
                as {kpiDefinition.unit ? PRETTY_UNIT[kpiDefinition.unit] : null}
              </span>
            </div>
            <div className="mb-2">
              <button
                className={`${
                  selectView === "values"
                    ? "border-black"
                    : " dark:text-gray-600"
                } w-1/3 h-10 border-b-2 justify-center items-center font-medium`}
                onClick={() => setSelectView("values")}
              >
                Values
              </button>
              <button
                className={`${
                  selectView === "history"
                    ? "border-black"
                    : " dark:text-gray-600"
                } w-1/3 h-10  border-b-2 justify-center items-center font-medium`}
                onClick={() => setSelectView("history")}
              >
                History
              </button>
            </div>
            {selectView === "values" ? (
              <KpiValuesModalSection
                kpi={kpiDefinition}
                circleId={circleId}
                fetchKpiValues={fetchKpiValues}
                fetchKpiDefinitions={fetchKpiDefinitions}
                isLoading={isLoading}
                kpiValues={kpiValues}
                onRequestClose={onRequestClose}
              />
            ) : (
              <KpiHistoryModalSection circleId={circleId} kpi={kpiDefinition} />
            )}
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <ModalRightSide isOpen={isOpen} onRequestClose={onRequestClose}>
      {renderModalContent()}
    </ModalRightSide>
  );
};

export default KpiDetailModalPage;
