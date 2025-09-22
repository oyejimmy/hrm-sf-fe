import React from 'react';
import { Empty, Button } from 'antd';
import { FileText, Eye, Download } from 'lucide-react';

interface DocumentListProps {
    documents: any[];
    isDarkMode: boolean;
    onViewDocument?: (document: any) => void;
    onDownloadDocument?: (document: any) => void;
}

const DocumentList = ({ documents, isDarkMode, onViewDocument, onDownloadDocument }: DocumentListProps) => {
    return (
        <div>
            {documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {documents.map((document: any) => (
                        <div key={document.id} style={{
                            padding: 16,
                            border: `1px solid ${isDarkMode ? '#333' : '#e8e8e8'}`,
                            borderRadius: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FileText size={24} color="#1890ff" />
                                <div>
                                    <div style={{ fontWeight: 500 }}>{document.name}</div>
                                    <div style={{ fontSize: 12, color: '#666' }}>
                                        {document.type} • {document.size} • {document.uploadDate}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Button 
                                    size="small" 
                                    icon={<Eye size={16} />}
                                    onClick={() => onViewDocument?.(document)}
                                >
                                    View
                                </Button>
                                <Button 
                                    type="primary" 
                                    size="small" 
                                    icon={<Download size={16} />}
                                    onClick={() => onDownloadDocument?.(document)}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty description="No documents available" imageStyle={{ height: 60 }} />
            )}
        </div>
    );
};

export default DocumentList;