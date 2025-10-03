import styled from 'styled-components';
import { Card, Button, Steps, DatePicker, Typography } from 'antd';

export const Container = styled.div`
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`;

export const HeaderCard = styled(Card)`
  text-align: center;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  
  @media (min-width: 768px) {
    margin-bottom: 24px;
    padding: 20px;
  }
`;

export const HeaderIcon = styled.div`
  font-size: 24px;
  color: #1890ff;
  margin-bottom: 8px;
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  color: #262626;
  font-size: 18px;
  font-weight: 600;
`;

export const HeaderText = styled.p`
  margin: 8px 0 0 0;
  color: #595959;
  font-size: 14px;
`;

export const StyledSteps = styled(Steps)`
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    margin-bottom: 32px;
  }
  
  .ant-steps-item-title {
    font-size: 12px;
    
    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

export const StepContent = styled.div`
  min-height: 300px;
  
  @media (min-width: 768px) {
    min-height: 400px;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (min-width: 768px) {
    margin-top: 24px;
    text-align: right;
    flex-direction: row;
    justify-content: flex-end;
    gap: 0;
  }
`;

export const PrevButton = styled(Button)`
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
    margin: 0 8px;
  }
`;

export const NextButton = styled(Button)`
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
  }
`;

export const CompleteButton = styled(Button)`
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
  }
`;

export const UserFormContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

export const UserFormCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin: 0 auto;
`;

export const UserFormTitle = styled(Typography.Title)`
  && {
    color: #2958C4;
    margin-bottom: 8px;
  }
`;

export const UserFormButton = styled(Button)`
  && {
    height: 48px;
    background: #2958C4;
    border-color: #2958C4;
  }
`;

export const AvatarUploader = styled.div`
  text-align: center;
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const AvatarContainer = styled.div<{ hasImage?: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #d9d9d9;
  background: ${props => props.hasImage ? 'none' : '#fafafa'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const AvatarImage = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  text-align: center;
  color: #999;
  
  .anticon {
    font-size: 20px;
  }
  
  div {
    font-size: 12px;
  }
`;

export const JobInfoTitle = styled.h3`
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  
  @media (min-width: 768px) {
    margin-bottom: 24px;
    font-size: 18px;
  }
`;

export const InfoItem = styled.div`
  margin-bottom: 12px;
  
  @media (min-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const InfoLabel = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  color: #262626;
`;

export const InfoValue = styled.div`
  color: #595959;
`;

export const InfoValueWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #595959;
`;

export const CopyIcon = styled.span`
  cursor: pointer;
  color: #1890ff;
`;

export const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`;

export const MinimalContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  padding: 16px;
`;

export const MinimalCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const MinimalHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
    margin-bottom: 32px;
  }
`;