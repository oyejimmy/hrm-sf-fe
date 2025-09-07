import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../../store/selectors/authSelectors';
import { Spin, Alert } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const SpinnerContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const RoleBasedRedirect: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (user) {
      // Redirect based on user role
      console.log('Redirecting based on user role:', user.role);
      switch (user.role) {
        case 'admin':
        case 'hr':
          navigate('/admin/dashboard', { replace: true });
          console.log('Redirecting to admin dashboard');
          break;
        case 'team_lead':
          navigate('/team-lead/dashboard', { replace: true });
          console.log('Redirecting to team lead dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard', { replace: true });
          console.log('Redirecting to employee dashboard');
          break;
        default:
          navigate('/login', { replace: true });
          console.log('Unknown role, redirecting to login');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Container>
      <SpinnerContainer>
        {isAuthenticated ? (
          <>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Redirecting to your dashboard...</p>
          </>
        ) : (
          <Alert
            message="Authentication Required"
            description="Please log in to access your dashboard."
            type="info"
            showIcon
          />
        )}
      </SpinnerContainer>
    </Container>
  );
};

export default RoleBasedRedirect;