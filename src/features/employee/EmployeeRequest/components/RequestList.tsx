// components/RequestList.tsx
import { Empty } from 'antd';
import { StyledCard } from './styles';
import RequestCard from './RequestCard';

interface RequestListProps {
  title: string;
  requests: any[];
  icon: React.ReactNode;
  emptyText: string;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, comments: string) => void;
  userRole: string;
  isDarkMode: boolean;
}

const RequestList = ({
  title,
  requests,
  icon,
  emptyText,
  onApprove,
  onReject,
  userRole,
  isDarkMode
}: RequestListProps) => {
  return (
    <StyledCard 
      title={<span>{icon} {title}</span>} 
      isDarkMode={isDarkMode}
    >
      {requests.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
          padding: '16px 0'
        }}>
          {requests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onApprove={onApprove}
              onReject={onReject}
              userRole={userRole}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      ) : (
        <Empty description={emptyText} imageStyle={{ height: 60 }} />
      )}
    </StyledCard>
  );
};

export default RequestList;