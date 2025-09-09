import React from "react";
import { Button, Tag } from "antd";
import { SectionCard } from "./styles";
import type { TrainingProgram } from "../types";

interface Props {
  trainings: TrainingProgram[];
}

const TrainingPrograms: React.FC<Props> = ({ trainings }) => (
  <SectionCard 
    title="Training Programs" 
    extra={<Button type="link">View All</Button>}
  >
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <th style={{ textAlign: 'left', padding: '12px' }}>Courses</th>
            <th style={{ textAlign: 'left', padding: '12px' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '12px' }}>Instructor</th>
            <th style={{ textAlign: 'left', padding: '12px' }}>Duration</th>
            <th style={{ textAlign: 'left', padding: '12px' }}>Enrollment</th>
            <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '12px' }}>{item.course}</td>
              <td style={{ padding: '12px' }}>{item.category}</td>
              <td style={{ padding: '12px' }}>{item.instructor}</td>
              <td style={{ padding: '12px' }}>{item.duration}</td>
              <td style={{ padding: '12px' }}>{item.enrollment}</td>
              <td style={{ padding: '12px' }}>
                <Tag color={item.status === "Active" ? "green" : "blue"}>{item.status}</Tag>
              </td>
              <td style={{ padding: '12px' }}>
                <Button type="link">{item.action}</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </SectionCard>
);

export default TrainingPrograms;