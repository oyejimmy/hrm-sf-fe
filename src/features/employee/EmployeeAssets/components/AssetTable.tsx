import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Grid } from 'antd';
import {
  Laptop,
  Monitor,
  Package,
  Filter,
  Info,
  PlusCircle,
  Smartphone,
  Headphones,
  Printer,
  Server,
  Search
} from 'lucide-react';
import { Asset, TableProps } from '../types';

const { Option } = Select;
const { useBreakpoint } = Grid;

const AssetTable: React.FC<TableProps> = ({ 
  assetsData, 
  onViewDetails, 
  onRequestAsset, 
  onReturnAsset 
}) => {
  const [filteredData, setFilteredData] = useState<Asset[]>(assetsData);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const screens = useBreakpoint();

  const columns: any[] = [
    {
      title: 'Asset Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Asset, b: Asset) => a.name.localeCompare(b.name),
      responsive: ['md']
    },
    {
      title: 'Type',
      dataIndex: 'asset_type',
      key: 'asset_type',
      render: (type: string) => {
        const iconProps = { size: 16, style: { marginRight: 8 } };
        let icon: React.ReactNode;
        let color: string;
        
        switch (type) {
          case 'Laptop': 
            icon = <Laptop {...iconProps} color="#1890ff" />; 
            color = '#1890ff';
            break;
          case 'Monitor': 
            icon = <Monitor {...iconProps} color="#52c41a" />; 
            color = '#52c41a';
            break;
          case 'Phone': 
            icon = <Smartphone {...iconProps} color="#faad14" />; 
            color = '#faad14';
            break;
          case 'Headphones': 
            icon = <Headphones {...iconProps} color="#722ed1" />; 
            color = '#722ed1';
            break;
          case 'Printer': 
            icon = <Printer {...iconProps} color="#f5222d" />; 
            color = '#f5222d';
            break;
          case 'Server': 
            icon = <Server {...iconProps} color="#13c2c2" />; 
            color = '#13c2c2';
            break;
          default: 
            icon = <Package {...iconProps} color="#8c8c8c" />;
            color = '#8c8c8c';
        }
        return <span style={{ color }}>{icon} {type}</span>;
      },
      filters: [
        { text: 'Laptop', value: 'Laptop' },
        { text: 'Monitor', value: 'Monitor' },
        { text: 'Phone', value: 'Phone' },
        { text: 'Headphones', value: 'Headphones' },
        { text: 'Printer', value: 'Printer' },
      ],
      onFilter: (value: string, record: Asset) => record.asset_type === value,
    },
    {
      title: 'Serial Number',
      dataIndex: 'serial_number',
      key: 'serial_number',
      responsive: ['lg']
    },
    {
      title: 'Assignment Date',
      dataIndex: 'assignment_date',
      key: 'assignment_date',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'Not assigned',
      sorter: (a: Asset, b: Asset) => 
        new Date(a.assignment_date || 0).getTime() - new Date(b.assignment_date || 0).getTime(),
      responsive: ['lg']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color: string;
        switch (status) {
          case 'assigned': color = 'green'; break;
          case 'available': color = 'blue'; break;
          case 'maintenance': color = 'orange'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Assigned', value: 'assigned' },
        { text: 'Available', value: 'available' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: (value: string, record: Asset) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Asset) => (
        <Space size="middle" direction={screens.xs ? "vertical" : "horizontal"}>
          <Button
            icon={<Info size={16} />}
            onClick={() => onViewDetails(record)}
            size={screens.xs ? "small" : "middle"}
          >
            Details
          </Button>
          <Button
            type="primary"
            icon={<PlusCircle size={16} />}
            onClick={() => onRequestAsset(record)}
            size={screens.xs ? "small" : "middle"}
          >
            Request
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    let result = assetsData;

    // Apply search filter
    if (searchText) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(searchText.toLowerCase()) ||
        item.asset_type.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    setFilteredData(result);
  }, [searchText, statusFilter, assetsData]);

  return (
    <Card
      title="Available Assets - Request from Admin"
      extra={
        <Space direction={screens.xs ? "vertical" : "horizontal"} style={screens.xs ? {width: '100%'} : {}}>
          <Input
            placeholder="Search assets..."
            prefix={<Search size={16} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: screens.xs ? '100%' : 200 }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: screens.xs ? '100%' : 150 }}
            allowClear
            onClear={() => setStatusFilter('all')}
          >
            <Option value="all">All Statuses</Option>
            <Option value="assigned">Assigned</Option>
            <Option value="available">Available</Option>
            <Option value="maintenance">Maintenance</Option>
          </Select>
          {!screens.xs && (
            <Button icon={<Filter size={16} />}>
              More Filters
            </Button>
          )}
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 15 }}
        scroll={screens.xs ? { x: true } : undefined}
      />
    </Card>
  );
};

export default AssetTable;