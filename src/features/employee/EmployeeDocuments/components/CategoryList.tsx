import React, { useMemo } from 'react';
import { List, Typography } from 'antd';
import { FolderOpen, Lock, FileText, Users, FileDigit, History } from 'lucide-react';
import { DocumentCard, CategoryListItem } from '../styles';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Document } from '../mockData';

const { Text } = Typography;

interface CategoryListProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  documents: Document[];
}

const categoryIcons = {
  'All Documents': <FolderOpen size={16} />,
  'Personal': <Lock size={16} />,
  'Employment': <FileText size={16} />,
  'HR': <Users size={16} />,
  'Finance': <FileDigit size={16} />,
  'Training': <History size={16} />
};

export const CategoryList: React.FC<CategoryListProps> = ({ currentCategory, onCategoryChange, documents }) => {
  const { isDarkMode } = useTheme();
  
  const categories = useMemo(() => {
    const categoryCounts = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { name: 'All Documents', count: documents.length, icon: categoryIcons['All Documents'] },
      { name: 'Personal', count: categoryCounts['Personal'] || 0, icon: categoryIcons['Personal'] },
      { name: 'Employment', count: categoryCounts['Employment'] || 0, icon: categoryIcons['Employment'] },
      { name: 'HR', count: categoryCounts['HR'] || 0, icon: categoryIcons['HR'] },
      { name: 'Finance', count: categoryCounts['Finance'] || 0, icon: categoryIcons['Finance'] },
      { name: 'Training', count: categoryCounts['Training'] || 0, icon: categoryIcons['Training'] }
    ];
  }, [documents]);

  return (
    <DocumentCard title="Categories" isDarkMode={isDarkMode}>
      <List
        itemLayout="horizontal"
        dataSource={categories}
        renderItem={(item) => (
          <CategoryListItem
            isActive={currentCategory === item.name}
            isDarkMode={isDarkMode}
            onClick={() => onCategoryChange(item.name)}
          >
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={item.name}
                description={`${item.count} documents`}
              />
            </List.Item>
          </CategoryListItem>
        )}
      />
    </DocumentCard>
  );
};