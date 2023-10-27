import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getStringDisplayValueByPeriodicity } from "../../helpers/kpiHelpers";
import { ApexChartType } from "../../model/kpi";
import { GRAPH_TYPES } from "../../constants";

const AreaAndLineGraph = ({
  seriesName,
  xValues,
  yValues,
  periodicity,
  target_value,
  targetFulfilled,
  percentage_change,
  graph_type: selectedGraphType = GRAPH_TYPES["line_graph"],
}: {
  seriesName: string;
  xValues: string[];
  yValues: number[];
  periodicity: string;
  target_value: number | null;
  targetFulfilled: number[] | null[];
  percentage_change: number | null;
  graph_type: ApexChartType | null;
}) => {
  const graph_type =
    selectedGraphType === GRAPH_TYPES["donut_graph"]
      ? GRAPH_TYPES["line_graph"]
      : selectedGraphType;
  const [chartOptions, setChartOptions] = useState<any>(null);
  const xValuesCopy = [...xValues];
  const sortedXValues = xValuesCopy.sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  const sortedYValues = sortedXValues.map((xValue) => {
    const index = xValues.indexOf(xValue);
    return yValues[index];
  });
  const sortedDisplayXValues = sortedXValues.map((xValue) => {
    const date = new Date(xValue);
    return getStringDisplayValueByPeriodicity(periodicity, date);
  });
  const sortedTargetFulfilled = sortedXValues.map((xValue) => {
    const index = xValues.indexOf(xValue);
    return targetFulfilled[index];
  });

  const lastTargetFulfilled =
    sortedTargetFulfilled[sortedTargetFulfilled.length - 1];
  useEffect(() => {
    const minYValue = target_value
      ? Math.min(...yValues, target_value, 0)
      : Math.min(...yValues, 0);

    const maxNonRoundedYValue = target_value
      ? Math.max(...yValues, target_value)
      : Math.max(...yValues);

    const maxYValue =
      maxNonRoundedYValue > 10
        ? Math.round((maxNonRoundedYValue * 1.1) / 10) * 10
        : maxNonRoundedYValue * 1.1;

    const options = {
      chart: {
        height: "100%",
        maxWidth: "100%",
        type: graph_type || "line",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: true,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },

      fill: {
        type: graph_type === GRAPH_TYPES["area_graph"] ? "gradient" : "solid",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: "#1C64F2",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
        },
      },
      markers: {
        size: [5],
        strokeWidth: 0,
      },
      series: [
        {
          data: sortedYValues,
          color:
            graph_type === GRAPH_TYPES["area_graph"] ? "#1A56DB" : "#6634C1",
          name: seriesName,
        },
      ],
      xaxis: {
        categories: sortedDisplayXValues,
        labels: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: true,
        max: maxYValue,
        min: minYValue,
        tickAmount: 6,
        forceNiceScale: true,
      },
      annotations: {
        yaxis: [{}],
      },
    };

    if (target_value) {
      options.annotations.yaxis = [
        {
          y: target_value,
          borderColor: "#22AD5C",
          label: {
            show: false,
            borderColor: "#22AD5C",
            style: {
              color: "#fff",
              background: "#22AD5C",
            },
            text: `Target (${lastTargetFulfilled}%) : ${target_value} `,
          },
        },
      ];
    }
    setChartOptions(options);
  }, [xValues]);

  const isNewValueHigher = percentage_change && percentage_change > 0;
  const textClass = isNewValueHigher ? "text-green-500" : "text-red-600";

  return (
    <div className="m-5 bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 pb-2">
            {sortedYValues[yValues.length - 1]}
          </h5>
          <p className="text-base font-normal text-gray-500">{seriesName}</p>
        </div>
        {percentage_change ? (
          <div
            className={`flex items-center px-2.5 py-0.5 text-base font-semibold text-center ${textClass}`}
          >
            {`${percentage_change.toFixed(2)}%`}
            <svg
              className="w-3 h-3 ml-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isNewValueHigher
                    ? "M5 13V1m0 0L1 5m4-4 4 4"
                    : "M5 1V13M5 13l4-4M5 13l-4-4"
                }
              />
            </svg>
          </div>
        ) : null}
      </div>
      <div id="area-chart">
        {chartOptions && (
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type={graph_type || "line"}
          />
        )}
      </div>
    </div>
  );
};

export default AreaAndLineGraph;
