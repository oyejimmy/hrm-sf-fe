import React from "react";
import { Collapse } from "antd";
import { SectionCard } from "./styles";
import type { Announcement } from "../types";

interface Props {
    announcements: Announcement[];
}

const Announcements: React.FC<Props> = ({ announcements }) => (
    <SectionCard title="Announcements & Updates">
        <Collapse accordion>
            {announcements.map((a) => (
                <Collapse.Panel header={`${a.title} (${a.date})`} key={a.id}>
                    <p>{a.description}</p>
                </Collapse.Panel>
            ))}
        </Collapse>
    </SectionCard>
);

export default Announcements;
