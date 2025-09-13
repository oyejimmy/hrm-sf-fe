import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader2 } from 'lucide-react';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const LoaderIcon = styled(Loader2)`
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 1s linear infinite;
`;

export const PageLoader: React.FC = () => {
  return (
    <LoaderContainer>
      <LoaderIcon />
    </LoaderContainer>
  );
};