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
  Alert,
  Upload,
  TimePicker,
  Checkbox,
  theme
} from 'antd';
import {
  SafetyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  TeamOutlined,
  CameraOutlined,
  ScanOutlined,
  GroupOutlined,
  UserOutlined,
  CalendarOutlined,
  BellOutlined,
  FlagOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  CarOutlined,
  ToolOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface PatrolRoute {
  id: string;
  name: string;
  type: 'safety' | 'sanitation' | 'maintenance' | 'security' | 'general';
  area: string;
  checkpoints: PatrolCheckpoint[];
  estimatedTime: number; // 分钟
  frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
  status: 'active' | 'inactive' | 'maintenance';
  description: string;
  priority: 'low' | 'medium' | 'high';
  createTime: string;
  lastPatrol?: string;
  totalPatrols: number;
}

interface PatrolCheckpoint {
  id: string;
  name: string;
  location: string;
  type: 'scan' | 'photo' | 'check' | 'report';
  required: boolean;
  description: string;
  order: number;
}

interface PatrolTask {
  id: string;
  routeId: string;
  routeName: string;
  patrolPerson: string;
  patrolPersonId: string;
  scheduledDate: string;
  scheduledTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
  checkpointResults: CheckpointResult[];
  issues: PatrolIssue[];
  totalCheckpoints: number;
  completedCheckpoints: number;
  notes?: string;
  weather?: string;
  temperature?: number;
}

interface CheckpointResult {
  checkpointId: string;
  checkpointName: string;
  status: 'completed' | 'skipped' | 'failed';
  checkTime?: string;
  photos: string[];
  notes?: string;
  issues?: string[];
}

interface PatrolIssue {
  id: string;
  type: 'safety' | 'sanitation' | 'equipment' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  photos: string[];
  reportTime: string;
  status: 'reported' | 'assigned' | 'in-progress' | 'resolved';
  assignedTo?: string;
  resolvedTime?: string;
  solution?: string;
}

interface PatrolPerson {
  id: string;
  name: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'busy';
  totalPatrols: number;
  completionRate: number;
  avgRating: number;
  certifications: string[];
  joinDate: string;
}

const PatrolManagementPage: React.FC = () => {
  const { token } = useToken();
  const [routes, setRoutes] = useState<PatrolRoute[]>([]);
  const [tasks, setTasks] = useState<PatrolTask[]>([]);
  const [issues, setIssues] = useState<PatrolIssue[]>([]);
  const [patrolPersons, setPatrolPersons] = useState<PatrolPerson[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟巡查路线数据
    setRoutes([
      {
        id: '1',
        name: '社区安全巡查路线',
        type: 'safety',
        area: 'A区',
        checkpoints: [
          { id: '1', name: '主入口', location: '社区大门', type: 'scan', required: true, description: '检查门禁系统', order: 1 },
          { id: '2', name: '消防通道', location: '1号楼旁', type: 'photo', required: true, description: '确保通道畅通', order: 2 },
          { id: '3', name: '监控室', location: '物业办公楼', type: 'check', required: true, description: '检查监控设备', order: 3 }
        ],
        estimatedTime: 45,
        frequency: 'daily',
        status: 'active',
        description: '每日社区安全隐患排查',
        priority: 'high',
        createTime: '2025-08-01',
        lastPatrol: '2025-08-20',
        totalPatrols: 156
      },
      {
        id: '2',
        name: '环境卫生检查路线',
        type: 'sanitation',
        area: 'B区',
        checkpoints: [
          { id: '4', name: '垃圾分类点', location: 'B区中心', type: 'photo', required: true, description: '检查垃圾分类情况', order: 1 },
          { id: '5', name: '绿化带', location: 'B区花园', type: 'check', required: true, description: '检查绿化维护', order: 2 }
        ],
        estimatedTime: 30,
        frequency: 'daily',
        status: 'active',
        description: '环境卫生日常检查',
        priority: 'medium',
        createTime: '2025-08-01',
        lastPatrol: '2025-08-19',
        totalPatrols: 89
      }
    ]);

    // 模拟巡查任务数据
    setTasks([
      {
        id: '1',
        routeId: '1',
        routeName: '社区安全巡查路线',
        patrolPerson: '李湘湘',
        patrolPersonId: '1',
        scheduledDate: '2025-08-21',
        scheduledTime: '09:00',
        actualStartTime: '09:05',
        actualEndTime: '09:50',
        status: 'completed',
        checkpointResults: [
          { checkpointId: '1', checkpointName: '主入口', status: 'completed', checkTime: '09:05', photos: [], notes: '门禁系统正常' },
          { checkpointId: '2', checkpointName: '消防通道', status: 'completed', checkTime: '09:25', photos: [], notes: '通道畅通' },
          { checkpointId: '3', checkpointName: '监控室', status: 'completed', checkTime: '09:45', photos: [], notes: '设备运行正常' }
        ],
        issues: [],
        totalCheckpoints: 3,
        completedCheckpoints: 3,
        notes: '巡查正常完成',
        weather: '晴',
        temperature: 18
      },
      {
        id: '2',
        routeId: '2',
        routeName: '环境卫生检查路线',
        patrolPerson: '王梦溪',
        patrolPersonId: '2',
        scheduledDate: '2025-08-21',
        scheduledTime: '14:00',
        status: 'scheduled',
        checkpointResults: [],
        issues: [],
        totalCheckpoints: 2,
        completedCheckpoints: 0
      }
    ]);

    // 模拟巡查人员数据
    setPatrolPersons([
      {
        id: '1',
        name: '李湘湘',
        phone: '13800138001',
        department: '保安部',
        position: '安保队长',
        status: 'active',
        totalPatrols: 156,
        completionRate: 98.5,
        avgRating: 4.8,
        certifications: ['安保资格证', '消防证'],
        joinDate: '2023-03-15'
      },
      {
        id: '2',
        name: '王梦溪',
        phone: '13800138002',
        department: '物业部',
        position: '保洁主管',
        status: 'active',
        totalPatrols: 89,
        completionRate: 96.8,
        avgRating: 4.6,
        certifications: ['保洁资格证'],
        joinDate: '2023-05-20'
      }
    ]);

    // 模拟问题数据
    setIssues([
      {
        id: '1',
        type: 'safety',
        severity: 'medium',
        description: '楼梯扶手松动',
        location: '3号楼2层',
        photos: [],
        reportTime: '2025-08-20 14:30:00',
        status: 'assigned',
        assignedTo: '维修部-王师傅'
      },
      {
        id: '2',
        type: 'sanitation',
        severity: 'low',
        description: '垃圾桶满溢',
        location: 'B区垃圾站',
        photos: [],
        reportTime: '2025-08-20 16:45:00',
        status: 'resolved',
        assignedTo: '保洁部-赵阿姨',
        resolvedTime: '2025-08-20 17:30:00',
        solution: '已清理垃圾并消毒'
      }
    ]);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safety': return <SafetyOutlined />;
      case 'sanitation': return <ToolOutlined />;
      case 'maintenance': return <ToolOutlined />;
      case 'security': return <SafetyOutlined />;
      default: return <ScanOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safety': return token.colorError;
      case 'sanitation': return token.colorSuccess;
      case 'maintenance': return token.colorWarning;
      case 'security': return token.colorPrimary;
      default: return token.colorTextSecondary;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'safety': return '安全巡查';
      case 'sanitation': return '卫生检查';
      case 'maintenance': return '设备维护';
      case 'security': return '治安巡逻';
      default: return '常规巡查';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return token.colorSuccess;
      case 'in-progress': return token.colorPrimary;
      case 'scheduled': return token.colorWarning;
      case 'overdue': return token.colorError;
      case 'cancelled': return token.colorTextSecondary;
      default: return token.colorTextSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'in-progress': return '进行中';
      case 'scheduled': return '已安排';
      case 'overdue': return '已超时';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return token.colorError;
      case 'high': return token.colorWarning;
      case 'medium': return token.colorPrimary;
      case 'low': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return '严重';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return severity;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchText === '' || 
      task.routeName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.patrolPerson.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddTask = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTask = (task: PatrolTask) => {
    setEditingItem(task);
    form.setFieldsValue({
      ...task,
      scheduledDateTime: dayjs(`${task.scheduledDate} ${task.scheduledTime}`)
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (task: PatrolTask) => {
    setSelectedItem(task);
    setIsDrawerVisible(true);
  };

  // 统计数据
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasksCount = tasks.filter(t => t.status === 'overdue').length;
  const totalIssues = issues.length;
  const unresolvedIssues = issues.filter(i => i.status !== 'resolved').length;

  // 图表配置
  const taskStatusChartOption = {
    title: { text: '巡查任务状态分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '任务数量',
      type: 'pie',
      radius: '50%',
      data: Object.entries(
        tasks.reduce((acc, task) => {
          acc[getStatusText(task.status)] = (acc[getStatusText(task.status)] || 0) + 1;
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

  const issueTypeChartOption = {
    title: { text: '问题类型统计', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['安全问题', '卫生问题', '设备问题', '其他问题']
    },
    yAxis: { type: 'value' },
    series: [{
      name: '问题数量',
      type: 'bar',
      data: [3, 5, 2, 1],
      itemStyle: { color: token.colorPrimary }
    }]
  };

  const taskColumns = [
    {
      title: '巡查任务',
      key: 'task',
      render: (record: PatrolTask) => (
        <Space>
          <Avatar
            size={48}
            style={{
              backgroundColor: getTypeColor('safety'),
              color: 'white'
            }}
            icon={<ScanOutlined />}
          />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{record.routeName}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              巡查员: {record.patrolPerson}
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              计划时间: {record.scheduledDate} {record.scheduledTime}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: PatrolTask) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {record.status === 'completed' && (
            <div style={{ fontSize: '12px' }}>
              完成度: {Math.round((record.completedCheckpoints / record.totalCheckpoints) * 100)}%
            </div>
          )}
        </Space>
      ),
      filters: [
        { text: '已安排', value: 'scheduled' },
        { text: '进行中', value: 'in-progress' },
        { text: '已完成', value: 'completed' },
        { text: '已超时', value: 'overdue' },
        { text: '已取消', value: 'cancelled' }
      ],
      onFilter: (value: any, record: PatrolTask) => record.status === value
    },
    {
      title: '进度',
      key: 'progress',
      render: (record: PatrolTask) => (
        <div>
          <Progress 
            percent={Math.round((record.completedCheckpoints / record.totalCheckpoints) * 100)} 
            size="small" 
          />
          <div style={{ fontSize: '12px', textAlign: 'center' }}>
            {record.completedCheckpoints}/{record.totalCheckpoints} 检查点
          </div>
        </div>
      )
    },
    {
      title: '时间信息',
      key: 'time',
      render: (record: PatrolTask) => (
        <div style={{ fontSize: '12px' }}>
          {record.actualStartTime && (
            <div><ClockCircleOutlined /> 开始: {record.actualStartTime}</div>
          )}
          {record.actualEndTime && (
            <div><CheckCircleOutlined /> 结束: {record.actualEndTime}</div>
          )}
          {!record.actualStartTime && (
            <div style={{ color: token.colorWarning }}>
              <CalendarOutlined /> 计划: {record.scheduledDate} {record.scheduledTime}
            </div>
          )}
        </div>
      )
    },
    {
      title: '问题',
      key: 'issues',
      render: (record: PatrolTask) => (
        <div>
          {record.issues.length > 0 ? (
            <Badge count={record.issues.length} style={{ backgroundColor: token.colorError }}>
              <Button type="text" icon={<WarningOutlined />} size="small">
                发现问题
              </Button>
            </Badge>
          ) : (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              无问题
            </Tag>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PatrolTask) => (
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
            onClick={() => handleEditTask(record)}
          />
          {record.status === 'scheduled' && (
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                Modal.confirm({
                  title: '确认取消',
                  content: '确定要取消这个巡查任务吗？',
                  onOk: () => {
                    setTasks(tasks.map(t => 
                      t.id === record.id ? { ...t, status: 'cancelled' } : t
                    ));
                    message.success('任务已取消');
                  }
                });
              }}
            />
          )}
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
          background: 'linear-gradient(135deg, #ff9a56 0%, #ffad56 100%)',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <ScanOutlined style={{ marginRight: '12px' }} />
              巡查管理系统
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              智能巡查路线规划，实时任务跟踪，问题快速响应处理
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddTask}>
                新建任务
              </Button>
              <Button type="primary" ghost icon={<GroupOutlined />}>
                路线管理
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
              title="总任务数"
              value={totalTasks}
              suffix="个"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<FileTextOutlined />}
            />
            <Progress percent={Math.round((completedTasks / totalTasks) * 100)} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="已完成"
              value={completedTasks}
              suffix={`/ ${totalTasks}`}
              valueStyle={{ color: token.colorSuccess }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress 
              percent={Math.round((completedTasks / totalTasks) * 100)} 
              size="small" 
              status="active" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="进行中"
              value={inProgressTasks}
              suffix="个"
              valueStyle={{ color: token.colorWarning }}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              超时任务: {overdueTasksCount}个
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="待处理问题"
              value={unresolvedIssues}
              suffix={`/ ${totalIssues}`}
              valueStyle={{ color: token.colorError }}
              prefix={<WarningOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              需要关注
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><FileTextOutlined />巡查任务</span>} key="tasks">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索路线名称、巡查员..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
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
                    <Option value="scheduled">已安排</Option>
                    <Option value="in-progress">进行中</Option>
                    <Option value="completed">已完成</Option>
                    <Option value="overdue">已超时</Option>
                    <Option value="cancelled">已取消</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            {/* 任务列表 */}
            <Table
              columns={taskColumns}
              dataSource={filteredTasks}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>

          <TabPane tab={<span><GroupOutlined />巡查路线</span>} key="routes">
            <Row gutter={[24, 24]}>
              {routes.map((route) => (
                <Col xs={24} sm={12} lg={8} key={route.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<EditOutlined />}>编辑</Button>,
                      <Button type="link" icon={<PlusOutlined />}>创建任务</Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <Avatar 
                          size={48} 
                          style={{ backgroundColor: getTypeColor(route.type) }} 
                          icon={getTypeIcon(route.type)} 
                        />
                      }
                      title={
                        <Space>
                          {route.name}
                          <Tag color={route.status === 'active' ? 'success' : 'default'}>
                            {route.status === 'active' ? '启用' : '停用'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Tag color={getTypeColor(route.type)}>
                            {getTypeText(route.type)}
                          </Tag>
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            <div><EnvironmentOutlined /> {route.area}</div>
                            <div><ClockCircleOutlined /> 预计{route.estimatedTime}分钟</div>
                            <div><ScanOutlined /> {route.checkpoints.length}个检查点</div>
                            <div>总巡查: {route.totalPatrols}次</div>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><WarningOutlined />问题管理</span>} key="issues">
            <List
              dataSource={issues}
              renderItem={(issue) => (
                <List.Item>
                  <Card style={{ width: '100%' }}>
                    <Row align="middle">
                      <Col flex="1">
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                          {issue.description}
                        </div>
                        <Space wrap>
                          <Tag color={getSeverityColor(issue.severity)}>
                            {getSeverityText(issue.severity)}严重程度
                          </Tag>
                          <Tag color={issue.status === 'resolved' ? 'success' : 
                                     issue.status === 'in-progress' ? 'processing' : 
                                     issue.status === 'assigned' ? 'warning' : 'default'}>
                            {issue.status === 'resolved' ? '已解决' : 
                             issue.status === 'in-progress' ? '处理中' : 
                             issue.status === 'assigned' ? '已分配' : '已上报'}
                          </Tag>
                          <span><EnvironmentOutlined /> {issue.location}</span>
                          <span><ClockCircleOutlined /> {issue.reportTime}</span>
                        </Space>
                        {issue.assignedTo && (
                          <div style={{ marginTop: '8px', color: token.colorTextSecondary }}>
                            负责人: {issue.assignedTo}
                          </div>
                        )}
                      </Col>
                      <Col>
                        <Space direction="vertical" align="center">
                          <Button type="primary" size="small">
                            查看详情
                          </Button>
                          {issue.status !== 'resolved' && (
                            <Button size="small">
                              分配处理
                            </Button>
                          )}
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab={<span><TeamOutlined />巡查人员</span>} key="persons">
            <Row gutter={[24, 24]}>
              {patrolPersons.map((person) => (
                <Col xs={24} sm={12} lg={8} key={person.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<CalendarOutlined />}>安排任务</Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <Badge 
                          status={person.status === 'active' ? 'success' : 
                                  person.status === 'busy' ? 'processing' : 'default'} 
                          dot
                        >
                          <Avatar size={48} icon={<UserOutlined />} />
                        </Badge>
                      }
                      title={person.name}
                      description={
                        <div>
                          <div>{person.department} - {person.position}</div>
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            <div>巡查次数: {person.totalPatrols}</div>
                            <div>完成率: {person.completionRate}%</div>
                            <div>评分: {person.avgRating}/5.0</div>
                            <div><TeamOutlined /> {person.phone}</div>
                          </div>
                          <div style={{ marginTop: '8px' }}>
                            {person.certifications.map(cert => (
                              <Tag key={cert}>{cert}</Tag>
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><BellOutlined />数据分析</span>} key="analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="任务状态分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={taskStatusChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="问题类型统计" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={issueTypeChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 任务详情抽屉 */}
      <Drawer
        title="巡查任务详情"
        placement="right"
        width={600}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedItem && (
          <div>
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                {selectedItem.routeName}
              </div>
              <Space wrap>
                <Tag color={getStatusColor(selectedItem.status)}>
                  {getStatusText(selectedItem.status)}
                </Tag>
                <span>巡查员: {selectedItem.patrolPerson}</span>
              </Space>
            </Card>
            
            <Descriptions column={1} bordered size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="计划时间">
                {selectedItem.scheduledDate} {selectedItem.scheduledTime}
              </Descriptions.Item>
              {selectedItem.actualStartTime && (
                <Descriptions.Item label="实际开始时间">{selectedItem.actualStartTime}</Descriptions.Item>
              )}
              {selectedItem.actualEndTime && (
                <Descriptions.Item label="实际结束时间">{selectedItem.actualEndTime}</Descriptions.Item>
              )}
              <Descriptions.Item label="检查点进度">
                {selectedItem.completedCheckpoints}/{selectedItem.totalCheckpoints}
              </Descriptions.Item>
              {selectedItem.weather && (
                <Descriptions.Item label="天气">{selectedItem.weather}</Descriptions.Item>
              )}
              {selectedItem.temperature && (
                <Descriptions.Item label="温度">{selectedItem.temperature}°C</Descriptions.Item>
              )}
              {selectedItem.notes && (
                <Descriptions.Item label="备注">{selectedItem.notes}</Descriptions.Item>
              )}
            </Descriptions>

            {selectedItem.checkpointResults.length > 0 && (
              <Card title="检查点完成情况" size="small">
                <Timeline>
                  {selectedItem.checkpointResults.map((result: CheckpointResult) => (
                    <Timeline.Item
                      key={result.checkpointId}
                      color={result.status === 'completed' ? 'green' : 
                             result.status === 'failed' ? 'red' : 'gray'}
                    >
                      <div style={{ fontWeight: 'bold' }}>{result.checkpointName}</div>
                      <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                        状态: {result.status === 'completed' ? '已完成' : 
                               result.status === 'failed' ? '检查失败' : '已跳过'}
                      </div>
                      {result.checkTime && (
                        <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                          检查时间: {result.checkTime}
                        </div>
                      )}
                      {result.notes && (
                        <div style={{ fontSize: '12px' }}>备注: {result.notes}</div>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            )}
          </div>
        )}
      </Drawer>

      {/* 新增/编辑任务模态框 */}
      <Modal
        title={editingItem ? '编辑巡查任务' : '新建巡查任务'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            const scheduledDateTime = values.scheduledDateTime;
            const formattedValues = {
              ...values,
              scheduledDate: scheduledDateTime.format('YYYY-MM-DD'),
              scheduledTime: scheduledDateTime.format('HH:mm'),
              id: editingItem?.id || Date.now().toString(),
              checkpointResults: editingItem?.checkpointResults || [],
              issues: editingItem?.issues || [],
              completedCheckpoints: editingItem?.completedCheckpoints || 0
            };

            if (editingItem) {
              setTasks(tasks.map(task => 
                task.id === editingItem.id ? { ...task, ...formattedValues } : task
              ));
              message.success('更新成功');
            } else {
              const route = routes.find(r => r.id === values.routeId);
              if (route) {
                const newTask = {
                  ...formattedValues,
                  routeName: route.name,
                  totalCheckpoints: route.checkpoints.length,
                  status: 'scheduled'
                } as PatrolTask;
                setTasks([...tasks, newTask]);
                message.success('创建成功');
              }
            }
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="巡查路线" name="routeId" rules={[{ required: true, message: '请选择巡查路线' }]}>
            <Select placeholder="请选择巡查路线">
              {routes.map(route => (
                <Option key={route.id} value={route.id}>
                  {route.name} ({route.area})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="巡查人员" name="patrolPersonId" rules={[{ required: true, message: '请选择巡查人员' }]}>
            <Select placeholder="请选择巡查人员">
              {patrolPersons.filter(p => p.status === 'active').map(person => (
                <Option key={person.id} value={person.id}>
                  {person.name} - {person.department}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="计划时间" name="scheduledDateTime" rules={[{ required: true, message: '请选择计划时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          
          {editingItem && (
            <Form.Item label="状态" name="status">
              <Select placeholder="请选择状态">
                <Option value="scheduled">已安排</Option>
                <Option value="in-progress">进行中</Option>
                <Option value="completed">已完成</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Form.Item>
          )}
          
          <Form.Item label="备注" name="notes">
            <Input.TextArea rows={3} placeholder="可选备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PatrolManagementPage;
