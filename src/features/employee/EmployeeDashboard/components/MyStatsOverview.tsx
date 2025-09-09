import React from "react";
import { Statistic } from "antd";
import { GridRow, StatCard } from "./styles";
import type { StatCard as StatCardType } from "../types";

interface Props {
    stats: StatCardType[];
}

const MyStatsOverview: React.FC<Props> = ({ stats }) => (
    <GridRow minWidth={200}>
        {stats.map((s) => (
            <StatCard key={s.id} bgColor={s.color}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Statistic
                        title={s.title}
                        value={s.value}
                        suffix={s.suffix}
                        valueStyle={{ color: '#fff' }}
                        prefix={s.icon}
                    />
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {s.icon}
                    </div>
                </div>
                {s.title === "Attendance Rate" && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                        +2.3% from last month
                    </div>
                )}
                {s.title === "Leave Balance" && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                        <div>Personal: 12</div>
                        <div>Sick: 6</div>
                    </div>
                )}
                {s.title === "Work Hours" && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                        This month
                    </div>
                )}
                {s.title === "Pending Requests" && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                        <div>1 leave</div>
                        <div>1 skill update</div>
                    </div>
                )}
            </StatCard>
        ))}
    </GridRow>
);

export default MyStatsOverview;