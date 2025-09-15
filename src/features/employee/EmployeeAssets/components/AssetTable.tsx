import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Grid } from 'antd';
import {
  Laptop,
  Monitor,
  Package,
  Filter,
  Info,
  PlusCircle,
  MinusCircle,
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
      dataIndex: 'type',
      key: 'type',
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
      onFilter: (value: string, record: Asset) => record.type === value,
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      responsive: ['lg']
    },
    {
      title: 'Assignment Date',
      dataIndex: 'assignmentDate',
      key: 'assignmentDate',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'Not assigned',
      sorter: (a: Asset, b: Asset) => 
        new Date(a.assignmentDate || 0).getTime() - new Date(b.assignmentDate || 0).getTime(),
      responsive: ['lg']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color: string;
        switch (status) {
          case 'Assigned': color = 'green'; break;
          case 'Available': color = 'blue'; break;
          case 'Maintenance': color = 'orange'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Assigned', value: 'Assigned' },
        { text: 'Available', value: 'Available' },
        { text: 'Maintenance', value: 'Maintenance' },
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
          {record.status === 'Available' && (
            <Button
              type="primary"
              icon={<PlusCircle size={16} />}
              onClick={() => onRequestAsset(record)}
              size={screens.xs ? "small" : "middle"}
            >
              Request
            </Button>
          )}
          {record.status === 'Assigned' && record.custodian === 'John Smith' && (
            <Button
              danger
              icon={<MinusCircle size={16} />}
              onClick={() => onReturnAsset(record)}
              size={screens.xs ? "small" : "middle"}
            >
              Return
            </Button>
          )}
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
        item.serialNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.type.toLowerCase().includes(searchText.toLowerCase())
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
      title="Asset Inventory"
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
            <Option value="Assigned">Assigned</Option>
            <Option value="Available">Available</Option>
            <Option value="Maintenance">Maintenance</Option>
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
        pagination={{ pageSize: 5 }}
        scroll={screens.xs ? { x: true } : undefined}
      />
    </Card>
  );
};

export default AssetTable;