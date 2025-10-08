import React from 'react';
import { Badge, Tooltip } from 'antd';
import { StatusIndicatorProps } from '../../types';
import { StatusContainer, StatusText } from '../styles';

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  isOnline, 
  lastUpdate, 
  isLoading = false 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <StatusContainer>
      <Tooltip title={isOnline ? 'Real-time updates active' : 'Connection lost'}>
        <Badge 
          status={isLoading ? 'processing' : isOnline ? 'success' : 'error'} 
          text={
            <StatusText>
              {isLoading ? 'Updating...' : `Last updated: ${formatTime(lastUpdate)}`}
            </StatusText>
          }
        />
      </Tooltip>
    </StatusContainer>
  );
};

export default StatusIndicator;