import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
    Button,
    Tag,
    Row,
    Col,
    Statistic,
    Input,
    Space,
    message,
    Typography,
    Flex
} from 'antd';
import {
    Plus,
    Search,
    Users,
    UserCheck,
    UserX,
    Edit,
    Trash2,
    Upload
} from 'lucide-react';
import { Employee, EmployeeFormData } from './types/types';
import EmployeeModal from './components/EmployeeModal';
import { ImportCSVModal } from './components/ImportCSVModal';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';
import { Container, StatCard, DirectoryHeader } from './styles';

const { Title } = Typography;
const { Search: SearchInput } = Input;

// Mock data

const initialData: Employee[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        position: 'Software Engineer',
        department: 'Engineering',
        status: 'active',
        joinDate: '2022-01-15'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        position: 'Product Manager',
        department: 'Product',
        status: 'active',
        joinDate: '2021-08-23'
    },
    {
        id: '3',
        name: 'Robert Johnson',
        email: 'robert.j@company.com',
        position: 'UX Designer',
        department: 'Design',
        status: 'on_leave',
        joinDate: '2020-05-10',
        leaveDate: '2023-10-15'
    }
];

const EmployeeManagement = () => {
    const { isDarkMode } = useTheme();
    const [data, setData] = useState<Employee[]>(initialData);
    const [isModalVisible, setIsModalVisible] = useState<any>(false);
    const [isImportModalVisible, setIsImportModalVisible] = useState<any>(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
    const [isEditing, setIsEditing] = useState<any>(false);
    const [searchText, setSearchText] = useState<any>('');

    const filteredData = useMemo(() => {
        if (!searchText) return data;

        return data.filter((item: any) =>
            Object.values(item).some(value =>
                value?.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [data, searchText]);

    const stats = useMemo(() => {
        const totalEmployees = data.length;
        const activeEmployees = data.filter(emp => emp.status === 'active').length;
        const onLeaveEmployees = data.filter(emp => emp.status === 'on_leave').length;

        return { totalEmployees, activeEmployees, onLeaveEmployees };
    }, [data]);

    const handleSave = (values: EmployeeFormData) => {
        if (isEditing && editingEmployee) {
            // Update existing employee
            setData(prev => prev.map(item =>
                item.id === editingEmployee.id
                    ? { ...values, id: editingEmployee.id }
                    : item
            ));
            message.success('Employee updated successfully');
        } else {
            // Add new employee
            const newEmployee: Employee = {
                ...values,
                id: Date.now().toString()
            };
            setData(prev => [...prev, newEmployee]);
            message.success('Employee added successfully');
        }

        setIsModalVisible(false);
        setEditingEmployee(undefined);
        setIsEditing(false);
    };

    const handleDelete = (id: string) => {
        setData(prev => prev.filter(item => item.id !== id));
        message.success('Employee deleted successfully');
    };

    const showEditModal = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsEditing(true);
        setIsModalVisible(true);
    };

    const showAddModal = () => {
        setEditingEmployee(undefined);
        setIsEditing(false);
        setIsModalVisible(true);
    };

    const handleImport = (employees: Employee[]) => {
        setData(prev => [...prev, ...employees]);
        setIsImportModalVisible(false);
        message.success(`Successfully imported ${employees.length} employees`);
    };

    const columns: any = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
                const statusConfig = {
                    active: { color: 'green', text: 'Active' },
                    on_leave: { color: 'orange', text: 'On Leave' },
                    inactive: { color: 'red', text: 'Inactive' }
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Date of Leave',
            dataIndex: 'leaveDate',
            key: 'leaveDate',
            render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Employee) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<Edit size={16} />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="text"
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Container>
            <HeaderComponent
                isDarkMode={isDarkMode}
                title="Employee Management"
                subtitle="Manage all Employee"
                breadcrumbItems={[
                    {
                        title: 'Home',
                        href: '/'
                    },
                ]}
                extraButtons={[
                    <Button
                        type="default"
                        icon={<Upload size={16} />}
                        onClick={() => setIsImportModalVisible(true)}
                    >
                        Import CSV
                    </Button>,
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        onClick={showAddModal}
                    >
                        Add Employee
                    </Button>
                ]}
            />
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <StatCard>
                        <Statistic
                            title="Total Employees"
                            value={stats.totalEmployees}
                            prefix={<Users size={20} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </StatCard>
                </Col>
                <Col span={8}>
                    <StatCard>
                        <Statistic
                            title="Active Employees"
                            value={stats.activeEmployees}
                            prefix={<UserCheck size={20} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </StatCard>
                </Col>
                <Col span={8}>
                    <StatCard>
                        <Statistic
                            title="Employees on Leave"
                            value={stats.onLeaveEmployees}
                            prefix={<UserX size={20} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </StatCard>
                </Col>
            </Row>

            {/* Employee Directory */}
            <Card>
                <DirectoryHeader>
                    <Title level={4} style={{ margin: 0 }}>Employee Directory</Title>
                    <Flex gap={8} wrap="wrap">
                        <SearchInput
                            placeholder="Search employees..."
                            prefix={<Search size={16} />}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />

                    </Flex>
                </DirectoryHeader>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* Modals */}
            <EmployeeModal
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingEmployee(undefined);
                }}
                onSave={handleSave}
                employee={editingEmployee}
                isEditing={isEditing}
            />

            <ImportCSVModal
                visible={isImportModalVisible}
                onCancel={() => setIsImportModalVisible(false)}
                onImport={handleImport}
            />
        </Container>
    );
};

export default EmployeeManagement;