import React from "react";
import { List, Tag } from "antd";
import { SectionCard } from "./styles";
import type { ScheduleEvent } from "../types";

interface Props {
    events: ScheduleEvent[];
}

const MySchedule: React.FC<Props> = ({ events }) => (
    <SectionCard title="My Schedule">
        <List
            dataSource={events}
            renderItem={(ev) => (
                <List.Item key={ev.id}>
                    <div>
                        <strong>{ev.title}</strong> — {ev.date}{" "}
                        <Tag color={ev.type === "Meeting" ? "blue" : ev.type === "Training" ? "green" : "orange"}>
                            {ev.type}
                        </Tag>
                    </div>
                </List.Item>
            )}
        />
    </SectionCard>
);

export default MySchedule;
