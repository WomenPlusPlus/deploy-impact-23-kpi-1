import { useEffect, useState } from "react";
import ModalRightSide from "../../components/ModalRightSide";
import { KpiExtended, KpiValue } from "../../model/kpi";
import { supabase } from "../../supabase";
import KpiValuesModalPage from "./KpiValuesModalPage";

const KpiDetailModalPage = ({
  isOpen,
  onRequestClose,
  kpi,
  circleId,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  kpi: KpiExtended;
  circleId: number;
}): JSX.Element => {
  const [selectView, setSelectView] = useState<"values" | "history">("values");
  const [kpiValues, setKpiValues] = useState<KpiValue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchKpiValues = async () => {
    try {
      setIsLoading(true);
      if (kpi) {
        let { data: kpi_values, error } = await supabase
          .from("kpi_values_period_standardized")
          .select("*")
          .eq("kpi_id", kpi.kpi_id)
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
    fetchKpiValues();
  }, [kpi]);

  const renderModalContent = () => {
    return (
      <>
        <div className="text-center text-2xl font-light">
          KPI - {kpi?.kpi_name}
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
          <KpiValuesModalPage
            kpi={kpi}
            circleId={circleId}
            fetchKpiValues={fetchKpiValues}
            isLoading={isLoading}
            kpiValues={kpiValues}
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
