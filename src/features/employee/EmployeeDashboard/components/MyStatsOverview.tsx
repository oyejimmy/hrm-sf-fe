import React from "react";
import { Statistic } from "antd";
import { SectionCard, GridRow } from "./styles";
import type { StatCard } from "../types";

interface Props {
    stats: StatCard[];
}

const MyStatsOverview: React.FC<Props> = ({ stats }) => (
    <GridRow minWidth={200}>
        {stats.map((s) => (
            <SectionCard key={s.id}>
                <Statistic
                    title={s.title}
                    value={s.value}
                    suffix={s.suffix}
                    valueStyle={{ color: s.color }}
                    prefix={s.icon}
                />
            </SectionCard>
        ))}
    </GridRow>
);

export default MyStatsOverview;
