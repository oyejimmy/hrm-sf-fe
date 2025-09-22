import React from "react";
import { Row, Col, Space, Typography } from "antd";
import { CheckCircle, Calendar, Clock, AlertCircle, User } from "lucide-react";
import type { StatCard as StatCardType } from "../types";
import { StateCard } from "../../../../components/StateCard";

const { Text } = Typography;

interface Props {
  stats: StatCardType[];
}

const RESPONSIVE_SIZES = {
  mobile: { iconSize: 14, titleLevel: 4 },
  desktop: { iconSize: 20, titleLevel: 3 },
};

const toneCycle = [
  "pastelGreen",
  "pastelPink",
  "lightPeach",
  "softLavender",
] as const;

const getIconForTitle = (title: string) => {
  const map: Record<string, React.ComponentType<any>> = {
    "Attendance Rate": CheckCircle,
    "Leave Balance": Calendar,
    "Work Hours": Clock,
    "Pending Requests": AlertCircle,
  };
  return map[title] || User;
};

const getCardDescription = (title: string) => {
  const baseStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
  };

  const contentMap: Record<string, React.ReactNode> = {
    "Attendance Rate": <div style={baseStyle}>+2.3% from last month</div>,
    "Leave Balance": (
      <Space direction="vertical" size={2} style={baseStyle}>
        <div>Personal: 12</div>
        <div>Sick: 6</div>
      </Space>
    ),
    "Work Hours": <div style={baseStyle}>This month</div>,
    "Pending Requests": (
      <Space direction="vertical" size={2} style={baseStyle}>
        <div>1 leave</div>
        <div>1 skill update</div>
      </Space>
    ),
  };

  return contentMap[title] || null;
};

const MyStatsOverview: React.FC<Props> = ({ stats }) => {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const sizes = isMobile ? RESPONSIVE_SIZES.mobile : RESPONSIVE_SIZES.desktop;

  return (
    <Row gutter={[16, 16]}>
      {stats.map((s, index) => {
        const IconComp = getIconForTitle(s.title);
        const tone = toneCycle[index % toneCycle.length];

        return (
          <Col xs={24} sm={12} md={12} lg={6} key={s.id}>
            <StateCard
              tone={tone}
              label={s.title}
              icon={IconComp}
              iconSize={sizes.iconSize}
              titleLevel={sizes.titleLevel as 1 | 2 | 3 | 4 | 5}
              value={s.value} // Pass just the value
              suffix={
                s.suffix ? ( // Use the suffix prop instead
                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: "0.6em",
                    }}
                  >
                    {s.suffix}
                  </Text>
                ) : null
              }
              description={getCardDescription(s.title)}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default MyStatsOverview;
