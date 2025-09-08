import React from "react";
import { Statistic } from "antd";
import { DashboardStat } from "../types";
import { GridContainer, StyledCard } from "./styles";

interface DashboardCardsProps {
  stats: DashboardStat[];
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  return (
    <GridContainer>
      {stats.map((stat, index) => (
        <StyledCard key={index}>
          <Statistic
            title={stat.title}
            value={stat.value}
            suffix={stat.suffix}
          />
        </StyledCard>
      ))}
    </GridContainer>
  );
};

export default DashboardCards;
