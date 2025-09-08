import React from "react";
import { Calendar, Badge } from "antd";

const getListData = (value: any) => {
  const day = value.date();
  if (day % 5 === 0) return [{ type: "success", content: "Approved Leave" }];
  if (day % 3 === 0) return [{ type: "warning", content: "Pending Leave" }];
  if (day % 7 === 0) return [{ type: "error", content: "Rejected Leave" }];
  return [];
};

const LeaveCalendar: React.FC = () => {
  const dateCellRender = (value: any) => {
    const listData = getListData(value);
    return (
      <ul>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return <Calendar dateCellRender={dateCellRender} />;
};

export default LeaveCalendar;
