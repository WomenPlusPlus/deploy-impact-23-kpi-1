import { useEffect, useState } from "react";
import { Kpi, KpiExtendedWithCircles } from "../../model/kpi";
import { supabase } from "../../supabase";
import { DataGrid } from "@mui/x-data-grid";
import { HEADER_KPI_COLUMNS_INACTIVE } from "./KpiPageHeaders";
import { Button } from "@mui/material";

const KpiPageInactiveSection = ({ circleId }: { circleId: number | null }) => {
  const [kpiDefinitions, setKpiDefinitions] = useState<
    KpiExtendedWithCircles[]
  >([]);
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

      let { data: activeCircleKpiDefinitions, error: circleError } =
        await supabase
          .from("circle_kpi_definition")
          .select("kpi_id, circle_kpidef_id")
          .eq("circle_id", circleId)
          .eq("is_active", true);

      if (circleError) {
        throw circleError;
      }
      const activeCircles = activeCircleKpiDefinitions || [];

      const circleKpiDefIdMap: { [key: number]: number } = {};
      activeCircles.forEach((circleKpiDef) => {
        circleKpiDefIdMap[circleKpiDef.kpi_id] = circleKpiDef.circle_kpidef_id;
      });

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
      const selectedCircleKpiDefinitions = selectedKpiDefinitions.map(
        (kpi) => ({
          circle_kpidef_id: kpi.circle_kpidef_id || undefined,
          circle_id: circleId,
          kpi_id: kpi.kpi_id,
          is_active: true,
        })
      );
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
      <Button variant="contained" color="primary" onClick={handleActivate}>
        Activate
      </Button>
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
