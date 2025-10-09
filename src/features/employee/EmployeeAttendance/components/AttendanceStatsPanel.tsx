import { Row, Col, Progress, Space, Typography, Card, Statistic } from "antd";
import { Clock, CheckCircle, XCircle, Coffee, TrendingUp } from "lucide-react";
import { StateCard } from "../../../../components/StateCard";

const { Text } = Typography;

const AttendanceStatsPanel = ({
  stats,
  summary,
  loading = false,
  showEmployeeStats = false,
}: any) => {
  if (showEmployeeStats && summary) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Present Days"
            value={`${summary.presentDays}/${summary.totalDays}`}
            icon={<CheckCircle />}
            tone="pastelGreen"
            description={`${summary.attendancePercentage.toFixed(1)}% attendance`}
            loading={loading}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Absent Days"
            value={summary.absentDays}
            icon={<XCircle />}
            tone="pastelPink"
            description="Missed days"
            loading={loading}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Late Days"
            value={summary.lateDays}
            icon={<Clock />}
            tone="lightPeach"
            description="Late arrivals"
            loading={loading}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Avg. Hours/Day"
            value={summary.averageWorkingHours}
            precision={1}
            suffix="h"
            icon={<TrendingUp />}
            tone="pastelBlue"
            description="Daily average"
            loading={loading}
          />
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Attendance Overview" loading={loading}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Progress
                percent={summary.attendancePercentage}
                strokeColor={{
                  "0%": "#ff4d4f",
                  "50%": "#faad14",
                  "100%": "#52c41a",
                }}
                trailColor="#f0f0f0"
                strokeWidth={12}
                format={(percent) => `${percent?.toFixed(1)}%`}
              />
              <Row justify="space-between">
                <Col>
                  <Space>
                    <CheckCircle size={16} color="#52c41a" />
                    <Text>Present: {summary.presentDays}</Text>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <XCircle size={16} color="#ff4d4f" />
                    <Text>Absent: {summary.absentDays}</Text>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Working Hours Summary" loading={loading}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Statistic
                title="Total Working Hours"
                value={summary.totalWorkingHours}
                precision={1}
                suffix="hours"
                valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
              />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  Average: {summary.averageWorkingHours.toFixed(1)} hours/day
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    );
  }

  if (stats) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Today's Attendance Overview" loading={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Progress
                  type="circle"
                  percent={Math.round(
                    (stats.todayPresent / stats.totalEmployees) * 100
                  )}
                  strokeColor="#52c41a"
                  format={(percent) => (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {percent}%
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Present
                      </div>
                    </div>
                  )}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Text>Total Employees:</Text>
                    <Text strong>{stats.totalEmployees}</Text>
                  </Space>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Text>Present:</Text>
                    <Text style={{ color: "#52c41a" }}>
                      {stats.todayPresent}
                    </Text>
                  </Space>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Text>Absent:</Text>
                    <Text style={{ color: "#ff4d4f" }}>
                      {stats.todayAbsent}
                    </Text>
                  </Space>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Text>Late:</Text>
                    <Text style={{ color: "#faad14" }}>{stats.todayLate}</Text>
                  </Space>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Text>On Break:</Text>
                    <Text style={{ color: "#1890ff" }}>{stats.onBreak}</Text>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }

  return null;
};

export default AttendanceStatsPanel;
