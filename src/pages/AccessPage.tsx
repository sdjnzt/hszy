import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Tabs,
  Badge,
  Tooltip,
  Popconfirm,
  Dropdown
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  SyncOutlined,
  DownloadOutlined,
  KeyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DownOutlined
} from '@ant-design/icons';
import { accessCards, accessRecords } from '../data/mockData';
import type { AccessCard, AccessRecord } from '../data/mockData';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const AccessPage: React.FC = () => {
  // 状态管理
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<AccessCard | null>(null);
  const [cardSearchText, setCardSearchText] = useState('');
  const [recordSearchText, setRecordSearchText] = useState('');
  const [form] = Form.useForm();

  // 门禁卡表格列定义
  const cardColumns = [
    {
      title: '卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      render: (text: string) => (
        <Space>
          <KeyOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '持卡人',
      dataIndex: 'holder',
      key: 'holder',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '卡类型',
      dataIndex: 'cardType',
      key: 'cardType',
      render: (type: string) => {
        const colors = {
          '员工卡': 'blue',
          '访客卡': 'green',
          '临时卡': 'orange'
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, "success" | "warning" | "error" | "default"> = {
          '正常': 'success',
          '挂失': 'warning',
          '注销': 'error',
          '过期': 'default'
        };
        return <Badge status={colors[status as keyof typeof colors]} text={status} />;
      },
    },
    {
      title: '最后使用时间',
      dataIndex: 'lastAccessTime',
      key: 'lastAccessTime',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '最后使用地点',
      dataIndex: 'lastAccessLocation',
      key: 'lastAccessLocation',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AccessCard) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要注销此门禁卡吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              注销
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 门禁记录表格列定义
  const recordColumns = [
    {
      title: '时间',
      dataIndex: 'accessTime',
      key: 'accessTime',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      render: (text: string) => (
        <Space>
          <KeyOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '持卡人',
      dataIndex: 'cardHolder',
      key: 'cardHolder',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: string) => {
        const color = direction === '进' ? 'green' : 'blue';
        return <Tag color={color}>{direction}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, "success" | "warning" | "error"> = {
          '正常': 'success',
          '异常': 'error',
          '被拒绝': 'warning'
        };
        return <Badge status={colors[status as keyof typeof colors]} text={status} />;
      },
    },
    {
      title: '体温',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (temp: number) => (
        <Tooltip title={temp > 37.3 ? '体温异常' : '体温正常'}>
          <Tag color={temp > 37.3 ? 'red' : 'green'}>{temp.toFixed(1)}°C</Tag>
        </Tooltip>
      ),
    },
  ];

  // 处理门禁卡编辑
  const handleEdit = (record: AccessCard) => {
    setSelectedCard(record);
    form.setFieldsValue({
      ...record,
      expireDate: dayjs(record.expireDate)
    });
    setCardModalVisible(true);
  };

  // 处理门禁卡删除
  const handleDelete = (record: AccessCard) => {
    // 在实际应用中这里会调用API
    const updatedCards = accessCards.filter(card => card.id !== record.id);
    // 更新本地数据
    accessCards.length = 0;
    accessCards.push(...updatedCards);
    message.success('门禁卡已注销');
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        expireDate: values.expireDate.format('YYYY-MM-DD'),
        lastAccessTime: selectedCard?.lastAccessTime || '-',
        lastAccessLocation: selectedCard?.lastAccessLocation || '-'
      };

      if (selectedCard) {
        // 编辑模式
        const index = accessCards.findIndex(card => card.id === selectedCard.id);
        if (index !== -1) {
          accessCards[index] = {
            ...accessCards[index],
            ...formData
          };
          message.success('门禁卡信息已更新');
        }
      } else {
        // 新增模式
        const newCard: AccessCard = {
          id: `card${accessCards.length + 1}`,
          cardNo: `AC${String(accessCards.length + 1).padStart(6, '0')}`,
          ...formData,
          issueDate: dayjs().format('YYYY-MM-DD')
        };
        accessCards.push(newCard);
        message.success('新门禁卡已创建');
      }
      setCardModalVisible(false);
      form.resetFields();
      setSelectedCard(null);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

      // 导出数据
  const handleExport = () => {
    try {
      type ExportData = {
        [key: string]: string;
      };

      const data: ExportData[] = accessCards.map(card => ({
        '卡号': card.cardNo,
        '持卡人': card.holder,
        '卡类型': card.cardType,
        '部门': card.department,
        '状态': card.status,
        '发卡日期': card.issueDate,
        '到期日期': card.expireDate,
        '最后使用时间': card.lastAccessTime || '-',
        '最后使用地点': card.lastAccessLocation || '-'
      }));

      // 创建CSV内容
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      // 创建Blob并下载
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `门禁卡数据_${dayjs().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('数据导出成功');
    } catch (error) {
      message.error('导出失败，请重试');
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    // 在实际应用中这里会重新调用API获取数据
    message.success('数据已刷新');
  };

  // 导出门禁记录数据
  const handleExportRecords = () => {
    try {
      type ExportData = {
        [key: string]: string;
      };

      const data: ExportData[] = accessRecords.map(record => ({
        '时间': record.accessTime,
        '卡号': record.cardNo,
        '持卡人': record.cardHolder,
        '位置': record.location,
        '方向': record.direction,
        '状态': record.status,
        '体温': record.temperature ? `${record.temperature.toFixed(1)}°C` : '-'
      }));

      // 创建CSV内容
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      // 创建Blob并下载
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `门禁记录_${dayjs().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('记录导出成功');
    } catch (error) {
      message.error('导出失败，请重试');
    }
  };

  // 批量操作
  const handleBatchOperation = (operation: string) => {
    Modal.confirm({
      title: `确认${operation}`,
      content: '是否确认执行此操作？',
      onOk() {
        message.success(`${operation}操作已完成`);
      }
    });
  };

  // 过滤门禁卡数据
  const filteredCards = accessCards.filter(card => 
    card.cardNo.toLowerCase().includes(cardSearchText.toLowerCase()) ||
    card.holder.toLowerCase().includes(cardSearchText.toLowerCase()) ||
    card.department.toLowerCase().includes(cardSearchText.toLowerCase())
  );

  // 过滤门禁记录数据
  const filteredRecords = accessRecords.filter(record =>
    record.cardNo.toLowerCase().includes(recordSearchText.toLowerCase()) ||
    record.cardHolder.toLowerCase().includes(recordSearchText.toLowerCase()) ||
    record.location.toLowerCase().includes(recordSearchText.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <KeyOutlined />
                门禁卡管理
              </span>
            }
            key="1"
          >
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col flex="auto">
                  <Space>
                    <Input
                      placeholder="搜索卡号/持卡人/部门"
                      prefix={<SearchOutlined />}
                      onChange={e => setCardSearchText(e.target.value)}
                      style={{ width: 250 }}
                      allowClear
                    />
                    <Select
                      placeholder="卡片类型"
                      style={{ width: 120 }}
                      allowClear
                    >
                      <Select.Option value="员工卡">员工卡</Select.Option>
                      <Select.Option value="访客卡">访客卡</Select.Option>
                      <Select.Option value="临时卡">临时卡</Select.Option>
                    </Select>
                    <Select
                      placeholder="使用状态"
                      style={{ width: 120 }}
                      allowClear
                    >
                      <Select.Option value="正常">正常</Select.Option>
                      <Select.Option value="挂失">挂失</Select.Option>
                      <Select.Option value="注销">注销</Select.Option>
                      <Select.Option value="过期">过期</Select.Option>
                    </Select>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setSelectedCard(null);
                        form.resetFields();
                        setCardModalVisible(true);
                      }}
                    >
                      新增门禁卡
                    </Button>
                    <Dropdown menu={{
                      items: [
                        {
                          key: '1',
                          label: '批量启用',
                          onClick: () => handleBatchOperation('批量启用')
                        },
                        {
                          key: '2',
                          label: '批量停用',
                          onClick: () => handleBatchOperation('批量停用')
                        },
                        {
                          key: '3',
                          label: '批量删除',
                          onClick: () => handleBatchOperation('批量删除')
                        }
                      ]
                    }}>
                      <Button>
                        批量操作 <DownOutlined />
                      </Button>
                    </Dropdown>
                    <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                      刷新
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                      导出
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>
            <Table
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => {
                  console.log('selected', selectedRowKeys);
                }
              }}
              columns={cardColumns}
              dataSource={filteredCards}
              rowKey="id"
              pagination={{
                total: filteredCards.length,
                pageSize: 10,
                showTotal: total => `共 ${total} 条记录`,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                门禁记录
              </span>
            }
            key="2"
          >
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col>
                  <RangePicker 
                    showTime 
                    style={{ width: 380 }} 
                    onChange={(dates) => {
                      if (dates) {
                        // 在实际应用中这里会根据时间范围筛选数据
                        console.log('Selected Time:', dates);
                      }
                    }}
                  />
                </Col>
                <Col flex="auto">
                  <Space>
                    <Input
                      placeholder="搜索卡号/持卡人/位置"
                      prefix={<SearchOutlined />}
                      onChange={e => setRecordSearchText(e.target.value)}
                      style={{ width: 250 }}
                      allowClear
                    />
                    <Select
                      placeholder="进出方向"
                      style={{ width: 120 }}
                      allowClear
                    >
                      <Select.Option value="进">进</Select.Option>
                      <Select.Option value="出">出</Select.Option>
                    </Select>
                    <Select
                      placeholder="记录状态"
                      style={{ width: 120 }}
                      allowClear
                    >
                      <Select.Option value="正常">正常</Select.Option>
                      <Select.Option value="异常">异常</Select.Option>
                      <Select.Option value="被拒绝">被拒绝</Select.Option>
                    </Select>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                      刷新
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleExportRecords}>
                      导出
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>
            <Table
              columns={recordColumns}
              dataSource={filteredRecords}
              rowKey="id"
              pagination={{
                total: filteredRecords.length,
                pageSize: 10,
                showTotal: total => `共 ${total} 条记录`,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 门禁卡表单模态框 */}
      <Modal
        title={selectedCard ? '编辑门禁卡' : '新增门禁卡'}
        visible={cardModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setCardModalVisible(false);
          form.resetFields();
          setSelectedCard(null);
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: '正常',
            cardType: '员工卡'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cardNo"
                label="卡号"
                rules={[{ required: true, message: '请输入卡号' }]}
              >
                <Input placeholder="请输入卡号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cardType"
                label="卡类型"
                rules={[{ required: true, message: '请选择卡类型' }]}
              >
                <Select>
                  <Select.Option value="员工卡">员工卡</Select.Option>
                  <Select.Option value="访客卡">访客卡</Select.Option>
                  <Select.Option value="临时卡">临时卡</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="holder"
                label="持卡人"
                rules={[{ required: true, message: '请输入持卡人姓名' }]}
              >
                <Input placeholder="请输入持卡人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select>
                  <Select.Option value="采掘部">采掘部</Select.Option>
                  <Select.Option value="机电部">机电部</Select.Option>
                  <Select.Option value="安全部">安全部</Select.Option>
                  <Select.Option value="综合部">综合部</Select.Option>
                  <Select.Option value="运输部">运输部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Select.Option value="正常">正常</Select.Option>
                  <Select.Option value="挂失">挂失</Select.Option>
                  <Select.Option value="注销">注销</Select.Option>
                  <Select.Option value="过期">过期</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expireDate"
                label="有效期至"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AccessPage; 