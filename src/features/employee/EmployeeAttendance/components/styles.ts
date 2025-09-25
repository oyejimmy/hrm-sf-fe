// styles.ts
import { Button, Card, Col, Row, Typography } from "antd";
import styled, { keyframes } from "styled-components";

const {Text} = Typography;

// Animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// Common Components
export const CommonCard = styled(Card) <{ isDarkMode?: boolean }>`
  background: ${(props: any) => props.isDarkMode ? '#1f1f1f' : 'white'};
  border: none;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  overflow: hidden;
  
  .ant-card-head {
    border-bottom: 1px solid ${(props: any) => props.isDarkMode ? '#2a2a2a' : '#f0f0f0'};
    background: ${(props: any) => props.isDarkMode ? '#1a1a1a' : '#fafafa'};
  }
  
  .ant-card-head-title {
    color: var(--text-color);
    font-weight: 600;
    font-size: 18px;
  }
  
  .ant-card-body {
    padding: 0;
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
    margin-bottom: 16px;
  }
`;

export const ResponsiveRow = styled(Row)`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const ResponsiveCol = styled(Col)`
  display: flex;
  
  @media (max-width: 992px) {
    margin-bottom: 16px;
  }
  
  .ant-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .ant-card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
`;

// AttendanceClockPanel Styles
export const ClockPanelCard = styled(Card)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
`;

export const ClockContainer = styled.div<{ isDarkMode: boolean; }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.6s ease-out;
  flex: 1;
  justify-content: center;
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const DigitalClock = styled.div<{ isDarkMode: boolean; }>`
  font-size: 42px;
  font-weight: 700;
  color: ${props => props.isDarkMode ? '#ffffff' : '#1a237e'};
  font-family: 'Inter', sans-serif;
  margin: 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 32px;
    margin: 16px 0;
  }
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const AnalogClock = styled.div<{ isDarkMode: boolean; }>`
  width: 180px;
  height: 180px;
  border: 4px solid ${props => props.isDarkMode ? '#ffffff' : '#455a64'};
  border-radius: 50%;
  position: relative;
  margin: 20px 0;
  background: ${props => props.isDarkMode ? '#1a237e' : 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

export const ClockHand = styled.div<{ $rotation: number; $length: number; $width: number; $color?: string; isDarkMode?: boolean; }>`
  position: absolute;
  background: ${props => props.$color || (props.isDarkMode ? '#ffffff' : '#455a64')};
  transform-origin: bottom center;
  left: 50%;
  bottom: 50%;
  width: ${props => props.$width}px;
  height: ${props => props.$length}px;
  transform: translateX(-50%) rotate(${props => props.$rotation}deg);
  border-radius: ${props => props.$width / 2}px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const ClockCenter = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background: #1a237e;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 10;
  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

export const ClockNumber = styled.div<{ $position: number; }>`
  position: absolute;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #1a237e;
  transform: ${props => {
    const angle = (props.$position - 3) * 30;
    const radius = 90;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    return `translate(${x}px, ${y}px)`;
  }};
  left: 50%;
  top: 50%;
  margin-left: -12px;
  margin-top: -12px;
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 12px;
    margin-left: -10px;
    margin-top: -10px;
  }
`;

export const ActionButton = styled(Button) <{ $variant: string; }>`
  min-width: 120px;
  height: 44px;
  border-radius: 22px;
  font-weight: 600;
  font-size: 14px;
  margin: 0 4px 12px 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  ${props => {
    switch (props.$variant) {
      case 'check-in':
        return `
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(76,175,80,0.4);
            background: linear-gradient(135deg, #388E3C 0%, #2E7D32 100%);
          }
        `;
      case 'check-out':
        return `
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(244,67,54,0.4);
            background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
          }
        `;
      case 'break':
        return `
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(255,152,0,0.4);
            background: linear-gradient(135deg, #f57c00 0%, #ef6c00 100%);
          }
        `;
      default:
        return '';
    }
  }}
  @media (max-width: 768px) {
    min-width: 120px;
    height: 48px;
    margin: 4px 4px 12px 4px;
    font-size: 14px;
  }
  @media (max-width: 480px) {
    min-width: 100px;
    height: 44px;
    font-size: 12px;
    margin: 2px 2px 8px 2px;
  }
`;

export const StatusCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
  margin-top: 20px;
  width: 100%;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

// AttendanceHistoryTable Styles
export const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px;
  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TimeCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TimeText = styled.span<{ $type: 'primary' | 'secondary' }>`
  font-size: ${props => props.$type === 'primary' ? '14px' : '12px'};
  color: ${props => props.$type === 'primary' ? 'var(--text-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.$type === 'primary' ? '500' : '400'};
`;

// AttendanceNotificationPanel Styles
export const NotificationPanelCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const NotificationCard = styled.div<{ $read: boolean; $priority: string }>`
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid ${props => 
    props.$priority === 'high' ? '#ff4d4f' :
    props.$priority === 'medium' ? '#faad14' : '#52c41a'
  };
  background: ${props => props.$read ? 'var(--surface)' : 'var(--surface-secondary)'};
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: var(--surface-secondary);
    transform: translateY(-1px);
  }
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const NotificationContent = styled.div`
  margin-left: 32px;
  @media (max-width: 480px) {
    margin-left: 0;
    margin-top: 8px;
  }
`;

export const NotificationScrollContainer = styled.div`
  flex: 1;
  max-height: 350px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 280px;
  }
`;

export const TimeStamp = styled(Text)`
  font-size: 11px;
  color: var(--text-secondary);
`;

// AttendanceOverviewPanel Styles
export const OverviewCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const StatsCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .ant-card-body {
    padding: 12px;
    flex: 1;
  }
`;

export const OverviewTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 24px;
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

export const OverviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

// AttendanceCalendar Styles
export const MonthYearSelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  background: transparent;
  @media (max-width: 576px) {
    gap: 6px;
  }
`;

export const DetailCard = styled(Card)`
  .ant-card-head {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    padding: 12px;
  }
  .ant-card-body {
    padding: 12px;
  }
  @media (max-width: 768px) {
    .ant-card-head {
      padding: 8px;
    }
    .ant-card-body {
      padding: 8px;
    }
  }
`;

export const StatusLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
  justify-content: center;
  @media (max-width: 576px) {
    gap: 4px;
    .ant-tag {
      font-size: 11px;
      padding: 2px 6px;
      margin: 2px;
    }
  }
`;

export const StatusDot = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ status }) => {
    const statusConfig: Record<string, string> = {
      Present: '#52c41a',
      Absent: '#f5222d',
      Late: '#faad14',
      'On Leave': '#1890ff',
      'Half Day': '#722ed1',
      Weekend: '#8c8c8c',
      Holiday: '#eb2f96'
    };
    return statusConfig[status] || '#d9d9d9';
  }};
`;

export const DescriptionPanel = styled.div`
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const CalendarContainer = styled.div`
  .ant-picker-calendar {
    .ant-picker-panel {
      padding: 8px;
      .ant-picker-cell {
        padding: 2px;
        .ant-picker-cell-inner {
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  @media (max-width: 768px) {
    .ant-picker-calendar {
      .ant-picker-panel {
        padding: 4px;
      }
    }
  }
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 6px;
  background-color: #f9f9f9;
  .detail-label {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 12px;
    color: #666;
  }
  .detail-value {
    font-size: 14px;
  }
  @media (max-width: 768px) {
    padding: 6px;
    .detail-label {
      font-size: 11px;
    }
    .detail-value {
      font-size: 12px;
    }
  }
`;

// AttendanceStatsPanel Styles
export const StatCard = styled(Card)`
  .ant-card-body {
    padding: 20px;
  }
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px;
    }
  }
`;

export const IconWrapper = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.$color}15`};
  color: ${props => props.$color};
  margin-bottom: 12px;
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const StatisticWrapper = styled.div`
  text-align: center;
`;

// Equal height container for main panels
export const EqualHeightContainer = styled.div`
  height: 480px;
  width: 100%;
  
  .ant-card {
    height: 100%;
    width: 100%;
    
    .ant-card-body {
      padding: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 400px;
  }
  
  @media (max-width: 480px) {
    min-height: 350px;
  }
`;