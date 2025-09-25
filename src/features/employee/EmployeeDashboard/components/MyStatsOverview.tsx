import React from "react";
import { Row, Col, Space, Typography } from "antd";
import { CheckCircle, Calendar, Clock, AlertCircle, User } from "lucide-react";
import type { StatCard as StatCardType } from "../types";
import { StateCard } from "../../../../components/StateCard";

const { Text } = Typography;

interface Props {
  stats: StatCardType[];
  dashboardData?: any;
  isLoading?: boolean;
}

const toneCycle = ["pastelGreen", "pastelPink", "lightPeach", "softLavender"] as const;

const iconMap: Record<string, React.ComponentType<any>> = {
  "Attendance Rate": CheckCircle,
  "Leave Balance": Calendar,
  "Work Hours": Clock,
  "Pending Requests": AlertCircle,
};

const getDescription = (title: string, data?: any) => {
  const style = { marginTop: 8, fontSize: 12 };
  
  switch (title) {
    case "Attendance Rate":
      const rate = data?.attendance?.attendance_rate || 0;
      const lastRate = data?.attendance?.last_month_rate || 0;
      const diff = rate - lastRate;
      return <div style={style}>{diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`} from last month</div>;
    
    case "Leave Balance":
      return (
        <Space direction="vertical" size={2} style={style}>
          <div>Personal: {data?.leave_balance?.personal_remaining || 0}</div>
          <div>Sick: {data?.leave_balance?.sick_remaining || 0}</div>
        </Space>
      );
    
    case "Pending Requests":
      return (
        <Space direction="vertical" size={2} style={style}>
          <div>{data?.requests?.pending_leaves || 0} leave</div>
          <div>{data?.requests?.pending_other || 0} other requests</div>
        </Space>
      );
    
    default:
      return <div style={style}>This month</div>;
  }
};

const MyStatsOverview: React.FC<Props> = ({ stats, dashboardData, isLoading }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  return (
    <Row gutter={[16, 16]}>
      {stats.map((stat, index) => {
        const IconComp = iconMap[stat.title] || User;
        const tone = toneCycle[index % toneCycle.length];

        return (
          <Col xs={24} sm={12} md={12} lg={6} key={stat.id}>
            <StateCard
              tone={tone}
              label={stat.title}
              icon={IconComp}
              iconSize={isMobile ? 14 : 20}
              titleLevel={isMobile ? 4 : 3}
              value={stat.value}
              loading={isLoading}
              suffix={
                stat.suffix ? (
                  <Text style={{ marginLeft: 6, fontSize: "0.6em" }}>
                    {stat.suffix}
                  </Text>
                ) : null
              }
              description={getDescription(stat.title, dashboardData)}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default MyStatsOverview;
