import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Tooltip, 
  Avatar, 
  Modal, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Divider,
  Progress,
  Grid
} from 'antd';
import { 
  Download, 
  User, 
  Eye, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import styled from 'styled-components';
import { Leave } from '../../../../services/api/types';
import { useTheme } from '../../../../contexts/ThemeContext';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

interface LeaveHistoryTableProps {
  leaveRequests: Leave[];
  loading?: boolean;
  onCancelRequest?: (id: string) => void;
}

const StyledTable = styled(Table)<{ $isDarkMode: boolean }>`
  .ant-table {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
  
  .ant-table-thead > tr > th {
    background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#fafafa'};
    color: ${props => props.$isDarkMode ? 'var(--text-primary)' : '#000000d9'};
    border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  }
  
  .ant-table-tbody > tr:hover > td {
    background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#fafafa'} !important;
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px 4px;
      font-size: 12px;
    }
  }
`;

const DetailModal = styled(Modal)<{ $isDarkMode: boolean }>`
  .ant-modal-content {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
  
  .ant-modal-header {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
    border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  }
  
  .ant-modal-body {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
`;

const StatusCard = styled(Card)<{ $isDarkMode: boolean; $status: string }>`
  background: ${props => {
    if (props.$status === 'Approved') return props.$isDarkMode ? '#1f4e1f' : '#f6ffed';
    if (props.$status === 'Rejected') return props.$isDarkMode ? '#4e1f1f' : '#fff2f0';
    if (props.$status === 'On Hold') return props.$isDarkMode ? '#4e3d1f' : '#fffbe6';
    return props.$isDarkMode ? 'var(--surfaceSecondary)' : '#f8f9fa';
  }};
  border: 1px solid ${props => {
    if (props.$status === 'Approved') return '#52c41a';
    if (props.$status === 'Rejected') return '#ff4d4f';
    if (props.$status === 'On Hold') return '#faad14';
    return props.$isDarkMode ? 'var(--border)' : '#d9d9d9';
  }};
  margin-bottom: 16px;
`;

const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({
  leaveRequests,
  loading = false,
  onCancelRequest
}) => {
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Approved': 'success',
      'Rejected': 'error',
      'On Hold': 'warning',
      'Pending': 'processing'
    };
    return colors[status] || 'default';
  };
  
  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Approved': <CheckCircle size={14} />,
      'Rejected': <XCircle size={14} />,
      'Pending': <Clock size={14} />
    };
    return icons[status] || <AlertCircle size={14} />;
  };

  const getLeaveTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Annual': '#52c41a',
      'Sick': '#ff4d4f',
      'Casual': '#1890ff',
      'Maternity': '#722ed1',
      'Paternity': '#13c2c2',
      'Unpaid': '#faad14'
    };
    return colors[type] || '#d9d9d9';
  };
  
  const handleViewDetails = (leave: Leave) => {
    setSelectedLeave(leave);
    setDetailModalVisible(true);
  };
  
  const handleCancelRequest = (id: string) => {
    Modal.confirm({
      title: 'Cancel Leave Request',
      content: 'Are you sure you want to cancel this leave request? This action cannot be undone.',
      okText: 'Yes, Cancel',
      cancelText: 'No',
      okType: 'danger',
      onOk: () => {
        if (onCancelRequest) {
          onCancelRequest(id);
        }
      }
    });
  };
  
  const getDaysUntilLeave = (startDate: string) => {
    const start = dayjs(startDate);
    const now = dayjs();
    const diff = start.diff(now, 'days');
    
    if (diff < 0) return 'Started';
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days`;
  };

  const columns = [
    {
      title: 'Leave Type',
      key: 'type',
      width: screens.xs ? 100 : 150,
      render: (record: Leave) => (
        <div style={{ fontWeight: 500 }}>{record.leave_type}</div>
      )
    },
    {
      title: 'Duration',
      key: 'duration',
      width: screens.xs ? 80 : 120,
      render: (record: Leave) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.duration} day{record.duration !== 1 ? 's' : ''}</div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>Full Day</div>
        </div>
      )
    },
    {
      title: 'Date Range',
      key: 'dates',
      width: screens.xs ? 120 : 180,
      render: (record: Leave) => {
        const startDate = dayjs(record.start_date);
        const endDate = dayjs(record.end_date);
        const daysUntil = getDaysUntilLeave(record.start_date);
        
        return (
          <div>
            <div style={{ fontSize: '12px' }}>
              {startDate.format('MMM DD')} - {endDate.format('MMM DD, YYYY')}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>
              {record.status === 'approved' && daysUntil !== 'Started' ? `Starts in ${daysUntil}` : ''}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Status',
      key: 'status',
      width: screens.xs ? 80 : 120,
      render: (record: Leave) => (
        <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
      )
    },
    {
      title: 'Applied',
      dataIndex: 'created_at',
      key: 'created_at',
      width: screens.xs ? 80 : 120,
      render: (date: string) => (
        <div style={{ fontSize: '12px' }}>
          {dayjs(date).format('MMM DD, YYYY')}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: screens.xs ? 80 : 120,
      render: (record: Leave) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <Button 
              size="small" 
              danger
              onClick={() => handleCancelRequest(record.id.toString())}
            >
              Cancel
            </Button>
          )}
        </Space>
      )
    }
  ];
  
  const renderDetailModal = () => {
    if (!selectedLeave) return null;
    
    return (
      <DetailModal
        title="Leave Request Details"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedLeave(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          selectedLeave.status === 'pending' && (
            <Button 
              key="cancel" 
              danger 
              onClick={() => {
                handleCancelRequest(selectedLeave.id.toString());
                setDetailModalVisible(false);
              }}
            >
              Cancel Request
            </Button>
          )
        ].filter(Boolean)}
        width={screens.xs ? '100%' : 700}
        centered
        $isDarkMode={isDarkMode}
      >
        <StatusCard $isDarkMode={isDarkMode} $status={selectedLeave.status}>
          <Row gutter={16} align="middle">
            <Col span={4}>
              {getStatusIcon(selectedLeave.status)}
            </Col>
            <Col span={20}>
              <Title level={5} style={{ margin: 0 }}>Request Status: {selectedLeave.status}</Title>
              <Text type="secondary">
                {selectedLeave.status === 'approved' && 'Your leave request has been approved'}
                {selectedLeave.status === 'rejected' && 'Your leave request has been rejected'}
                {selectedLeave.status === 'pending' && 'Your leave request is under review'}
              </Text>
            </Col>
          </Row>
        </StatusCard>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card size="small" title="Leave Information">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Type:</Text>
                  <div>
                    <Space>
                      <div 
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: getLeaveTypeColor(selectedLeave.leave_type)
                        }}
                      />
                      <Text strong>{selectedLeave.leave_type} Leave</Text>
                    </Space>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Duration:</Text>
                  <div><Text strong>{selectedLeave.duration} day{selectedLeave.duration !== 1 ? 's' : ''}</Text></div>
                </div>
                <div>
                  <Text type="secondary">Duration Type:</Text>
                  <div><Text>Full Day</Text></div>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" title="Date Information">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">From:</Text>
                  <div><Text strong>{dayjs(selectedLeave.start_date).format('MMMM DD, YYYY')}</Text></div>
                </div>
                <div>
                  <Text type="secondary">To:</Text>
                  <div><Text strong>{dayjs(selectedLeave.end_date).format('MMMM DD, YYYY')}</Text></div>
                </div>
                <div>
                  <Text type="secondary">Applied On:</Text>
                  <div><Text>{dayjs(selectedLeave.created_at).format('MMMM DD, YYYY')}</Text></div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Card size="small" title="Reason" style={{ marginTop: 16 }}>
          <Text>{selectedLeave.reason}</Text>
        </Card>
        
        {selectedLeave.status === 'approved' && (
          <Card size="small" title="Leave Progress" style={{ marginTop: 16 }}>
            <Progress 
              percent={dayjs().isAfter(dayjs(selectedLeave.start_date)) ? 100 : 0}
              status={dayjs().isAfter(dayjs(selectedLeave.end_date)) ? 'success' : 'active'}
              format={() => {
                if (dayjs().isBefore(dayjs(selectedLeave.start_date))) {
                  return `Starts ${getDaysUntilLeave(selectedLeave.start_date)}`;
                }
                if (dayjs().isAfter(dayjs(selectedLeave.end_date))) {
                  return 'Completed';
                }
                return 'In Progress';
              }}
            />
          </Card>
        )}
      </DetailModal>
    );
  };

  return (
    <>
      <StyledTable
        columns={columns}
        dataSource={leaveRequests}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} requests`,
          responsive: true
        }}
        scroll={{ x: screens.xs ? 600 : 'auto' }}
        size={screens.xs ? 'small' : 'middle'}
        $isDarkMode={isDarkMode}
        rowClassName={(record: any) => {
          if (record.status === 'approved' && dayjs().isBetween(dayjs(record.start_date), dayjs(record.end_date))) {
            return 'active-leave-row';
          }
          return '';
        }}
      />
      {renderDetailModal()}
    </>
  );
};

export default LeaveHistoryTable;