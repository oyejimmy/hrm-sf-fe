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
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;
  
  @media (max-width: 768px) {
    padding: 1px 6px;
    font-size: 11px;
  }
`;

export const UserRoleTag: React.FC<UserRoleTagProps> = ({ role, className }) => {
  // Define tag properties based on role
  const getRoleTagProps = () => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          color: 'red',
          icon: <CrownOutlined />,
          text: 'Admin'
        };
      case 'hr':
        return {
          color: 'volcano',
          icon: <CrownOutlined />,
          text: 'HR'
        };
      case 'team_lead':
        return {
          color: 'geekblue',
          icon: <TeamOutlined />,
          text: 'Team Lead'
        };
      case 'employee':
        return {
          color: 'green',
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