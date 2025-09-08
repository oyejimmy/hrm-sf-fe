import React from "react";
import { Card, Progress } from "antd";
import { GridContainer, StyledCard } from "./styles";

interface DashboardProps {
    totalEmployees: number;
    completed: number;
    inProgress: number;
    notStarted: number;
}

const TrainingDashboard: React.FC<DashboardProps> = ({
    totalEmployees,
    completed,
    inProgress,
    notStarted,
}) => {
    return (
        <GridContainer>
            <StyledCard>
                <Card.Meta title="Total Employees in Training" description={totalEmployees} />
            </StyledCard>
            <StyledCard>
                <Card.Meta title="Completed" description={<Progress type="circle" percent={completed} />} />
            </StyledCard>
            <StyledCard>
                <Card.Meta title="In Progress" description={<Progress type="circle" percent={inProgress} />} />
            </StyledCard>
            <StyledCard>
                <Card.Meta title="Not Started" description={<Progress type="circle" percent={notStarted} />} />
            </StyledCard>
        </GridContainer>
    );
};

export default TrainingDashboard;
