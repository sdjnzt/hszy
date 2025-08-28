import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Space, Typography, Button } from 'antd';
import { AppstoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getGridUnits, GridUnit } from './data';

const { Title, Text } = Typography;

const GridUnitsPage: React.FC = () => {
  const [units, setUnits] = useState<GridUnit[]>([]);

  useEffect(() => {
    setUnits(getGridUnits());
  }, []);

  const columns = [
    { title: '网格名称', dataIndex: 'name', key: 'name' },
    { title: '网格代码', dataIndex: 'code', key: 'code' },
    { title: '面积(㎡)', dataIndex: 'area', key: 'area', render: (v: number) => v.toLocaleString() },
    { title: '人口', dataIndex: 'population', key: 'population' },
    { title: '户数', dataIndex: 'households', key: 'households' },
    { title: '建筑数', dataIndex: 'buildings', key: 'buildings' },
    { title: '网格员', dataIndex: 'manager', key: 'manager' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: GridUnit['status']) => (
        <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange'}>
          {status === 'active' ? '正常' : status === 'inactive' ? '停用' : '维护中'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}><AppstoreOutlined style={{ marginRight: 8 }} />网格单元</Title>
        <Text type="secondary">统一划分网格，管理人地物情事组织</Text>
      </div>
      <Card title="网格清单">
        <Table rowKey="id" columns={columns} dataSource={units} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default GridUnitsPage;


