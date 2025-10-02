import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Divider, Tabs, Button, Card, message } from 'antd';
import styled from 'styled-components';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, UserCheck, Building, CreditCard, Shield, Copy } from 'lucide-react';
import { Employee, DetailedEmployee } from '../../../../hooks/api/useEmployees';
import { DATE_FORMATS } from '../../../../constants';
import dayjs from 'dayjs';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;
  }
  .ant-modal-close {
    color: #6c757d;
    &:hover {
      color: #495057;
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  gap: 20px;
  height: 100%;
`;

const EmployeeCard = styled(Card)`
  width: 280px;
  height: 480px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: slideInLeft 0.5s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  }
  
  .ant-card-body {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const CardHeader = styled.div`
  height: 320px;
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: white;
  overflow: hidden;
`;



const EmployeePhoto = styled.div<{ src?: string }>`
  width: 100%;
  height: 100%;
  background-color: white;
  ${props => props.src ? `
    background-image: url(${props.src});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center bottom;
  ` : `
    background-color: #2958C4;
  `}
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  margin: 0;
  animation: slideInRight 0.8s ease-out 0.2s both;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const CardContent = styled.div`
  flex: 1;
  background: white;
  padding: 12px 20px 8px 20px;
  display: flex;
  flex-direction: column;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 1px 0;
  color: #666;
  font-size: 13px;
  animation: slideInUp 0.6s ease-out 0.5s both;
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmployeeDetails = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 12px;
`;

const DetailItem = styled.div`
  color: #666;
  
  .label {
    font-weight: 700;
    color: #333;
    display: block;
  }
  
  .value {
    color: #666;
  }
`;

const TabsContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const EmployeeName = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 700;
  text-align: left;
  animation: slideInUp 0.6s ease-out 0.3s both;
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmployeeTitle = styled.p`
  margin: 0;
  color: #3498db;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  animation: slideInUp 0.6s ease-out 0.4s both;
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmployeeId = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 500;
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item {
    padding-bottom: 8px;
    margin-bottom: 8px;
    width: 33.33%;
    display: inline-block;
    vertical-align: top;
    padding-right: 16px;
    box-sizing: border-box;
  }
  
  .ant-descriptions-item-label {
    font-weight: 700;
    color: #495057;
    display: block;
    margin: 0;
    padding: 0;
    line-height: 1.2;
    font-size: 13px;
    
    &::after {
      content: '' !important;
    }
  }
  
  .ant-descriptions-item-content {
    color: #212529;
    display: block;
    word-wrap: break-word;
    margin: 0;
    padding: 0;
    line-height: 1.2;
    font-size: 14px;
    text-transform: capitalize;
    
    &:has([data-field="email"]) {
      text-transform: none;
    }
  }
  
  .ant-descriptions-item-content[data-email] {
    text-transform: none;
  }
  
  .ant-descriptions-item[data-span="3"] {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    .ant-descriptions-item {
      width: 100% !important;
    }
  }
  
  @media (max-width: 1024px) {
    .ant-descriptions-item {
      width: 50% !important;
    }
    
    .ant-descriptions-item[data-span="3"] {
      width: 100% !important;
    }
  }
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface EmployeeViewModalProps {
  employee: Employee | null;
  visible: boolean;
  onClose: () => void;
}

const EmployeeViewModal: React.FC<EmployeeViewModalProps> = ({
  employee,
  visible,
  onClose,
}) => {
  if (!employee) return null;
  
  const employeeData = employee as DetailedEmployee;

  const getStatusColor = (status: string) => {
    const statusColors = {
      active: 'green',
      on_leave: 'orange',
      inactive: 'red',
    };
    return statusColors[status as keyof typeof statusColors] || 'default';
  };

  const formatDate = (date?: string) => {
    return date ? dayjs(date).format(DATE_FORMATS.DISPLAY) : '-';
  };

  return (
    <StyledModal
      title="Employee Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>
      ]}
      width="90vw"
      style={{ maxWidth: '1200px' }}
      bodyStyle={{ maxHeight: '70vh', overflow: 'hidden' }}
      centered

    >
      <ModalContent>
        <EmployeeCard>
          <CardHeader>
            <EmployeePhoto src={employeeData.avatar_url}>
              {!employeeData.avatar_url && <User size={50} color="#999" />}
            </EmployeePhoto>
          </CardHeader>
          <CardContent>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <EmployeeName style={{ marginBottom: '0px' }}>{employeeData.name}</EmployeeName>
              <EmployeeTitle style={{ marginBottom: '4px' }}>{employeeData.position || '-'}</EmployeeTitle>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <ContactInfo style={{ justifyContent: 'flex-start', margin: '0px' }}>
                <Mail size={14} />
                <span>{employeeData.email}</span>
              </ContactInfo>
              <ContactInfo style={{ justifyContent: 'flex-start', margin: '0px' }}>
                <Phone size={14} />
                <span>{employeeData.phone || '-'}</span>
              </ContactInfo>
            </div>
          </CardContent>
          <EmployeeDetails>
            <DetailItem>
              <span className="label">Employee ID</span>
              <span className="value">{employeeData.employee_id}</span>
            </DetailItem>
            <DetailItem>
              <span className="label">Status</span>
              <Tag color={employeeData.active ? 'green' : 'red'}>
                {employeeData.active ? 'Active' : 'Inactive'}
              </Tag>
            </DetailItem>
          </EmployeeDetails>
        </EmployeeCard>
        
        <TabsContainer>
          <Tabs defaultActiveKey="1" items={[
        {
          key: '1',
          label: <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><UserCheck size={16} />Personal Information</span>,
          children: (
            <>
              <StyledDescriptions column={3} layout="vertical" size="small" colon={false}>
                <Descriptions.Item label="Full Name">{employeeData.name}</Descriptions.Item>
                <Descriptions.Item label="Employee ID">{employeeData.employee_id}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={employeeData.active ? 'green' : 'red'}>
                    {employeeData.active ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Email"><span data-email style={{ textTransform: 'none' }}>{employeeData.email}</span></Descriptions.Item>
                <Descriptions.Item label="Phone">{employeeData.phone || '-'}</Descriptions.Item>
                <Descriptions.Item label="Personal Email"><span data-email style={{ textTransform: 'none' }}>{employeeData.personal_email || '-'}</span></Descriptions.Item>
                <Descriptions.Item label="Gender">{employeeData.gender || '-'}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{formatDate(employeeData.date_of_birth)}</Descriptions.Item>
                <Descriptions.Item label="Marital Status">{employeeData.marital_status || '-'}</Descriptions.Item>
                <Descriptions.Item label="Blood Group">{employeeData.blood_group || '-'}</Descriptions.Item>
                <Descriptions.Item label="Nationality">{employeeData.nationality || '-'}</Descriptions.Item>
                <Descriptions.Item label="Religion">{employeeData.religion || '-'}</Descriptions.Item>
                <Descriptions.Item label="Address">{employeeData.address || '-'}</Descriptions.Item>
                <Descriptions.Item label="Skills Summary">{employeeData.skills_summary || '-'}</Descriptions.Item>
                <Descriptions.Item label="Certifications">{employeeData.certifications || '-'}</Descriptions.Item>
                <Descriptions.Item label="Languages Known">{employeeData.languages_known || '-'}</Descriptions.Item>
                <Descriptions.Item label="Hobbies">{employeeData.hobbies || '-'}</Descriptions.Item>
                <Descriptions.Item label="Graduation Year">{employeeData.graduation_year || '-'}</Descriptions.Item>
                <Descriptions.Item label="Team Size">{employeeData.team_size || '-'}</Descriptions.Item>
              </StyledDescriptions>
            </>
          )
        },
        {
          key: '2',
          label: <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={16} />Employment Information</span>,
          children: (
            <StyledDescriptions column={3} layout="vertical" size="small" colon={false}>
              <Descriptions.Item label="Position">{employeeData.position}</Descriptions.Item>
              <Descriptions.Item label="Department">{employeeData.department}</Descriptions.Item>
              <Descriptions.Item label="Role">{employeeData.role}</Descriptions.Item>
              <Descriptions.Item label="Manager">{employeeData.manager || 'No Manager'}</Descriptions.Item>
              <Descriptions.Item label="Employment Type">{employeeData.employment_type?.replace('_', ' ') || '-'}</Descriptions.Item>
              <Descriptions.Item label="Employment Status">{employeeData.employment_status?.replace('_', ' ') || '-'}</Descriptions.Item>
              <Descriptions.Item label="Work Location">{employeeData.work_location || '-'}</Descriptions.Item>
              <Descriptions.Item label="Work Type">{employeeData.work_type || '-'}</Descriptions.Item>
              <Descriptions.Item label="Work Schedule">{employeeData.work_schedule || '-'}</Descriptions.Item>
              <Descriptions.Item label="Hire Date">{formatDate(employeeData.hire_date)}</Descriptions.Item>
              <Descriptions.Item label="Qualification">{employeeData.qualification || '-'}</Descriptions.Item>
              <Descriptions.Item label="University">{employeeData.university || '-'}</Descriptions.Item>
              <Descriptions.Item label="Salary">{employeeData.salary ? `PKR ${employeeData.salary.toLocaleString()}` : '-'}</Descriptions.Item>
              <Descriptions.Item label="Salary in Figure">
                <span>{employeeData.salary_in_words || '-'}</span>
                {employeeData.salary_in_words && (
                  <Copy 
                    size={14} 
                    style={{ cursor: 'pointer', marginLeft: '8px', color: '#1890ff' }} 
                    onClick={() => {
                      if (employeeData.salary_in_words) {
                        navigator.clipboard.writeText(employeeData.salary_in_words);
                        message.success('Salary in Figure copied!');
                      }
                    }}
                  />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Bonus Target">{employeeData.bonus_target || '-'}</Descriptions.Item>
              <Descriptions.Item label="Stock Options">{employeeData.stock_options || '-'}</Descriptions.Item>
              <Descriptions.Item label="Last Salary Increase">{employeeData.last_salary_increase || '-'}</Descriptions.Item>
            </StyledDescriptions>
          )
        },
        {
          key: '3',
          label: <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} />Emergency Contact</span>,
          children: (
            <StyledDescriptions column={3} layout="vertical" size="small" colon={false}>
              <Descriptions.Item label="Contact Name">{employeeData.emergency_contact_name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Relationship">{employeeData.emergency_contact_relationship || '-'}</Descriptions.Item>
              <Descriptions.Item label="Phone">{employeeData.emergency_contact_phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="Work Phone">{employeeData.emergency_contact_work_phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="Home Phone">{employeeData.emergency_contact_home_phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>{employeeData.emergency_contact_address || '-'}</Descriptions.Item>
            </StyledDescriptions>
          )
        }
          ]} />
        </TabsContainer>
      </ModalContent>
    </StyledModal>
  );
};

export default EmployeeViewModal;