import { useEffect, useState } from "react";
import ModalRightSide from "../components/ModalRightSide";
import { KpiExtended, KpiValue } from "../model/kpi";
import { supabase } from "../supabase";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getQuarter, getWeek } from "date-fns";
import { getDisplayValueByPeriodicity } from "../helpers/kpiHelpers";

const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const KpiDetailModalPage = ({
  isOpen,
  onRequestClose,
  kpi,
  circleId,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  kpi: KpiExtended;
  circleId: number;
}): JSX.Element => {
  const renderModalContent = () => {
    const [selectView, setSelectView] = useState<"values" | "history">(
      "values"
    );
    const [kpiValues, setKpiValues] = useState<KpiValue[]>([]);

    const fetchKpiValues = async () => {
      try {
        if (kpi) {
          let { data: kpi_values, error } = await supabase
            .from("kpi_values_period_standardized")
            .select("*")
            .eq("kpi_id", kpi.kpi_id)
            .eq("circle_id", circleId);

          if (error) {
            throw error;
          }
          setKpiValues(kpi_values || []);
        }
      } catch (error: any) {
        alert(error.message);
      }
    };

    useEffect(() => {
      fetchKpiValues();
    }, [kpi]);

    const renderAddNewValue = () => {
      return (
        <>
          <div className="text-2xl ">
            Set a new value for{" "}
            <span className="font-medium">{kpi?.kpi_name}</span>
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
          headerName: "Period",
          field: "standardized_date",
          flex: 1,
          sortable: true,
          headerAlign: "center",
          align: "center",
          renderCell: (params) => {
            const periodicity = params.row.kpi_periodicity;
            const date = params.value ? new Date(params.value as string) : null;
            if (date === null || periodicity === undefined) {
              return null;
            } else {
              return getDisplayValueByPeriodicity(periodicity, date);
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
          headerName: "Updated by",
          field: "user_name",
          flex: 1,
          sortable: false,
          filterable: false,
          headerAlign: "center",
          align: "center",
        },
        {
          headerName: "Updated at",
          field: "updated_at",
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
          KPI - {kpi?.kpi_name}
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
  return (
    <ModalRightSide isOpen={isOpen} onRequestClose={onRequestClose}>
      {renderModalContent()}
    </ModalRightSide>
  );
};

export default KpiDetailModalPage;
