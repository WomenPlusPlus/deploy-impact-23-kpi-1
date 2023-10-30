import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KpiExtended } from "../model/kpi";
import KpiDetailModalPage from "./KpiModalPage/KpiDetailModalPage";
import { Tooltip, Grid } from "@mui/material";
import { HiMiniInformationCircle } from "react-icons/hi2";
import {
  getDisplayValueByPeriodicity,
  getPreviousPeriodByPeriodicity,
  getStringDisplayValueByPeriodicity,
} from "../helpers/kpiHelpers";
import SnackBarComponent from "../components/SnackBarComponent";

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
      headerName: "Circle Name",
      field: "circle_name",
      width: 150,
      sortable: true,
      hideable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Latest Value",
      field: "latest_value",
      width: 200,
      sortable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value as number;
        const getDisplayValue = (value: number) => {
          if (value === null) {
            return null;
          } else if (params.row.unit === "%") {
            return value.toFixed(2) + "%";
          } else {
            return value.toLocaleString("fr-ch");
          }
        };
        const getChangeColor = (value: number) => {
          if (value === null) {
            return "";
          } else if (value > 0) {
            return "bg-green-600";
          } else if (value < -50) {
            return "bg-red-600";
          } else {
            return "bg-amber-500";
          }
        };
        return (
          <Grid container className="flex justify-center items-center">
            <Grid item xs={4}></Grid>
            <Grid item xs={4} className="mr-1 text-center">
              {getDisplayValue(value)}{" "}
            </Grid>
            {params.row.percentage_change &&
            typeof params.row.percentage_change === "number" ? (
              <Grid
                item
                xs={4}
                className={`w-[60px] h-[29px] p-1.5 ${getChangeColor(
                  params.row.percentage_change
                )} text-red-600 bg-opacity-50 rounded justify-center items-center gap-1 inline-flex`}
              >
                <div className="text-center text-neutral-900 text-[12px] font-medium font-['Inter']">
                  {params.row.percentage_change?.toFixed(2)}%
                </div>
              </Grid>
            ) : (
              <Grid item xs={4}></Grid>
            )}
          </Grid>
        );
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
          return (
            <div className="flex" data-tooltip-target="tooltip-default">
              {getStringDisplayValueByPeriodicity(periodicity, date) !==
                getStringDisplayValueByPeriodicity(periodicity, new Date()) &&
                getStringDisplayValueByPeriodicity(periodicity, date) !==
                  getPreviousPeriodByPeriodicity(periodicity, new Date()) && (
                  <Tooltip title={<span>Missing Latest Value</span>}>
                    <svg
                      className="w-[20px] h-[20px] text-gray-800 mr-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#F23030"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                    </svg>
                  </Tooltip>
                )}
              {getDisplayValueByPeriodicity(periodicity, date)}{" "}
            </div>
          );
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
  const other = {
    showCellVerticalBorder: true,
    showColumnVerticalBorder: true,
  };

  const [kpiDefinitions, setKpiDefinitions] = useState<any[]>([]);
  const { kpiId } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiExtended | null>(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleOpenModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleClick = (kpi: KpiExtended) => {
    setSelectedKpi(kpi);
    handleOpenModal();
  };
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

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
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchKpi();
  }, [kpiId]);

  const filteredKpiDefinitions = periodicityOrder.map((periodicity) =>
    kpiDefinitions.filter((item) => item.periodicity === periodicity)
  );

  const renderKpis = filteredKpiDefinitions.filter((kpi) => kpi.length !== 0);

  const getRowClassName = (params: any) => {
    if (params.row.is_approved === false) {
      return "bg-orange-200";
    }
    return "";
  };

  return (
    <>
      {renderKpis &&
        renderKpis.map((renderKpi, index) => (
          <div key={index}>
            <div className="text-xl font-medium">{`${renderKpi[0].periodicity
              .charAt(0)
              .toUpperCase()}${renderKpi[0].periodicity.slice(1)} KPIs`}</div>
            <div className="shadow-md border-0 border-primary-light cursor-pointer">
              <DataGrid
                getRowId={(row) => row.circle_kpidef_id}
                rows={renderKpi}
                rowSelection={false}
                columns={HEADER_KPI_COLUMNS}
                onRowClick={(params) => {
                  params.row.is_approved === true && handleClick(params.row);
                }}
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
                getRowClassName={getRowClassName}
              />
            </div>
          </div>
        ))}
      {selectedKpi && (
        <KpiDetailModalPage
          isOpen={modalIsOpen}
          onRequestClose={handleOpenModal}
          kpiId={selectedKpi.kpi_id}
          circleId={selectedKpi.circle_id}
          setOpenAlert={setOpen}
          setAlertMessage={setAlertMessage}
          setSeverity={setSeverity}
        />
      )}
      <SnackBarComponent
        open={open}
        alertMessage={alertMessage}
        severity={severity}
        handleCloseAlert={handleCloseAlert}
      />
    </>
  );
}
