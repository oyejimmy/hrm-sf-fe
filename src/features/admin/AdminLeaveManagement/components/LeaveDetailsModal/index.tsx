import React, { useState, useEffect } from 'react';
import { Modal, Button, Tag, Row, Col } from 'antd';
import { Eye, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { DATE_FORMATS } from '../../../../../constants/dateFormats';
import { api } from '../../../../../services/api/api';
import { LeaveRequest } from '../../types';
import { 
  ModalSection, 
  SectionTitle, 
  FieldLabel, 
  FieldValue, 
  ReasonBox 
} from '../styles';

interface LeaveDetailsModalProps {
  visible: boolean;
  leave: LeaveRequest | null;
  onClose: () => void;
  onApprove?: (leave: LeaveRequest) => void;
  onReject?: (leave: LeaveRequest) => void;
  isApproving?: boolean;
}

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  visible,
  leave,
  onClose,
  onApprove,
  onReject,
  isApproving = false
}) => {
  // Fetch leave balance using existing API
  const { data: leaveBalance } = useQuery({
    queryKey: ['leave-balance'],
    queryFn: async () => {
      const response = await api.get('/api/leaves/balance');
      return response.data[0]; // Get first leave type balance
    },
    enabled: visible,
    staleTime: 5 * 60 * 1000,
  });



  const getLeaveTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      annual: 'blue', sick: 'red', casual: 'green', maternity: 'purple', paternity: 'orange', unpaid: 'gray'
    };
    return colors[(type || '').toLowerCase()] || 'default';
  };

  if (!leave) return null;

  return (
    <Modal 
      title="Leave Request Details"
      open={visible} 
      onCancel={onClose}
      width={900}
      centered
      closable={false}
      maskClosable={false}
      footer={[
        <Button key="close" onClick={onClose}>Close</Button>,
        leave.status === 'pending' && onApprove && onReject && [
          <Button 
            key="approve" 
            type="primary" 
            icon={<CheckCircle size={16} />} 
            onClick={() => { onApprove(leave); onClose(); }} 
            loading={isApproving}
          >
            Approve
          </Button>,
          <Button 
            key="reject" 
            danger 
            icon={<XCircle size={16} />} 
            onClick={() => { onClose(); onReject(leave); }}
          >
            Reject
          </Button>
        ]
      ].flat().filter(Boolean)}
    >
      <div style={{ padding: '8px 0' }}>
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <ModalSection>
              <SectionTitle color="#1890ff">
                <User size={16} /> Employee Information
              </SectionTitle>
              <Row gutter={[24, 12]}>
                <Col span={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Full Name</FieldLabel>
                    <FieldValue>{leave.employeeName}</FieldValue>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Employee ID</FieldLabel>
                    <FieldValue>{leave.employeeId}</FieldValue>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Department</FieldLabel>
                    <FieldValue>{leave.department || 'Not available'}</FieldValue>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Position</FieldLabel>
                    <FieldValue>{leave.position || 'Not available'}</FieldValue>
                  </div>
                </Col>
              </Row>
            </ModalSection>
          </Col>
          <Col span={12}>
            <ModalSection background="#f6ffed" border="#b7eb8f">
              <SectionTitle color="#52c41a">
                <Calendar size={16} /> Leave Details
              </SectionTitle>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Leave Type</FieldLabel>
                    <div><Tag color={getLeaveTypeColor(leave.leaveType)} style={{ margin: 0 }}>{leave.leaveType}</Tag></div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Status</FieldLabel>
                    <div>
                      <Tag color={leave.status === 'pending' ? 'orange' : leave.status === 'approved' ? 'green' : 'red'} style={{ margin: 0 }}>
                        {leave.status.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Start Date</FieldLabel>
                    <FieldValue>{dayjs(leave.startDate).format(DATE_FORMATS.DISPLAY)}</FieldValue>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>End Date</FieldLabel>
                    <FieldValue>{dayjs(leave.endDate).format(DATE_FORMATS.DISPLAY)}</FieldValue>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Duration</FieldLabel>
                    <FieldValue color="#1890ff">
                      {leave.days_requested || 0} {(leave.days_requested || 0) === 1 ? 'Day' : 'Days'}
                    </FieldValue>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Applied On</FieldLabel>
                    <FieldValue>{dayjs(leave.createdAt).format(DATE_FORMATS.DISPLAY)}</FieldValue>
                  </div>
                </Col>
              </Row>
            </ModalSection>
          </Col>
          <Col span={12}>
            <ModalSection background="#f0f5ff" border="#91d5ff">
              <SectionTitle color="#1890ff">
                <Calendar size={16} /> Leave Balance Information
              </SectionTitle>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Total Allocated</FieldLabel>
                    <FieldValue>{leaveBalance?.total_allocated || 0} days</FieldValue>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Used This Year</FieldLabel>
                    <FieldValue color="#ff4d4f">{leaveBalance?.taken || 0} days</FieldValue>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Remaining Balance</FieldLabel>
                    <FieldValue color="#52c41a">{leaveBalance?.remaining || 0} days</FieldValue>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Balance After Request</FieldLabel>
                    <FieldValue color={(leaveBalance?.remaining || 0) - (leave.days_requested || 0) >= 0 ? "#52c41a" : "#ff4d4f"}>
                      {Math.max(0, (leaveBalance?.remaining || 0) - (leave.days_requested || 0))} days
                    </FieldValue>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ marginBottom: '8px' }}>
                    <FieldLabel>Leave Year</FieldLabel>
                    <FieldValue>{new Date().getFullYear()}</FieldValue>
                  </div>
                </Col>
              </Row>
            </ModalSection>
          </Col>
        </Row>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#595959' }}>Reason for Leave</h4>
          <ReasonBox>
            {leave.reason || 'No reason provided'}
          </ReasonBox>
        </div>

        {(leave.rejection_reason || leave.status !== 'pending') && (
          <ModalSection background="#fff7e6" border="#ffd591">
            <h4 style={{ margin: '0 0 8px 0', color: '#d46b08' }}>Approver Comments</h4>
            {leave.rejection_reason ? (
              <div style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '8px' }}>
                {leave.rejection_reason}
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#8c8c8c', fontStyle: 'italic' }}>
                No comments provided
              </div>
            )}
            {leave.approved_by && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                <strong>Reviewed by:</strong> {leave.approved_by} 
                {leave.approved_at && (
                  <span> on {dayjs(leave.approved_at).format(DATE_FORMATS.DISPLAY)}</span>
                )}
              </div>
            )}
          </ModalSection>
        )}
      </div>
    </Modal>
  );
};

export default LeaveDetailsModal;