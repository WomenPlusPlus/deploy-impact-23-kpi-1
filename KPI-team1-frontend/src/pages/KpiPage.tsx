import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { KpiExtended } from "../model/kpi";
import KpiDetailModalPage from "./KpiDetailModalPage";
import { getDisplayValueByPeriodicity } from "../helpers/kpiHelpers";
import { useOutletContext, useParams } from "react-router-dom";
import { Circles } from "../model/circle";
import { UserDetails } from "../model/user";
import { TbCirclePlus } from "react-icons/tb";
import AddKpiModalPage from "./AddKpiModalPage";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { Tooltip } from "@mui/material";

interface OutletContext {
  circles: Circles[];
  kpiDefinitions: KpiExtended[];
  setKpiDefinitions: React.Dispatch<React.SetStateAction<KpiExtended[]>>;
  userDetails: UserDetails;
  fetchKpiDefinitions: () => Promise<void>;
}

const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

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
    headerName: "Target",
    field: "kpi_target",
    width: 150,
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
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
    width: 150,
    sortable: false,
    filterable: false,
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

const periodicityOrder = ["daily", "weekly", "monthly", "quarterly", "yearly"];

export default function KpiPage(): JSX.Element {
  const { circleId } = useParams();
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addKpiModalIsOpen, setAddKpiModalIsOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiExtended | null>(null);
  const {
    kpiDefinitions,
    setKpiDefinitions,
    userDetails,
    fetchKpiDefinitions,
  }: OutletContext = useOutletContext();

  useEffect(() => {
    if (circleId) {
      setSelectedCircleId(circleId);
    } else {
      setSelectedCircleId(userDetails.defaultCircleId);
    }
  }, [circleId]);

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

  const handleClick = (kpi: KpiExtended) => {
    setSelectedKpi(kpi);
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
      <div key={periodicity}>
        <div className="text-xl font-medium">{`${periodicity
          .charAt(0)
          .toUpperCase()}${periodicity.slice(1)} KPIs`}</div>
        <div className="shadow-md border-0 border-primary-light mb-8 cursor-pointer">
          <DataGrid
            getRowId={(row) => row.circle_kpidef_id}
            rows={filteredKpiDefinitions}
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
      {selectedKpi && (
        <KpiDetailModalPage
          isOpen={modalIsOpen}
          onRequestClose={handleOpenModal}
          kpi={selectedKpi}
          circleId={Number(circleId)}
        />
      )}

      <div className="flex">
        <div className="w-11/12 xl:w-800">
          <div className="flex justify-between text-2xl pb-4 border-b border-gray-300">
            KPIs - {circleKpis[0]?.circle_name}
            <button
              className="flex justify-center items-center py-2 px-6 gap-2.5 rounded-md bg-[#FBBB21] text-[#131313] text-base font-semibold cursor-pointer hover:bg-yellow-600"
              onClick={handleOpenAddKpiModal}
            >
              <span>
                <TbCirclePlus />
              </span>
              <div>KPI</div>
            </button>
          </div>
          {periodicityOrder.map((periodicity) => renderDataGrid(periodicity))}
        </div>
      </div>
      <AddKpiModalPage
        isOpen={addKpiModalIsOpen}
        onRequestClose={handleOpenAddKpiModal}
        circleId={Number(selectedCircleId)}
        fetchKpiDefinitions={fetchKpiDefinitions}
        kpiDefinitions={kpiDefinitions}
        setKpiDefinitions={setKpiDefinitions}
      />
    </>
  );
}
