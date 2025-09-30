import React from 'react';
import { Row, Col, Spin } from 'antd';
import Chart from 'react-apexcharts';
import { ChartContainer } from './styles';
import { useAttendanceReport } from '../../../../hooks/api/useReports';

interface ChartsSectionProps {
  departmentData?: { name: string; total_members: number }[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ departmentData = [] }) => {
  const currentYear = new Date().getFullYear();
  const { data: attendanceReportData, isLoading: attendanceLoading } = useAttendanceReport(currentYear, 0);

  const chartData: any = {
    options: {
      labels: departmentData.map(dept => dept.name),
      colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
      legend: {
        position: 'bottom' as const,
      },
    },
    series: departmentData.map(dept => dept.total_members),
  };

  const attendanceData = {
    options: {
      chart: {
        id: 'attendance-chart',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      colors: ['#1890ff'],
    },
    series: [
      {
        name: 'Attendance Rate',
        data: attendanceReportData?.monthly_rates || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  return (
    <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
      <Col xs={24} lg={12}>
        <ChartContainer title="Department Distribution">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="pie"
            height={350}
          />
        </ChartContainer>
      </Col>
      <Col xs={24} lg={12}>
        <ChartContainer title="Monthly Attendance Rate">
          {attendanceLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Chart
              options={attendanceData.options}
              series={attendanceData.series}
              type="bar"
              height={350}
            />
          )}
        </ChartContainer>
      </Col>
    </Row>
  );
};