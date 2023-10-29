import { ApexChartType } from "./model/kpi";

export const GRAPH_TYPES: {
  [key: string]: ApexChartType | null;
} = {
  area_graph: ApexChartType.Area,
  line_graph: ApexChartType.Line,
  donut_graph: ApexChartType.Donut,
};
