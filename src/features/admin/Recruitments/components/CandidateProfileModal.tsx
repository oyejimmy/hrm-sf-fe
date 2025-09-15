import { Modal, Descriptions, Tag, Button } from "antd";

const CandidateProfileModal = ({ candidate, open, onClose }: any) => {
  if (!candidate) return null;

  return (
    <Modal
      title={`Candidate Profile - ${candidate.name}`}
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
      centered
      width={600}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{candidate.phone}</Descriptions.Item>
        <Descriptions.Item label="Skills">
          {candidate.skills.map((s: any) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Experience">{candidate.experience}</Descriptions.Item>
        <Descriptions.Item label="Status">{candidate.status}</Descriptions.Item>
        {candidate.coverLetter && (
          <Descriptions.Item label="Cover Letter">
            {candidate.coverLetter}
          </Descriptions.Item>
        )}
        {candidate.resumeUrl && (
          <Descriptions.Item label="Resume">
            <a href={candidate.resumeUrl} target="_blank" rel="noreferrer">
              Download Resume
            </a>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default CandidateProfileModal;
