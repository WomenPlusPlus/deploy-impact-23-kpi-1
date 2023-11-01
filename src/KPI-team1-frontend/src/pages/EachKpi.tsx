import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KpiExtended } from "../model/kpi";
import KpiDetailModalPage from "./KpiModalPage/KpiDetailModalPage";
import { HEADER_KPI_COLUMNS as STANDARD_HEADER } from "./KpiPage/KpiPageHeaders";
import SnackBarComponent from "../components/SnackBarComponent";

export default function EachKpi(): JSX.Element {
  const periodicityOrder = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
  ];

  const NEW_HEADER_COLUMN: GridColDef = {
    headerName: "Circle Name",
    field: "circle_name",
    flex: 2,
    sortable: true,
    hideable: false,
    headerAlign: "left",
    align: "left",
  };
  let HEADER_KPI_COLUMNS: GridColDef[] = [...STANDARD_HEADER];

  HEADER_KPI_COLUMNS.splice(1, 0, NEW_HEADER_COLUMN);

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
                sx={{ fontFamily: "Inter" }}
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
