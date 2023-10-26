import { useState, useEffect } from "react";
import { GraphType, KpiExtended, KpiValue } from "../model/kpi";
import { supabase } from "../supabase";
import AreaChart from "../components/graphs/AreaChart";
import { Grid } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import { UserDetails } from "../model/user";
import { GRAPH_TYPES } from "../constants";

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
      alert(error.message);
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
          curr.graph_type === GraphType.LineGraph
            ? curr.cumulative_value.toFixed(2)
            : curr.cumulative_value,
        target_fulfilled: curr.target_fulfilled,
      });
    } else {
      const kpiDefinition = kpiDefinitions.find(
        (kpi) =>
          kpi.kpi_id === curr.kpi_id && kpi.circle_id === selectedCircleId
      );
      acc.push({
        kpi_id: curr.kpi_id,
        values: [
          {
            standardized_date: curr.standardized_date,
            cumulative_value:
              curr.graph_type === GraphType.LineGraph
                ? curr.cumulative_value.toFixed(2)
                : curr.cumulative_value,
            target_fulfilled: curr.target_fulfilled,
          },
        ],
        kpi_name: kpiDefinition?.kpi_name || "",
        periodicity: kpiDefinition?.periodicity || "",
        target_value: kpiDefinition?.target_value || null,
        percentage_change: kpiDefinition?.percentage_change,
        graph_type: curr.graph_type,
      });
    }
    return acc;
  }, []);

  return (
    <div className="App">
      <Grid container>
        {allKpis.map((item: any) => {
          return (
            <Grid item xs={6} key={item.kpi_id}>
              <AreaChart
                xValues={item.values.map(
                  (value: any) => value.standardized_date
                )}
                yValues={item.values.map(
                  (value: any) => value.cumulative_value
                )}
                targetFulfilled={item.values.map(
                  (value: any) => value.target_fulfilled
                )}
                seriesName={item.kpi_name}
                periodicity={item.periodicity}
                target_value={item.target_value}
                percentage_change={item.percentage_change}
                graph_type={GRAPH_TYPES[item.graph_type] || null}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
