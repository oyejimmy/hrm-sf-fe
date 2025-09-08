import React from "react";
import { Progress, Row, Col } from "antd";
import { SectionCard } from "./styles";

interface Props {
  departments: any;
}

/** small widget per department with employee count and performance */
const DepartmentOverview: React.FC<Props> = ({ departments }) => {
  return (
    <SectionCard title="Departmental Overview">
      <Row gutter={[16, 16]}>
        {departments.map((d: any) => (
          <Col xs={24} sm={12} md={6} key={d.id}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontWeight: 700 }}>{d.name}</div>
              <div style={{ color: "#666" }}>{d.employees} employees</div>
              <Progress percent={Math.round(d.avgPerformance)} status={d.avgPerformance > 85 ? "success" : "active"} />
            </div>
          </Col>
        ))}
      </Row>
    </SectionCard>
  );
};

export default DepartmentOverview;
