import React, { useState } from 'react';
import { Layout, Row, Col, Card, Input, Button, Table, Tag, Space, Flex, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined, SmileOutlined, ExportOutlined } from '@ant-design/icons';
import HeaderComponent from '../../../components/PageHeader';
import EmployeeModal from './components/EmployeeModal';
import styled from 'styled-components';

const { Content } = Layout;

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background-color: #ffffff;
`;

const DashboardContent = styled(Content)`
  padding: 24px;
  background-color: #ffffff;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const StatCard = styled(Card)`
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  height: 100%;
  
  .ant-card-body {
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px;
    }
  }
`;

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  color: #8c8c8c;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StatValue = styled.h3`
  margin: 8px 0 0 0;
  color: #262626;
  font-size: 24px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin: 4px 0 0 0;
  }
`;

const StatIcon = styled.div`
  font-size: 24px;
  color: #1890ff;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const GreenStatIcon = styled(StatIcon)`
  color: #52c41a;
`;

const OrangeStatIcon = styled(StatIcon)`
  color: #fa8c16;
`;

const AddEmployeeButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DirectoryCard = styled(Card)`
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-top: 24px;
  
  .ant-card-body {
    padding: 0;
  }
`;

const DirectoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }
`;

const SearchInput = styled(Input)`
  border-radius: 6px;
  width: 250px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledTable = styled(Table)`
  border-radius: 8px;
  
  .ant-table-thead > tr > th {
    background-color: #fafafa;
    color: #262626;
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
`;

// Types
export interface Employee {
    key: string;
    employee: {
        name: string;
        id: string;
    };
    email: string;
    position: string;
    department: string;
    status: string;
    joinDate: string;
    dateOfLeave?: string;
}

const initialData: Employee[] = [
    {
        key: '1',
        employee: { name: 'John Doe', id: 'EMP001' },
        email: 'john.doe@company.com',
        position: 'Frontend Developer',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2023-01-15',
    },
    {
        key: '2',
        employee: { name: 'Jane Doe', id: 'EMP002' },
        email: 'jane.doe@company.com',
        position: 'HR Manager',
        department: 'Human Resources',
        status: 'On Leave',
        joinDate: '2023-01-15',
        dateOfLeave: '2023-01-15',
    },
    {
        key: '3',
        employee: { name: 'Peter Jones', id: 'EMP003' },
        email: 'peter.jones@company.com',
        position: 'Backend Developer',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2023-01-15',
    },
    {
        key: '4',
        employee: { name: 'Sarah Miller', id: 'EMP004' },
        email: 'sarah.miller@company.com',
        position: 'HR Manager',
        department: 'Marketing',
        status: 'On Leave',
        joinDate: '2023-01-15',
        dateOfLeave: '2023-01-15',
    },
    {
        key: '5',
        employee: { name: 'David Wilson', id: 'EMP005' },
        email: 'david.wilson@company.com',
        position: 'Project Manager',
        department: 'Operations',
        status: 'Active',
        joinDate: '2023-01-15',
    },
    {
        key: '6',
        employee: { name: 'Emily White', id: 'EMP006' },
        email: 'emily.white@company.com',
        position: 'Project Manager',
        department: 'Operations',
        status: 'Active',
        joinDate: '2023-01-15',
    },
    {
        key: '7',
        employee: { name: 'Michael Brown', id: 'EMP007' },
        email: 'michael.brown@company.com',
        position: 'Project Manager',
        department: 'Operations',
        status: 'On Leave',
        joinDate: '2023-01-15',
        dateOfLeave: '2023-01-15',
    },
    {
        key: '8',
        employee: { name: 'Laura Davis', id: 'EMP008' },
        email: 'laura.davis@company.com',
        position: 'Project Manager',
        department: 'Operations',
        status: 'Active',
        joinDate: '2023-01-15',
    },
];

const EmployeeManagement: React.FC = () => {
    const [data, setData] = useState<Employee[]>(initialData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const showAddModal = () => {
        setIsEditing(false);
        setEditingEmployee(null);
        setIsModalVisible(true);
    };

    const showEditModal = (employee: Employee) => {
        setIsEditing(true);
        setEditingEmployee(employee);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingEmployee(null);
    };

    const handleSave = (employeeData: any) => {
        if (isEditing && editingEmployee) {
            // Update existing employee
            const updatedData = data.map(item =>
                item.key === editingEmployee.key
                    ? { ...item, ...employeeData, employee: { ...item.employee, name: employeeData.employee.name } }
                    : item
            );
            setData(updatedData);
            message.success('Employee updated successfully');
        } else {
            // Add new employee
            const newEmployee: Employee = {
                key: `EMP${String(data.length + 1).padStart(3, '0')}`,
                employee: {
                    name: employeeData.employee.name,
                    id: `EMP${String(data.length + 1).padStart(3, '0')}`
                },
                email: employeeData.email,
                position: employeeData.position,
                department: employeeData.department,
                status: employeeData.status,
                joinDate: employeeData.joinDate,
                dateOfLeave: employeeData.dateOfLeave
            };
            setData([...data, newEmployee]);
            message.success('Employee added successfully');
        }
        setIsModalVisible(false);
        setEditingEmployee(null);
    };

    const handleDelete = (key: string) => {
        setData(data.filter(item => item.key !== key));
        message.success('Employee deleted successfully');
    };

    const columns: any = [
        {
            title: 'Employee',
            dataIndex: 'employee',
            key: 'employee',
            render: (employee: Employee['employee']) => (
                <>
                    <div style={{ display: 'block' }}>{employee.name}</div>
                    <div style={{ color: '#8c8c8c' }}>{employee.id}</div>
                </>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color;
                switch (status) {
                    case 'Active':
                        color = '#e6f7ff';
                        break;
                    case 'On Leave':
                        color = '#fffbe6';
                        break;
                    default:
                        color = 'gray';
                }
                return <Tag color={color} style={{ borderRadius: '16px', fontWeight: 'bold', color: status === 'Active' ? '#1890ff' : '#faad14' }}>{status}</Tag>;
            },
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
        },
        {
            title: 'Date of leave',
            dataIndex: 'dateOfLeave',
            key: 'dateOfLeave',
            render: (dateOfLeave: string) => dateOfLeave || '----',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Employee) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                    <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)} />
                </Space>
            ),
        },
    ];

    const breadcrumbItems = [
        { title: 'Dashboard', href: '/' },
    ];

    return (
        <StyledLayout>
            <HeaderComponent
                title="Employee Management"
                subtitle="Manage employee profiles, departments, and information"
                breadcrumbItems={breadcrumbItems}
                extraButtons={[
                    <AddEmployeeButton
                        key="add-employee"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}
                    >
                        Add Employee
                    </AddEmployeeButton>
                ]}
            />

            <DashboardContent>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <StatCard>
                            <StatContent>
                                <StatInfo>
                                    <StatLabel>Total Employees</StatLabel>
                                    <StatValue>{data.length}</StatValue>
                                </StatInfo>
                                <StatIcon>
                                    <UserOutlined />
                                </StatIcon>
                            </StatContent>
                        </StatCard>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <StatCard>
                            <StatContent>
                                <StatInfo>
                                    <StatLabel>Active Today</StatLabel>
                                    <StatValue>{data.filter(emp => emp.status === 'Active').length}</StatValue>
                                </StatInfo>
                                <GreenStatIcon>
                                    <SmileOutlined />
                                </GreenStatIcon>
                            </StatContent>
                        </StatCard>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <StatCard>
                            <StatContent>
                                <StatInfo>
                                    <StatLabel>On Leave</StatLabel>
                                    <StatValue>{data.filter(emp => emp.status === 'On Leave').length}</StatValue>
                                </StatInfo>
                                <OrangeStatIcon>
                                    <ExportOutlined />
                                </OrangeStatIcon>
                            </StatContent>
                        </StatCard>
                    </Col>
                </Row>

                <DirectoryCard>
                    <DirectoryHeader>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Employee Directory</h4>
                        <SearchInput
                            placeholder="Search employees"
                            prefix={<SearchOutlined />}
                        />
                    </DirectoryHeader>
                    <StyledTable
                        columns={columns}
                        dataSource={data}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: '100%' }}
                    />
                </DirectoryCard>

                <EmployeeModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    employee={editingEmployee}
                    isEditing={isEditing}
                />
            </DashboardContent>
        </StyledLayout>
    );
};

export default EmployeeManagement;