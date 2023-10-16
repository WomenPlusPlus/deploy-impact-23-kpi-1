import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { KpiLogs } from "../../model/kpi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
const LOGS_HEADERS: GridColDef[] = [
  {
    headerName: "User",
    field: "user_name",
    flex: 3,
    sortable: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const circleName = params.row.user_circle_name || null;
      return (
        <div className="text-center">
          <span className="text-center">{params.value}</span>

          {circleName && (
            <div className="text-xs text-gray-400 text-center">
              {circleName}
            </div>
          )}
        </div>
      );
    },
  },
  //todo: update data base view
  {
    headerName: "Period",
    field: "standardized_date",
    flex: 2,
    sortable: true,
    headerAlign: "center",
    align: "center",
    //todo update with helper function to get the right date format
    // renderCell: (params) => {
    //   return <>{params.value}</>;
    // }
  },
  {
    headerName: "Date Entered",
    field: "period_date",
    flex: 2,
    sortable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "Value entered",
    field: "value",
    flex: 2,
    sortable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "Added on",
    field: "created_at",
    flex: 2,
    sortable: true,
    headerAlign: "center",
    align: "left",
    renderCell: (params) => {
      //todo: update with timezone as it seemt to show the utc time
      return <>{format(new Date(params.value), "yyyy-MM-dd HH'h'mm")}</>;
    },
  },
];
const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

export default function KpiHistoryModalPage(): JSX.Element {
  const [kpiLogs, setKpiLogs] = useState<KpiLogs[]>([]);
  const fetchKpiHistory = async () => {
    try {
      let { data: kpi_logs, error } = await supabase
        .from("kpi_logs")
        .select("*");
      //todo:filter by kpi_id and circle_id

      if (error) {
        console.log("Error getting kpi logs:", error);
      }
      if (kpi_logs) {
        setKpiLogs(kpi_logs);
      }
    } catch (error: any) {
      alert(`Error getting kpi logs: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchKpiHistory();
  }, []);

  return (
    <>
      <DataGrid
        getRowId={(row) => row.kpi_value_history_id}
        rows={kpiLogs}
        rowSelection={false}
        columns={LOGS_HEADERS}
        classes={{
          columnHeaders: "bg-customPurple",
          columnHeader: "uppercase",
        }}
        {...other}
      />
    </>
  );
}
