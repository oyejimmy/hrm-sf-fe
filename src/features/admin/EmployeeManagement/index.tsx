import { useState, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Row,
  Col,
  Input,
  Space,
  Typography,
  Flex,
  Spin,
  Popconfirm,
  Tooltip,
  Modal,
  Descriptions,
  Avatar,
} from "antd";
import {
  Plus,
  Search,
  Users,
  UserCheck,
  Edit,
  Trash2,
  Upload,
  MapPin,
  Briefcase,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  FileText,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { CsvIcon, ExcelIcon } from "../../../components/icons";
import {
  useEmployees,
  useDeleteEmployee,
  Employee,
} from "../../../hooks/api/useEmployees";
import EmployeeModal from "./components/EmployeeModal";
import { ImportCSVModal } from "./components/ImportCSVModal";
import EmployeeViewModal from "./components/EmployeeViewModal";
import { Wrapper } from "../../../components/Wrapper";
import { useTheme } from "../../../contexts/ThemeContext";
import HeaderComponent from "../../../components/PageHeader";
import { StateCard } from "../../../components/StateCard";
import { DATE_FORMATS } from "../../../constants";
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const { Search: SearchInput } = Input;

const EmployeeManagement = () => {
  const { isDarkMode } = useTheme();
  const { data: employees = [], isLoading, error } = useEmployees();
  const deleteEmployee = useDeleteEmployee();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<
    Employee | undefined
  >();
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [visibleSalaries, setVisibleSalaries] = useState<Set<number>>(new Set());
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const togglePasswordVisibility = (employeeId: number) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const toggleSalaryVisibility = (employeeId: number) => {
    setVisibleSalaries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const filteredData = useMemo(() => {
    if (!searchText) return employees;

    return employees.filter((item: Employee) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [employees, searchText]);

  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (emp) => emp.status === "active"
    ).length;
    const fullTimeEmployees = employees.filter(
      (emp) => emp.employment_status === "full_time"
    ).length;
    const remoteEmployees = employees.filter(
      (emp) => emp.work_location === "remote" || emp.work_type === "remote"
    ).length;

    return {
      totalEmployees,
      activeEmployees,
      fullTimeEmployees,
      remoteEmployees,
    };
  }, [employees]);

  const handleSave = () => {
    setIsModalVisible(false);
    setEditingEmployee(undefined);
    setIsEditing(false);
  };

  const handleDelete = (id: number) => {
    deleteEmployee.mutate(id);
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

  const showViewModal = (employee: Employee) => {
    setViewingEmployee(employee);
    setIsViewModalVisible(true);
  };

  const handleImport = (importedEmployees: any[]) => {
    setIsImportModalVisible(false);
  };

  const exportToCSV = () => {
    const dataToExport = filteredData.map(emp => ({
      'Employee ID': emp.employee_id,
      'Name': emp.name,
      'Email': emp.email,
      'Department': emp.department,
      'Position': emp.position,
      'Role': emp.role?.charAt(0).toUpperCase() + emp.role?.slice(1) || '',
      'Manager': emp.manager || 'No Manager',
      'Salary': emp.salary || 'Not Set',
      'Work Location': emp.work_location,
      'Employment Type': emp.employment_type?.replace('_', ' ') || '',
      'Status': emp.status,
      'Join Date': emp.hire_date ? dayjs(emp.hire_date).format(DATE_FORMATS.DISPLAY) : ''
    }));
    
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const dataToExport = filteredData.map(emp => ({
      'Employee ID': emp.employee_id,
      'Name': emp.name,
      'Email': emp.email,
      'Department': emp.department,
      'Position': emp.position,
      'Role': emp.role?.charAt(0).toUpperCase() + emp.role?.slice(1) || '',
      'Manager': emp.manager || 'No Manager',
      'Salary': emp.salary || 'Not Set',
      'Work Location': emp.work_location,
      'Employment Type': emp.employment_type?.replace('_', ' ') || '',
      'Status': emp.status,
      'Join Date': emp.hire_date ? dayjs(emp.hire_date).format(DATE_FORMATS.DISPLAY) : ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, `employees_${dayjs().format('YYYY-MM-DD')}.xlsx`);
  };

  const columns: any = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
      render: (employee_id: string) => <strong style={{ color: '#1890ff' }}>{employee_id}</strong>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Company Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => role ? role.charAt(0).toUpperCase() + role.slice(1) : "-",
    },
    {
      title: "Supervisor",
      dataIndex: "manager",
      key: "manager",
      render: (manager: string) => manager || "No Manager",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (salary: number, record: Employee) => {
        const isVisible = visibleSalaries.has(record.id);
        return (
          <Space>
            {salary ? (
              isVisible ? `PKR ${salary.toLocaleString()}` : "******"
            ) : "Not Set"}
            {salary && (
              <Button
                type="text"
                size="small"
                icon={isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                onClick={() => toggleSalaryVisibility(record.id)}
              />
            )}
          </Space>
        );
      },
    },
    {
      title: "Work Location",
      dataIndex: "work_location",
      key: "work_location",
    },
    {
      title: "Employment Type",
      dataIndex: "employment_type",
      key: "employment_type",
      render: (employment_type: string) => employment_type?.replace("_", " ") || "-",
    },


    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          active: { color: "green", text: "Active" },
          on_leave: { color: "orange", text: "On Leave" },
          inactive: { color: "red", text: "Inactive" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Join Date",
      dataIndex: "hire_date",
      key: "hire_date",
      render: (date: string) =>
        date ? dayjs(date).format(DATE_FORMATS.DISPLAY) : "-",
    },
    {
      title: "Temp Password",
      dataIndex: "temp_password",
      key: "temp_password",
      render: (tempPassword: string, record: Employee) => {
        if (!tempPassword) {
          return (
            <div style={{ textAlign: 'center' }}>
              <Tooltip title="User has successfully changed their password from the temporary password">
                <CheckCircle size={16} color="#52c41a" />
              </Tooltip>
            </div>
          );
        }
        
        const isVisible = visiblePasswords.has(record.id);
        return (
          <Space>
            <Key size={16} color="#fa541c" />
            <Tag color="orange">{isVisible ? tempPassword : "******"}</Tag>
            <Button
              type="text"
              size="small"
              icon={isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              onClick={() => togglePasswordVisibility(record.id)}
            />
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Employee) => (
        <Space size={0}>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => showViewModal(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Employee"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<Trash2 size={16} />}
                loading={deleteEmployee.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Spin size="large" />
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h3>Error loading employees</h3>
          <p>Please try refreshing the page</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Employee Management"
        subtitle="View, add, edit, and manage employee records, roles, and organizational structure"
        breadcrumbItems={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Employees",
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
          </Button>,
        ]}
      />
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Total Employees"
            value={stats.totalEmployees}
            icon={<Users />}
            tone="pastelBlue"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Active Employees"
            value={stats.activeEmployees}
            icon={<UserCheck />}
            tone="pastelGreen"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Full-Time"
            value={stats.fullTimeEmployees}
            icon={<Briefcase />}
            tone="lightPeach"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Remote Workers"
            value={stats.remoteEmployees}
            icon={<MapPin />}
            tone="softLavender"
            loading={isLoading}
          />
        </Col>
      </Row>

      {/* Table */}
      <Card
        title="Employee List"
        extra={
          <Space>
            <SearchInput
              placeholder="Search employees..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Tooltip title="Export to CSV">
              <Button
                type="text"
                icon={<CsvIcon size={20} />}
                onClick={exportToCSV}
              />
            </Tooltip>
            <Tooltip title="Export to Excel">
              <Button
                type="text"
                icon={<ExcelIcon size={20} />}
                onClick={exportToExcel}
              />
            </Tooltip>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
        <div style={{ marginTop: 8, fontSize: '14px', fontWeight: 500, color: isDarkMode ? '#fff' : '#333' }}>
          {(() => {
            const total = filteredData.length;
            if (total === 0) return "No employees found";
            if (total === 1) return "Displaying 1 employee record";
            return `Displaying ${total} employee records`;
          })()}
        </div>
      </Card>

      <EmployeeModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
        employee={editingEmployee}
        isEditing={isEditing}
      />

      <ImportCSVModal
        visible={isImportModalVisible}
        onCancel={() => setIsImportModalVisible(false)}
        onImport={handleImport}
      />

      <EmployeeViewModal
        employee={viewingEmployee}
        visible={isViewModalVisible}
        onClose={() => {
          setIsViewModalVisible(false);
          setViewingEmployee(null);
        }}
      />
    </Wrapper>
  );
};

export default EmployeeManagement;