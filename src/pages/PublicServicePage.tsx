import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Space,
  Tag,
  Typography,
  Avatar,
  Badge,
  Select,
  Input,
  Table,
  Modal,
  Form,
  DatePicker,
  message,
  Drawer,
  Progress,
  Timeline,
  List,
  Tabs,
  Descriptions,
  Rate,
  Alert,
  Steps,
  theme
} from 'antd';
import {
  CustomerServiceOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  StarOutlined,
  TeamOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  CarOutlined,
  BookOutlined,
  ToolOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  BankOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;

interface ServiceRequest {
  id: string;
  title: string;
  type: 'maintenance' | 'medical' | 'transport' | 'education' | 'shopping' | 'legal' | 'other';
  category: string;
  submitter: string;
  phone: string;
  address: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createTime: string;
  updateTime: string;
  assignedTo?: string;
  feedback?: number;
  solution?: string;
  images: string[];
  estimatedTime?: string;
  completedTime?: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  type: 'individual' | 'company';
  services: string[];
  rating: number;
  completedCount: number;
  phone: string;
  address: string;
  certification: string;
  status: 'active' | 'inactive';
  joinDate: string;
  description: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  providerCount: number;
  requestCount: number;
}

const PublicServicePage: React.FC = () => {
  const { token } = useToken();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟服务类别数据
    setCategories([
      {
        id: '1',
        name: '维修服务',
        icon: <ToolOutlined />,
        color: token.colorPrimary,
        description: '家电维修、水电维修、管道疏通等',
        providerCount: 25,
        requestCount: 156
      },
      {
        id: '2',
        name: '医疗服务',
        icon: <MedicineBoxOutlined />,
        color: token.colorSuccess,
        description: '上门医疗、健康咨询、康复护理等',
        providerCount: 18,
        requestCount: 89
      },
      {
        id: '3',
        name: '出行服务',
        icon: <CarOutlined />,
        color: token.colorWarning,
        description: '代驾服务、接送服务、租车服务等',
        providerCount: 32,
        requestCount: 201
      },
      {
        id: '4',
        name: '教育服务',
        icon: <BookOutlined />,
        color: token.colorInfo,
        description: '家教辅导、技能培训、兴趣班等',
        providerCount: 15,
        requestCount: 67
      },
      {
        id: '5',
        name: '购物服务',
        icon: <ShoppingOutlined />,
        color: token.colorError,
        description: '代购服务、配送服务、跑腿服务等',
        providerCount: 28,
        requestCount: 134
      },
      {
        id: '6',
        name: '法律服务',
        icon: <SafetyOutlined />,
        color: '#722ed1',
        description: '法律咨询、合同审查、纠纷调解等',
        providerCount: 12,
        requestCount: 45
      }
    ]);

    // 模拟服务请求数据
    setRequests([
      {
        id: '1',
        title: '空调维修服务',
        type: 'maintenance',
        category: '家电维修',
        submitter: '张晓',
        phone: '13800138001',
        address: '金宇路123号1单元201',
        description: '客厅空调不制冷，需要专业师傅上门检修',
        priority: 'medium',
        status: 'processing',
        createTime: '2025-08-20 09:30:00',
        updateTime: '2025-08-20 14:20:00',
        assignedTo: '李师傅',
        images: [],
        estimatedTime: '2025-08-21 10:00:00'
      },
      {
        id: '2',
        title: '老人健康检查',
        type: 'medical',
        category: '上门医疗',
        submitter: '王明路',
        phone: '13800138002',
        address: '建设路456号2单元302',
        description: '家中老人行动不便，需要医生上门进行常规健康检查',
        priority: 'high',
        status: 'pending',
        createTime: '2025-08-20 15:45:00',
        updateTime: '2025-08-20 15:45:00',
        images: []
      },
      {
        id: '3',
        title: '孩子课后辅导',
        type: 'education',
        category: '家教辅导',
        submitter: '李明',
        phone: '13800138003',
        address: '太白路789号3单元101',
        description: '孩子数学成绩不理想，需要专业老师进行课后辅导',
        priority: 'medium',
        status: 'completed',
        createTime: '2025-08-18 18:00:00',
        updateTime: '2025-08-20 16:30:00',
        assignedTo: '陈老师',
        feedback: 5,
        solution: '已安排陈老师每周三次上门辅导，孩子进步明显',
        completedTime: '2025-08-20 16:30:00',
        images: []
      }
    ]);

    // 模拟服务提供者数据
    setProviders([
      {
        id: '1',
        name: '李师傅家电维修',
        type: 'individual',
        services: ['家电维修', '水电维修', '管道疏通'],
        rating: 4.8,
        completedCount: 156,
        phone: '13800138101',
        address: '任城区维修服务中心',
        certification: '家电维修工程师证',
        status: 'active',
        joinDate: '2023-03-15',
        description: '从事家电维修15年，经验丰富，服务态度好'
      },
      {
        id: '2',
        name: '仁爱医疗服务中心',
        type: 'company',
        services: ['上门医疗', '健康咨询', '康复护理'],
        rating: 4.9,
        completedCount: 89,
        phone: '13800138102',
        address: '任城区医疗服务大厦',
        certification: '医疗服务许可证',
        status: 'active',
        joinDate: '2023-01-10',
        description: '专业医疗团队，提供优质上门医疗服务'
      },
      {
        id: '3',
        name: '陈老师教育工作室',
        type: 'individual',
        services: ['家教辅导', '兴趣培养', '学习规划'],
        rating: 4.7,
        completedCount: 67,
        phone: '13800138103',
        address: '任城区教育培训中心',
        certification: '教师资格证',
        status: 'active',
        joinDate: '2023-05-20',
        description: '资深教师，擅长中小学数学物理辅导'
      }
    ]);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <ToolOutlined />;
      case 'medical': return <MedicineBoxOutlined />;
      case 'transport': return <CarOutlined />;
      case 'education': return <BookOutlined />;
      case 'shopping': return <ShoppingOutlined />;
      case 'legal': return <SafetyOutlined />;
      default: return <CustomerServiceOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return token.colorPrimary;
      case 'medical': return token.colorSuccess;
      case 'transport': return token.colorWarning;
      case 'education': return token.colorInfo;
      case 'shopping': return token.colorError;
      case 'legal': return '#722ed1';
      default: return token.colorTextSecondary;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'maintenance': return '维修服务';
      case 'medical': return '医疗服务';
      case 'transport': return '出行服务';
      case 'education': return '教育服务';
      case 'shopping': return '购物服务';
      case 'legal': return '法律服务';
      default: return '其他服务';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return token.colorError;
      case 'high': return token.colorWarning;
      case 'medium': return token.colorPrimary;
      case 'low': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return token.colorSuccess;
      case 'processing': return token.colorPrimary;
      case 'pending': return token.colorWarning;
      case 'cancelled': return token.colorTextSecondary;
      default: return token.colorTextSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'processing': return '处理中';
      case 'pending': return '待处理';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchText === '' || 
      request.title.toLowerCase().includes(searchText.toLowerCase()) ||
      request.submitter.toLowerCase().includes(searchText.toLowerCase()) ||
      request.phone.includes(searchText);
    const matchesType = selectedType === 'all' || request.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddRequest = () => {
    setEditingRequest(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRequest = (request: ServiceRequest) => {
    setEditingRequest(request);
    form.setFieldsValue({
      ...request,
      createTime: dayjs(request.createTime),
      estimatedTime: request.estimatedTime ? dayjs(request.estimatedTime) : null
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDrawerVisible(true);
  };

  const handleDeleteRequest = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个服务请求吗？删除后将无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        setRequests(requests.filter(request => request.id !== id));
        message.success('删除成功');
      }
    });
  };

  // 统计数据
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const averageRating = requests
    .filter(r => r.feedback)
    .reduce((sum, r) => sum + (r.feedback || 0), 0) / 
    requests.filter(r => r.feedback).length || 0;

  // 图表配置
  const typeChartOption = {
    title: { text: '服务类型分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '请求数量',
      type: 'pie',
      radius: '50%',
      data: Object.entries(
        requests.reduce((acc, request) => {
          acc[getTypeText(request.type)] = (acc[getTypeText(request.type)] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const trendChartOption = {
    title: { text: '服务请求趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '新增请求',
        type: 'line',
        data: [65, 78, 85, 92, 88, 95],
        itemStyle: { color: token.colorPrimary }
      },
      {
        name: '完成请求',
        type: 'line',
        data: [58, 72, 80, 87, 85, 90],
        itemStyle: { color: token.colorSuccess }
      }
    ]
  };

  const columns = [
    {
      title: '服务请求',
      key: 'request',
      render: (record: ServiceRequest) => (
        <Space>
          <Avatar
            size={48}
            style={{
              backgroundColor: getTypeColor(record.type),
              color: 'white'
            }}
            icon={getTypeIcon(record.type)}
          />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{record.title}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {record.category} | {record.submitter}
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              <PhoneOutlined /> {record.phone}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '服务类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
          {getTypeText(type)}
        </Tag>
      ),
      filters: [
        { text: '维修服务', value: 'maintenance' },
        { text: '医疗服务', value: 'medical' },
        { text: '出行服务', value: 'transport' },
        { text: '教育服务', value: 'education' },
        { text: '购物服务', value: 'shopping' },
        { text: '法律服务', value: 'legal' }
      ],
      onFilter: (value: any, record: ServiceRequest) => record.type === value
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
      sorter: (a: ServiceRequest, b: ServiceRequest) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: ServiceRequest) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {record.feedback && (
            <Rate disabled defaultValue={record.feedback} style={{ fontSize: '12px' }} />
          )}
        </Space>
      ),
      filters: [
        { text: '待处理', value: 'pending' },
        { text: '处理中', value: 'processing' },
        { text: '已完成', value: 'completed' },
        { text: '已取消', value: 'cancelled' }
      ],
      onFilter: (value: any, record: ServiceRequest) => record.status === value
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => (
        <div style={{ fontSize: '12px' }}>
          <ClockCircleOutlined style={{ marginRight: '4px' }} />
          {dayjs(time).format('MM-DD HH:mm')}
        </div>
      ),
      sorter: (a: ServiceRequest, b: ServiceRequest) => 
        dayjs(a.createTime).unix() - dayjs(b.createTime).unix()
    },
    {
      title: '负责人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo?: string) => (
        assignedTo ? (
          <Tag color="blue">
            <TeamOutlined /> {assignedTo}
          </Tag>
        ) : (
          <Text type="secondary">未分配</Text>
        )
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ServiceRequest) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRequest(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteRequest(record.id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <Card
        style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <CustomerServiceOutlined style={{ marginRight: '12px' }} />
              便民服务平台
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              整合社区服务资源，为居民提供便捷、高效的生活服务
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddRequest}>
                新建请求
              </Button>
              <Button type="primary" ghost icon={<TeamOutlined />}>
                服务商管理
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="总请求数"
              value={totalRequests}
              suffix="个"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<FileTextOutlined />}
            />
            <Progress percent={Math.round((completedRequests / totalRequests) * 100)} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="已完成"
              value={completedRequests}
              suffix={`/ ${totalRequests}`}
              valueStyle={{ color: token.colorSuccess }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress 
              percent={Math.round((completedRequests / totalRequests) * 100)} 
              size="small" 
              status="active" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="待处理"
              value={pendingRequests}
              suffix="个"
              valueStyle={{ color: token.colorWarning }}
              prefix={<ExclamationCircleOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              需要及时处理
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="平均评分"
              value={averageRating.toFixed(1)}
              suffix="/5.0"
              valueStyle={{ color: token.colorError }}
              prefix={<StarOutlined />}
            />
            <Rate disabled defaultValue={averageRating} style={{ fontSize: '14px' }} />
          </Card>
        </Col>
      </Row>

      {/* 服务类别快捷入口 */}
      <Card title="服务类别" style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col xs={12} sm={8} md={6} lg={4} key={category.id}>
              <Card
                hoverable
                style={{ textAlign: 'center', borderRadius: '8px' }}
                bodyStyle={{ padding: '16px' }}
              >
                <Avatar
                  size={48}
                  style={{ backgroundColor: category.color, marginBottom: '12px' }}
                  icon={category.icon}
                />
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{category.name}</div>
                <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginBottom: '8px' }}>
                  {category.description}
                </div>
                <Space>
                  <Badge count={category.providerCount} style={{ backgroundColor: category.color }} />
                  <span style={{ fontSize: '11px' }}>服务商</span>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><FileTextOutlined />服务请求</span>} key="requests">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索请求标题、申请人、联系电话..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="服务类型"
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部类型</Option>
                    <Option value="maintenance">维修服务</Option>
                    <Option value="medical">医疗服务</Option>
                    <Option value="transport">出行服务</Option>
                    <Option value="education">教育服务</Option>
                    <Option value="shopping">购物服务</Option>
                    <Option value="legal">法律服务</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="状态"
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    style={{ width: 100 }}
                    allowClear
                  >
                    <Option value="all">全部状态</Option>
                    <Option value="pending">待处理</Option>
                    <Option value="processing">处理中</Option>
                    <Option value="completed">已完成</Option>
                    <Option value="cancelled">已取消</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            {/* 请求列表 */}
            <Table
              columns={columns}
              dataSource={filteredRequests}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 1400 }}
            />
          </TabPane>

          <TabPane tab={<span><TeamOutlined />服务商管理</span>} key="providers">
            <Row gutter={[24, 24]}>
              {providers.map((provider) => (
                <Col xs={24} sm={12} lg={8} key={provider.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<PhoneOutlined />}>联系</Button>,
                      <Button type="link" icon={<EditOutlined />}>编辑</Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <Avatar 
                          size={48} 
                          style={{ backgroundColor: token.colorPrimary }} 
                          icon={provider.type === 'company' ? <BankOutlined /> : <TeamOutlined />} 
                        />
                      }
                      title={
                        <Space>
                          {provider.name}
                          <Tag color={provider.status === 'active' ? 'success' : 'default'}>
                            {provider.status === 'active' ? '在线' : '离线'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '8px' }}>
                            {provider.services.map(service => (
                              <Tag key={service}>{service}</Tag>
                            ))}
                          </div>
                          <Space>
                            <Rate disabled defaultValue={provider.rating} style={{ fontSize: '12px' }} />
                            <span>{provider.rating}</span>
                          </Space>
                          <div style={{ marginTop: '4px', fontSize: '12px', color: token.colorTextSecondary }}>
                            完成订单: {provider.completedCount}单
                          </div>
                          <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                            <PhoneOutlined /> {provider.phone}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><StarOutlined />数据分析</span>} key="analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="服务类型分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={typeChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="服务请求趋势" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={trendChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="服务效率统计" style={{ borderRadius: '12px' }}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Statistic title="平均响应时间" value={2.3} suffix="小时" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="平均完成时间" value={1.8} suffix="天" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="客户满意度" value={95.6} suffix="%" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 服务请求详情抽屉 */}
      <Drawer
        title="服务请求详情"
        placement="right"
        width={600}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedRequest && (
          <div>
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Row align="middle">
                <Col flex="1">
                  <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                    {selectedRequest.title}
                  </div>
                  <Space wrap>
                    <Tag color={getTypeColor(selectedRequest.type)} icon={getTypeIcon(selectedRequest.type)}>
                      {getTypeText(selectedRequest.type)}
                    </Tag>
                    <Tag color={getPriorityColor(selectedRequest.priority)}>
                      {getPriorityText(selectedRequest.priority)}优先级
                    </Tag>
                    <Tag color={getStatusColor(selectedRequest.status)}>
                      {getStatusText(selectedRequest.status)}
                    </Tag>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Descriptions column={1} bordered size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="申请人">{selectedRequest.submitter}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedRequest.phone}</Descriptions.Item>
              <Descriptions.Item label="服务地址">{selectedRequest.address}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedRequest.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{selectedRequest.updateTime}</Descriptions.Item>
              {selectedRequest.assignedTo && (
                <Descriptions.Item label="负责人">{selectedRequest.assignedTo}</Descriptions.Item>
              )}
              {selectedRequest.estimatedTime && (
                <Descriptions.Item label="预计完成时间">{selectedRequest.estimatedTime}</Descriptions.Item>
              )}
              {selectedRequest.completedTime && (
                <Descriptions.Item label="实际完成时间">{selectedRequest.completedTime}</Descriptions.Item>
              )}
              <Descriptions.Item label="详细描述">
                {selectedRequest.description}
              </Descriptions.Item>
              {selectedRequest.solution && (
                <Descriptions.Item label="解决方案">
                  {selectedRequest.solution}
                </Descriptions.Item>
              )}
              {selectedRequest.feedback && (
                <Descriptions.Item label="客户评价">
                  <Rate disabled defaultValue={selectedRequest.feedback} />
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedRequest.status === 'completed' && (
              <Alert
                message="服务已完成"
                description="此服务请求已成功完成，感谢您的使用。"
                type="success"
                showIcon
              />
            )}
          </div>
        )}
      </Drawer>

      {/* 新增/编辑请求模态框 */}
      <Modal
        title={editingRequest ? '编辑服务请求' : '新建服务请求'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            const formattedValues = {
              ...values,
              createTime: values.createTime.format('YYYY-MM-DD HH:mm:ss'),
              estimatedTime: values.estimatedTime ? values.estimatedTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
              id: editingRequest?.id || Date.now().toString(),
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              images: editingRequest?.images || []
            };

            if (editingRequest) {
              setRequests(requests.map(request => 
                request.id === editingRequest.id ? { ...request, ...formattedValues } : request
              ));
              message.success('更新成功');
            } else {
              setRequests([...requests, formattedValues as ServiceRequest]);
              message.success('创建成功');
            }
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRequest(null);
          form.resetFields();
        }}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="请求标题" name="title" rules={[{ required: true, message: '请输入请求标题' }]}>
                <Input placeholder="请输入请求标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="服务类型" name="type" rules={[{ required: true, message: '请选择服务类型' }]}>
                <Select placeholder="请选择服务类型">
                  <Option value="maintenance">维修服务</Option>
                  <Option value="medical">医疗服务</Option>
                  <Option value="transport">出行服务</Option>
                  <Option value="education">教育服务</Option>
                  <Option value="shopping">购物服务</Option>
                  <Option value="legal">法律服务</Option>
                  <Option value="other">其他服务</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="申请人" name="submitter" rules={[{ required: true, message: '请输入申请人姓名' }]}>
                <Input placeholder="请输入申请人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="服务分类" name="category" rules={[{ required: true, message: '请输入服务分类' }]}>
                <Input placeholder="请输入具体服务分类" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="服务地址" name="address" rules={[{ required: true, message: '请输入服务地址' }]}>
            <Input placeholder="请输入详细的服务地址" />
          </Form.Item>
          
          <Form.Item label="详细描述" name="description" rules={[{ required: true, message: '请输入详细描述' }]}>
            <Input.TextArea rows={4} placeholder="请详细描述您的服务需求" />
          </Form.Item>

          {editingRequest && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="创建时间" name="createTime">
                    <DatePicker showTime style={{ width: '100%' }} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="预计完成时间" name="estimatedTime">
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="负责人" name="assignedTo">
                    <Input placeholder="请输入负责人" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择状态">
                      <Option value="pending">待处理</Option>
                      <Option value="processing">处理中</Option>
                      <Option value="completed">已完成</Option>
                      <Option value="cancelled">已取消</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PublicServicePage;
