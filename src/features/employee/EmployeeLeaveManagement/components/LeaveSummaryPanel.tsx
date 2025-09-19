import React from 'react';
import { Progress, Typography, Row, Col } from 'antd';
import { Sun, Thermometer, Briefcase, Baby, UserX } from 'lucide-react';
import {
  BalanceCard,
  IconWrapper,
  BalanceInfo
} from './styles';
import { LeaveBalance } from '../types';

const { Text } = Typography; // Destructure Text component from Typography

// Interface for LeaveSummaryPanel component props
interface LeaveSummaryPanelProps {
  leaveBalances: LeaveBalance[]; // Array of leave balance objects
}

// LeaveSummaryPanel functional component
const LeaveSummaryPanel: React.FC<LeaveSummaryPanelProps> = ({ leaveBalances }) => {
  // Function to get the appropriate icon based on leave type
  const getLeaveIcon = (type: string) => {
    switch (type) {
      case 'Annual': return <Sun size={20} />; // Icon for Annual Leave
      case 'Sick': return <Thermometer size={20} />; // Icon for Sick Leave
      case 'Casual': return <Briefcase size={20} />; // Icon for Casual Leave
      case 'Maternity': return <Baby size={20} />; // Icon for Maternity Leave
      case 'Paternity': return <Baby size={20} />; // Icon for Paternity Leave
      default: return <UserX size={20} />; // Default icon for other leave types
    }
  };

  // Function to get the color associated with each leave type
  const getLeaveColor = (type: string) => {
    switch (type) {
      case 'Annual': return '#faad14'; // Color for Annual Leave
      case 'Sick': return '#f5222d'; // Color for Sick Leave
      case 'Casual': return '#52c41a'; // Color for Casual Leave
      case 'Maternity': return '#eb2f96'; // Color for Maternity Leave
      case 'Paternity': return '#722ed1'; // Color for Paternity Leave
      default: return '#1890ff'; // Default color
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}> {/* Row component with gutter for spacing */}
        {leaveBalances.map((balance: LeaveBalance, index: number) => {
          // Calculate percentage of leave used
          const usagePercent = (balance.taken / balance.totalAllocated) * 100;
          // Calculate percentage of leave remaining
          const remainingPercent = (balance.remaining / balance.totalAllocated) * 100;
          
          return (
            <Col xs={24} sm={12} lg={12} key={index}> {/* Column for responsive layout */}
              <BalanceCard> {/* Styled card for leave balance */}
                <IconWrapper $color={getLeaveColor(balance.type)}> {/* Wrapper for icon with dynamic color */}
                  {getLeaveIcon(balance.type)} {/* Display leave type icon */}
                </IconWrapper>
                <BalanceInfo> {/* Container for balance information */}
                  <Text strong style={{ display: 'block', marginBottom: 4 }}> {/* Display leave type name */}
                    {balance.type} Leave
                  </Text>
                  <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}> {/* Display remaining and total leave */}
                    {balance.remaining} of {balance.totalAllocated} remaining
                  </Text>
                  <Progress
                    percent={usagePercent} // Percentage of leave used
                    success={{ percent: remainingPercent }} // Percentage of leave remaining for success status
                    strokeColor={getLeaveColor(balance.type)} // Progress bar color based on leave type
                    size="small" // Small size for progress bar
                    style={{ marginTop: 8 }} // Top margin for progress bar
                    format={() => `${balance.taken}/${balance.totalAllocated}`} // Custom format for progress text
                  />
                </BalanceInfo>
              </BalanceCard>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default LeaveSummaryPanel; 