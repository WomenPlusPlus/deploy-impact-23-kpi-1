import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getDisplayValueByPeriodicity } from "../../helpers/kpiHelpers";
import { supabase } from "../../supabase";
import { useState, useEffect } from "react";
import { LinearProgress, TextField } from "@mui/material";
import { KpiExtended, KpiValue } from "../../model/kpi";
import { format, set } from "date-fns";

const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const KpiValuesModalSection = ({
  kpi,
  circleId,
  fetchKpiValues,
  fetchKpiDefinition,
  isLoading,
  kpiValues,
  onRequestClose,
}: {
  kpi: KpiExtended;
  circleId: number;
  fetchKpiValues: () => void;
  fetchKpiDefinition: () => void;
  isLoading: boolean;
  kpiValues: KpiValue[];
  onRequestClose: () => void;
}): JSX.Element => {
  const [comment, setComment] = useState<string>("");
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newValue, setNewValue] = useState<number | null>(null);
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              <div className="text-center">{format(date, "yyyy-MM-dd")}</div>
            ) : null}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setTargetValue(kpi.target_value);
  }, [kpi]);

  const renderAddNewValue = () => {
    const handleSave = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      try {
        const { data, error } = await supabase
          .from("kpi_values_history")
          .insert([
            {
              kpi_id: kpi?.kpi_id,
              value: newValue,
              circle_id: circleId,
              period_date: newDate,
              comment: comment,
              action: "CREATE",
              periodicity: kpi?.periodicity,
            },
          ])
          .select("*");

        if (error) {
          setError(
            "The date for updating KPI's value shouldn't be a future date. Please set a date again!"
          );
        }
        if (data) {
          fetchKpiValues();
          setError("");
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    return (
      <>
        <div className="text-2xl ">
          Set a new value for{" "}
          <span className="font-medium">{kpi?.kpi_name}</span>
        </div>
        <form onSubmit={handleSave}>
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
                required
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
                required
              />
            </label>
          </div>
          <div className="text-sm text-red-600">{error}</div>
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
            <button
              className="w-28 h-10 mr-4 bg-white rounded border border-customYellow justify-center items-center gap-2 inline-flex text-zinc-700 text-base font-medium"
              onClick={() => onRequestClose()}
            >
              Cancel
            </button>
            <button className="w-28 h-10 bg-customYellow rounded justify-center items-center gap-2 inline-flex text-base font-medium">
              Save
            </button>
          </div>
        </form>
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
    const handleSaveTarget = async (value: string | null) => {
      if (!value) return;
      const numberedValue = Number(value);
      if (numberedValue === kpi.target_value) return;
      try {
        const { data, error } = await supabase
          .from("target")
          .upsert({
            target_id: kpi.target_id ? kpi.target_id : undefined,
            kpi_id: kpi.kpi_id,
            circle_id: circleId,
            target_value: numberedValue,
          })
          .select("target_value");
        if (data) {
          const result = data[0].target_value;
          alert(`Target value successfully updated to ${result}`);
          setTargetValue(result);
        }
        if (error) {
          alert(`Error updating the target \nDetails: ${error.message}`);
          return;
        }
        fetchKpiDefinition();
      } catch (error: any) {
        console.log(error.message);
      }
    };

    return (
      <>
        <div className="mt-4 text-2xl">Set a target value for this year</div>
        <div className="flex justify-between my-2">
          <label className="font-medium w-full">
            Enter a target value
            <input
              className="block w-full font-normal text-neutral-800 p-2 border rounded-md border-neutral-400"
              name="target value"
              type="number"
              placeholder="What's your target"
              onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                handleSaveTarget(event.target.value);
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTargetValue(Number(event.target.value));
              }}
              value={targetValue || undefined}
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

export default KpiValuesModalSection;
