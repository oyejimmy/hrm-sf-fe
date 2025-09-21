import React from 'react';
import { Empty, Avatar, Tag, Typography } from 'antd';
import { User } from 'lucide-react';
import { StyledCard } from './styles';

const { Text } = Typography;

interface ActivityLogsProps {
    logs: any[];
    isDarkMode: boolean;
}

const ActivityLogs = ({ logs, isDarkMode }: ActivityLogsProps) => {
    const renderLogItem = (log: any) => (
        <div style={{
            display: 'flex',
            gap: 12,
            padding: '16px 0',
            borderBottom: `1px solid ${isDarkMode ? '#434343' : '#f0f0f0'}`
        }}>
            <Avatar size={40} icon={<User size={20} />} src={log.avatar} />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <Text strong>{log.performedBy}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{log.timestamp}</Text>
                </div>
                <Text style={{ display: 'block', marginTop: 4 }}>
                    <Tag color="blue" style={{ marginRight: 8, marginTop: 4 }}>{log.action}</Tag>
                    {log.details}
                </Text>
            </div>
        </div>
    );

    return (
        <StyledCard isDarkMode={isDarkMode}>
            {logs.length > 0 ? (
                <div>
                    {logs.map(renderLogItem)}
                </div>
            ) : (
                <Empty description="No activity logs" imageStyle={{ height: 60 }} />
            )}
        </StyledCard>
    );
};

export default ActivityLogs;