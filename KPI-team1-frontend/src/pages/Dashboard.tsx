import { useState, useEffect } from "react";
import { KpiValue } from "../model/kpi";
import { supabase } from "../supabase";
import AreaChart from "../components/AreaChart";
import { Grid } from "@mui/material";

export default function Dashboard(): JSX.Element {
  const [kpiAllValues, setAllKpiValues] = useState<KpiValue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchAllKpiValues = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("kpi_values_period_standardized")
        .select("*")
        .eq("circle_id", 4);

      if (data) {
        setAllKpiValues(data);
      }
      setIsLoading(false);
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllKpiValues();
  }, []);

  const allKpis = kpiAllValues.reduce((acc: any, curr: any) => {
    const foundKpi = acc.find((item: any) => item.kpi_id === curr.kpi_id);
    if (foundKpi) {
      foundKpi.values.push({
        standardized_date: curr.standardized_date,
        value: curr.value,
      });
    } else {
      acc.push({
        kpi_id: curr.kpi_id,
        values: [
          {
            standardized_date: curr.standardized_date,
            value: curr.value,
          },
        ],
      });
    }
    return acc;
  }, []);

  return (
    <div className="App">
      <Grid container spacing={2}>
        {allKpis.map((item: any) => {
          return (
            <Grid xs={4}>
              <AreaChart
                xValues={item.values.map(
                  (value: any) => value.standardized_date
                )}
                yValues={item.values.map((value: any) => value.value)}
                seriesName="KPI"
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
