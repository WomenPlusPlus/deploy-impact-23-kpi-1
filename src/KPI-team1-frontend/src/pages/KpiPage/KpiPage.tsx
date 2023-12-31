import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { KpiExtended } from "../../model/kpi";
import KpiDetailModalPage from "../KpiModalPage/KpiDetailModalPage";
import { useOutletContext, useParams } from "react-router-dom";
import { UserDetails } from "../../model/user";
import { HiOutlinePlusCircle } from "react-icons/hi";
import AddKpiModalPage from "../AddKpiModalPage";
import { HEADER_KPI_COLUMNS } from "./KpiPageHeaders";
import KpiPageInactiveSection from "./KpiPageInactiveSection";
import { getStringDisplayValueByPeriodicity } from "../../helpers/kpiHelpers";
import SnackBarComponent from "../../components/SnackBarComponent";

interface OutletContext {
  kpiDefinitions: KpiExtended[];
  userDetails: UserDetails;
  fetchKpiDefinitions: () => Promise<void>;
  circleId: number | null;
  setCircleId: (circleId: number) => void;
}

const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const periodicityOrder = ["daily", "weekly", "monthly", "quarterly", "yearly"];

export default function KpiPage(): JSX.Element {
  const { circleId: circleIdParam } = useParams();
  const [selectedCircleId, setSelectedCircleId] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedKpiId, setSelectedKpiId] = useState<number | null>(null);
  const [addKpiModalIsOpen, setAddKpiModalIsOpen] = useState(false);
  const [selectView, setSelectView] = useState<"active" | "all">("active");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const {
    kpiDefinitions,
    userDetails,
    fetchKpiDefinitions,
    circleId,
    setCircleId,
  }: OutletContext = useOutletContext();

  useEffect(() => {
    if (circleId) {
      setSelectedCircleId(Number(circleId));
    } else if (!circleId && circleIdParam) {
      setCircleId(Number(circleIdParam));
      setSelectedCircleId(Number(circleIdParam));
    } else {
      setCircleId(Number(userDetails.defaultCircleId));
      setSelectedCircleId(Number(userDetails.defaultCircleId));
    }
  }, [circleIdParam, circleId, userDetails]);

  const circleKpis =
    kpiDefinitions &&
    kpiDefinitions.filter(
      (kpiDefinition) =>
        kpiDefinition.circle_id === Number(selectedCircleId) &&
        kpiDefinition.is_active
    );

  const handleOpenModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleOpenAddKpiModal = () => {
    setAddKpiModalIsOpen(!addKpiModalIsOpen);
  };

  const handleClick = (kpi: number) => {
    setSelectedKpiId(kpi);
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

  const renderDataGrid = (periodicity: string) => {
    const filteredKpiDefinitions = circleKpis.filter(
      (item) => item.periodicity === periodicity
    );
    if (filteredKpiDefinitions.length === 0) {
      return null;
    }

    const getRowClassName = (params: any) => {
      if (params.row.is_approved === false) {
        return "bg-orange-200";
      }
      return "";
    };

    return (
      <div key={periodicity} className="mt-5">
        <div className="flex items-end">
          <div className="text-xl font-medium mr-2">{`${periodicity
            .charAt(0)
            .toUpperCase()}${periodicity.slice(1)} KPIs`}</div>{" "}
          <span className="text-gray-400 text-xs font-semibold italic">
            {getStringDisplayValueByPeriodicity(periodicity, new Date())}
          </span>
        </div>
        <div className="shadow-md border-0 border-primary-light mb-10">
          <DataGrid
            sx={{ fontFamily: "Inter" }}
            getRowId={(row) => row.circle_kpidef_id}
            rows={filteredKpiDefinitions}
            rowSelection={false}
            columns={HEADER_KPI_COLUMNS}
            onRowClick={(params) => {
              params.row.is_approved === true && handleClick(params.row.kpi_id);
            }}
            classes={{
              columnHeaders: "bg-customPurple",
              columnHeader: "uppercase",
              row: "cursor-pointer",
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            {...other}
            getRowClassName={getRowClassName}
          />
        </div>
      </div>
    );
  };
  return (
    <>
      {selectedKpiId && (
        <KpiDetailModalPage
          isOpen={modalIsOpen}
          onRequestClose={handleOpenModal}
          kpiId={selectedKpiId}
          circleId={Number(selectedCircleId)}
          setOpenAlert={setOpen}
          setAlertMessage={setAlertMessage}
          setSeverity={setSeverity}
        />
      )}

      <div className="flex">
        <div className="w-full xl:w-800 m-5">
          {circleId === 0 && (
            <div className="flex justify-between items-center text-red-600 text-xl mb-4">
              You are not part of any circle. You can still search for KPIs or
              Circles.
            </div>
          )}
          {circleKpis?.[0] && (
            <div className="flex justify-between text-2xl pb-4 border-b border-gray-300">
              KPIs - {circleKpis[0].circle_name}
              <button
                className="flex justify-center items-center py-2 px-6 gap-2.5 rounded-md bg-[#FBBB21] text-[#131313] text-base font-semibold cursor-pointer hover:bg-yellow-600"
                onClick={handleOpenAddKpiModal}
              >
                <span className="text-xl">
                  <HiOutlinePlusCircle />
                </span>
                <div>KPI</div>
              </button>
            </div>
          )}

          <div className="mb-2">
            <button
              className={`${
                selectView === "active"
                  ? "border-violet-500 text-gray-500"
                  : "text-gray-400"
              } w-24 h-10 border-b-2 justify-center items-center font-medium`}
              onClick={() => setSelectView("active")}
            >
              Active
            </button>
            <button
              className={`${
                selectView === "all"
                  ? "border-violet-500 text-gray-500"
                  : "text-gray-400"
              } w-24 h-10  border-b-2 justify-center items-center font-medium`}
              onClick={() => setSelectView("all")}
            >
              Inactive
            </button>
          </div>

          {selectView === "active" ? (
            periodicityOrder.map((periodicity) => renderDataGrid(periodicity))
          ) : (
            <KpiPageInactiveSection
              circleId={Number(selectedCircleId)}
              fetchKpiDefinitions={fetchKpiDefinitions}
            />
          )}
        </div>
      </div>

      <AddKpiModalPage
        isOpen={addKpiModalIsOpen}
        onRequestClose={handleOpenAddKpiModal}
        circleId={Number(selectedCircleId)}
        fetchKpiDefinitions={fetchKpiDefinitions}
        setOpenAlert={setOpen}
        setAlertMessage={setAlertMessage}
        setSeverity={setSeverity}
      />

      <SnackBarComponent
        open={open}
        alertMessage={alertMessage}
        severity={severity}
        handleCloseAlert={handleCloseAlert}
      />
    </>
  );
}
