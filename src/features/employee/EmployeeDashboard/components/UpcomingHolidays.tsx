import React from "react";
import { List } from "antd";
import { SectionCard } from "./styles";
import type { Holiday } from "../types";

interface Props {
  holidays: Holiday[];
}

const UpcomingHolidays: React.FC<Props> = ({ holidays }) => (
  <SectionCard title="Upcoming Holidays">
    <List
      dataSource={holidays}
      renderItem={(item) => (
        <List.Item style={{ padding: '8px 0', border: 'none' }}>
          <List.Item.Meta
            title={<strong>{item.name}</strong>}
            description={
              <div>
                <div>{item.date}</div>
                <span style={{ color: '#999' }}>{item.day}</span>
              </div>
            }
          />
        </List.Item>
      )}
    />
  </SectionCard>
);

export default UpcomingHolidays;