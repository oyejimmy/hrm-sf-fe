import React from 'react';
import { Empty } from 'antd';
import { StyledCard } from './styles';
import DocumentCard from './DocumentCard';

interface DocumentListProps {
    documents: any[];
    isDarkMode: boolean;
    onViewDocument?: (document: any) => void;
    onDownloadDocument?: (document: any) => void;
}

const DocumentList = ({ documents, isDarkMode, onViewDocument, onDownloadDocument }: DocumentListProps) => {
    const handleView = (document: any) => {
        if (onViewDocument) onViewDocument(document);
        // Mock view action - in real app, this would open the document
        console.log('View document:', document);
    };

    const handleDownload = (document: any) => {
        if (onDownloadDocument) onDownloadDocument(document);
        // Mock download action - in real app, this would download the file
        console.log('Download document:', document);
    };

    return (
        <StyledCard isDarkMode={isDarkMode}>
            {documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {documents.map((document: any) => (
                        <DocumentCard
                            key={document.id}
                            document={document}
                            isDarkMode={isDarkMode}
                            onView={handleView}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            ) : (
                <Empty description="No documents available" imageStyle={{ height: 60 }} />
            )}
        </StyledCard>
    );
};

export default DocumentList;