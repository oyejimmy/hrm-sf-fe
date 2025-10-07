import React from 'react';
import { Image } from 'antd';
import styled from 'styled-components';

const LogoFallback = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  background: ${props => props.theme?.colors?.primary || '#2958C4'};
  color: white;
  width: ${props => {
    switch (props.size) {
      case 'small': return '24px';
      case 'large': return '48px';
      default: return '36px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '24px';
      case 'large': return '48px';
      default: return '36px';
    }
  }};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '10px';
      case 'large': return '18px';
      default: return '16px';
    }
  }};
  font-weight: bold;
`;

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <>
        <LogoFallback size={size}>
          HRM
        </LogoFallback>
        {showText && <span>HRM System</span>}
      </>
    );
  }

  return (
    <>
      <Image
        src="/logo.png"
        alt="HRM Logo"
        preview={false}
        width={size === 'small' ? 24 : size === 'large' ? 48 : 36}
        height={size === 'small' ? 24 : size === 'large' ? 48 : 36}
        style={{
          objectFit: 'contain',
        }}
        onError={handleImageError}
        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzI5NThDNCIvPgo8dGV4dCB4PSIzMiIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5IUk08L3RleHQ+Cjwvc3ZnPgo="
      />
      {showText && <span>HRM System</span>}
    </>
  );
};