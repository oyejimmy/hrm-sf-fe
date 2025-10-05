import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';

const CroppedAvatarContainer = styled.div<{ 
  size: number; 
  src: string; 
  crop?: string;
}>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  background-image: url(${props => props.src});
  background-size: ${props => {
    if (!props.crop) return 'cover';
    try {
      const cropData = typeof props.crop === 'string' ? JSON.parse(props.crop) : props.crop;
      if (cropData && cropData.scale) {
        return `${props.size * cropData.scale}px ${props.size * cropData.scale}px`;
      }
      return 'cover';
    } catch {
      return 'cover';
    }
  }};
  background-position: ${props => {
    if (!props.crop) return 'center';
    try {
      const cropData = typeof props.crop === 'string' ? JSON.parse(props.crop) : props.crop;
      if (cropData && typeof cropData.offsetX === 'number' && typeof cropData.offsetY === 'number') {
        const scaleRatio = props.size / 200;
        return `${-cropData.offsetX * scaleRatio}px ${-cropData.offsetY * scaleRatio}px`;
      }
      return 'center';
    } catch {
      return 'center';
    }
  }};
  background-repeat: no-repeat;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
`;

interface CroppedAvatarProps {
  src?: string;
  crop?: string;
  size?: number;
  onClick?: () => void;
  fallback?: string;
}

const CroppedAvatar: React.FC<CroppedAvatarProps> = ({
  src,
  crop,
  size = 40,
  onClick,
  fallback = "https://images.unsplash.com/photo-1580489944761-15a19d65463f?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}) => {
  const imageSrc = src || fallback;

  // Check if we have valid crop data
  const hasCropData = crop && crop !== 'null' && crop !== 'undefined';
  
  if (hasCropData && src) {
    return (
      <CroppedAvatarContainer
        size={size}
        src={imageSrc}
        crop={crop}
        onClick={onClick}
      />
    );
  }

  return (
    <Avatar
      size={size}
      src={imageSrc}
      onClick={onClick}
    />
  );
};

export default CroppedAvatar;