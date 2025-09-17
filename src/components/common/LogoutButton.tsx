import React from 'react';
import { Button } from 'antd';
import { LogOut } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LogoutButtonProps {
  type?: 'primary' | 'default' | 'text';
  size?: 'small' | 'middle' | 'large';
  icon?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  type = 'text', 
  size = 'middle',
  icon = true 
}) => {
  const { logout, isLogoutLoading } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Button
      type={type}
      size={size}
      icon={icon ? <LogOut size={16} /> : undefined}
      loading={isLogoutLoading}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};