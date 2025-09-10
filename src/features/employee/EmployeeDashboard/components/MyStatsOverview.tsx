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
        // Blue gradient
        "linear-gradient(135deg, rgb(14, 64, 110) 0%, rgb(85, 116, 255) 100%)",
        // Green gradient
        "linear-gradient(135deg, rgb(25, 100, 26) 0%, rgb(126, 217, 87) 100%)",
        // Teal gradient
        "linear-gradient(135deg, rgb(20, 74, 70) 0%, rgb(102, 217, 255) 100%)",
        // Purple gradient
        "linear-gradient(135deg, rgb(100, 11, 75) 0%, rgb(255, 117, 244) 100%)"
    ];
    // Maps stat titles to appropriate Ant Design icons
    // Provides visual context for each statistic type
    const getIconForTitle = (title: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            // Check mark for attendance
            "Attendance Rate": <CheckCircleOutlined />,
            // Calendar for leave balance
            "Leave Balance": <CalendarOutlined />,
            // Clock for work hours
            "Work Hours": <ClockCircleOutlined />,
            // Exclamation for pending items
            "Pending Requests": <ExclamationCircleOutlined />,
        };
        // Return matching icon or default user icon if not found
        return iconMap[title] || <UserOutlined />;
    };

    //Returns additional content specific to each stat card type
    //Provides contextual information below the main statistic
    const getCardContent = (title: string) => {
        const contentMap: Record<string, React.ReactNode> = {
            "Attendance Rate": (
                // Trend information for attendance 
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    +2.3% from last month
                </div>
            ),
            "Leave Balance": (
                // Personal leave balance and  Sick leave balance
                <Space direction="vertical" size={2} style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    <div>Personal: 12</div>
                    <div>Sick: 6</div>
                </Space>
            ),
            "Work Hours": (
                // Time period context for work hours
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    This month
                </div>
            ),
            "Pending Requests": (
                // Number of pending leave requests and Number of pending skill updates 
                <Space direction="vertical" size={2} style={{ marginTop: '8px', fontSize: '12px', color: '#fff' }}>
                    <div>1 leave</div>
                    <div>1 skill update</div>
                </Space>
            ),
        };
        // Return matching content or null if not found
        return contentMap[title] || null;
    };

    return (
        // Main grid container with consistent spacing between cards
        <Row gutter={[24, 24]}>
            {stats.map((s, index) => {
                // Determine background based on theme mode
                // Use single grey color for dark mode, gradients for light mode
                const background = isDarkMode
                    // Consistent grey for dark mode
                    ? "#6E6E6E"
                    // Cycle through gradients
                    : lightModeGradients[index % lightModeGradients.length];

                // Get appropriate icon for this stat card
                const iconElement = getIconForTitle(s.title);

                return (
                    // Responsive column layout:
                    // - Full width on mobile (xs: 24)
                    // - Half width on small screens (sm: 12) - 2 cards per row
                    // - Third width on medium screens (md: 8) - 3 cards per row
                    // - Quarter width on large screens (lg: 6) - 4 cards per row
                    <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        key={s.id}
                        style={{
                            // Bottom margin for mobile spacing
                            marginBottom: '16px',
                            // Horizontal padding to prevent edge touching
                            padding: '0 8px'
                        }}
                    >
                        <Card
                            // Remove default border
                            bordered={false}
                            style={{
                                // Dynamic background based on theme
                                background,
                                // Rounded corners
                                borderRadius: '8px',
                                // Subtle shadow for depth
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                // Fixed height for consistent card sizes
                                height: '160px',
                                display: 'flex',
                                flexDirection: 'column',
                                // Space distribution
                                justifyContent: 'space-between',
                                // Ensure no margin issues
                                margin: 0
                            }}
                            bodyStyle={{
                                // Internal padding
                                padding: '16px',
                                // Full height utilization
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                // Content spacing
                                justifyContent: 'space-between'
                            }}
                        >
                            {/* Top section with statistic and icon */}
                            <div style={{
                                display: 'flex',
                                // Space between text and icon
                                justifyContent: 'space-between',
                                // Align to top
                                alignItems: 'flex-start',
                                // Take available space
                                flex: 1,
                                // Prevent overflow issues
                                minHeight: 0
                            }}>
                                {/* Main statistic display */}
                                <Statistic
                                    title={
                                        <span style={{
                                            // White text for contrast
                                            color: '#fff',
                                            // Slight transparency
                                            opacity: 0.9,
                                            // Appropriate title size
                                            fontSize: '14px',
                                            // Better text spacing
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
                                            // Match title size
                                            fontSize: '14px'
                                        }}>
                                            {s.suffix}
                                        </span>
                                    )}
                                    valueStyle={{
                                        // White text for contrast
                                        color: '#fff',
                                        // Emphasize the number
                                        fontWeight: 'bold',
                                        // Large readable number
                                        fontSize: '24px',
                                        // Proper text spacing
                                        lineHeight: '1.2'
                                    }}
                                />
                                <div style={{
                                    // Semi-transparent white
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    // Perfect circle
                                    borderRadius: '50%',
                                    // Fixed size
                                    width: '40px',
                                    // Fixed size
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // Prevent shrinking
                                    flexShrink: 0,
                                    // Space from statistic
                                    marginLeft: '8px',
                                }}>
                                    {React.isValidElement(iconElement) &&
                                        React.cloneElement(iconElement as React.ReactElement, {
                                            style: {
                                                // White icon
                                                color: '#fff',
                                                // Appropriate icon size
                                                fontSize: '18px'
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            <div style={{
                                // Push to bottom of card
                                marginTop: 'auto',     
                                // Ensure consistent space
                                minHeight: '20px'      
                            }}>
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