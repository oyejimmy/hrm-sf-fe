import React from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";

interface Props {
    balances: any;
}

const ChartWrapper = styled.div`
  margin: 20px 0;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const LeaveAnalytics: React.FC<Props> = ({ balances }) => {
    const chartOptions: any = {
        chart: {
            type: "donut",
        },
        labels: ["Annual", "Sick", "Casual", "Compensatory"],
        legend: {
            position: "bottom",
        },
    };

    const series = [
        balances.annual,
        balances.sick,
        balances.casual,
        balances.compensatory,
    ];

    return (
        <ChartWrapper>
            <h3>Leave Balance Distribution</h3>
            <Chart options={chartOptions} series={series} type="donut" height={300} />
        </ChartWrapper>
    );
};

export default LeaveAnalytics;
