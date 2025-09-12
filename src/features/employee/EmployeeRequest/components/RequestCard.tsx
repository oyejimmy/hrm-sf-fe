import { Modal, Input, Typography, Tag, Space, Row, Col, Card } from 'antd';
import {
    FileText,
    Calendar,
    Laptop,
    Car,
    Trophy,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    DollarSign
} from 'lucide-react';

import { RequestCard as StyledRequestCard, SecondaryButton, PrimaryButton } from './styles';

const { Title, Text } = Typography;

interface RequestCardProps {
    request: any;
    onApprove: (requestId: string) => void;
    onReject: (requestId: string, comments: string) => void;
    userRole: string;
    isDarkMode: boolean;
}

const RequestCard = ({
    request,
    onApprove,
    onReject,
    userRole,
    isDarkMode
}: RequestCardProps) => {
    const getTypeIcon = (type: string) => {
        const iconStyle = { width: 20, height: 20, marginRight: 8 };
        switch (type) {
            case 'loan': return <DollarSign style={{ ...iconStyle, color: '#1890ff' }} />;
            case 'document': return <FileText style={{ ...iconStyle, color: '#52c41a' }} />;
            case 'leave': return <Calendar style={{ ...iconStyle, color: '#faad14' }} />;
            case 'equipment': return <Laptop style={{ ...iconStyle, color: '#722ed1' }} />;
            case 'travel': return <Car style={{ ...iconStyle, color: '#13c2c2' }} />;
            case 'recognition': return <Trophy style={{ ...iconStyle, color: '#f5222d' }} />;
            default: return <FileText style={iconStyle} />;
        }
    };

    const getStatusTag = (status: string) => {
        let color = 'gold';
        let icon = <Clock size={14} />;
        let text = 'PENDING';

        if (status === 'approved') {
            color = 'green';
            icon = <CheckCircle size={14} />;
            text = 'APPROVED';
        } else if (status === 'rejected') {
            color = 'red';
            icon = <XCircle size={14} />;
            text = 'REJECTED';
        } else if (status === 'in_progress') {
            color = 'blue';
            icon = <TrendingUp size={14} />;
            text = 'IN PROGRESS';
        }

        return (
            <Tag
                icon={icon}
                color={color}
                style={{
                    borderRadius: 12,
                    padding: '4px 8px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}
            >
                {text}
            </Tag>
        );
    };

    const getPriorityTag = (priority: string = 'medium') => {
        let color = 'blue';
        let text = 'MEDIUM';

        if (priority === 'high') {
            color = 'red';
            text = 'HIGH';
        } else if (priority === 'low') {
            color = 'green';
            text = 'LOW';
        }

        return (
            <Tag color={color} style={{ borderRadius: 12, margin: 0 }}>
                {text}
            </Tag>
        );
    };

    // Get border color based on status
    const getBorderColor = (status: string) => {
        if (status === 'pending') return '#faad14'; // Yellow
        if (status === 'approved') return '#52c41a'; // Green
        if (status === 'rejected') return '#f5222d'; // Red
        return '#d9d9d9'; // Default
    };

    return (
        <StyledRequestCard
            isDarkMode={isDarkMode}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: `2px solid ${getBorderColor(request.status)}`,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
        >
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        {getTypeIcon(request.type)}
                        <Title
                            level={5}
                            style={{
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {request.subject}
                        </Title>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                        {getPriorityTag(request.priority)}
                        {getStatusTag(request.status)}
                    </div>
                </div>

                <Text
                    style={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
                        marginBottom: 16,
                        display: 'block',
                        lineHeight: '1.5',
                        minHeight: '48px'
                    }}
                >
                    {request.details}
                </Text>

                <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={16} color="#1890ff" />
                        <Text type="secondary" style={{ fontSize: '13px' }}>{request.date}</Text>
                    </div>

                    {request.type === 'loan' && request.amount && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <DollarSign size={16} color="#52c41a" />
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                ${request.amount.toLocaleString()}
                            </Text>
                        </div>
                    )}

                    {request.type === 'document' && request.documentType && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={16} color="#faad14" />
                            <Text type="secondary" style={{ fontSize: '13px' }}>{request.documentType}</Text>
                        </div>
                    )}

                    {request.type === 'leave' && request.startDate && request.endDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={16} color="#13c2c2" />
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                {request.startDate} to {request.endDate}
                            </Text>
                        </div>
                    )}
                </Space>

                {request.approver && (
                    <div style={{ marginBottom: 12 }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Approved by: {request.approver}
                        </Text>
                    </div>
                )}

                {request.approverComments && (
                    <div style={{
                        padding: 12,
                        background: isDarkMode ? '#1d1d1d' : '#f9f9f9',
                        borderRadius: 8,
                        marginBottom: 16
                    }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            <strong>Comments:</strong> {request.approverComments}
                        </Text>
                    </div>
                )}
            </div>

            {userRole === 'manager' && request.status === 'pending' && (
                <div style={{
                    display: 'flex',
                    gap: 8,
                    justifyContent: 'flex-end',
                    marginTop: 'auto',
                    paddingTop: 16,
                    borderTop: `1px solid ${isDarkMode ? '#434343' : '#f0f0f0'}`
                }}>
                    <SecondaryButton
                        isDarkMode={isDarkMode}
                        onClick={() => {
                            Modal.confirm({
                                title: 'Reject Request',
                                content: (
                                    <Input.TextArea
                                        placeholder="Please provide a reason for rejection"
                                        rows={4}
                                        style={{ marginTop: 16 }}
                                    />
                                ),
                                okText: 'Reject',
                                okType: 'danger',
                                cancelText: 'Cancel',
                                onOk: (close) => {
                                    const textarea = document.querySelector('.ant-modal-body textarea') as HTMLTextAreaElement;
                                    onReject(request.id, textarea.value);
                                    close();
                                }
                            });
                        }}
                    >
                        Reject
                    </SecondaryButton>
                    <PrimaryButton onClick={() => onApprove(request.id)}>
                        Approve
                    </PrimaryButton>
                </div>
            )}
        </StyledRequestCard>
    );
};

// New component to display requests in columns by status
interface RequestColumnViewProps {
    requests: any[];
    onApprove: (requestId: string) => void;
    onReject: (requestId: string, comments: string) => void;
    userRole: string;
    isDarkMode: boolean;
}

const RequestColumnView = ({
    requests,
    onApprove,
    onReject,
    userRole,
    isDarkMode
}: RequestColumnViewProps) => {
    // Filter requests by status
    const pendingRequests = requests.filter(req => req.status === 'pending');
    const approvedRequests = requests.filter(req => req.status === 'approved');
    const rejectedRequests = requests.filter(req => req.status === 'rejected');

    return (
        <Row gutter={[24, 24]}>
            {/* Pending Requests Column */}
            <Col xs={24} md={8} lg={8} xl={8} span={8}>
                <Card
                    title="Pending Requests"
                    size="small"
                >
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map(request => (
                            <div key={request.id} style={{ marginBottom: '16px' }}>
                                <RequestCard
                                    request={request}
                                    onApprove={onApprove}
                                    onReject={onReject}
                                    userRole={userRole}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#bfbfbf' }}>
                            No pending requests
                        </div>
                    )}
                </Card>
            </Col>

            {/* Approved Requests Column */}
            <Col xs={24} md={8} lg={8} xl={8} span={8} >
                <Card
                    title="Approved Requests"
                    size="small"
                    headStyle={{
                        backgroundColor: '#f6ffed',
                        borderBottom: '2px solid #52c41a',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                    bodyStyle={{ padding: '8px' }}
                >
                    {approvedRequests.length > 0 ? (
                        approvedRequests.map(request => (
                            <div key={request.id} style={{ marginBottom: '16px' }}>
                                <RequestCard
                                    request={request}
                                    onApprove={onApprove}
                                    onReject={onReject}
                                    userRole={userRole}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#bfbfbf' }}>
                            No approved requests
                        </div>
                    )}
                </Card>
            </Col>

            {/* Rejected Requests Column */}
            <Col xs={24} md={8} lg={8} xl={8} span={8}>
                <Card
                    title="Rejected Requests"
                    size="small"
                    headStyle={{
                        backgroundColor: '#fff2f0',
                        borderBottom: '2px solid #f5222d',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                    bodyStyle={{ padding: '8px' }}
                >
                    {rejectedRequests.length > 0 ? (
                        rejectedRequests.map(request => (
                            <div key={request.id} style={{ marginBottom: '16px' }}>
                                <RequestCard
                                    request={request}
                                    onApprove={onApprove}
                                    onReject={onReject}
                                    userRole={userRole}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#bfbfbf' }}>
                            No rejected requests
                        </div>
                    )}
                </Card>
            </Col>
        </Row>
    );
};

export { RequestCard, RequestColumnView };