import React from "react";
import { Statistic, Card, Row, Col, Space } from "antd";
import {
    CheckCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { StatCard as StatCardType } from "../types";
import { useTheme } from "../../../../contexts/ThemeContext";

// Define the props interface for type safety
interface Props {
    // Array of stat card data to display
    stats: StatCardType[];
}

// MyStatsOverview Component
// Displays a grid of statistic cards with icons and additional information
// Responsive design that works on mobile, tablet, and desktop
const MyStatsOverview: React.FC<Props> = ({ stats }) => {
    // Get theme context to determine if dark mode is enabled
    const { isDarkMode } = useTheme();

    // Gradient colors for light mode - different colors for visual distinction
    const lightModeGradients = [
        "linear-gradient(135deg, rgb(14, 64, 110) 0%, rgb(85, 116, 255) 100%)", // Blue
        "linear-gradient(135deg, rgb(25, 100, 26) 0%, rgb(126, 217, 87) 100%)", // Green
        "linear-gradient(135deg, rgb(20, 74, 70) 0%, rgb(102, 217, 255) 100%)", // Teal
        "linear-gradient(135deg, rgb(100, 11, 75) 0%, rgb(255, 117, 244) 100%)" // Purple
    ];

    // Maps stat titles to appropriate Ant Design icons
    const getIconForTitle = (title: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            "Attendance Rate": <CheckCircleOutlined />,
            "Leave Balance": <CalendarOutlined />,
            "Work Hours": <ClockCircleOutlined />,
            "Pending Requests": <ExclamationCircleOutlined />,
        };
        return iconMap[title] || <UserOutlined />;
    };

    // Returns additional content specific to each stat card type
    const getCardContent = (title: string) => {
        const contentMap: Record<string, React.ReactNode> = {
            "Attendance Rate": (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    +2.3% from last month
                </div>
            ),
            "Leave Balance": (
                <Space direction="vertical" size={2} style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    <div>Personal: 12</div>
                    <div>Sick: 6</div>
                </Space>
            ),
            "Work Hours": (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    This month
                </div>
            ),
            "Pending Requests": (
                <Space direction="vertical" size={2} style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    <div>1 leave</div>
                    <div>1 skill update</div>
                </Space>
            ),
        };
        return contentMap[title] || null;
    };

    return (
        <Row gutter={[16, 16]}>
            {stats.map((s, index) => {
                // Background based on theme
                const background = isDarkMode
                    ? "#2f2f2f"
                    : lightModeGradients[index % lightModeGradients.length];

                // ✅ Dynamic shadow for dark/light mode
                const shadow = isDarkMode
                    ? "0 2px 8px rgba(255, 255, 255, 0.8)"
                    : "0 2px 8px rgba(0, 0, 0, 0.10)";

                const iconElement = getIconForTitle(s.title);

                return (
                    <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        key={s.id}
                        style={{
                            marginBottom: '16px',
                            padding: '0 8px'
                        }}
                    >
                        <Card
                            bordered={false}
                            style={{
                                background,
                                borderRadius: '8px',
                                boxShadow: shadow, // ✅ applied here
                                height: '160px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                margin: 0
                            }}
                            bodyStyle={{
                                padding: '16px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            {/* Top section with statistic and icon */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flex: 1,
                                minHeight: 0
                            }}>
                                <Statistic
                                    title={
                                        <span style={{
                                            color: '#fff',
                                            opacity: 0.9,
                                            fontSize: '14px',
                                            lineHeight: '1.3'
                                        }}>
                                            {s.title}
                                        </span>
                                    }
                                    value={s.value}
                                    suffix={s.suffix && (
                                        <span style={{
                                            color: '#fff',
                                            opacity: 0.9,
                                            fontSize: '14px'
                                        }}>
                                            {s.suffix}
                                        </span>
                                    )}
                                    valueStyle={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '24px',
                                        lineHeight: '1.2'
                                    }}
                                />
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginLeft: '8px',
                                }}>
                                    {React.isValidElement(iconElement) &&
                                        React.cloneElement(iconElement as React.ReactElement, {
                                            style: {
                                                color: '#fff',
                                                fontSize: '18px'
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto', minHeight: '20px' }}>
                                {getCardContent(s.title)}
                            </div>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
};

export default MyStatsOverview;
