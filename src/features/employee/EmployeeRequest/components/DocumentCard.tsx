import React from 'react';
import { Typography } from 'antd';
import { FileText, Eye, Download } from 'lucide-react';

import { DocumentCard as StyleDocument, SecondaryButton, PrimaryButton } from '../components/styles';

const { Title, Text } = Typography;

interface DocumentCardProps {
    document: any;
    isDarkMode: boolean;
}

const DocumentCard = ({ document, isDarkMode }: DocumentCardProps) => {
    return (
        <StyleDocument isDarkMode={isDarkMode}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: isDarkMode ? '#2a2a2a' : '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FileText size={24} color="#1890ff" />
                    </div>
                    <div>
                        <Title level={5} style={{ margin: 0 }}>{document.name}</Title>
                        <Text type="secondary">{document.type} • {document.size} • {document.uploadDate}</Text>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <SecondaryButton isDarkMode={isDarkMode} icon={<Eye size={16} />}>
                        View
                    </SecondaryButton>
                    <PrimaryButton icon={<Download size={16} />}>
                        Download
                    </PrimaryButton>
                </div>
            </div>
        </StyleDocument>
    );
};

export default DocumentCard;