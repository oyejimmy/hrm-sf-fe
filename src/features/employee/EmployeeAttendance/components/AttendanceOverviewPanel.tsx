import React from "react";
import { Row, Col, Progress, Space, Typography } from "antd";
import { TrendingUp, UserCheck, UserX, AlertCircle, Coffee } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../services/api/api";
import { StateCard } from "../../../../components/StateCard";
import { OverviewCard, OverviewContent, EqualHeightContainer } from "./styles";

const { Text } = Typography;

const AttendanceOverviewPanel: React.FC = () => {
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance-overview'],
    queryFn: () => api.get('/api/attendance/records').then(res => res.data),
  });
  const calculateStats = () => {
    if (!attendanceData?.length) return { presentDays: 0, absentDays: 0, lateDays: 0, onLeaveDays: 0, attendancePercentage: 0 };
    const present = attendanceData.filter((record: any) => record.status === 'present').length;
    const absent = attendanceData.filter((record: any) => record.status === 'absent').length;
    const late = attendanceData.filter((record: any) => record.status === 'late').length;
    const onLeave = attendanceData.filter((record: any) => record.status === 'on_leave').length;
    const total = attendanceData.length;
    return {
      presentDays: present,
      absentDays: absent,
      lateDays: late,
      onLeaveDays: onLeave,
      attendancePercentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };
  const stats = calculateStats();
  return (
    <EqualHeightContainer>
      <OverviewCard
        loading={isLoading}
        title={
          <Space>
            <TrendingUp size={18} />
            Attendance Overview
          </Space>
        }
      >
        <OverviewContent>
          <Row gutter={[12, 12]}>
            {[
              { label: "Present", value: stats.presentDays, icon: (props: any) => <UserCheck {...props} />, tone: "pastelGreen" as const },
              { label: "Absent", value: stats.absentDays, icon: (props: any) => <UserX {...props} />, tone: "pastelPink" as const },
              { label: "Late", value: stats.lateDays, icon: (props: any) => <AlertCircle {...props} />, tone: "lightPeach" as const },
              { label: "On Leave", value: stats.onLeaveDays, icon: (props: any) => <Coffee {...props} />, tone: "softLavender" as const },
            ].map((stat) => (
              <Col xs={12} key={stat.label}>
                <StateCard
                  tone={stat.tone}
                  label={stat.label}
                  icon={stat.icon}
                  iconSize={18}
                  titleLevel={3}
                  value={stat.value}
                  loading={isLoading}
                  suffix={
                    <Text style={{ marginLeft: 6, fontSize: "0.65em", color: "rgba(0,0,0,0.56)" }}>
                      days
                    </Text>
                  }
                />
              </Col>
            ))}
          </Row>

          <Row style={{ marginTop: 16 }}>
            <Col xs={24}>
              <Text style={{ display: "block", marginBottom: 8, color: "rgba(0,0,0,0.65)" }}>
                Attendance Rate
              </Text>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Text style={{ fontWeight: 600, fontSize: 20, color: "#1a237e", minWidth: 60 }}>
                  {stats.attendancePercentage}%
                </Text>
                <Progress
                  percent={stats.attendancePercentage}
                  status="active"
                  strokeColor={{ from: "#388E3C", to: "#1a237e" }}
                  showInfo={false}
                  style={{ flex: 1 }}
                />
              </div>
            </Col>
          </Row>
        </OverviewContent>
      </OverviewCard>
    </EqualHeightContainer>
  );
};

export default AttendanceOverviewPanel;
