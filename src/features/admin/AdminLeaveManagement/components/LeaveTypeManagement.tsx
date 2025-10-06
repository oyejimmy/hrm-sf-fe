import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag
} from 'antd';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import LeaveTypeModal from './LeaveTypeModal';

interface LeaveType {
  id: number;
  name: string;
  description?: string;
  default_allocation: number;
  is_active: boolean;
  created_at: string;
}

interface LeaveTypeManagementProps {
  leaveTypes: LeaveType[];
  loading: boolean;
  onCreateLeaveType: (data: any) => void;
  onUpdateLeaveType: (id: number, data: any) => void;
  onDeleteLeaveType: (id: number) => void;
  createLoading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
}

const LeaveTypeManagement: React.FC<LeaveTypeManagementProps> = ({
  leaveTypes,
  loading,
  onCreateLeaveType,
  onUpdateLeaveType,
  onDeleteLeaveType,
  createLoading = false,
  updateLoading = false,
  deleteLoading = false
}) => {
  const { isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);

  const handleCreate = (values: any) => {
    onCreateLeaveType(values);
    setModalVisible(false);
  };

  const handleEdit = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType);
    setModalVisible(true);
  };

  const handleUpdate = (values: any) => {
    if (editingLeaveType) {
      onUpdateLeaveType(editingLeaveType.id, values);
      setModalVisible(false);
      setEditingLeaveType(null);
    }
  };

  const handleDelete = (id: number) => {
    onDeleteLeaveType(id);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingLeaveType(null);
  };

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: LeaveType) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{text}</span>
          {!record.is_active && <Tag color="red">Inactive</Tag>}
        </Space>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-'
    },
    {
      title: 'Default Allocation',
      dataIndex: 'default_allocation',
      key: 'default_allocation',
      render: (days: number) => `${days} days`
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LeaveType) => (
        <Space>
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEdit(record)}
            disabled={updateLoading}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Leave Type"
            description="Are you sure you want to delete this leave type? This will deactivate it for all employees."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              disabled={deleteLoading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Card
        title="Leave Type Management"
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setModalVisible(true)}
            loading={createLoading}
          >
            Add Leave Type
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={leaveTypes}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
      </Card>

      <LeaveTypeModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSubmit={editingLeaveType ? handleUpdate : handleCreate}
        loading={editingLeaveType ? updateLoading : createLoading}
        editData={editingLeaveType}
      />
    </>
  );
};

export default LeaveTypeManagement;