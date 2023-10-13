import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { supabase } from "../supabase";
// import { Kpi, KpiExtended, KpiValue } from "../model/kpi";
// import { getWeek, getQuarter } from "date-fns";
import { KpiExtended } from "../model/kpi";
import KpiDetailModalPage from "./KpiDetailModalPage";
import { getDisplayValueByPeriodicity } from "../helpers/kpiHelpers";
import { useOutletContext, useParams } from "react-router-dom";
import { Circles } from "../model/circle";

interface OutletContext {
  circles: Circles[];
  // kpiDefinitions: KpiExtended[];
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
    width: 300,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
];

const periodicityOrder = ["daily", "weekly", "monthly", "quarterly", "yearly"];

export default function KpiPage(): JSX.Element {
  const { circleId } = useParams();
  const [selectedCircleId, setSelectedCircleId] = useState("");
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [selectedKpi, setSelectedKpi] = useState<KpiExtended | null>(null);
  // const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);
  // const [circleName, setCircleName] = useState("");
  // const { circles, kpiDefinitions }: OutletContext = useOutletContext();

  useEffect(() => {
    if (circleId) {
      setSelectedCircleId(circleId);
    } else {
      setSelectedCircleId("1");
    }
  }, [circleId]);

  // const circleKpis =
  //   kpiDefinitions &&
  //   kpiDefinitions.filter(
  //     (kpiDefinition) => kpiDefinition.circle_id === Number(selectedCircleId)
  //   );

  // const findCircleName = () => {
  //   if (circles) {
  //     const foundCircleName = circles.find(
  //       (circle) => circle.circle_user[0].circle_id === Number(circleId)
  //     );
  //     console.log("check circleName", foundCircleName);
  //     if (foundCircleName) {
  //       setCircleName(foundCircleName?.circle_name);
  //     }
  //   }
  // };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiExtended | null>(null);
  const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);
  const [circleName, setCircleName] = useState("");
  const { circles }: OutletContext = useOutletContext();

  const findCircleName = () => {
    const foundCircleName = circles.find(
      (circle) => circle.circle_user[0].circle_id === Number(circleId)
    );
    if (foundCircleName) {
      setCircleName(foundCircleName?.circle_name);
    }
  };

  const handleOpenModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleClick = (kpi: KpiExtended) => {
    setSelectedKpi(kpi);
    handleOpenModal();
  };

  const fetchKpiDefinitions = async () => {
    try {
      let { data: kpi_definition, error } = await supabase
        .from("kpi_definition_with_latest_values")
        .select("*")
        .eq("circle_id", Number(selectedCircleId));

      if (error) {
        throw error;
      }
      setKpiDefinitions(kpi_definition || []);
    } catch (error: any) {
      console.log("Error getting kpi definitions:", error.message);
    }
  };

  useEffect(() => {
    fetchKpiDefinitions();
  }, [selectedCircleId]);

  useEffect(() => {
    findCircleName();
  }, [circles, circleId]);

  const renderDataGrid = (periodicity: string) => {
    const filteredKpiDefinitions = kpiDefinitions.filter(
      (item) => item.periodicity === periodicity
    );
    if (filteredKpiDefinitions.length === 0) {
      return null;
    }
    return (
      <div key={periodicity}>
        <div className="text-xl font-medium">{`${periodicity
          .charAt(0)
          .toUpperCase()}${periodicity.slice(1)} KPIs`}</div>
        <div className="shadow-md border-0 border-primary-light">
          <DataGrid
            getRowId={(row) => row.circle_kpidef_id}
            rows={filteredKpiDefinitions}
            rowSelection={false}
            columns={HEADER_KPI_COLUMNS}
            onRowClick={(params) => {
              handleClick(params.row);
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
          <div className="text-2xl pb-4 border-b border-gray-300">
            {/* KPIs - {circleKpis[0]?.circle_name}
          </div> */}
            {/* <div className=" text-xl font-medium">Monthly KPIs (test)</div> */}
            {/* <div className="shadow-md border-0 border-primary-light ">
            <DataGrid
              rows={data}
              rowSelection={false}
              columns={HEADER_KPI_COLUMNS}
              slots={{ toolbar: GridToolbar }}
              classes={{
                columnHeaders: "bg-customPurple ",
                columnHeader: "uppercase",
              }}
              {...other}
            />
          </div> */}
            KPIs - {circleName}
          </div>
          {periodicityOrder.map((periodicity) => renderDataGrid(periodicity))}
        </div>
      </div>
    </>
  );
}
