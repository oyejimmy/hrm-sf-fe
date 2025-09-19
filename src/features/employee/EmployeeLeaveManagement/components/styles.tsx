import styled from 'styled-components';
import { Card, Modal, Table } from 'antd';

// Styled Card component with dark mode support
export const StyledCard = styled(Card) <{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#1f1f1f' : '#fff'}; // Background color based on dark mode
  border: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'}; // Border color based on dark mode
  border-radius: 12px; // Rounded corners
  box-shadow: ${props => props.isDarkMode
    ? '0 4px 16px rgba(0,0,0,0.24)'
    : '0 4px 12px rgba(0,0,0,0.08)'}; // Box shadow based on dark mode
  transition: all 0.3s ease; // Smooth transition for all properties

  &:hover {
    box-shadow: ${props => props.isDarkMode
    ? '0 6px 20px rgba(0,0,0,0.32)'
    : '0 6px 16px rgba(0,0,0,0.12)'}; // Enhanced box shadow on hover
  }

  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'}; // Bottom border for card header
  }

  .ant-card-head-title {
    font-weight: 600; // Bold font weight for card title
    font-size: 16px; // Font size for card title
    color: ${props => props.isDarkMode ? '#e6e6e6' : 'var(--text-color)'}; // Text color based on dark mode
  }
`;

// Styled component for card title layout
export const CardTitle = styled.div`
  display: flex; // Use flexbox for layout
  align-items: center; // Center items vertically
  gap: 8px; // Gap between items
`;

// Styled component for action bar layout
export const ActionBar = styled.div`
  display: flex; // Use flexbox for layout
  gap: 12px; // Gap between items
  margin-bottom: 24px; // Bottom margin
  flex-wrap: wrap; // Allow items to wrap to the next line
`;

// Styled component for leave balance card
export const BalanceCard = styled.div`
  display: flex; // Use flexbox for layout
  align-items: center; // Center items vertically
  padding: 16px; // Padding around content
  border-radius: 8px; // Rounded corners
  background: var(--surface); // Background color from CSS variable
  border: 1px solid var(--border-color); // Border color from CSS variable
  margin-bottom: 12px; // Bottom margin
`;

// Styled component for icon wrapper with dynamic color
export const IconWrapper = styled.div<{ $color: string }>`
  display: inline-flex; // Use inline flexbox for layout
  align-items: center; // Center items vertically
  justify-content: center; // Center items horizontally
  width: 40px; // Fixed width
  height: 40px; // Fixed height
  border-radius: 8px; // Rounded corners
  background: ${props => `${props.$color}15`}; // Background color with transparency
  color: ${props => props.$color}; // Icon color
  margin-right: 16px; // Right margin
`;

// Styled component for balance information layout
export const BalanceInfo = styled.div`
  flex: 1; // Allow component to grow and shrink
`;

// Styled component for notification card with read status and priority
export const NotificationCard = styled.div<{ $read: boolean; $priority: string }>`
  padding: 12px; // Padding around content
  border-radius: 6px; // Rounded corners
  border-left: 4px solid ${props =>
    props.$priority === 'high' ? '#ff4d4f' : // Red for high priority
      props.$priority === 'medium' ? '#faad14' : '#52c41a' // Orange for medium, Green for low
  }; // Left border color based on priority
  background: ${props => props.$read ? 'var(--surface)' : 'var(--surface-secondary)'}; // Background based on read status
  margin-bottom: 8px; // Bottom margin
  cursor: pointer; // Pointer cursor on hover
  transition: all 0.2s; // Smooth transition for all properties

  &:hover {
    background: var(--surface-secondary); // Background change on hover
    transform: translateY(-1px); // Slight upward movement on hover
  }
`;

// Styled component for notification header layout
export const NotificationHeader = styled.div`
  display: flex; // Use flexbox for layout
  justify-content: space-between; // Space items evenly
  align-items: flex-start; // Align items to the start vertically
  margin-bottom: 8px; // Bottom margin
`;

// Styled component for notification content indentation
export const NotificationContent = styled.div`
  margin-left: 32px; // Left margin for indentation
`;

// Styled component for timestamp text
export const TimeStamp = styled.span`
  font-size: 11px; // Smaller font size
  color: var(--text-secondary); // Secondary text color
`;

// Styled component for recipient card layout
export const RecipientCard = styled.div`
  display: flex; // Use flexbox for layout
  align-items: center; // Center items vertically
  padding: 8px 12px; // Padding around content
  border: 1px solid var(--border-color); // Border color from CSS variable
  border-radius: 6px; // Rounded corners
  margin: 4px 0; // Vertical margin
  background: var(--surface); // Background color from CSS variable
`;

// Styled component for recipient information layout
export const RecipientInfo = styled.div`
  margin-left: 8px; // Left margin
  flex: 1; // Allow component to grow and shrink
`;

// Styled Modal component with custom styles
export const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px; // Padding for modal body
  }
  
  @media (max-width: 576px) {
    .ant-modal-body {
      padding: 16px; // Reduced padding for smaller screens
    }
  }
`;

// Styled Card component for statistics
export const StatCard = styled(Card)`
  .ant-card-body {
    padding: 20px; // Padding for card body
  }
`;

// Styled component for statistic wrapper
export const StatisticWrapper = styled.div`
  text-align: center; // Center align text
`;

// Styled Table component with custom styles
export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: var(--surface-secondary); // Background color for table header
    font-weight: 600; // Bold font weight for table header
  }
  
  .ant-table-tbody > tr:hover > td {
    background: var(--surface-hover) !important; // Background color on row hover
  }
`;