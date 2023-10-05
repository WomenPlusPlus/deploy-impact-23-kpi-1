import { useEffect, useState } from "react";
import ModalRightSide from "../components/ModalRightSide";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { supabase } from "../supabase";
import { KpiExtended } from "../model/kpi";

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
    field: "last_value",
    width: 150,
    sortable: true,
    headerAlign: "center",

    align: "center",
  },
  {
    headerName: "Last Update",
    field: "last_period_date",
    width: 150,
    sortable: true,
    headerAlign: "center",
    align: "center",
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
const data: GridRowsProp = [
  {
    id: 1,
    kpi_name: "share of teams constituted as circles",
    kpi_target: "80%",
    last_value: "35%",
    kpi_next_due_date: "Aug 2023",
    description: "to define",
  },
  {
    id: 2,
    kpi_name: "count sessions on .projuventute.ch",
    kpi_target: "100000",
    last_value: "158611",
    kpi_next_due_date: "Aug 2023",
    description: "to define",
  },
  {
    id: 3,
    kpi_name: "private donations",
    kpi_target: "100000",
    last_value: "1369218",
    kpi_next_due_date: "Aug 2023",
    description: "to define",
  },
];
const periodicityOrder = ["daily", "weekly", "monthly", "quarterly", "yearly"];

export default function KpiPage(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState("");
  const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);
  const handleOpenModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleClick = (kpi: string) => {
    setSelectedKpi(kpi);
    handleOpenModal();
  };

  const fetchKpiDefinitions = async () => {
    try {
      let { data: kpi_definition, error } = await supabase
        .from("kpi_definition_with_latest_value")
        .select("*");

      if (error) {
        throw error;
      }
      setKpiDefinitions(kpi_definition || []);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchKpiDefinitions();
  }, []);

  const renderModalContent = () => {
    const [selectView, setSelectView] = useState<"values" | "history">(
      "values"
    );

    const renderAddNewValue = () => {
      return (
        <>
          <div className="text-2xl ">
            Set a new value for{" "}
            <span className="font-medium">{selectedKpi}</span>
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
      return (
        <>
          <div className="mt-4 text-2xl">Previous Values</div>
          {/* Add content for showing previous values here */}
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
          KPI - {selectedKpi}
        </div>
        {
          //if values is selected, render the values component, if not render the history component
        }

        {/* <div className="mt-4 text-2xl">Values History</div> */}
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
    const filteredKpiDefinitions = kpiDefinitions.filter(
      item => item.periodicity === periodicity
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
            getRowId={row => row.kpi_id}
            rows={filteredKpiDefinitions}
            rowSelection={false}
            columns={HEADER_KPI_COLUMNS}
            onRowClick={params => {
              handleClick(params.row.kpi_name);
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

      <div className="flex m-12">
        <div className="w-11/12 md:w-3/4  xl:w-800">
          <div className="text-2xl py-4 my-2 border-b border-gray-300">
            KPIs - Marketing Zürich
          </div>
          <div className=" text-xl font-medium">Monthly KPIs (test)</div>
          <div className="shadow-md border-0 border-primary-light ">
            <DataGrid
              rows={data}
              rowSelection={false}
              columns={HEADER_KPI_COLUMNS}
              slots={{ toolbar: GridToolbar }}
              onRowClick={params => {
                handleClick(params.row.kpi_name);
              }}
              classes={{
                columnHeaders: "bg-customPurple ",
                columnHeader: "uppercase",
              }}
            />
          </div>
          {periodicityOrder.map(periodicity => renderDataGrid(periodicity))}
        </div>
      </div>
    </>
  );
}
