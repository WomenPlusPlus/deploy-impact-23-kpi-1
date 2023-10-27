import { GridColDef } from "@mui/x-data-grid";
import { getDisplayValueByPeriodicity } from "../../helpers/kpiHelpers";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { Tooltip } from "@mui/material";
import { format } from "date-fns";

export const HEADER_KPI_COLUMNS: GridColDef[] = [
  {
    headerName: "KPI Name",
    field: "kpi_name",
    width: 300,
    sortable: true,
    hideable: false,
    headerAlign: "center",
    renderCell: (params) => {
      if (params.row.unit === "%") {
        return (
          <>
            <span>{params.value}</span>
            <div className="ml-4 w-6 h-6 bg-amber-400 rounded-[100px] flex-col justify-center items-center gap-2 inline-flex">
              <div className="w-[19px] text-center text-zinc-700 text-base font-medium font-['Inter']">
                %
              </div>
            </div>
          </>
        );
      }
    },
  },
  {
    headerName: "Latest Value",
    field: "latest_value",
    width: 150,
    sortable: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const value = params.value as number;
      if (value === null) {
        return null;
      } else if (params.row.unit === "%") {
        return value.toFixed(2) + "%";
      } else {
        return value.toLocaleString("fr-ch");
      }
    },
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
      const date = params.value ? new Date(params.value as string) : null;
      if (date === null || periodicity === undefined) {
        return null;
      } else {
        return getDisplayValueByPeriodicity(periodicity, date);
      }
    },
  },
  {
    headerName: "Description",
    field: "description",
    width: 200,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "Target",
    field: "target_value",
    width: 150,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "",
    field: "",
    renderCell: (cellValues) => {
      return cellValues.row.is_approved === false ? (
        <Tooltip
          title={<span>You can add values once the KPI is approved</span>}
        >
          <div className="flex py-1.5 px-3 justify-center items-center gap-2 rounded-3xl border-[#FBBB21] border-2 hover:bg-gray-300">
            <div className="text-sm font-medium leading-5 text-[#131313]">
              pending
            </div>
            <span className="text-[#7C7E7E] text-base">
              <HiMiniInformationCircle />
            </span>
          </div>
        </Tooltip>
      ) : (
        <div></div>
      );
    },
    width: 150,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
];

export const HEADER_KPI_COLUMNS_INACTIVE: GridColDef[] = [
  {
    headerName: "KPI Name",
    field: "kpi_name",
    flex: 2,
    sortable: true,
    hideable: false,
    headerAlign: "center",
  },
  {
    headerName: "Description",
    field: "description",
    flex: 3,
    sortable: false,

    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "Periodicity",
    field: "periodicity",
    flex: 1,
    sortable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "Unit",
    field: "unit",
    flex: 1,
    sortable: true,
    headerAlign: "center",
    align: "center",
  },

  {
    headerName: "Cumulative",
    field: "cumulative",
    flex: 1,
    sortable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "Formula",
    field: "formula",
    flex: 1,
    sortable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    headerName: "Created At",
    field: "created_at",
    flex: 1,
    sortable: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return <>{format(new Date(params.value), "yyyy-MM-dd")}</>;
    },
  },
  {
    headerName: "Approved",
    field: "is_approved",
    flex: 1,
    sortable: true,
    headerAlign: "center",
    align: "center",
  },
];
