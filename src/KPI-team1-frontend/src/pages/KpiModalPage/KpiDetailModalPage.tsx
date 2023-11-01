import { useEffect, useState } from "react";
import ModalRightSide from "../../components/ModalRightSide";
import { KpiExtended, KpiValue } from "../../model/kpi";
import { supabase } from "../../supabase";
import KpiValuesModalSection from "./KpiValuesModalSection";
import KpiHistoryModalSection from "./KpiHistoryModalSection";
import { useOutletContext } from "react-router-dom";
import { Switch } from "@mui/material";
import { green } from "@mui/material/colors";

interface OutletContext {
  kpiDefinitions: KpiExtended[];
  fetchKpiDefinitions: () => void;
}
const KpiDetailModalPage = ({
  isOpen,
  onRequestClose,
  kpiId,
  circleId,
  setOpenAlert,
  setAlertMessage,
  setSeverity,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  kpiId: number;
  circleId: number;
  setOpenAlert: (value: boolean) => void;
  setAlertMessage: (value: string) => void;
  setSeverity: (value: "success" | "error" | "warning" | "info") => void;
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
          setAlertMessage("Error fetching KPI values");
          setSeverity("error");
          setOpenAlert(true);
          throw error;
        }
        setKpiValues(kpi_values || []);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
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

  const handleSwitch = async (
    kpiDefinition: KpiExtended,
    isChecked: boolean
  ) => {
    try {
      if (!kpiDefinition.circle_kpidef_id) return;
      if (isChecked) {
        let { data: kpi, error } = await supabase
          .from("circle_kpi_definition")
          .update({
            is_active: true,
          })
          .eq("circle_kpidef_id", kpiDefinition.circle_kpidef_id)
          .select("*");

        if (error) {
          setAlertMessage("Error activating KPI");
          setSeverity("error");
          setOpenAlert(true);
          throw error;
        }
        if (kpi && kpi.length > 0) {
          setAlertMessage("KPI activated");
          setSeverity("success");
          setOpenAlert(true);
          fetchKpiDefinitions();
        }
      } else {
        let { data: kpi, error } = await supabase
          .from("circle_kpi_definition")
          .update({
            is_active: false,
          })
          .eq("circle_kpidef_id", kpiDefinition.circle_kpidef_id)
          .select("*");

        if (error) {
          setAlertMessage("Error deactivating KPI");
          setSeverity("error");
          setOpenAlert(true);

          throw error;
        }
        if (kpi && kpi.length > 0) {
          setAlertMessage("KPI deactivated");
          setSeverity("success");
          setOpenAlert(true);
          fetchKpiDefinitions();
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const renderModalContent = () => {
    if (!kpiDefinition) {
      return null;
    }
    return (
      <>
        {kpiDefinition ? (
          <>
            <div>
              <Switch
                color="default"
                sx={{
                  "&.MuiSwitch-root .MuiSwitch-track": {
                    backgroundColor: green[200],
                  },

                  "&.MuiSwitch-root .Mui-checked": {
                    color: green[300],
                  },
                }}
                checked={kpiDefinition.is_active}
                onChange={(e) => {
                  handleSwitch(kpiDefinition, e.target.checked);
                }}
              />
              <span className="text-sm font-medium">active</span>
            </div>
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
                {kpiDefinition.formula
                  ? kpiDefinition.formula.charAt(0).toUpperCase() +
                    kpiDefinition.formula.slice(1)
                  : null}{" "}
              </span>
              <span>
                - {kpiDefinition.unit ? PRETTY_UNIT[kpiDefinition.unit] : null}
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
                setOpenAlert={setOpenAlert}
                setAlertMessage={setAlertMessage}
                setSeverity={setSeverity}
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
