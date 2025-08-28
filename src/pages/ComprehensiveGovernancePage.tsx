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
  Rate,
  Calendar,
  Steps,
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
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
  FlagOutlined,
  ThunderboltOutlined,
  FireOutlined,
  HeartOutlined,
  BookOutlined,
  ToolOutlined,
  CameraOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  CarOutlined,
  HomeOutlined,
  ShopOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;

interface SecurityCase {
  id: string;
  title: string;
  type: 'theft' | 'dispute' | 'violence' | 'disturbance' | 'traffic' | 'fire' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'processing' | 'resolved' | 'closed';
  location: string;
  reportTime: string;
  reporter: string;
  reporterPhone: string;
  description: string;
  assignedTo?: string;
  processSteps: ProcessStep[];
  evidence: Evidence[];
  involvedPersons: InvolvedPerson[];
  resolution?: string;
  resolvedTime?: string;
  satisfaction?: number;
  notes?: string;
}

interface ProcessStep {
  id: string;
  step: string;
  operator: string;
  operateTime: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface Evidence {
  id: string;
  type: 'photo' | 'video' | 'document' | 'audio';
  name: string;
  url: string;
  uploadTime: string;
  uploader: string;
}

interface InvolvedPerson {
  id: string;
  name: string;
  role: 'victim' | 'suspect' | 'witness' | 'mediator';
  phone?: string;
  address?: string;
  description?: string;
}

interface SecurityPrevention {
  id: string;
  title: string;
  type: 'patrol' | 'education' | 'equipment' | 'training' | 'meeting';
  area: string;
  planDate: string;
  actualDate?: string;
  participants: string[];
  organizer: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  content: string;
  effect?: string;
  feedback?: number;
}

interface RiskArea {
  id: string;
  name: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskType: string[];
  description: string;
  preventiveMeasures: string[];
  responsible: string;
  lastInspection: string;
  nextInspection: string;
  caseCount: number;
}

const ComprehensiveGovernancePage: React.FC = () => {
  const { token } = useToken();
  const [securityCases, setSecurityCases] = useState<SecurityCase[]>([]);
  const [preventions, setPreventions] = useState<SecurityPrevention[]>([]);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [selectedCase, setSelectedCase] = useState<SecurityCase | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [editingCase, setEditingCase] = useState<SecurityCase | null>(null);
  const [activeTab, setActiveTab] = useState('cases');
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟安全案件数据
    setSecurityCases([
      {
        id: '1',
        title: '停车位纠纷调解',
        type: 'dispute',
        severity: 'medium',
        status: 'resolved',
        location: '1号楼地下车库',
        reportTime: '2025-08-20 09:30:00',
        reporter: '王一鸣',
        reporterPhone: '13800138001',
        description: '因停车位占用问题发生纠纷，双方情绪激动',
        assignedTo: '社区调解员-李明',
        processSteps: [
          {
            id: '1',
            step: '接收案件',
            operator: '值班员',
            operateTime: '2025-08-20 09:35:00',
            description: '案件已登记，分配给调解员处理',
            status: 'completed'
          },
          {
            id: '2',
            step: '现场调解',
            operator: '王一鸣',
            operateTime: '2025-08-20 14:00:00',
            description: '组织双方进行调解，达成一致意见',
            status: 'completed'
          },
          {
            id: '3',
            step: '案件结案',
            operator: '李明',
            operateTime: '2025-08-20 16:30:00',
            description: '调解成功，双方签署调解协议',
            status: 'completed'
          }
        ],
        evidence: [
          {
            id: '1',
            type: 'photo',
            name: '现场照片1',
            url: '/evidence/photo1.jpg',
            uploadTime: '2025-08-20 10:00:00',
            uploader: '王一鸣'
          }
        ],
        involvedPersons: [
          {
            id: '1',
            name: '王丽鱼',
            role: 'victim',
            phone: '13800138001',
            address: '1号楼201',
            description: '投诉方'
          },
          {
            id: '2',
            name: '刘丽',
            role: 'suspect',
            phone: '13800138002',
            address: '1号楼301',
            description: '被投诉方'
          }
        ],
        resolution: '通过调解，双方同意按照停车位使用规定执行，刘丽同意不再占用王丽的固定车位',
        resolvedTime: '2025-08-20 16:30:00',
        satisfaction: 5,
        notes: '调解效果良好，双方表示满意'
      },
      {
        id: '2',
        title: '楼道堆物安全隐患',
        type: 'fire',
        severity: 'high',
        status: 'processing',
        location: '3号楼2层楼道',
        reportTime: '2025-08-21 08:15:00',
        reporter: '刘明亮',
        reporterPhone: '13800138003',
        description: '楼道内堆放大量杂物，存在消防安全隐患',
        assignedTo: '安全管理员-钱七',
        processSteps: [
          {
            id: '1',
            step: '接收案件',
            operator: '值班员',
            operateTime: '2025-08-21 08:20:00',
            description: '案件已登记，优先处理',
            status: 'completed'
          },
          {
            id: '2',
            step: '现场核查',
            operator: '刘明亮',
            operateTime: '2025-08-21 10:00:00',
            description: '现场确认确实存在安全隐患，已拍照取证',
            status: 'completed'
          },
          {
            id: '3',
            step: '清理整改',
            operator: '刘明亮',
            operateTime: '',
            description: '通知业主限期清理，配合物业进行整改',
            status: 'in-progress'
          }
        ],
        evidence: [
          {
            id: '1',
            type: 'photo',
            name: '楼道堆物照片',
            url: '/evidence/hallway.jpg',
            uploadTime: '2025-08-21 10:30:00',
            uploader: '刘明亮'
          }
        ],
        involvedPersons: [
          {
            id: '1',
            name: '赵六',
            role: 'victim',
            phone: '13800138003',
            address: '3号楼205',
            description: '举报人'
          }
        ],
        notes: '需要加强楼道管理，定期巡查'
      }
    ]);

    // 模拟预防措施数据
    setPreventions([
      {
        id: '1',
        title: '社区安全宣传教育',
        type: 'education',
        area: '社区广场',
        planDate: '2025-08-25',
        participants: ['张三', '李明', '王五'],
        organizer: '社区安全委员会',
        status: 'planned',
        content: '开展防火防盗安全知识宣传，提高居民安全意识',
        feedback: 4.5
      },
      {
        id: '2',
        title: '安全设备检查',
        type: 'equipment',
        area: '全社区',
        planDate: '2025-08-22',
        actualDate: '2025-08-22',
        participants: ['安保队'],
        organizer: '物业管理处',
        status: 'completed',
        content: '对消防设备、监控设备、门禁系统进行全面检查',
        effect: '发现3处设备故障，已及时维修',
        feedback: 4.8
      }
    ]);

    // 模拟风险区域数据
    setRiskAreas([
      {
        id: '1',
        name: '地下车库',
        location: '1-3号楼地下',
        riskLevel: 'medium',
        riskType: ['盗窃', '火灾'],
        description: '车库内监控盲区较多，存在安全隐患',
        preventiveMeasures: ['增设监控探头', '加强巡逻', '改善照明'],
        responsible: '物业安保部',
        lastInspection: '2025-08-15',
        nextInspection: '2025-08-29',
        caseCount: 2
      },
      {
        id: '2',
        name: '社区后门',
        location: '社区北侧',
        riskLevel: 'high',
        riskType: ['外来人员', '盗窃'],
        description: '后门管理相对松散，外来人员容易进入',
        preventiveMeasures: ['加装门禁系统', '安排专人值守', '设置警示标识'],
        responsible: '社区治安队',
        lastInspection: '2025-08-18',
        nextInspection: '2025-08-01',
        caseCount: 5
      }
    ]);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theft': return <WarningOutlined />;
      case 'dispute': return <ExclamationCircleOutlined />;
      case 'violence': return <ThunderboltOutlined />;
      case 'disturbance': return <BellOutlined />;
      case 'traffic': return <CarOutlined />;
      case 'fire': return <FireOutlined />;
      default: return <SafetyOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theft': return token.colorError;
      case 'dispute': return token.colorWarning;
      case 'violence': return '#ff4d4f';
      case 'disturbance': return token.colorInfo;
      case 'traffic': return token.colorPrimary;
      case 'fire': return '#ff7875';
      default: return token.colorTextSecondary;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'theft': return '盗窃案件';
      case 'dispute': return '纠纷调解';
      case 'violence': return '暴力事件';
      case 'disturbance': return '扰民投诉';
      case 'traffic': return '交通事故';
      case 'fire': return '消防安全';
      default: return '其他事件';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff4d4f';
      case 'high': return token.colorError;
      case 'medium': return token.colorWarning;
      case 'low': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return token.colorSuccess;
      case 'processing': return token.colorPrimary;
      case 'investigating': return token.colorWarning;
      case 'reported': return token.colorInfo;
      case 'closed': return token.colorTextSecondary;
      default: return token.colorTextSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return '已解决';
      case 'processing': return '处理中';
      case 'investigating': return '调查中';
      case 'reported': return '已上报';
      case 'closed': return '已结案';
      default: return status;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ff4d4f';
      case 'high': return token.colorError;
      case 'medium': return token.colorWarning;
      case 'low': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'critical': return '极高风险';
      case 'high': return '高风险';
      case 'medium': return '中等风险';
      case 'low': return '低风险';
      default: return level;
    }
  };

  const filteredCases = securityCases.filter(caseItem => {
    const matchesSearch = searchText === '' || 
      caseItem.title.toLowerCase().includes(searchText.toLowerCase()) ||
      caseItem.location.toLowerCase().includes(searchText.toLowerCase()) ||
      caseItem.reporter.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType === 'all' || caseItem.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || caseItem.severity === selectedSeverity;
    
    return matchesSearch && matchesType && matchesStatus && matchesSeverity;
  });

  const handleAddCase = () => {
    setEditingCase(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCase = (caseItem: SecurityCase) => {
    setEditingCase(caseItem);
    form.setFieldsValue({
      ...caseItem,
      reportTime: dayjs(caseItem.reportTime)
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (caseItem: SecurityCase) => {
    setSelectedCase(caseItem);
    setIsDrawerVisible(true);
  };

  // 统计数据
  const totalCases = securityCases.length;
  const resolvedCases = securityCases.filter(c => c.status === 'resolved').length;
  const processingCases = securityCases.filter(c => c.status === 'processing' || c.status === 'investigating').length;
  const averageResolutionTime = 2.5; // 平均处理时间（天）
  const satisfactionRate = 4.6; // 平均满意度

  // 图表配置
  const caseTypeChartOption = {
    title: { text: '案件类型分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '案件数量',
      type: 'pie',
      radius: '50%',
      data: Object.entries(
        securityCases.reduce((acc, caseItem) => {
          acc[getTypeText(caseItem.type)] = (acc[getTypeText(caseItem.type)] || 0) + 1;
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

  const caseTrendChartOption = {
    title: { text: '案件处理趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '新增案件',
        type: 'line',
        data: [12, 8, 15, 10, 6, 9],
        itemStyle: { color: token.colorError }
      },
      {
        name: '解决案件',
        type: 'line',
        data: [10, 9, 13, 11, 7, 8],
        itemStyle: { color: token.colorSuccess }
      }
    ]
  };

  const columns = [
    {
      title: '案件信息',
      key: 'case',
      render: (record: SecurityCase) => (
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
              <EnvironmentOutlined /> {record.location}
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              举报人: {record.reporter}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
          {getTypeText(type)}
        </Tag>
      ),
      filters: [
        { text: '盗窃案件', value: 'theft' },
        { text: '纠纷调解', value: 'dispute' },
        { text: '暴力事件', value: 'violence' },
        { text: '扰民投诉', value: 'disturbance' },
        { text: '交通事故', value: 'traffic' },
        { text: '消防安全', value: 'fire' },
        { text: '其他事件', value: 'other' }
      ],
      onFilter: (value: any, record: SecurityCase) => record.type === value
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {getSeverityText(severity)}
        </Tag>
      ),
      sorter: (a: SecurityCase, b: SecurityCase) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[a.severity as keyof typeof severityOrder] - 
               severityOrder[b.severity as keyof typeof severityOrder];
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: SecurityCase) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {record.satisfaction && (
            <Rate disabled defaultValue={record.satisfaction} style={{ fontSize: '12px' }} />
          )}
        </Space>
      ),
      filters: [
        { text: '已上报', value: 'reported' },
        { text: '调查中', value: 'investigating' },
        { text: '处理中', value: 'processing' },
        { text: '已解决', value: 'resolved' },
        { text: '已结案', value: 'closed' }
      ],
      onFilter: (value: any, record: SecurityCase) => record.status === value
    },
    {
      title: '处理信息',
      key: 'process',
      render: (record: SecurityCase) => (
        <div style={{ fontSize: '12px' }}>
          <div><ClockCircleOutlined /> 上报时间: {dayjs(record.reportTime).format('MM-DD HH:mm')}</div>
          {record.assignedTo && (
            <div><TeamOutlined /> 负责人: {record.assignedTo}</div>
          )}
          {record.resolvedTime && (
            <div><CheckCircleOutlined /> 解决时间: {dayjs(record.resolvedTime).format('MM-DD HH:mm')}</div>
          )}
          <div>
            <Progress 
              percent={Math.round((record.processSteps.filter(s => s.status === 'completed').length / record.processSteps.length) * 100)} 
              size="small" 
            />
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SecurityCase) => (
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
            onClick={() => handleEditCase(record)}
          />
          {record.status !== 'resolved' && record.status !== 'closed' && (
            <Button
              type="text"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: '标记为已解决',
                  content: '确定要将此案件标记为已解决吗？',
                  onOk: () => {
                    setSecurityCases(securityCases.map(c => 
                      c.id === record.id ? { ...c, status: 'resolved', resolvedTime: dayjs().format('YYYY-MM-DD HH:mm:ss') } : c
                    ));
                    message.success('案件已标记为解决');
                  }
                });
              }}
            >
              <CheckCircleOutlined style={{ color: token.colorSuccess }} />
            </Button>
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
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <SafetyOutlined style={{ marginRight: '12px' }} />
              综合治理平台
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              构建平安社区，全方位安全防控，快速响应处置各类治安事件
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddCase}>
                新增案件
              </Button>
              <Button type="primary" ghost icon={<BellOutlined />}>
                应急响应
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
              title="总案件数"
              value={totalCases}
              suffix="件"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<FileTextOutlined />}
            />
            <Progress percent={Math.round((resolvedCases / totalCases) * 100)} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="已解决"
              value={resolvedCases}
              suffix={`/ ${totalCases}`}
              valueStyle={{ color: token.colorSuccess }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress 
              percent={Math.round((resolvedCases / totalCases) * 100)} 
              size="small" 
              status="active" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="处理中"
              value={processingCases}
              suffix="件"
              valueStyle={{ color: token.colorWarning }}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              需要关注
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="平均满意度"
              value={satisfactionRate}
              suffix="/5.0"
              valueStyle={{ color: token.colorError }}
              prefix={<HeartOutlined />}
            />
            <Rate disabled defaultValue={satisfactionRate} style={{ fontSize: '14px' }} />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><FileTextOutlined />安全案件</span>} key="cases">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索案件标题、地点、举报人..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="案件类型"
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部类型</Option>
                    <Option value="theft">盗窃案件</Option>
                    <Option value="dispute">纠纷调解</Option>
                    <Option value="violence">暴力事件</Option>
                    <Option value="disturbance">扰民投诉</Option>
                    <Option value="traffic">交通事故</Option>
                    <Option value="fire">消防安全</Option>
                    <Option value="other">其他事件</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="严重程度"
                    value={selectedSeverity}
                    onChange={setSelectedSeverity}
                    style={{ width: 100 }}
                    allowClear
                  >
                    <Option value="all">全部程度</Option>
                    <Option value="critical">紧急</Option>
                    <Option value="high">高</Option>
                    <Option value="medium">中</Option>
                    <Option value="low">低</Option>
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
                    <Option value="reported">已上报</Option>
                    <Option value="investigating">调查中</Option>
                    <Option value="processing">处理中</Option>
                    <Option value="resolved">已解决</Option>
                    <Option value="closed">已结案</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            {/* 案件列表 */}
            <Table
              columns={columns}
              dataSource={filteredCases}
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

          <TabPane tab={<span><ToolOutlined />预防措施</span>} key="prevention">
            <Row gutter={[24, 24]}>
              {preventions.map((prevention) => (
                <Col xs={24} sm={12} lg={8} key={prevention.id}>
                  <Card
                    hoverable
                    title={prevention.title}
                    extra={
                      <Tag color={prevention.status === 'completed' ? 'success' : 
                                 prevention.status === 'in-progress' ? 'processing' : 
                                 prevention.status === 'planned' ? 'warning' : 'default'}>
                        {prevention.status === 'completed' ? '已完成' : 
                         prevention.status === 'in-progress' ? '进行中' : 
                         prevention.status === 'planned' ? '计划中' : '已取消'}
                      </Tag>
                    }
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<EditOutlined />}>编辑</Button>
                    ]}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="类型">
                        {prevention.type === 'patrol' ? '安全巡逻' : 
                         prevention.type === 'education' ? '宣传教育' : 
                         prevention.type === 'equipment' ? '设备检查' : 
                         prevention.type === 'training' ? '应急演练' : '专题会议'}
                      </Descriptions.Item>
                      <Descriptions.Item label="区域">{prevention.area}</Descriptions.Item>
                      <Descriptions.Item label="计划时间">{prevention.planDate}</Descriptions.Item>
                      {prevention.actualDate && (
                        <Descriptions.Item label="实际时间">{prevention.actualDate}</Descriptions.Item>
                      )}
                      <Descriptions.Item label="组织者">{prevention.organizer}</Descriptions.Item>
                      <Descriptions.Item label="参与人数">{prevention.participants.length}人</Descriptions.Item>
                      {prevention.feedback && (
                        <Descriptions.Item label="效果评价">
                          <Rate disabled defaultValue={prevention.feedback} style={{ fontSize: '12px' }} />
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: token.colorTextSecondary }}>
                      {prevention.content}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><WarningOutlined />风险区域</span>} key="risk-areas">
            <Row gutter={[24, 24]}>
              {riskAreas.map((area) => (
                <Col xs={24} sm={12} lg={8} key={area.id}>
                  <Card
                    hoverable
                    title={
                      <Space>
                        <EnvironmentOutlined />
                        {area.name}
                      </Space>
                    }
                    extra={
                      <Tag color={getRiskLevelColor(area.riskLevel)}>
                        {getRiskLevelText(area.riskLevel)}
                      </Tag>
                    }
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<CalendarOutlined />}>巡查记录</Button>
                    ]}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="位置">{area.location}</Descriptions.Item>
                      <Descriptions.Item label="风险类型">
                        {area.riskType.map(type => (
                          <Tag key={type}>{type}</Tag>
                        ))}
                      </Descriptions.Item>
                      <Descriptions.Item label="负责人">{area.responsible}</Descriptions.Item>
                      <Descriptions.Item label="上次检查">{area.lastInspection}</Descriptions.Item>
                      <Descriptions.Item label="下次检查">{area.nextInspection}</Descriptions.Item>
                      <Descriptions.Item label="相关案件">
                        <Badge count={area.caseCount} style={{ backgroundColor: token.colorError }} />
                      </Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: token.colorTextSecondary }}>
                      <div style={{ marginBottom: '8px' }}><strong>风险描述:</strong></div>
                      <div>{area.description}</div>
                      <div style={{ marginTop: '8px' }}><strong>防范措施:</strong></div>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {area.preventiveMeasures.map((measure, index) => (
                          <li key={index}>{measure}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><BarChartOutlined />数据分析</span>} key="analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="案件类型分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={caseTypeChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="案件处理趋势" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={caseTrendChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="治理效果统计" style={{ borderRadius: '12px' }}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Statistic title="平均处理时间" value={averageResolutionTime} suffix="天" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="案件解决率" value={Math.round((resolvedCases / totalCases) * 100)} suffix="%" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="居民满意度" value={satisfactionRate} suffix="/5.0" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 案件详情抽屉 */}
      <Drawer
        title="案件详细信息"
        placement="right"
        width={800}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedCase && (
          <div>
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                {selectedCase.title}
              </div>
              <Space wrap>
                <Tag color={getTypeColor(selectedCase.type)} icon={getTypeIcon(selectedCase.type)}>
                  {getTypeText(selectedCase.type)}
                </Tag>
                <Tag color={getSeverityColor(selectedCase.severity)}>
                  {getSeverityText(selectedCase.severity)}严重程度
                </Tag>
                <Tag color={getStatusColor(selectedCase.status)}>
                  {getStatusText(selectedCase.status)}
                </Tag>
              </Space>
            </Card>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="事发地点">{selectedCase.location}</Descriptions.Item>
              <Descriptions.Item label="上报时间">{selectedCase.reportTime}</Descriptions.Item>
              <Descriptions.Item label="举报人">{selectedCase.reporter}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedCase.reporterPhone}</Descriptions.Item>
              {selectedCase.assignedTo && (
                <Descriptions.Item label="负责人" span={2}>{selectedCase.assignedTo}</Descriptions.Item>
              )}
              <Descriptions.Item label="案件描述" span={2}>
                {selectedCase.description}
              </Descriptions.Item>
              {selectedCase.resolution && (
                <Descriptions.Item label="处理结果" span={2}>
                  {selectedCase.resolution}
                </Descriptions.Item>
              )}
              {selectedCase.resolvedTime && (
                <Descriptions.Item label="解决时间">{selectedCase.resolvedTime}</Descriptions.Item>
              )}
              {selectedCase.satisfaction && (
                <Descriptions.Item label="满意度评价">
                  <Rate disabled defaultValue={selectedCase.satisfaction} />
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 处理流程 */}
            <Card title="处理流程" size="small" style={{ marginBottom: '16px' }}>
              <Steps direction="vertical" size="small">
                {selectedCase.processSteps.map((step) => (
                  <Step
                    key={step.id}
                    title={step.step}
                    description={
                      <div>
                        <div>操作人: {step.operator}</div>
                        <div>时间: {step.operateTime}</div>
                        <div>说明: {step.description}</div>
                      </div>
                    }
                    status={step.status === 'completed' ? 'finish' : 
                           step.status === 'in-progress' ? 'process' : 'wait'}
                  />
                ))}
              </Steps>
            </Card>

            {/* 涉及人员 */}
            {selectedCase.involvedPersons.length > 0 && (
              <Card title="涉及人员" size="small" style={{ marginBottom: '16px' }}>
                <List
                  dataSource={selectedCase.involvedPersons}
                  renderItem={(person) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: person.role === 'victim' ? token.colorError : 
                                             person.role === 'suspect' ? token.colorWarning : 
                                             person.role === 'witness' ? token.colorInfo : token.colorSuccess 
                            }}
                            icon={<UserOutlined />}
                          />
                        }
                        title={
                          <Space>
                            {person.name}
                            <Tag color={person.role === 'victim' ? 'error' : 
                                       person.role === 'suspect' ? 'warning' : 
                                       person.role === 'witness' ? 'processing' : 'success'}>
                              {person.role === 'victim' ? '受害人' : 
                               person.role === 'suspect' ? '涉事人' : 
                               person.role === 'witness' ? '证人' : '调解员'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            {person.phone && <div><PhoneOutlined /> {person.phone}</div>}
                            {person.address && <div><HomeOutlined /> {person.address}</div>}
                            {person.description && <div>{person.description}</div>}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 相关证据 */}
            {selectedCase.evidence.length > 0 && (
              <Card title="相关证据" size="small">
                <List
                  dataSource={selectedCase.evidence}
                  renderItem={(evidence) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ backgroundColor: token.colorPrimary }}
                            icon={evidence.type === 'photo' ? <CameraOutlined /> : <FileTextOutlined />}
                          />
                        }
                        title={evidence.name}
                        description={
                          <div>
                            <div>类型: {evidence.type === 'photo' ? '照片' : 
                                     evidence.type === 'video' ? '视频' : 
                                     evidence.type === 'document' ? '文档' : '音频'}</div>
                            <div>上传者: {evidence.uploader}</div>
                            <div>上传时间: {evidence.uploadTime}</div>
                          </div>
                        }
                      />
                      <Button type="link">查看</Button>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Drawer>

      {/* 新增/编辑案件模态框 */}
      <Modal
        title={editingCase ? '编辑案件信息' : '新增安全案件'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            const formattedValues = {
              ...values,
              reportTime: values.reportTime.format('YYYY-MM-DD HH:mm:ss'),
              id: editingCase?.id || Date.now().toString(),
              processSteps: editingCase?.processSteps || [
                {
                  id: '1',
                  step: '案件登记',
                  operator: '系统管理员',
                  operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  description: '案件已成功登记',
                  status: 'completed'
                }
              ],
              evidence: editingCase?.evidence || [],
              involvedPersons: editingCase?.involvedPersons || []
            };

            if (editingCase) {
              setSecurityCases(securityCases.map(caseItem => 
                caseItem.id === editingCase.id ? { ...caseItem, ...formattedValues } : caseItem
              ));
              message.success('更新成功');
            } else {
              setSecurityCases([...securityCases, formattedValues as SecurityCase]);
              message.success('添加成功');
            }
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCase(null);
          form.resetFields();
        }}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="案件标题" name="title" rules={[{ required: true, message: '请输入案件标题' }]}>
                <Input placeholder="请输入案件标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="案件类型" name="type" rules={[{ required: true, message: '请选择案件类型' }]}>
                <Select placeholder="请选择案件类型">
                  <Option value="theft">盗窃案件</Option>
                  <Option value="dispute">纠纷调解</Option>
                  <Option value="violence">暴力事件</Option>
                  <Option value="disturbance">扰民投诉</Option>
                  <Option value="traffic">交通事故</Option>
                  <Option value="fire">消防安全</Option>
                  <Option value="other">其他事件</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="严重程度" name="severity" rules={[{ required: true, message: '请选择严重程度' }]}>
                <Select placeholder="请选择严重程度">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="事发地点" name="location" rules={[{ required: true, message: '请输入事发地点' }]}>
                <Input placeholder="请输入事发地点" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="举报人" name="reporter" rules={[{ required: true, message: '请输入举报人姓名' }]}>
                <Input placeholder="请输入举报人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="reporterPhone" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="上报时间" name="reportTime" rules={[{ required: true, message: '请选择上报时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态">
                  <Option value="reported">已上报</Option>
                  <Option value="investigating">调查中</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="resolved">已解决</Option>
                  <Option value="closed">已结案</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="案件描述" name="description" rules={[{ required: true, message: '请输入案件描述' }]}>
            <Input.TextArea rows={4} placeholder="请详细描述案件经过" />
          </Form.Item>

          {editingCase && (
            <>
              <Form.Item label="负责人" name="assignedTo">
                <Input placeholder="请输入负责人" />
              </Form.Item>
              
              <Form.Item label="处理结果" name="resolution">
                <Input.TextArea rows={3} placeholder="请输入处理结果" />
              </Form.Item>
              
              <Form.Item label="备注" name="notes">
                <Input.TextArea rows={2} placeholder="可选备注信息" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ComprehensiveGovernancePage;
