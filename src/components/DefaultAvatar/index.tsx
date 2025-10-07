import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface DefaultAvatarProps {
  src?: string;
  size?: number | 'small' | 'default' | 'large';
  name?: string;
  style?: React.CSSProperties;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ 
  src, 
  size = 'default', 
  name, 
  style 
}) => {
  const getInitials = (fullName?: string) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  if (src) {
    return (
      <Avatar 
        src={src} 
        size={size} 
        style={style}
        onError={() => false}
      >
        {initials || <UserOutlined />}
      </Avatar>
    );
  }

  return (
    <Avatar 
      size={size} 
      style={{ 
        backgroundColor: '#2958C4',
        ...style 
      }}
    >
      {initials || <UserOutlined />}
    </Avatar>
  );
};