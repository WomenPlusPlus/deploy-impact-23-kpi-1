import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getDisplayValueByPeriodicity } from "../../helpers/kpiHelpers";
import { supabase } from "../../supabase";
import { useState } from "react";
import { LinearProgress } from "@mui/material";
import { KpiExtended, KpiValue } from "../../model/kpi";

const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const KpiValuesModalPage = ({
  kpi,
  circleId,
  fetchKpiValues,
  isLoading,
  kpiValues,
}: {
  kpi: KpiExtended;
  circleId: number;
  fetchKpiValues: () => void;
  isLoading: boolean;
  kpiValues: KpiValue[];
}): JSX.Element => {
  const [comment, setComment] = useState<string>("");
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newValue, setNewValue] = useState<number | null>(null);
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

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
      headerName: "Comment",
      field: "comment",
      flex: 1,
      sortable: false,
      filterable: false,
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
      renderCell: (params) => {
        const date = params.row.created_at
          ? new Date(params.row.created_at as string)
          : null;
        return (
          <div>
            <div className="text-center">{params.value}</div>
            {date ? (
              <div className="text-center">
                {date.toLocaleDateString("en-CH")}
              </div>
            ) : null}
          </div>
        );
      },
    },
  ];

  const renderAddNewValue = () => {
    const handleSave = async (
      value: number | null,
      date: Date | null,
      comment: string | null
    ) => {
      try {
        const { data, error } = await supabase
          .from("kpi_values_history")
          .insert([
            {
              kpi_id: kpi?.kpi_id,
              value: value,
              circle_id: circleId,
              period_date: date,
              comment: comment,
              action: "CREATE",
            },
          ])
          .select("*");

        if (error) {
          alert(`Error inserting new value \nDetails: ${error.message}`);
        }
        if (data) {
          fetchKpiValues();
        }
      } catch (error: any) {
        alert(error.message);
      }
    };
    return (
      <>
        <div className="text-2xl ">
          Set a new value for{" "}
          <span className="font-medium">{kpi?.kpi_name}</span>
        </div>
        <div className="flex justify-between my-2">
          <label className="font-medium w-full mr-2">
            Set a date*
            <input
              className="block w-full p-2 border rounded-md"
              name="set date"
              type="date"
              onChange={(e) => {
                setNewDate(new Date(e.target.value));
              }}
            />
          </label>
          <label className="font-medium w-full">
            Enter a new value*
            <input
              className="block w-full p-2 border rounded-md"
              name="new value"
              type="number"
              placeholder="What's your value"
              onChange={(e) => {
                setNewValue(parseInt(e.target.value));
              }}
            />
          </label>
        </div>
        <label className="font-medium w-full">
          Comment
          <textarea
            className="block w-full p-2 border rounded-md"
            name="comment"
            rows={3}
            placeholder="Optional: add comment to your changes"
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </label>
        <div className="pt-4 flex justify-end">
          <button className="w-28 h-10 mr-4 bg-white rounded border border-customYellow justify-center items-center gap-2 inline-flex text-zinc-700 text-base font-medium">
            Cancel
          </button>
          <button
            className="w-28 h-10 bg-customYellow rounded justify-center items-center gap-2 inline-flex text-base font-medium"
            onClick={() => handleSave(newValue, newDate, comment)}
          >
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
        <div className="">
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress,
            }}
            loading={isLoading}
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
      <div className="bg-gray-100 p-4">{renderAddNewValue()}</div>
      {renderPreviousValues()}
      {renderSetTargetValue()}
    </>
  );
};

export default KpiValuesModalPage;
