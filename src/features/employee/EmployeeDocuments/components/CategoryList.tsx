import React from 'react';
import { List, Typography } from 'antd';
import { FolderOpen, Lock, FileText, Users, FileDigit, History } from 'lucide-react';
import { DocumentCard, CategoryListItem } from '../styles';
import { useTheme } from '../../../../contexts/ThemeContext';

const { Text } = Typography;

interface CategoryListProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { name: 'All Documents', count: 28, icon: <FolderOpen size={16} /> },
  { name: 'Personal', count: 5, icon: <Lock size={16} /> },
  { name: 'Employment', count: 3, icon: <FileText size={16} /> },
  { name: 'HR', count: 7, icon: <Users size={16} /> },
  { name: 'Finance', count: 4, icon: <FileDigit size={16} /> },
  { name: 'Training', count: 6, icon: <History size={16} /> }
];

export const CategoryList: React.FC<CategoryListProps> = ({ currentCategory, onCategoryChange }) => {
  const { isDarkMode } = useTheme();

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