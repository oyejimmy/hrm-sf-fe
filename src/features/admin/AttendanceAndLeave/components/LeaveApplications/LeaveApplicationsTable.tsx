import React from 'react';
import { Table, Tag, Space, Button, Input, Flex } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { LeaveRequest } from '../../types';
import styled from 'styled-components';

const SearchInput = styled(Input)`
  border-radius: ${props => props.theme.borderRadius.md};
  width: 250px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

const StyledTable = styled(Table)`
  border-radius: ${props => props.theme.borderRadius.lg};
  
  .ant-table-thead > tr > th {
    background-color: ${props => props.theme.colors.surfaceSecondary};
    color: ${props => props.theme.colors.textPrimary};
    border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${props => props.theme.colors.borderLight};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  .ant-table-tbody > tr {
    background-color: ${props => props.theme.colors.surface};
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: ${props => props.theme.colors.surfaceSecondary} !important;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: ${props => props.theme.spacing.sm};
    }
  }
`;

interface LeaveApplicationsTableProps {
  data: LeaveRequest[];
  onEdit: (record: LeaveRequest) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const LeaveApplicationsTable = ({
  data,
  onEdit,
  onDelete,
  loading = false
}: any) => {
  const columns: any = [
    { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
    { title: "Leave Type", dataIndex: "leaveType", key: "leaveType" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    { title: "Reason", dataIndex: "reason", key: "reason", ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = 'default';
        if (status === 'Approved') color = 'success';
        if (status === 'Rejected') color = 'error';
        if (status === 'Pending') color = 'warning';

        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: LeaveRequest) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id!)} />
        </Space>
      ),
    },
  ];

  return (
    <>
    <Flex justify='space-between' style={{ marginBottom: "20px" }}>
        <SearchInput
          placeholder="Search employees"
          prefix={<SearchOutlined />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => onEdit()}
        >
          Add Leave Request
        </Button>
      </Flex>
      <StyledTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        loading={loading}
      />
    </>
  );
};

export default LeaveApplicationsTable;