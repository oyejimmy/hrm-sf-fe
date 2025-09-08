import React from "react";
import { Card, Row, Col, Statistic } from "antd";

interface Props {
    summaries: any;
}

const TeamLeaveSummary: React.FC<Props> = ({ summaries }) => (
    <Row gutter={16}>
        {summaries.map((summary: any, index: any) => (
            <Col span={6} key={index}>
                <Card title={summary.department}>
                    <Statistic title="Total Employees" value={summary.totalEmployees} />
                    <Statistic title="On Leave" value={summary.onLeave} />
                    <Statistic title="Pending" value={summary.pending} />
                    <Statistic title="Approved" value={summary.approved} />
                    <Statistic title="Rejected" value={summary.rejected} />
                </Card>
            </Col>
        ))}
    </Row>
);

export default TeamLeaveSummary;
