import React from "react";
import { Card, Statistic, Row, Col, Progress } from "antd";
import styled from "styled-components";
import { LeaveBalance } from "../types";

const PanelWrapper = styled.div`
  margin-bottom: 24px;
`;

interface Props {
    balance: LeaveBalance;
}

const LeaveSummaryPanel: React.FC<Props> = ({ balance }) => (
    <PanelWrapper>
        <Row gutter={16}>
            <Col span={6}>
                <Card>
                    <Statistic title="Annual Leave" value={balance.annual} suffix="days" />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Sick Leave" value={balance.sick} suffix="days" />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Casual Leave" value={balance.casual} suffix="days" />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Taken This Year" value={balance.totalTaken} suffix="days" />
                    <Progress percent={(balance.totalTaken / 30) * 100} size="small" />
                </Card>
            </Col>
        </Row>
    </PanelWrapper>
);

export default LeaveSummaryPanel;
