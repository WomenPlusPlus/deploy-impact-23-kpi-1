import { useState, useEffect } from "react";
import { GraphType, KpiExtended, KpiValue } from "../model/kpi";
import { supabase } from "../supabase";
import AreaAndLineGraph from "../components/graphs/AreaAndLineGraph";
import { Grid } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import { UserDetails } from "../model/user";
import { GRAPH_TYPES } from "../constants";
import SnackBarComponent from "../components/SnackBarComponent";

interface OutletContext {
  circleId: number | null;
  setCircleId: (circleId: number) => void;
  kpiDefinitions: KpiExtended[];
  userDetails: UserDetails;
}
export default function Dashboard(): JSX.Element {
  const { circleId: circleIdParam } = useParams();
  const [kpiAllValues, setAllKpiValues] = useState<KpiValue[]>([]);
  const [selectedCircleId, setSelectedCircleId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const { circleId, setCircleId, kpiDefinitions, userDetails }: OutletContext =
    useOutletContext();

  useEffect(() => {
    if (circleId) {
      setSelectedCircleId(Number(circleId));
    } else if (!circleId && circleIdParam) {
      setCircleId(Number(circleIdParam));
      setSelectedCircleId(Number(circleIdParam));
    } else {
      if (
        userDetails.defaultCircleId !== null ||
        userDetails.defaultCircleId !== 0
      ) {
        setCircleId(Number(userDetails.defaultCircleId));
        setSelectedCircleId(Number(userDetails.defaultCircleId));
      }
    }
  }, [circleIdParam, circleId, userDetails]);

  const fetchAllKpiValues = async () => {
    try {
      if (!selectedCircleId) return;
      const { data, error } = await supabase
        .from("kpi_values_period_standardized")
        .select("*")
        .eq("circle_id", selectedCircleId);

      if (data) {
        setAllKpiValues(data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchAllKpiValues();
  }, [selectedCircleId]);
  const allKpis = kpiAllValues.reduce((acc: any, curr: any) => {
    const foundKpi = acc.find((item: any) => item.kpi_id === curr.kpi_id);
    if (foundKpi) {
      foundKpi.values.push({
        standardized_date: curr.standardized_date,
        cumulative_value:
          curr.graph_type === GraphType.LineGraph ||
          curr.graph_type === GraphType.DonutGraph
            ? curr.cumulative_value.toFixed(2)
            : curr.cumulative_value,
        target_fulfilled: curr.target_fulfilled,
      });
    } else {
      const kpiDefinition = kpiDefinitions.find(
        (kpi) =>
          kpi.kpi_id === curr.kpi_id && kpi.circle_id === selectedCircleId
      );

      const getTargetValue = () => {
        if (kpiDefinition?.target_value) {
          if (
            kpiDefinition.formula === "average" &&
            kpiDefinition.unit === "boolean"
          ) {
            return {
              value: (kpiDefinition.target_value / 100).toFixed(2),
              target_percentage: kpiDefinition?.target_fulfilled
                ? (kpiDefinition.target_fulfilled * 100).toFixed(2)
                : null,
            };
          }
          return {
            value: kpiDefinition?.target_value,
            target_percentage: kpiDefinition?.target_fulfilled,
          };
        }
        return { value: null };
      };
      acc.push({
        kpi_id: curr.kpi_id,
        values: [
          {
            standardized_date: curr.standardized_date,
            cumulative_value:
              curr.graph_type === GraphType.LineGraph ||
              curr.graph_type === GraphType.DonutGraph
                ? curr.cumulative_value.toFixed(2)
                : curr.cumulative_value,
          },
        ],
        kpi_name: kpiDefinition?.kpi_name || "",
        periodicity: kpiDefinition?.periodicity || "",
        target_value: getTargetValue().value,
        percentage_change: kpiDefinition?.percentage_change,
        graph_type: curr.graph_type,
        show: kpiDefinition?.is_approved || false,
        target_fulfilled: getTargetValue().target_percentage,
      });
    }
    return acc;
  }, []);

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const circleKpis =
    kpiDefinitions &&
    kpiDefinitions.filter(
      (kpiDefinition) => kpiDefinition.circle_id === Number(selectedCircleId)
    );

  return (
    <div>
      {circleKpis?.[0] && (
        <div className="text-2xl m-5 pb-4 border-b border-gray-300">
          KPIs - {circleKpis[0].circle_name}
        </div>
      )}
      <Grid container>
        {allKpis
          .filter((item: any) => item.show === true)
          .map((item: any) => {
            return (
              <Grid item xs={6} key={item.kpi_id}>
                <AreaAndLineGraph
                  xValues={item.values.map(
                    (value: any) => value.standardized_date
                  )}
                  yValues={item.values.map(
                    (value: any) => value.cumulative_value
                  )}
                  seriesName={item.kpi_name}
                  periodicity={item.periodicity}
                  target_value={item.target_value}
                  percentage_change={item.percentage_change}
                  graph_type={GRAPH_TYPES[item.graph_type] || null}
                  target_fulfilled={item.target_fulfilled}
                />
              </Grid>
            );
          })}
      </Grid>
      <SnackBarComponent
        open={open}
        alertMessage={alertMessage}
        severity={severity}
        handleCloseAlert={handleCloseAlert}
      />
    </div>
  );
}
