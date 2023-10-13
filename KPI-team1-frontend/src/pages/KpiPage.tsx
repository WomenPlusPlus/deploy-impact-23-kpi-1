import { useEffect, useState } from "react";
import ModalRightSide from "../components/ModalRightSide";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { supabase } from "../supabase";
import { Kpi, KpiExtended, KpiValue } from "../model/kpi";
import { getWeek, getQuarter } from "date-fns";
import { useOutletContext, useParams } from "react-router-dom";
import { Circles } from "../model/circle";

interface OutletContext {
  circles: Circles[];
  kpiDefinitions: KpiExtended[];
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
//TO DO : remove this dummy data when demo is done
const data: GridRowsProp = [
  {
    id: 1,
    kpi_name: "share of teams constituted as circles",
    kpi_target: "80%",
    latest_value: "35%",
    latest_standardized_date: "Aug 2023",
    description: "to define",
  },
  {
    id: 2,
    kpi_name: "count sessions on .projuventute.ch",
    kpi_target: "100000",
    latest_value: "158611",
    latest_standardized_date: "2023-07-10",
    description: "to define",
  },
  {
    id: 3,
    kpi_name: "private donations",
    kpi_target: "100000",
    latest_value: "1369218",
    latest_standardized_date: "2022-02-19",
    description: "to define",
  },
];
const periodicityOrder = ["daily", "weekly", "monthly", "quarterly", "yearly"];

export default function KpiPage(): JSX.Element {
  const { circleId } = useParams();
  const [selectedCircleId, setSelectedCircleId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiExtended | null>(null);
  // const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);
  // const [circleName, setCircleName] = useState("");
  const { circles, kpiDefinitions }: OutletContext = useOutletContext();

  useEffect(() => {
    if (circleId) {
      setSelectedCircleId(circleId);
    } else {
      setSelectedCircleId("1");
    }
  }, [circleId]);

  const circleKpis =
    kpiDefinitions &&
    kpiDefinitions.filter(
      (kpiDefinition) => kpiDefinition.circle_id === Number(selectedCircleId)
    );

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

  const handleOpenModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleClick = (kpi: KpiExtended) => {
    setSelectedKpi(kpi);
    handleOpenModal();
  };

  // const fetchKpiDefinitions = async () => {
  //   try {
  //     let { data: kpi_definition, error } = await supabase
  //       .from("kpi_definition_with_latest_values")
  //       .select("*")
  //       .eq("circle_id", Number(selectedCircleId));

  //     if (error) {
  //       throw error;
  //     }
  //     setKpiDefinitions(kpi_definition || []);
  //     // findCircleName();

  //     console.log("check data", kpiDefinitions);
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchKpiDefinitions();
  // }, [selectedCircleId]);

  const renderModalContent = () => {
    const [selectView, setSelectView] = useState<"values" | "history">(
      "values"
    );
    const [kpiValues, setKpiValues] = useState<KpiValue[]>([]);

    const fetchKpiValues = async () => {
      try {
        if (selectedKpi) {
          let { data: kpi_values, error } = await supabase
            .from("kpi_values_period_standardized")
            .select("*")
            .eq("kpi_id", selectedKpi.kpi_id)
            .eq("circle_id", Number(circleId));

          if (error) {
            throw error;
          }
          setKpiValues(kpi_values || []);
          console.log(kpi_values, "kpi_values");
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    useEffect(() => {
      fetchKpiValues();
    }, [selectedKpi]);

    const renderAddNewValue = () => {
      return (
        <>
          <div className="text-2xl ">
            Set a new value for{" "}
            <span className="font-medium">{selectedKpi?.kpi_name}</span>
          </div>
          <div className="flex justify-between my-2">
            <label className="font-medium w-full mr-2">
              Set a date
              <input
                className="block w-full p-2 border rounded-md"
                name="set date"
                type="date"
              />
            </label>
            <label className="font-medium w-full">
              Enter a new value
              <input
                className="block w-full p-2 border rounded-md"
                name="new value"
                type="number"
              />
            </label>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="w-28 h-10 mr-4 bg-white rounded border border-customYellow justify-center items-center gap-2 inline-flex text-zinc-700 text-base font-medium">
              Cancel
            </button>
            <button className="w-28 h-10 bg-customYellow rounded justify-center items-center gap-2 inline-flex text-base font-medium">
              Save
            </button>
          </div>
        </>
      );
    };

    const renderPreviousValues = () => {
      const PREVIOUS_VALUES_COLUMNS: GridColDef[] = [
        {
          headerName: "Date",
          field: "standardized_date",
          flex: 1,
          sortable: true,
          headerAlign: "center",
          align: "center",
          renderCell: (params) => {
            if (params.value === null) return null;
            const periodicity = params.row.kpi_periodicity;
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
          headerName: "Value",
          field: "value",
          flex: 1,
          sortable: true,
          headerAlign: "center",
          align: "center",
        },
        {
          headerName: "Status",
          field: "comment",
          flex: 1,
          sortable: false,
          filterable: false,
          headerAlign: "center",
          align: "center",
        },
      ];

      return (
        <>
          <div className="mt-4 text-2xl">Previous Values</div>
          <div className="">
            <DataGrid
              getRowId={(row) => row.kpi_value_history_id}
              rows={kpiValues}
              rowSelection={false}
              columns={PREVIOUS_VALUES_COLUMNS}
              classes={{
                columnHeaders: "bg-customPurple",
                columnHeader: "uppercase",
              }}
              {...other}
            />
          </div>
        </>
      );
    };

    const renderSetTargetValue = () => {
      return (
        <>
          <div className="mt-4 text-2xl">Set a target value for this year</div>
          <div className="flex justify-between my-2">
            <label className="font-medium w-full mr-2">
              Due Date
              <input
                className="block w-full font-normal text-neutral-400 p-2 border rounded-md border-neutral-400"
                name="target date"
                type="date"
              />
            </label>
            <label className="font-medium w-full">
              Enter the target value
              <input
                className="block w-full font-normal text-neutral-400 p-2 border rounded-md border-neutral-400"
                name="target value"
                type="number"
                placeholder="What's your target"
              />
            </label>
          </div>
        </>
      );
    };
    return (
      <>
        <div className="text-center text-2xl font-light">
          KPI - {selectedKpi?.kpi_name}
        </div>
        <div className="mb-2">
          <button
            className={`${
              selectView === "values" ? "border-black" : " dark:text-gray-600"
            } w-1/3 h-10 border-b-2 justify-center items-center font-medium`}
            onClick={() => setSelectView("values")}
          >
            Values
          </button>
          <button
            className={`${
              selectView === "history" ? "border-black" : " dark:text-gray-600"
            } w-1/3 h-10  border-b-2 justify-center items-center font-medium`}
            onClick={() => setSelectView("history")}
          >
            History
          </button>
        </div>
        {selectView === "values" ? (
          <>
            <div className="bg-gray-100 p-4">{renderAddNewValue()}</div>
            {renderPreviousValues()}
            {renderSetTargetValue()}
          </>
        ) : null}
      </>
    );
  };

  const renderDataGrid = (periodicity: string) => {
    const filteredKpiDefinitions = circleKpis.filter(
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
                paginationModel: { pageSize: 10 },
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
      <ModalRightSide isOpen={modalIsOpen} onRequestClose={handleOpenModal}>
        {renderModalContent()}
      </ModalRightSide>

      <div className="flex">
        <div className="w-11/12 xl:w-800">
          <div className="text-2xl pb-4 border-b border-gray-300">
            KPIs - {circleKpis[0]?.circle_name}
          </div>
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
          {periodicityOrder.map((periodicity) => renderDataGrid(periodicity))}
        </div>
      </div>
    </>
  );
}
