import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Avatar } from 'antd';
import { Download, MessageSquare, User } from 'lucide-react';
import { LeaveRequest } from '../types';

// Define props interface for LeaveHistoryTable component
interface LeaveHistoryTableProps {
  leaveRequests: LeaveRequest[]; // Array of leave request data
  loading?: boolean; // Loading state for the table
}

// LeaveHistoryTable functional component
const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({
  leaveRequests, // Destructure leaveRequests from props
  loading = false // Destructure loading with a default value of false
}) => {
  // Function to determine tag color based on leave status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'green'; // Green for approved status
      case 'Rejected': return 'red'; // Red for rejected status
      case 'On Hold': return 'orange'; // Orange for on hold status
      case 'Pending': return 'blue'; // Blue for pending status
      default: return 'default'; // Default color for other statuses
    }
  };

  // Define table columns
  const columns = [
    {
      title: 'Type', // Column title for leave type
      dataIndex: 'type', // Data index for leave type
      key: 'type', // Unique key for the column
      render: (type: string) => <Tag color="blue">{type}</Tag> // Render leave type as a blue tag
    },
    {
      title: 'Duration', // Column title for leave duration
      key: 'duration', // Unique key for the column
      render: (record: LeaveRequest) => ( // Custom render function for duration
        <Space direction="vertical" size={0}>
          <span>{record.duration} day{record.duration !== 1 ? 's' : ''}</span> {/* Display duration in days */}
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {record.durationType} {/* Display duration type */}
          </span>
        </Space>
      )
    },
    {
      title: 'Dates', // Column title for leave dates
      key: 'dates', // Unique key for the column
      render: (record: LeaveRequest) => ( // Custom render function for dates
        <Space direction="vertical" size={0}>
          <span>{new Date(record.from).toLocaleDateString()}</span> {/* Display start date */}
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            to {new Date(record.to).toLocaleDateString()} {/* Display end date */}
          </span>
        </Space>
      )
    },
    {
      title: 'Status', // Column title for leave status
      dataIndex: 'status', // Data index for leave status
      key: 'status', // Unique key for the column
      render: (status: string) => ( // Custom render function for status
        <Tag color={getStatusColor(status)}>{status}</Tag> // Display status as a colored tag
      )
    },
    {
      title: 'Recipients', // Column title for recipients
      key: 'recipients', // Unique key for the column
      render: (record: LeaveRequest) => ( // Custom render function for recipients
        <Avatar.Group maxCount={3} size="small"> {/* Avatar group for multiple recipients */}
          {record.recipientDetails.map(recipient => ( // Map through recipient details
            <Tooltip key={recipient.id} title={`${recipient.name} - ${recipient.role}`}> {/* Tooltip for each recipient */}
              <Avatar size="small" icon={<User size={12} />} /> {/* Avatar for each recipient */}
            </Tooltip>
          ))}
        </Avatar.Group>
      )
    },
    {
      title: 'Applied', // Column title for applied date
      dataIndex: 'appliedAt', // Data index for applied date
      key: 'appliedAt', // Unique key for the column
      render: (date: string) => new Date(date).toLocaleDateString() // Render applied date
    },
    {
      title: 'Actions', // Column title for actions
      key: 'actions', // Unique key for the column
      render: (record: LeaveRequest) => ( // Custom render function for actions
        <Space>
          {record.attachmentUrl && ( // Conditionally render download button if attachment exists
            <Button size="small" icon={<Download size={14} />} /> // Download button
          )}
          {record.adminComments && ( // Conditionally render message button if admin comments exist
            <Tooltip title={record.adminComments}> {/* Tooltip for admin comments */}
              <Button size="small" icon={<MessageSquare size={14} />} /> {/* Message button */}
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns} // Pass defined columns to the table
      dataSource={leaveRequests} // Pass leave requests data to the table
      loading={loading} // Pass loading state to the table
      rowKey="id" // Use 'id' as the unique key for each row
      pagination={{ pageSize: 10 }} // Set pagination with page size of 10
      scroll={{ x: true }} // Enable horizontal scrolling
    />
  );
};

export default LeaveHistoryTable;