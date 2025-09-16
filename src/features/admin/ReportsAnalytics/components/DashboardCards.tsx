import React from "react";
import { DashboardStat } from "../types";
import { GridContainer, StyledCard, StyledStatistic } from "./styles";

interface DashboardCardsProps {
  stats: DashboardStat[];
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  return (
    <GridContainer>
      {stats.map((stat, index) => (
        <StyledCard key={index} style={{ borderTop: `4px solid ${stat.color || '#1890ff'}` }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              marginRight: 16, 
              padding: 12, 
              borderRadius: '50%', 
              backgroundColor: `${stat.color || '#1890ff'}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <StyledStatistic
              title={stat.title}
              value={stat.value}
              suffix={stat.suffix}
              valueStyle={{ color: stat.color || '#1890ff' }}
            />
          </div>
        </StyledCard>
      ))}
    </GridContainer>
  );
};

export default DashboardCards;