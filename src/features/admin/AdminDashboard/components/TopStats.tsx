// AdminDashboard/components/TopStats.tsx
import React from "react";
import { Row, Col, Statistic } from "antd";
// import { SectionCard } from "../styles";
import type { TopStat } from "../types";
import { SectionCard } from "./styles";

/** TopStats: renders stat cards in a responsive row */
interface Props {
  stats: TopStat[];
}

const TopStats: React.FC<Props> = ({ stats }) => {
  return (
    <Row gutter={[16, 16]}>
      {stats.map((s) => (
        <Col xs={24} sm={12} md={6} key={s.id}>
          <SectionCard>
            <Statistic
              title={s.title}
              value={s.value}
              suffix={s.suffix}
              valueStyle={{ color: s.color ?? undefined, fontWeight: 700 }}
              prefix={s.icon ?? null}
            />
          </SectionCard>
        </Col>
      ))}
    </Row>
  );
};

export default TopStats;
