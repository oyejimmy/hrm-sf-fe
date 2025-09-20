import { Statistic, Row, Col, Progress, Space, Card } from "antd";
import {
  TrendingUp,
  UserCheck,
  UserX,
  AlertCircle,
  Coffee,
} from "lucide-react";
import { StatsCard, StyledCard } from "./styles";

const StatItem = ({ title, value, icon, color }: any) => (
  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
    <StatsCard>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color, fontSize: "18px" }}
        style={{ textAlign: "center" }}
      />
    </StatsCard>
  </Col>
);

const AttendanceOverviewPanel = ({ summary, loading }: any) => {
  return (
    <Card
      loading={loading}
      title={
        <Space>
          <TrendingUp size={18} />
          Attendance Overview
        </Space>
      }
    >
      <Row gutter={[8, 8]}>
        <StatItem
          title="Present"
          value={summary.presentDays || 0}
          icon={<UserCheck size={16} style={{ color: "#52c41a" }} />}
          color="#52c41a"
        />
        <StatItem
          title="Absent"
          value={summary.absentDays || 0}
          icon={<UserX size={16} style={{ color: "#f5222d" }} />}
          color="#f5222d"
        />
        <StatItem
          title="Late"
          value={summary.lateDays || 0}
          icon={<AlertCircle size={16} style={{ color: "#faad14" }} />}
          color="#faad14"
        />
        <StatItem
          title="On Leave"
          value={0} // Mock data since this value is not in the summary prop
          icon={<Coffee size={16} style={{ color: "#1890ff" }} />}
          color="#1890ff"
        />
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Statistic
            title="Attendance Rate"
            value={`${summary.attendancePercentage}%`}
            valueStyle={{ color: "#1a237e", fontSize: "24px" }}
          />
          <Progress
            percent={summary.attendancePercentage}
            status="active"
            strokeColor={{ from: "#388E3C", to: "#1a237e" }}
            showInfo={false}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default AttendanceOverviewPanel;
