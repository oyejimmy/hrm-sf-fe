import React, { useState, useMemo } from 'react';
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
  Grid,
  Input
} from 'antd';
import { 
  Download, 
  User, 
  Eye, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Search
} from 'lucide-react';
import styled from 'styled-components';
import { Leave } from '../../../../services/api/types';
import { useTheme } from '../../../../contexts/ThemeContext';
import { DATE_FORMATS } from '../../../../constants';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

interface LeaveHistoryTableProps {
  leaveRequests: Leave[];
  loading?: boolean;
  onCancelRequest?: (id: string) => void;
  searchText?: string;
  onSearchChange?: (value: string) => void;
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
    border-bottom: none;
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
  onCancelRequest,
  searchText = ''
}) => {
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const filteredLeaveRequests = useMemo(() => {
    if (!searchText) return leaveRequests;
    
    return leaveRequests.filter(leave => 
      leave.leave_type.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [leaveRequests, searchText]);
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'approved': 'green',
      'rejected': 'red',
      'pending': 'orange',
      'on_hold': 'yellow'
    };
    return colors[status.toLowerCase()] || 'blue';
  };
  
  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'approved': <CheckCircle size={32} />,
      'rejected': <XCircle size={32} />,
      'pending': <Clock size={32} />
    };
    return icons[status.toLowerCase()] || <AlertCircle size={32} />;
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
      dataIndex: 'leave_type',
      key: 'leave_type',
      width: screens.xs ? 100 : 150,
      sorter: (a: any, b: any) => a.leave_type.localeCompare(b.leave_type),
      render: (type: string) => (
        <div style={{ fontWeight: 500 }}>{type}</div>
      )
    },
    {
      title: 'Duration',
      key: 'duration',
      width: screens.xs ? 80 : 120,
      sorter: (a: any, b: any) => {
        const aDuration = a.duration || a.days_requested || 0;
        const bDuration = b.duration || b.days_requested || 0;
        return aDuration - bDuration;
      },
      render: (record: any) => {
        const duration = record.duration || (record as any).days_requested || 0;
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{duration} day{duration !== 1 ? 's' : ''}</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>Full Day</div>
          </div>
        );
      }
    },
    {
      title: 'Date Range',
      dataIndex: 'start_date',
      key: 'start_date',
      width: screens.xs ? 120 : 180,
      sorter: (a: any, b: any) => dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf(),
      render: (startDate: string, record: any) => {
        const start = dayjs(startDate);
        const end = dayjs(record.end_date);
        const daysUntil = getDaysUntilLeave(startDate);
        
        return (
          <div>
            <div style={{ fontSize: '12px' }}>
              {start.format('DD MMM, YYYY')} - {end.format('DD MMM, YYYY')}
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
      dataIndex: 'status',
      key: 'status',
      width: screens.xs ? 80 : 120,
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Applied',
      dataIndex: 'created_at',
      key: 'created_at',
      width: screens.xs ? 80 : 120,
      sorter: (a: any, b: any) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
      render: (date: string) => (
        <div style={{ fontSize: '12px' }}>
          {dayjs(date).format('DD MMM, YYYY')}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: screens.xs ? 80 : 120,
      render: (record: any) => (
        <Space>
          <Button 
            size="small" 
            icon={<Eye size={14} />}
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
        closable={false}
        maskClosable={false}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedLeave(null);
        }}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          selectedLeave.status === 'pending' && (
            <Button 
              key="cancel" 
              type="primary"
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
              <div style={{ color: selectedLeave.status === 'approved' ? '#52c41a' : selectedLeave.status === 'rejected' ? '#ff4d4f' : '#faad14' }}>
                {getStatusIcon(selectedLeave.status)}
              </div>
            </Col>
            <Col span={20}>
              <Title level={5} style={{ margin: 0, color: selectedLeave.status === 'approved' ? '#52c41a' : selectedLeave.status === 'rejected' ? '#ff4d4f' : '#faad14' }}>
                Request Status: {selectedLeave.status}
              </Title>
              <Text style={{ color: selectedLeave.status === 'approved' ? '#52c41a' : selectedLeave.status === 'rejected' ? '#ff4d4f' : '#faad14' }}>
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
                  <div><Text strong>{selectedLeave.duration || (selectedLeave as any).days_requested || 0} day{(selectedLeave.duration || (selectedLeave as any).days_requested || 0) !== 1 ? 's' : ''}</Text></div>
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
                  <div><Text strong>{dayjs(selectedLeave.start_date).format('DD MMM, YYYY')}</Text></div>
                </div>
                <div>
                  <Text type="secondary">To:</Text>
                  <div><Text strong>{dayjs(selectedLeave.end_date).format('DD MMM, YYYY')}</Text></div>
                </div>
                <div>
                  <Text type="secondary">Applied On:</Text>
                  <div><Text>{dayjs(selectedLeave.created_at).format('DD MMM, YYYY')}</Text></div>
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
        dataSource={filteredLeaveRequests}
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