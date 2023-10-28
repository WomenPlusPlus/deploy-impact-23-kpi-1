import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { KpiExtended } from "../../model/kpi";
import KpiDetailModalPage from "../KpiModalPage/KpiDetailModalPage";
import { useOutletContext, useParams } from "react-router-dom";
import { Circle } from "../../model/circle";
import { UserDetails } from "../../model/user";
import { HiOutlinePlusCircle } from "react-icons/hi";
import AddKpiModalPage from "../AddKpiModalPage";
import { HEADER_KPI_COLUMNS } from "./KpiPageHeaders";
import KpiPageInactiveSection from "./KpiPageInactiveSection";
import { getStringDisplayValueByPeriodicity } from "../../helpers/kpiHelpers";

interface OutletContext {
  circles: Circle[];
  kpiDefinitions: KpiExtended[];
  userDetails: UserDetails;
  fetchKpiDefinitions: () => Promise<void>;
}

const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const periodicityOrder = ["daily", "weekly", "monthly", "quarterly", "yearly"];

export default function KpiPage(): JSX.Element {
  const { circleId } = useParams();
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedKpiId, setSelectedKpiId] = useState<number | null>(null);
  const [addKpiModalIsOpen, setAddKpiModalIsOpen] = useState(false);
  const [selectView, setSelectView] = useState<"active" | "all">("active");
  const {
    circles,
    kpiDefinitions,
    userDetails,
    fetchKpiDefinitions,
  }: OutletContext = useOutletContext();

  useEffect(() => {
    if (circleId) {
      setSelectedCircleId(circleId);
    } else {
      setSelectedCircleId(userDetails.defaultCircleId);
    }
  }, [circleId, userDetails]);

  const selectedCircle = circles.find(
    (circle) => circle.circle_id === Number(selectedCircleId)
  );
  const circleKpis =
    kpiDefinitions &&
    kpiDefinitions.filter(
      (kpiDefinition) => kpiDefinition.circle_id === Number(selectedCircleId)
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
        />
      )}

      <div className="flex">
        <div className="w-full xl:w-800">
          <div className="flex justify-between pb-4 border-b border-gray-300">
            <div>
              {selectedCircle && (
                <div className="text-2xl">
                  {" "}
                  KPIs - {selectedCircle.circle_name}
                </div>
              )}
            </div>
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
      />
    </>
  );
}
