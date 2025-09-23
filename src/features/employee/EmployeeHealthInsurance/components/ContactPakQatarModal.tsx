import React from 'react';
import { Modal, Card, Row, Col, Typography, Space, Divider } from 'antd';
import { PhoneOutlined, MailOutlined, GlobalOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ContactPakQatarModalProps {
  visible: boolean;
  onCancel: () => void;
}

const ContactPakQatarModal: React.FC<ContactPakQatarModalProps> = ({
  visible,
  onCancel
}) => {
  const contactInfo = {
    name: "PakQatar",
    fullName: "PakQatar Family Takaful Limited",
    phone: "+92-21-111-725-282",
    email: "info@pakqatar.com.pk",
    website: "https://www.pakqatar.com.pk",
    address: "PakQatar House, Plot No. 5-C, Block-9, Clifton, Karachi",
    city: "Karachi",
    country: "Pakistan",
    businessHours: "Monday - Friday: 9:00 AM - 6:00 PM",
    emergencyContact: "+92-21-111-725-911"
  };

  return (
    <Modal
      title="Contact PakQatar"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <Card>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          {contactInfo.fullName}
        </Title>
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Space>
                  <PhoneOutlined style={{ color: '#1890ff' }} />
                  <Text strong>General Helpline:</Text>
                </Space>
                <br />
                <Text copyable>{contactInfo.phone}</Text>
              </div>

              <div>
                <Space>
                  <PhoneOutlined style={{ color: '#ff4d4f' }} />
                  <Text strong>Emergency Contact:</Text>
                </Space>
                <br />
                <Text copyable>{contactInfo.emergencyContact}</Text>
              </div>

              <Divider />

              <div>
                <Space>
                  <MailOutlined style={{ color: '#52c41a' }} />
                  <Text strong>Email:</Text>
                </Space>
                <br />
                <Text copyable>{contactInfo.email}</Text>
              </div>

              <div>
                <Space>
                  <GlobalOutlined style={{ color: '#722ed1' }} />
                  <Text strong>Website:</Text>
                </Space>
                <br />
                <Text copyable>
                  <a href={contactInfo.website} target="_blank" rel="noopener noreferrer">
                    {contactInfo.website}
                  </a>
                </Text>
              </div>

              <Divider />

              <div>
                <Space>
                  <EnvironmentOutlined style={{ color: '#fa8c16' }} />
                  <Text strong>Address:</Text>
                </Space>
                <br />
                <Text>{contactInfo.address}</Text>
                <br />
                <Text>{contactInfo.city}, {contactInfo.country}</Text>
              </div>

              <div>
                <Space>
                  <ClockCircleOutlined style={{ color: '#13c2c2' }} />
                  <Text strong>Business Hours:</Text>
                </Space>
                <br />
                <Text>{contactInfo.businessHours}</Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};

export default ContactPakQatarModal;