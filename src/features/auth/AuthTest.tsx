import React from 'react';
import { Card, Button, Typography, Space, Tag } from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import { tokenStorage } from '../../utils/security';

const { Title, Text } = Typography;

export const AuthTest: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const token = tokenStorage.getToken('access_token');

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated || !user) {
    return (
      <Card title="Authentication Status">
        <Text type="danger">Not authenticated</Text>
      </Card>
    );
  }

  return (
    <Card title="Authentication Status" style={{ maxWidth: 600, margin: '20px auto' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={4}>User Information</Title>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <Tag color="blue">{user.role}</Tag></p>
          <p><strong>Status:</strong> <Tag color="green">{user.status}</Tag></p>
        </div>
        
        <div>
          <Title level={4}>Authentication Details</Title>
          <p><strong>Authenticated:</strong> <Tag color="green">Yes</Tag></p>
          <p><strong>Token Present:</strong> <Tag color={token ? 'green' : 'red'}>{token ? 'Yes' : 'No'}</Tag></p>
        </div>

        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Card>
  );
};