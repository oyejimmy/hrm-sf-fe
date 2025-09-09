import React from 'react';
import { Tag } from 'antd';
import { UserOutlined, TeamOutlined, CrownOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface UserRoleTagProps {
  role: string;
  className?: string;
}

const StyledTag = styled(Tag)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme?.spacing?.xs || '4px'};
  padding: 2px ${props => props.theme?.spacing?.sm || '8px'};
  border-radius: ${props => props.theme?.borderRadius?.sm || '4px'};
  font-size: ${props => props.theme?.typography?.fontSize?.xs || '12px'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || 500};
  margin-right: ${props => props.theme?.spacing?.sm || '8px'};
  
  @media (max-width: ${props => props.theme?.breakpoints?.md || '768px'}) {
    padding: 1px 6px;
    font-size: 11px;
  }
`;

export const UserRoleTag: React.FC<UserRoleTagProps> = ({ role, className }) => {
  // Define tag properties based on role using theme colors
  const getRoleTagProps = () => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          color: 'error',
          icon: <CrownOutlined />,
          text: 'Admin'
        };
      case 'hr':
        return {
          color: 'warning',
          icon: <CrownOutlined />,
          text: 'HR'
        };
      case 'team_lead':
        return {
          color: 'processing',
          icon: <TeamOutlined />,
          text: 'Team Lead'
        };
      case 'employee':
        return {
          color: 'success',
          icon: <UserOutlined />,
          text: 'Employee'
        };
      default:
        return {
          color: 'default',
          icon: <UserOutlined />,
          text: role
        };
    }
  };

  const { color, icon, text } = getRoleTagProps();

  return (
    <StyledTag color={color} className={className} aria-label={`User role: ${text}`}>
      {icon} {text}
    </StyledTag>
  );
};