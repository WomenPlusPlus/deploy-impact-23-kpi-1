import { useEffect, useState } from "react";
import ModalRightSide from "../../components/ModalRightSide";
import { KpiExtended, KpiValue } from "../../model/kpi";
import { supabase } from "../../supabase";
import KpiValuesModalSection from "./KpiValuesModalSection";

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

  const fetchKpiDefinition = async () => {
    try {
      let { data: kpi, error } = await supabase
        .from("kpi_definition_with_latest_values")
        .select("*")
        .eq("kpi_id", kpiId)
        .eq("circle_id", circleId);

      if (error) {
        alert(error.message);
      }
      if (kpi) {
        setKpiDefinition(kpi[0]);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchKpiDefinition();
    fetchKpiValues();
  }, [kpiId]);

  const renderModalContent = () => {
    if (!kpiDefinition) {
      return null;
    }
    return (
      <>
        <div className="text-center text-2xl font-light">
          KPI - {kpiDefinition?.kpi_name}
        </div>
        <div className="mb-2">
          <button
            className={`${
              selectView === "values" ? "border-black" : " dark:text-gray-600"
            } w-1/3 h-10 border-b-2 justify-center items-center font-medium`}
            onClick={() => setSelectView("values")}
          >
            Values
          </button>
          <button
            className={`${
              selectView === "history" ? "border-black" : " dark:text-gray-600"
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
            fetchKpiDefinition={fetchKpiDefinition}
            isLoading={isLoading}
            kpiValues={kpiValues}
            onRequestClose={onRequestClose}
          />
        ) : (
          <>history</>
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
