import { Row, Col, Statistic, Progress, Space, Typography } from "antd";
import { Clock, CheckCircle, XCircle, Coffee, TrendingUp } from "lucide-react";
import { StatCard, IconWrapper, StatisticWrapper } from "./styles";

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
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#52c41a">
                <CheckCircle size={24} />
              </IconWrapper>
              <Statistic
                title="Present Days"
                value={summary.presentDays}
                suffix={`/ ${summary.totalDays}`}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {summary.attendancePercentage.toFixed(1)}% attendance
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#ff4d4f">
                <XCircle size={24} />
              </IconWrapper>
              <Statistic
                title="Absent Days"
                value={summary.absentDays}
                valueStyle={{
                  color: "#ff4d4f",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Missed days
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#faad14">
                <Clock size={24} />
              </IconWrapper>
              <Statistic
                title="Late Days"
                value={summary.lateDays}
                valueStyle={{
                  color: "#faad14",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Late arrivals
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#1890ff">
                <TrendingUp size={24} />
              </IconWrapper>
              <Statistic
                title="Avg. Hours/Day"
                value={summary.averageWorkingHours}
                precision={1}
                suffix="h"
                valueStyle={{
                  color: "#1890ff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Daily average
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24} lg={12}>
          <StatCard title="Attendance Overview" loading={loading}>
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
          </StatCard>
        </Col>

        <Col xs={24} lg={12}>
          <StatCard title="Working Hours Summary" loading={loading}>
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
          </StatCard>
        </Col>
      </Row>
    );
  }

  if (stats) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#52c41a">
                <CheckCircle size={24} />
              </IconWrapper>
              <Statistic
                title="Present Today"
                value={stats.todayPresent}
                suffix={`/ ${stats.totalEmployees}`}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {((stats.todayPresent / stats.totalEmployees) * 100).toFixed(1)}
                % present
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#ff4d4f">
                <XCircle size={24} />
              </IconWrapper>
              <Statistic
                title="Absent Today"
                value={stats.todayAbsent}
                valueStyle={{
                  color: "#ff4d4f",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Not checked in
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#faad14">
                <Clock size={24} />
              </IconWrapper>
              <Statistic
                title="Late Today"
                value={stats.todayLate}
                valueStyle={{
                  color: "#faad14",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Late arrivals
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard loading={loading}>
            <StatisticWrapper>
              <IconWrapper $color="#722ed1">
                <Coffee size={24} />
              </IconWrapper>
              <Statistic
                title="On Break"
                value={stats.onBreak}
                valueStyle={{
                  color: "#722ed1",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Currently on break
              </Text>
            </StatisticWrapper>
          </StatCard>
        </Col>

        <Col xs={24}>
          <StatCard title="Today's Attendance Overview" loading={loading}>
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
          </StatCard>
        </Col>
      </Row>
    );
  }

  return null;
};

export default AttendanceStatsPanel;
