import { useEffect, useState } from "react";
import { KpiExtended } from "../../model/kpi";
import { supabase } from "../../supabase";
import { DataGrid } from "@mui/x-data-grid";
import { HEADER_KPI_COLUMNS_INACTIVE } from "./KpiPageHeaders";

const KpiPageInactiveSection = ({
  circleId,
  fetchKpiDefinitions,
}: {
  circleId: number | null;
  fetchKpiDefinitions: () => Promise<void>;
}) => {
  const [kpiDefinitions, setKpiDefinitions] = useState<KpiExtended[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  const fetchInactiveAndActiveKpis = async () => {
    if (!circleId) return;
    try {
      let { data: kpi_definitions, error } = await supabase
        .from("kpi_definition")
        .select("*");
      if (error) {
        throw error;
      }
      const kpiDefinitionsResult = kpi_definitions || [];

      let { data: circleKpiDefIds, error: circleError } = await supabase
        .from("circle_kpi_definition")
        .select("*")
        .eq("circle_id", circleId);

      if (circleError) {
        throw circleError;
      }
      // const activeCircles = activeCircleKpiDefinitions || [];

      const circleKpiDefIdMap: { [key: number]: number } = {};

      circleKpiDefIds && circleKpiDefIds.length > 0
        ? circleKpiDefIds.forEach((circleKpiDef) => {
            circleKpiDefIdMap[circleKpiDef.kpi_id] =
              circleKpiDef.circle_kpidef_id;
          })
        : null;

      const activeCircles =
        circleKpiDefIds && circleKpiDefIds.length > 0
          ? circleKpiDefIds.filter((circleKpiDef) => circleKpiDef.is_active)
          : [];

      const filteredKpiDefinitions = kpiDefinitionsResult.filter((kpi) => {
        return !activeCircles.some(
          (circleKpiDef) => circleKpiDef.kpi_id === kpi.kpi_id
        );
      });

      const kpiDefinitionsWithCircleKpiDefId = filteredKpiDefinitions.map(
        (kpi) => ({
          ...kpi,
          circle_kpidef_id: circleKpiDefIdMap[kpi.kpi_id] || null,
        })
      );

      setKpiDefinitions(kpiDefinitionsWithCircleKpiDefId || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleActivate = async () => {
    try {
      if (kpiDefinitions.length === 0 || selectedRowIds.length === 0) return;
      const selectedKpiDefinitions = kpiDefinitions.filter((kpi) =>
        selectedRowIds.includes(kpi.kpi_id)
      );
      const selectedCircleKpiDefinitionsToAdd = selectedKpiDefinitions
        .filter((kpi) => !kpi.circle_kpidef_id)
        .map((kpi) => ({
          circle_id: circleId,
          kpi_id: kpi.kpi_id,
          is_active: true,
        }));

      const selectedCircleKpiDefinitionsToUpdate = selectedKpiDefinitions
        .filter((kpi) => kpi.circle_kpidef_id)
        .map((kpi) => ({
          circle_kpidef_id: kpi.circle_kpidef_id,
          circle_id: circleId,
          kpi_id: kpi.kpi_id,
          is_active: true,
        }));
      let fetchedData = [];
      for (const selectedCircleKpiDefinitionToUpdate of selectedCircleKpiDefinitionsToUpdate) {
        const { data, error } = await supabase
          .from("circle_kpi_definition")
          .update(selectedCircleKpiDefinitionToUpdate)
          .eq(
            "circle_kpidef_id",
            selectedCircleKpiDefinitionToUpdate.circle_kpidef_id
          )
          .select("circle_kpidef_id");
        if (data && data.length > 0) fetchedData.push(...data);
        if (error) {
          throw error;
        }
      }
      const { data: addedData, error } = await supabase
        .from("circle_kpi_definition")
        .insert(selectedCircleKpiDefinitionsToAdd)
        .select("circle_kpidef_id");

      if (
        (fetchedData && fetchedData.length > 0) ||
        (addedData && addedData.length > 0)
      ) {
        fetchKpiDefinitions();
        fetchInactiveAndActiveKpis();
      }
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleSelectionChange = (rowSelectionModel: any) => {
    setSelectedRowIds(rowSelectionModel);
  };

  useEffect(() => {
    fetchInactiveAndActiveKpis();
  }, []);

  return (
    <>
      <div className="flex justify-end  mb-2">
        <button
          disabled={selectedRowIds.length === 0}
          className={`py-2 px-2 rounded-md border-2 text-base w-36 font-semibold  ${
            selectedRowIds.length >= 1
              ? "hover:bg-[#FBBB21] border-[#FBBB21]"
              : "text-gray-400"
          }`}
          onClick={handleActivate}
        >
          Activate{" "}
          {selectedRowIds.length > 0
            ? `${selectedRowIds.length} KPI${
                selectedRowIds.length > 1 ? "s" : ""
              }`
            : ""}
        </button>
      </div>
      <DataGrid
        getRowId={(row) => row.kpi_id}
        rows={kpiDefinitions}
        columns={HEADER_KPI_COLUMNS_INACTIVE}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
        rowSelectionModel={selectedRowIds}
      />
    </>
  );
};

export default KpiPageInactiveSection;
