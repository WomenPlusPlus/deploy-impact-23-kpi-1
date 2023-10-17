import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({
  seriesName,
  xValues,
  yValues,
}: {
  seriesName: string;
  xValues: string[];
  yValues: number[];
}) => {
  const [chartOptions, setChartOptions] = useState<any>(null);
  const xValuesCopy = [...xValues];
  const sortedXValues = xValuesCopy.sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  const sortedYValues = sortedXValues.map((xValue) => {
    const index = xValues.indexOf(xValue);
    return yValues[index];
  });
  useEffect(() => {
    const options = {
      chart: {
        height: "100%",
        maxWidth: "100%",
        type: "area",
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
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
        },
      },
      series: [
        {
          data: sortedYValues,
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: sortedXValues,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    };
    setChartOptions(options);
  }, [xValues]);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            {sortedYValues[yValues.length - 1]}
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            {seriesName}
          </p>
        </div>
        <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
          {
            //todo: update with percentage change
          }
          12%
          <svg
            className="w-3 h-3 ml-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13V1m0 0L1 5m4-4 4 4"
            />
          </svg>
        </div>
      </div>
      <div id="area-chart">
        {chartOptions && (
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="area"
          />
        )}
      </div>
    </div>
  );
};

export default AreaChart;
