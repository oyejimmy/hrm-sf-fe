import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  message,
  Tooltip,
  Card,
  Row,
  Col,
} from "antd";
import { CheckCircle, XCircle, Eye, Calendar, User, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveApi } from "../../../../services/api/leaveApi";
import { StateCard } from "../../../../components/StateCard";

const { TextArea } = Input;

interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  status: string;
  createdAt: string;
}

const LeaveManagementPanel: React.FC = () => {
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const queryClient = useQueryClient();

  // Queries
  const { data: pendingLeaves = [], isLoading } = useQuery({
    queryKey: ["admin-pending-leaves"],
    queryFn: leaveApi.getPendingLeaveRequests,
    refetchInterval: 30000,
  });

  const { data: leaveStats } = useQuery({
    queryKey: ["admin-leave-stats"],
    queryFn: leaveApi.getAdminLeaveStats,
    refetchInterval: 60000,
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (requestId: string) => leaveApi.approveLeaveRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-leaves"] });
      queryClient.invalidateQueries({ queryKey: ["admin-leave-stats"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-leave-notifications"],
      });
      message.success("Leave request approved successfully");
    },
    onError: () => {
      message.error("Failed to approve leave request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      requestId,
      reason,
    }: {
      requestId: string;
      reason: string;
    }) => leaveApi.rejectLeaveRequest(requestId, { rejection_reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-leaves"] });
      queryClient.invalidateQueries({ queryKey: ["admin-leave-stats"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-leave-notifications"],
      });
      setRejectModalVisible(false);
      setRejectionReason("");
      setSelectedLeave(null);
      message.success("Leave request rejected successfully");
    },
    onError: () => {
      message.error("Failed to reject leave request");
    },
  });

  const handleApprove = (leave: LeaveRequest) => {
    Modal.confirm({
      title: "Approve Leave Request",
      content: `Are you sure you want to approve ${leave.employeeName}'s ${leave.leaveType} leave request?`,
      onOk: () => approveMutation.mutate(leave.id.toString()),
    });
  };

  const handleReject = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedLeave) return;

    if (!rejectionReason.trim()) {
      message.error("Please provide a reason for rejection");
      return;
    }

    rejectMutation.mutate({
      requestId: selectedLeave.id.toString(),
      reason: rejectionReason,
    });
  };

  const handleView = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setViewModalVisible(true);
  };

  const getLeaveTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      annual: "blue",
      sick: "red",
      casual: "green",
      maternity: "purple",
      paternity: "orange",
      unpaid: "gray",
    };
    return colors[type.toLowerCase()] || "default";
  };

  const columns = [
    {
      title: "Employee",
      key: "employee",
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{record.employeeName}</span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            ID: {record.employeeId}
          </span>
        </Space>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
      render: (type: string) => (
        <Tag color={getLeaveTypeColor(type)}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span>
            {new Date(record.startDate).toLocaleDateString()} -{" "}
            {new Date(record.endDate).toLocaleDateString()}
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {record.daysRequested} day{record.daysRequested !== 1 ? "s" : ""}
          </span>
        </Space>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => (
        <Tooltip title={reason}>
          <span
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {reason || "No reason provided"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Applied On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: LeaveRequest) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Approve">
            <Button
              type="text"
              icon={<CheckCircle size={16} />}
              style={{ color: "#52c41a" }}
              onClick={() => handleApprove(record)}
              loading={approveMutation.isPending}
            />
          </Tooltip>
          <Tooltip title="Reject">
            <Button
              type="text"
              icon={<XCircle size={16} />}
              style={{ color: "#ff4d4f" }}
              onClick={() => handleReject(record)}
              loading={rejectMutation.isPending}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      {leaveStats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="Pending Requests"
              value={leaveStats.pendingRequests}
              icon={<Clock />}
              tone="lightPeach"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="Approved This Month"
              value={leaveStats.approvedThisMonth}
              icon={<CheckCircle />}
              tone="pastelGreen"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="Rejected Requests"
              value={leaveStats.rejectedRequests}
              icon={<XCircle />}
              tone="pastelPink"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="Total Requests"
              value={leaveStats.totalRequests}
              icon={<User />}
              tone="pastelBlue"
            />
          </Col>
        </Row>
      )}

      {/* Pending Requests Table */}
      <Card
        title="Pending Leave Requests"
        extra={
          <Space>
            <Button icon={<Calendar size={16} />}>View Calendar</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={pendingLeaves}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Reject Modal */}
      <Modal
        title="Reject Leave Request"
        open={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectionReason("");
          setSelectedLeave(null);
        }}
        confirmLoading={rejectMutation.isPending}
      >
        {selectedLeave && (
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>Employee:</strong> {selectedLeave.employeeName}
            </p>
            <p>
              <strong>Leave Type:</strong> {selectedLeave.leaveType}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {new Date(selectedLeave.startDate).toLocaleDateString()} -{" "}
              {new Date(selectedLeave.endDate).toLocaleDateString()}
            </p>
          </div>
        )}
        <TextArea
          placeholder="Please provide a reason for rejection..."
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="Leave Request Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedLeave(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircle size={16} />}
            onClick={() => {
              if (selectedLeave) {
                handleApprove(selectedLeave);
                setViewModalVisible(false);
              }
            }}
            loading={approveMutation.isPending}
          >
            Approve
          </Button>,
          <Button
            key="reject"
            danger
            icon={<XCircle size={16} />}
            onClick={() => {
              setViewModalVisible(false);
              if (selectedLeave) {
                handleReject(selectedLeave);
              }
            }}
          >
            Reject
          </Button>,
        ]}
      >
        {selectedLeave && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p>
                  <strong>Employee Name:</strong> {selectedLeave.employeeName}
                </p>
                <p>
                  <strong>Employee ID:</strong> {selectedLeave.employeeId}
                </p>
                <p>
                  <strong>Leave Type:</strong>
                  <Tag
                    color={getLeaveTypeColor(selectedLeave.leaveType)}
                    style={{ marginLeft: 8 }}
                  >
                    {selectedLeave.leaveType.charAt(0).toUpperCase() +
                      selectedLeave.leaveType.slice(1)}
                  </Tag>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(selectedLeave.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(selectedLeave.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Days Requested:</strong> {selectedLeave.daysRequested}
                </p>
                <p>
                  <strong>Applied On:</strong>{" "}
                  {new Date(selectedLeave.createdAt).toLocaleDateString()}
                </p>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <p>
                <strong>Reason:</strong>
              </p>
              <div
                style={{
                  padding: "12px",
                  background: "var(--background-secondary)",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                }}
              >
                {selectedLeave.reason || "No reason provided"}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveManagementPanel;
