import React from 'react';
import { Input, Select, Space, Typography } from 'antd';
import { Search, Calendar } from 'lucide-react';

const { Option } = Select;
const { Text } = Typography;

interface PayslipFiltersProps {
  searchText: string;
  searchYear: string;
  onSearch: (value: string) => void;
  onYearFilter: (value: string) => void;
  onStatusFilter?: (value: string) => void;
}

const PayslipFilters: React.FC<PayslipFiltersProps> = ({
  searchText,
  searchYear,
  onSearch,
  onYearFilter,
  onStatusFilter,
}) => {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <Space wrap size={12}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>FILTERS:</Text>
        </div>
        
        <Select
          placeholder="Year"
          value={searchYear}
          style={{ width: 100 }}
          onChange={onYearFilter}
          suffixIcon={<Calendar size={14} color="#999" />}
        >
          <Option value="2024">2024</Option>
          <Option value="2023">2023</Option>
          <Option value="2022">2022</Option>
        </Select>
        
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 120 }}
          onChange={onStatusFilter}
        >
          <Option value="generated">Generated</Option>
          <Option value="approved">Approved</Option>
          <Option value="paid">Paid</Option>
        </Select>
      </Space>
      
      <Input
        placeholder="Search by payslip number or period..."
        prefix={<Search size={16} color="#999" />}
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
        allowClear
        style={{ width: 280 }}
      />
    </div>
  );
};

export default PayslipFilters;