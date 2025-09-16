import React from "react";
import ReactApexChart from "react-apexcharts";
import { ChartData } from "../types";
import { ChartWrapper } from "./styles";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Donut 
} from "lucide-react";

interface AnalyticsChartsProps {
  title: string;
  type: "bar" | "line" | "pie" | "donut";
  data: ChartData;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ title, type, data }) => {
  const chartIcons = {
    bar: <BarChart3 size={20} color="#3b82f6" />,
    line: <TrendingUp size={20} color="#10b981" />,
    pie: <PieChart size={20} color="#8b5cf6" />,
    donut: <Donut size={20} color="#f59e0b" />
  };

  const options: ApexCharts.ApexOptions = {
    chart: { 
      type, 
      toolbar: { 
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      } 
    },
    xaxis: { categories: data.categories },
    legend: { position: "bottom" },
    dataLabels: { enabled: type === 'pie' || type === 'donut' },
    title: { 
      text: title, 
      align: "left",
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    colors: type === 'bar' ? ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'] : undefined,
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetY: 0,
          horizontalAlign: 'center'
        }
      }
    }]
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