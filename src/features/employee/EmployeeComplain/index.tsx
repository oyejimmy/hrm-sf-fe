import React, { useState } from 'react';
import { Button, message, Spin, Input, Row, Col, Divider } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../contexts/ThemeContext';
import { Wrapper } from '../../../components/Wrapper';
import HeaderComponent from '../../../components/PageHeader';
import { ComplaintStats } from './components/ComplaintStats';
import { ComplaintTable } from './components/ComplaintTable';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintDetails } from './components/ComplaintDetails';
import { fetchComplaints, submitComplaint, Complaint } from './mockData';
import { ComplaintCard } from './styles';

const EmployeeComplain = () => {
  const { isDarkMode } = useTheme();
  const queryClient = useQueryClient();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: fetchComplaints
  });

  const submitMutation = useMutation({
    mutationFn: submitComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      message.success('Complaint submitted successfully!');
      setFormVisible(false);
    },
    onError: () => {
      message.error('Failed to submit complaint');
    }
  });

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDetailsVisible(true);
  };

  const handleSubmitComplaint = (values: any) => {
    submitMutation.mutate(values);
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.subject.toLowerCase().includes(searchText.toLowerCase()) ||
    complaint.type.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Complaint Management"
        subtitle="Submit and track your workplace complaints"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          {title: "Complaint Management",}
        ]}
        extraButtons={[
          <Button
            key="new-complaint"
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={() => setFormVisible(true)}

          >
            Submit New Complaint
          </Button>
        ]}
      />
      
      <div style={{ marginBottom: 16 }}>
        <ComplaintStats complaints={complaints} />
      </div>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <ComplaintCard
            title="My Complaints"
            isDarkMode={isDarkMode}
            extra={
              <Input
                placeholder="Search complaints..."
                prefix={<Search size={16} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%', maxWidth: 250 }}
              />
            }
          >
            <ComplaintTable
              complaints={filteredComplaints}
              onViewComplaint={handleViewComplaint}
            />
            <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
              {searchText
                ? `Search "${searchText}" from ${complaints.length} items showing ${filteredComplaints.length} results`
                : `Showing ${filteredComplaints.length} of ${complaints.length} complaints`
              }
            </div>
          </ComplaintCard>
        </Col>
      </Row>
      
      <ComplaintForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmitComplaint}
        loading={submitMutation.isPending}
      />
      
      <ComplaintDetails
        complaint={selectedComplaint}
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
      />
    </Wrapper>
  );
};

export default EmployeeComplain;