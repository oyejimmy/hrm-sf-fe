import React from "react";
import { Row, Col, Progress, Space, Card, Typography } from "antd";
import {
  TrendingUp,
  UserCheck,
  UserX,
  AlertCircle,
  Coffee,
} from "lucide-react";
import { StateCard } from "../../../../components/StateCard";
import { OverviewCard, OverviewContent, EqualHeightContainer } from "./styles";

const { Text } = Typography;

type Summary = {
  presentDays?: number;
  absentDays?: number;
  lateDays?: number;
  onLeaveDays?: number;
  attendancePercentage?: number;
};

interface Props {
  summary: Summary;
  loading?: boolean;
}

const AttendanceOverviewPanel: React.FC<Props> = ({ summary, loading }) => {
  const stats = [
    {
      label: "Present",
      value: summary?.presentDays ?? 0,
      icon: UserCheck,
      tone: "pastelGreen" as const,
    },
    {
      label: "Absent",
      value: summary?.absentDays ?? 0,
      icon: UserX,
      tone: "pastelPink" as const,
    },
    {
      label: "Late",
      value: summary?.lateDays ?? 0,
      icon: AlertCircle,
      tone: "lightPeach" as const,
    },
    {
      label: "On Leave",
      value: summary?.onLeaveDays ?? 0,
      icon: Coffee,
      tone: "softLavender" as const,
    },
  ];

  const attendancePct = Number(summary?.attendancePercentage ?? 0);

  return (
    <EqualHeightContainer>
      <OverviewCard
        loading={loading}
        title={
          <Space>
            <TrendingUp size={18} />
            Attendance Overview
          </Space>
        }
      >
        <OverviewContent>
          <Row gutter={[12, 12]}>
        {stats.map((s: any) => (
          <Col xs={12} sm={12} md={12} lg={12} xl={12} key={s.label}>
            <StateCard
              tone={s.tone}
              label={s.label}
              icon={s.icon}
              iconSize={18}
              titleLevel={3}
              value={s.value}
              suffix={
                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: "0.65em",
                    color: "rgba(0,0,0,0.56)",
                  }}
                >
                  days
                </Text>
              }
            />
          </Col>
        ))}
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24}>
          <Text
            style={{
              display: "block",
              marginBottom: 4,
              color: "rgba(0,0,0,0.65)",
            }}
          >
            Attendance Rate
          </Text>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Text style={{ fontWeight: 600, fontSize: 20, color: "#1a237e" }}>
              {attendancePct}%
            </Text>
            <div style={{ flex: 1 }}>
              <Progress
                percent={attendancePct}
                status="active"
                strokeColor={{ from: "#388E3C", to: "#1a237e" }}
                showInfo={false}
              />
            </div>
          </div>
          </Col>
          </Row>
        </OverviewContent>
      </OverviewCard>
    </EqualHeightContainer>
  );
};

export default AttendanceOverviewPanel;
