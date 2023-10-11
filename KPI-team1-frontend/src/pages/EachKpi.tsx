import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getWeek, getQuarter } from "date-fns";
import { supabase } from "../supabase";
import { KpiExtended } from "../model/kpi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EachKpi(): JSX.Element {
  const periodicityOrder = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
  ];
  const HEADER_KPI_COLUMNS: GridColDef[] = [
    {
      headerName: "KPI Name",
      field: "kpi_name",
      width: 300,
      sortable: true,
      hideable: false,
      headerAlign: "center",
    },
    {
      headerName: "Circle Name",
      field: "circle_name",
      width: 300,
      sortable: true,
      hideable: false,
      headerAlign: "center",
    },
    // {
    //   headerName: "Target",
    //   field: "kpi_target",
    //   width: 150,
    //   sortable: false,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      headerName: "Latest Value",
      field: "latest_value",
      width: 150,
      sortable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Last Update",
      field: "latest_standardized_date",
      width: 150,
      sortable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value === null) return null;
        const periodicity = params.row.periodicity;
        const date = new Date(params.value as string);
        if (periodicity === "daily") {
          return date.toLocaleDateString("en-CH");
        } else if (periodicity === "quarterly") {
          return `Q${getQuarter(date)}`;
        } else if (periodicity === "yearly") {
          return date.toLocaleDateString("en-CH", {
            year: "numeric",
          } as Intl.DateTimeFormatOptions);
        } else if (periodicity === "weekly") {
          return `Week ${getWeek(date, {
            weekStartsOn: 1,
            firstWeekContainsDate: 4,
          })}`;
        } else {
          return date.toLocaleDateString("en-CH", {
            month: "short",
            year: "numeric",
          } as Intl.DateTimeFormatOptions);
        }
      },
    },
    {
      headerName: "Description",
      field: "description",
      width: 300,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
    },
  ];
  const other = {
    showCellVerticalBorder: true,
    showColumnVerticalBorder: true,
  };

  const [kpiDefinitions, setKpiDefinitions] = useState<any[]>([]);
  const { kpiId } = useParams();

  const fetchKpi = async () => {
    try {
      let { data: kpi_definition, error } = await supabase
        .from("kpi_definition_with_latest_values")
        .select("*")
        .eq("kpi_id", Number(kpiId));
      if (error) {
        throw error;
      }
      if (kpi_definition) {
        setKpiDefinitions(kpi_definition || []);
      }

      console.log("check data", kpi_definition);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchKpi();
  }, [kpiId]);

  const fetchCircleName = async (circleId: number) => {
    try {
      let { data: circleName, error } = await supabase
        .from("circle")
        .select("circle_name")
        .eq("circle_id", circleId);
      if (error) {
        throw error;
      }
      return circleName && circleName[0].circle_name;

      console.log("check circleName", circleName);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const filteredKpiDefinitions = periodicityOrder.map((periodicity) =>
    kpiDefinitions.filter((item) => item.periodicity === periodicity)
  );

  const renderKpis = filteredKpiDefinitions.filter((kpi) => kpi.length !== 0);
  console.log("check renderKpis", renderKpis);

  return (
    <>
      {renderKpis &&
        renderKpis.map((renderKpi, index) => (
          <div key={index}>
            <div className="text-xl font-medium">{`${renderKpi[0].periodicity
              .charAt(0)
              .toUpperCase()}${renderKpi[0].periodicity.slice(1)} KPIs`}</div>
            <div className="shadow-md border-0 border-primary-light">
              <DataGrid
                getRowId={(row) => row.circle_kpidef_id}
                rows={renderKpi}
                rowSelection={false}
                columns={HEADER_KPI_COLUMNS}
                // onRowClick={(params) => {
                //   handleClick(params.row);
                // }}
                classes={{
                  columnHeaders: "bg-customPurple",
                  columnHeader: "uppercase",
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                {...other}
              />
            </div>
          </div>
        ))}
    </>
  );
}
