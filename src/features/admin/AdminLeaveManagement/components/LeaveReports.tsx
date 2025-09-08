import React from "react";
import { List, Button } from "antd";
import { LeaveReport } from "../types";

interface Props {
  reports: LeaveReport[];
}

const LeaveReports: React.FC<Props> = ({ reports }) => (
  <List
    header={<div>Generated Reports</div>}
    bordered
    dataSource={reports}
    renderItem={(item) => (
      <List.Item
        actions={[
          <Button type="link" href={item.url} target="_blank">
            View
          </Button>,
        ]}
      >
        {item.title} - <i>{item.generatedAt}</i>
      </List.Item>
    )}
  />
);

export default LeaveReports;
