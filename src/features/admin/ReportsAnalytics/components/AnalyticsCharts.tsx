import React from "react";
import ReactApexChart from "react-apexcharts";
import { ChartData } from "../types";
import { ChartWrapper } from "./styles";

interface AnalyticsChartsProps {
  title: string;
  type: "bar" | "line" | "pie" | "donut";
  data: ChartData;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ title, type, data }) => {
  const options: ApexCharts.ApexOptions = {
    chart: { type, toolbar: { show: false } },
    xaxis: { categories: data.categories },
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    title: { text: title, align: "left" },
  };

  return (
    <ChartWrapper>
      <ReactApexChart
        options={options}
        series={data.series}
        type={type}
        height={350}
      />
    </ChartWrapper>
  );
};

export default AnalyticsCharts;
