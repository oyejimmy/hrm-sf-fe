// components/EmployeePayslip/components/PayslipFilters.tsx
import React from 'react';
import { Input, Select, Button, Space, Typography } from 'antd';
import { Filter, Search } from 'lucide-react';
import { FilterSection } from './styles';

const { Text } = Typography;
const { Option } = Select;

interface PayslipFiltersProps {
  searchText: string;
  searchYear: string;
  onSearch: (value: string) => void;
  onYearFilter: (value: string) => void;
}

const PayslipFilters: React.FC<PayslipFiltersProps> = ({
  searchText,
  searchYear,
  onSearch,
  onYearFilter,
}) => {
  return (
    <FilterSection>
      <div className="search-section">
        <Input
          placeholder="Search pay periods..."
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: 250 }}
        />
      </div>
      <div className="filter-section">
        <Space>
          <Text>Year:</Text>
          <Select
            defaultValue={searchYear}
            style={{ width: 120 }}
            onChange={onYearFilter}
          >
            <Option value="2023">2023</Option>
            <Option value="2022">2022</Option>
            <Option value="2021">2021</Option>
          </Select>
          <Button icon={<Filter size={14} />}>More Filters</Button>
        </Space>
      </div>
    </FilterSection>
  );
};

export default PayslipFilters;