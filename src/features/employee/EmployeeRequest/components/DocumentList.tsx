import React from 'react';
import { Empty } from 'antd';
import { StyledCard } from './styles';
import DocumentCard from './DocumentCard';

interface DocumentListProps {
    documents: any[];
    isDarkMode: boolean;
}

const DocumentList = ({ documents, isDarkMode }: DocumentListProps) => {
    return (
        <StyledCard isDarkMode={isDarkMode}>
            {documents.length > 0 ? (
                documents.map((document: any) => (
                    <DocumentCard
                        key={document.id}
                        document={document}
                        isDarkMode={isDarkMode}
                    />
                ))
            ) : (
                <Empty description="No documents available" imageStyle={{ height: 60 }} />
            )}
        </StyledCard>
    );
};

export default DocumentList;