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
  Steps,
  Upload,
  InputNumber,
  theme
} from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  FlagOutlined,
  ThunderboltOutlined,
  FireOutlined,
  HeartOutlined,
  ToolOutlined,
  CameraOutlined,
  StarOutlined,
  HomeOutlined,
  CarOutlined,
  ShopOutlined,
  MedicineBoxOutlined,
  SafetyOutlined,
  BookOutlined,
  UploadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const { RangePicker } = DatePicker;

interface Event {
  id: string;
  title: string;
  type: 'emergency' | 'maintenance' | 'community' | 'safety' | 'service' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'resolved' | 'closed' | 'cancelled';
  category: string;
  location: string;
  createTime: string;
  updateTime: string;
  reportedBy: string;
  reporterPhone: string;
  assignedTo?: string;
  department?: string;
  description: string;
  solution?: string;
  processSteps: EventStep[];
  attachments: EventAttachment[];
  participants: EventParticipant[];
  deadline?: string;
  completedTime?: string;
  impact: 'low' | 'medium' | 'high';
  cost?: number;
  feedback?: EventFeedback;
  tags: string[];
  notes?: string;
}

interface EventStep {
  id: string;
  title: string;
  description: string;
  operator: string;
  operateTime: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  duration?: number;
  comments?: string;
}

interface EventAttachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  uploadTime: string;
  uploader: string;
  size: string;
}

interface EventParticipant {
  id: string;
  name: string;
  role: 'reporter' | 'handler' | 'supervisor' | 'witness' | 'affected';
  phone?: string;
  department?: string;
  involvement: string;
}

interface EventFeedback {
  rating: number;
  comment: string;
  submittedBy: string;
  submitTime: string;
}

interface EventTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  defaultSteps: string[];
  estimatedDuration: number;
  requiredFields: string[];
  isActive: boolean;
}

const EventManagementPage: React.FC = () => {
  const { token } = useToken();
  const [events, setEvents] = useState<Event[]>([]);
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState('events');
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟事件数据
    setEvents([
      {
        id: '1',
        title: '电梯故障紧急维修',
        type: 'emergency',
        priority: 'urgent',
        status: 'resolved',
        category: '设备故障',
        location: '2号楼A单元电梯',
        createTime: '2025-08-20 08:30:00',
        updateTime: '2025-08-20 15:45:00',
        reportedBy: '张伟',
        reporterPhone: '13800138001',
        assignedTo: '电梯维修公司',
        department: '物业管理部',
        description: '2号楼A单元电梯突然停止运行，有人员被困',
        solution: '维修人员及时赶到，修复电梯故障，救出被困人员',
        processSteps: [
          {
            id: '1',
            title: '接收报告',
            description: '接到居民报告，电梯故障有人被困',
            operator: '值班员',
            operateTime: '2025-08-20 08:32:00',
            status: 'completed',
            duration: 2
          },
          {
            id: '2',
            title: '应急响应',
            description: '立即联系电梯维修公司，启动应急程序',
            operator: '物业经理',
            operateTime: '2025-08-20 08:35:00',
            status: 'completed',
            duration: 15
          },
          {
            id: '3',
            title: '现场处置',
            description: '维修人员到达现场，成功救出被困人员',
            operator: '电梯维修技师',
            operateTime: '2025-08-20 09:15:00',
            status: 'completed',
            duration: 120
          },
          {
            id: '4',
            title: '故障修复',
            description: '排查故障原因，更换损坏部件，恢复正常运行',
            operator: '电梯维修技师',
            operateTime: '2025-08-20 15:30:00',
            status: 'completed',
            duration: 240
          }
        ],
        attachments: [
          {
            id: '1',
            name: '故障现场照片',
            type: 'image',
            url: '/attachments/elevator_fault.jpg',
            uploadTime: '2025-08-20 09:00:00',
            uploader: '张三',
            size: '2.5MB'
          }
        ],
        participants: [
          {
            id: '1',
            name: '张三',
            role: 'reporter',
            phone: '13800138001',
            involvement: '发现故障并报告'
          },
          {
            id: '2',
            name: '李师傅',
            role: 'handler',
            phone: '13800138101',
            department: '电梯维修公司',
            involvement: '负责维修工作'
          }
        ],
        completedTime: '2025-08-20 15:45:00',
        impact: 'high',
        cost: 1200,
        feedback: {
          rating: 5,
          comment: '处理及时，维修质量好',
          submittedBy: '张三',
          submitTime: '2025-08-20 16:00:00'
        },
        tags: ['紧急事件', '设备故障', '电梯'],
        notes: '今后需要加强电梯日常维护'
      },
      {
        id: '2',
        title: '消防设备年度检查',
        type: 'maintenance',
        priority: 'medium',
        status: 'processing',
        category: '预防性维护',
        location: '全社区',
        createTime: '2025-08-15 09:00:00',
        updateTime: '2025-08-20 17:30:00',
        reportedBy: '物业管理处',
        reporterPhone: '13800138000',
        assignedTo: '消防检测公司',
        department: '安全管理部',
        description: '对社区内所有消防设备进行年度检查和维护',
        processSteps: [
          {
            id: '1',
            title: '制定检查计划',
            description: '制定详细的消防设备检查计划和时间表',
            operator: '安全管理员',
            operateTime: '2025-08-15 10:00:00',
            status: 'completed',
            duration: 60
          },
          {
            id: '2',
            title: '设备检查',
            description: '逐一检查消防栓、烟感器、应急照明等设备',
            operator: '消防检测技师',
            operateTime: '2025-08-18 08:00:00',
            status: 'in-progress',
            duration: 480
          },
          {
            id: '3',
            title: '问题整改',
            description: '对发现的问题进行整改和维修',
            operator: '维修人员',
            operateTime: '',
            status: 'pending'
          }
        ],
        attachments: [
          {
            id: '1',
            name: '检查计划表',
            type: 'document',
            url: '/attachments/fire_check_plan.pdf',
            uploadTime: '2025-08-15 10:30:00',
            uploader: '安全管理员',
            size: '1.2MB'
          }
        ],
        participants: [
          {
            id: '1',
            name: '安全管理员',
            role: 'supervisor',
            department: '安全管理部',
            involvement: '负责检查监督'
          }
        ],
        deadline: '2025-08-25 18:00:00',
        impact: 'medium',
        tags: ['消防安全', '预防维护', '年度检查']
      },
      {
        id: '3',
        title: '社区春节活动组织',
        type: 'community',
        priority: 'medium',
        status: 'processing',
        category: '社区活动',
        location: '社区广场',
        createTime: '2025-08-10 14:00:00',
        updateTime: '2025-08-20 16:00:00',
        reportedBy: '社区居委会',
        reporterPhone: '13800138888',
        assignedTo: '活动组织委员会',
        department: '社区服务部',
        description: '筹备社区春节联欢活动，包括节目表演、游戏互动等',
        processSteps: [
          {
            id: '1',
            title: '活动策划',
            description: '制定活动方案，确定活动内容和流程',
            operator: '活动策划员',
            operateTime: '2025-08-12 09:00:00',
            status: 'completed',
            duration: 240
          },
          {
            id: '2',
            title: '资源准备',
            description: '采购活动用品，联系表演团体',
            operator: '采购员',
            operateTime: '2025-08-15 10:00:00',
            status: 'in-progress',
            duration: 180
          },
          {
            id: '3',
            title: '场地布置',
            description: '布置活动现场，搭建舞台设备',
            operator: '后勤人员',
            operateTime: '',
            status: 'pending'
          }
        ],
        attachments: [
          {
            id: '1',
            name: '活动方案',
            type: 'document',
            url: '/attachments/spring_festival_plan.pdf',
            uploadTime: '2025-08-12 15:00:00',
            uploader: '活动策划员',
            size: '3.1MB'
          }
        ],
        participants: [
          {
            id: '1',
            name: '活动策划员',
            role: 'handler',
            department: '社区服务部',
            involvement: '负责活动策划和组织'
          }
        ],
        deadline: '2025-08-28 15:00:00',
        impact: 'medium',
        cost: 5000,
        tags: ['社区活动', '春节', '居民服务']
      }
    ]);

    // 模拟事件模板数据
    setTemplates([
      {
        id: '1',
        name: '设备故障处理',
        type: 'emergency',
        description: '用于处理各类设备故障的标准流程',
        defaultSteps: ['接收报告', '现场勘查', '故障修复', '验收确认'],
        estimatedDuration: 120,
        requiredFields: ['location', 'description', 'assignedTo'],
        isActive: true
      },
      {
        id: '2',
        name: '安全检查',
        type: 'safety',
        description: '定期安全检查的标准流程',
        defaultSteps: ['制定计划', '现场检查', '问题整改', '复查验收'],
        estimatedDuration: 480,
        requiredFields: ['location', 'deadline', 'assignedTo'],
        isActive: true
      }
    ]);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <WarningOutlined />;
      case 'maintenance': return <ToolOutlined />;
      case 'community': return <TeamOutlined />;
      case 'safety': return <SafetyOutlined />;
      case 'service': return <HeartOutlined />;
      default: return <CalendarOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return token.colorError;
      case 'maintenance': return token.colorWarning;
      case 'community': return token.colorPrimary;
      case 'safety': return '#ff7875';
      case 'service': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'emergency': return '紧急事件';
      case 'maintenance': return '维护保养';
      case 'community': return '社区活动';
      case 'safety': return '安全事件';
      case 'service': return '服务事件';
      default: return '其他事件';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return token.colorError;
      case 'medium': return token.colorWarning;
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
      case 'resolved': return token.colorSuccess;
      case 'processing': return token.colorPrimary;
      case 'pending': return token.colorWarning;
      case 'closed': return token.colorTextSecondary;
      case 'cancelled': return '#d9d9d9';
      default: return token.colorTextSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return '已解决';
      case 'processing': return '处理中';
      case 'pending': return '待处理';
      case 'closed': return '已关闭';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return token.colorError;
      case 'medium': return token.colorWarning;
      case 'low': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'high': return '高影响';
      case 'medium': return '中等影响';
      case 'low': return '低影响';
      default: return impact;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchText === '' || 
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.location.toLowerCase().includes(searchText.toLowerCase()) ||
      event.reportedBy.toLowerCase().includes(searchText.toLowerCase()) ||
      event.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || event.priority === selectedPriority;
    
    let matchesDateRange = true;
    if (dateRange[0] && dateRange[1]) {
      const eventDate = dayjs(event.createTime);
      matchesDateRange = eventDate.isAfter(dateRange[0].startOf('day')) && 
                        eventDate.isBefore(dateRange[1].endOf('day'));
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesDateRange;
  });

  const handleAddEvent = () => {
    setEditingEvent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      ...event,
      createTime: dayjs(event.createTime),
      deadline: event.deadline ? dayjs(event.deadline) : null
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDrawerVisible(true);
  };

  const handleDeleteEvent = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个事件吗？删除后将无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        setEvents(events.filter(event => event.id !== id));
        message.success('删除成功');
      }
    });
  };

  // 统计数据
  const totalEvents = events.length;
  const resolvedEvents = events.filter(e => e.status === 'resolved').length;
  const processingEvents = events.filter(e => e.status === 'processing').length;
  const urgentEvents = events.filter(e => e.priority === 'urgent').length;
  const averageResolutionTime = 3.2; // 平均处理时间（天）

  // 图表配置
  const eventTypeChartOption = {
    title: { text: '事件类型分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '事件数量',
      type: 'pie',
      radius: '50%',
      data: Object.entries(
        events.reduce((acc, event) => {
          acc[getTypeText(event.type)] = (acc[getTypeText(event.type)] || 0) + 1;
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

  const eventTrendChartOption = {
    title: { text: '事件处理趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '新增事件',
        type: 'line',
        data: [15, 12, 18, 14, 10, 16],
        itemStyle: { color: token.colorError }
      },
      {
        name: '处理完成',
        type: 'line',
        data: [13, 11, 16, 15, 9, 14],
        itemStyle: { color: token.colorSuccess }
      }
    ]
  };

  const columns = [
    {
      title: '事件信息',
      key: 'event',
      render: (record: Event) => (
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
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {record.title}
              <Space style={{ marginLeft: '8px' }}>
                {record.tags.slice(0, 2).map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              <EnvironmentOutlined /> {record.location}
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              报告人: {record.reportedBy}
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
        { text: '紧急事件', value: 'emergency' },
        { text: '维护保养', value: 'maintenance' },
        { text: '社区活动', value: 'community' },
        { text: '安全事件', value: 'safety' },
        { text: '服务事件', value: 'service' },
        { text: '其他事件', value: 'other' }
      ],
      onFilter: (value: any, record: Event) => record.type === value
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string, record: Event) => (
        <Space direction="vertical" size="small">
          <Tag color={getPriorityColor(priority)}>
            {getPriorityText(priority)}
          </Tag>
          <Tag color={getImpactColor(record.impact)}>
            {getImpactText(record.impact)}
          </Tag>
        </Space>
      ),
      sorter: (a: Event, b: Event) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Event) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          <div style={{ fontSize: '12px' }}>
            进度: {Math.round((record.processSteps.filter(s => s.status === 'completed').length / record.processSteps.length) * 100)}%
          </div>
        </Space>
      ),
      filters: [
        { text: '待处理', value: 'pending' },
        { text: '处理中', value: 'processing' },
        { text: '已解决', value: 'resolved' },
        { text: '已关闭', value: 'closed' },
        { text: '已取消', value: 'cancelled' }
      ],
      onFilter: (value: any, record: Event) => record.status === value
    },
    {
      title: '时间信息',
      key: 'time',
      render: (record: Event) => (
        <div style={{ fontSize: '12px' }}>
          <div><ClockCircleOutlined /> 创建: {dayjs(record.createTime).format('MM-DD HH:mm')}</div>
          <div><CalendarOutlined /> 更新: {dayjs(record.updateTime).format('MM-DD HH:mm')}</div>
          {record.deadline && (
            <div style={{ color: dayjs(record.deadline).isBefore(dayjs()) ? token.colorError : token.colorWarning }}>
              <FlagOutlined /> 截止: {dayjs(record.deadline).format('MM-DD HH:mm')}
            </div>
          )}
          {record.completedTime && (
            <div style={{ color: token.colorSuccess }}>
              <CheckCircleOutlined /> 完成: {dayjs(record.completedTime).format('MM-DD HH:mm')}
            </div>
          )}
        </div>
      )
    },
    {
      title: '负责信息',
      key: 'assignment',
      render: (record: Event) => (
        <div style={{ fontSize: '12px' }}>
          {record.assignedTo && (
            <div><TeamOutlined /> 负责人: {record.assignedTo}</div>
          )}
          {record.department && (
            <div><HomeOutlined /> 部门: {record.department}</div>
          )}
          {record.cost && (
            <div style={{ color: token.colorSuccess }}>成本: ¥{record.cost}</div>
          )}
          {record.feedback && (
            <div>
              满意度: <Rate disabled defaultValue={record.feedback.rating} style={{ fontSize: '10px' }} />
            </div>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Event) => (
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
            onClick={() => handleEditEvent(record)}
          />
          {(record.status === 'processing' || record.status === 'pending') && (
            <Button
              type="text"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: '标记为已解决',
                  content: '确定要将此事件标记为已解决吗？',
                  onOk: () => {
                    setEvents(events.map(e => 
                      e.id === record.id ? { 
                        ...e, 
                        status: 'resolved', 
                        completedTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
                      } : e
                    ));
                    message.success('事件已标记为解决');
                  }
                });
              }}
            >
              <CheckCircleOutlined style={{ color: token.colorSuccess }} />
            </Button>
          )}
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteEvent(record.id)}
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
              <CalendarOutlined style={{ marginRight: '12px' }} />
              事件管理系统
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              统一管理各类社区事件，标准化处理流程，提升响应效率
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddEvent}>
                新增事件
              </Button>
              <Button type="primary" ghost icon={<WarningOutlined />}>
                紧急响应
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
              title="总事件数"
              value={totalEvents}
              suffix="个"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<FileTextOutlined />}
            />
            <Progress percent={Math.round((resolvedEvents / totalEvents) * 100)} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="已解决"
              value={resolvedEvents}
              suffix={`/ ${totalEvents}`}
              valueStyle={{ color: token.colorSuccess }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress 
              percent={Math.round((resolvedEvents / totalEvents) * 100)} 
              size="small" 
              status="active" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="处理中"
              value={processingEvents}
              suffix="个"
              valueStyle={{ color: token.colorWarning }}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              紧急事件: {urgentEvents}个
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="平均处理时间"
              value={averageResolutionTime}
              suffix="天"
              valueStyle={{ color: token.colorError }}
              prefix={<StarOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              目标: ≤2天
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><FileTextOutlined />事件列表</span>} key="events">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索事件标题、地点、报告人、描述..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="事件类型"
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部类型</Option>
                    <Option value="emergency">紧急事件</Option>
                    <Option value="maintenance">维护保养</Option>
                    <Option value="community">社区活动</Option>
                    <Option value="safety">安全事件</Option>
                    <Option value="service">服务事件</Option>
                    <Option value="other">其他事件</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="优先级"
                    value={selectedPriority}
                    onChange={setSelectedPriority}
                    style={{ width: 100 }}
                    allowClear
                  >
                    <Option value="all">全部优先级</Option>
                    <Option value="urgent">紧急</Option>
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
                    <Option value="pending">待处理</Option>
                    <Option value="processing">处理中</Option>
                    <Option value="resolved">已解决</Option>
                    <Option value="closed">已关闭</Option>
                    <Option value="cancelled">已取消</Option>
                  </Select>
                </Col>
                <Col>
                  <RangePicker
                    placeholder={['开始日期', '结束日期']}
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates || [null, null])}
                    style={{ width: 200 }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 事件列表 */}
            <Table
              columns={columns}
              dataSource={filteredEvents}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 1600 }}
            />
          </TabPane>

          <TabPane tab={<span><BookOutlined />事件模板</span>} key="templates">
            <Row gutter={[24, 24]}>
              {templates.map((template) => (
                <Col xs={24} sm={12} lg={8} key={template.id}>
                  <Card
                    hoverable
                    title={template.name}
                    extra={
                      <Tag color={template.isActive ? 'success' : 'default'}>
                        {template.isActive ? '启用' : '停用'}
                      </Tag>
                    }
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<EditOutlined />}>编辑</Button>,
                      <Button type="link" icon={<PlusOutlined />}>创建事件</Button>
                    ]}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="类型">
                        <Tag color={getTypeColor(template.type)}>
                          {getTypeText(template.type)}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="预计时长">{template.estimatedDuration}分钟</Descriptions.Item>
                      <Descriptions.Item label="默认步骤">{template.defaultSteps.length}个</Descriptions.Item>
                      <Descriptions.Item label="必填字段">{template.requiredFields.length}个</Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: token.colorTextSecondary }}>
                      {template.description}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Text strong>默认步骤:</Text>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '12px' }}>
                        {template.defaultSteps.map((step, index) => (
                          <li key={index}>{step}</li>
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
                <Card title="事件类型分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={eventTypeChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="事件处理趋势" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={eventTrendChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="处理效率统计" style={{ borderRadius: '12px' }}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Statistic title="事件解决率" value={Math.round((resolvedEvents / totalEvents) * 100)} suffix="%" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="平均响应时间" value={1.2} suffix="小时" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="客户满意度" value={4.6} suffix="/5.0" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 事件详情抽屉 */}
      <Drawer
        title="事件详细信息"
        placement="right"
        width={800}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedEvent && (
          <div>
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                {selectedEvent.title}
              </div>
              <Space wrap>
                <Tag color={getTypeColor(selectedEvent.type)} icon={getTypeIcon(selectedEvent.type)}>
                  {getTypeText(selectedEvent.type)}
                </Tag>
                <Tag color={getPriorityColor(selectedEvent.priority)}>
                  {getPriorityText(selectedEvent.priority)}优先级
                </Tag>
                <Tag color={getStatusColor(selectedEvent.status)}>
                  {getStatusText(selectedEvent.status)}
                </Tag>
                <Tag color={getImpactColor(selectedEvent.impact)}>
                  {getImpactText(selectedEvent.impact)}
                </Tag>
              </Space>
            </Card>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="事件分类">{selectedEvent.category}</Descriptions.Item>
              <Descriptions.Item label="事发地点">{selectedEvent.location}</Descriptions.Item>
              <Descriptions.Item label="报告人">{selectedEvent.reportedBy}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedEvent.reporterPhone}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedEvent.createTime}</Descriptions.Item>
              <Descriptions.Item label="最后更新">{selectedEvent.updateTime}</Descriptions.Item>
              {selectedEvent.assignedTo && (
                <Descriptions.Item label="负责人">{selectedEvent.assignedTo}</Descriptions.Item>
              )}
              {selectedEvent.department && (
                <Descriptions.Item label="负责部门">{selectedEvent.department}</Descriptions.Item>
              )}
              {selectedEvent.deadline && (
                <Descriptions.Item label="处理期限">{selectedEvent.deadline}</Descriptions.Item>
              )}
              {selectedEvent.completedTime && (
                <Descriptions.Item label="完成时间">{selectedEvent.completedTime}</Descriptions.Item>
              )}
              {selectedEvent.cost && (
                <Descriptions.Item label="处理成本">¥{selectedEvent.cost}</Descriptions.Item>
              )}
              <Descriptions.Item label="事件描述" span={2}>
                {selectedEvent.description}
              </Descriptions.Item>
              {selectedEvent.solution && (
                <Descriptions.Item label="处理方案" span={2}>
                  {selectedEvent.solution}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 处理流程 */}
            <Card title="处理流程" size="small" style={{ marginBottom: '16px' }}>
              <Steps direction="vertical" size="small">
                {selectedEvent.processSteps.map((step) => (
                  <Step
                    key={step.id}
                    title={step.title}
                    description={
                      <div>
                        <div>操作人: {step.operator}</div>
                        {step.operateTime && <div>时间: {step.operateTime}</div>}
                        <div>说明: {step.description}</div>
                        {step.duration && <div>耗时: {step.duration}分钟</div>}
                        {step.comments && <div>备注: {step.comments}</div>}
                      </div>
                    }
                    status={step.status === 'completed' ? 'finish' : 
                           step.status === 'in-progress' ? 'process' : 
                           step.status === 'cancelled' ? 'error' : 'wait'}
                  />
                ))}
              </Steps>
            </Card>

            {/* 参与人员 */}
            {selectedEvent.participants.length > 0 && (
              <Card title="参与人员" size="small" style={{ marginBottom: '16px' }}>
                <List
                  dataSource={selectedEvent.participants}
                  renderItem={(participant) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: participant.role === 'reporter' ? token.colorPrimary : 
                                             participant.role === 'handler' ? token.colorSuccess : 
                                             participant.role === 'supervisor' ? token.colorWarning : token.colorInfo 
                            }}
                            icon={<UserOutlined />}
                          />
                        }
                        title={
                          <Space>
                            {participant.name}
                            <Tag color={participant.role === 'reporter' ? 'blue' : 
                                       participant.role === 'handler' ? 'green' : 
                                       participant.role === 'supervisor' ? 'orange' : 'default'}>
                              {participant.role === 'reporter' ? '报告人' : 
                               participant.role === 'handler' ? '处理人' : 
                               participant.role === 'supervisor' ? '监督人' : 
                               participant.role === 'witness' ? '证人' : '受影响人'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            {participant.phone && <div><PhoneOutlined /> {participant.phone}</div>}
                            {participant.department && <div><HomeOutlined /> {participant.department}</div>}
                            <div>{participant.involvement}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 附件 */}
            {selectedEvent.attachments.length > 0 && (
              <Card title="相关附件" size="small" style={{ marginBottom: '16px' }}>
                <List
                  dataSource={selectedEvent.attachments}
                  renderItem={(attachment) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ backgroundColor: token.colorPrimary }}
                            icon={attachment.type === 'image' ? <CameraOutlined /> : 
                                  attachment.type === 'video' ? <CameraOutlined /> : 
                                  <FileTextOutlined />}
                          />
                        }
                        title={attachment.name}
                        description={
                          <div>
                            <div>类型: {attachment.type === 'image' ? '图片' : 
                                     attachment.type === 'video' ? '视频' : 
                                     attachment.type === 'document' ? '文档' : '音频'}</div>
                            <div>大小: {attachment.size}</div>
                            <div>上传者: {attachment.uploader}</div>
                            <div>上传时间: {attachment.uploadTime}</div>
                          </div>
                        }
                      />
                      <Button type="link" icon={<EyeOutlined />}>查看</Button>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 反馈评价 */}
            {selectedEvent.feedback && (
              <Card title="反馈评价" size="small">
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>满意度评分:</Text>
                    <Rate disabled defaultValue={selectedEvent.feedback.rating} style={{ marginLeft: '8px' }} />
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>评价内容:</Text> {selectedEvent.feedback.comment}
                  </div>
                  <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                    评价人: {selectedEvent.feedback.submittedBy} | 
                    评价时间: {selectedEvent.feedback.submitTime}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </Drawer>

      {/* 新增/编辑事件模态框 */}
      <Modal
        title={editingEvent ? '编辑事件信息' : '新增事件'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            const formattedValues = {
              ...values,
              createTime: values.createTime.format('YYYY-MM-DD HH:mm:ss'),
              deadline: values.deadline ? values.deadline.format('YYYY-MM-DD HH:mm:ss') : undefined,
              id: editingEvent?.id || Date.now().toString(),
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              processSteps: editingEvent?.processSteps || [
                {
                  id: '1',
                  title: '事件登记',
                  description: '事件已成功登记到系统',
                  operator: '系统管理员',
                  operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  status: 'completed'
                }
              ],
              attachments: editingEvent?.attachments || [],
              participants: editingEvent?.participants || [],
              tags: editingEvent?.tags || []
            };

            if (editingEvent) {
              setEvents(events.map(event => 
                event.id === editingEvent.id ? { ...event, ...formattedValues } : event
              ));
              message.success('更新成功');
            } else {
              setEvents([...events, formattedValues as Event]);
              message.success('添加成功');
            }
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingEvent(null);
          form.resetFields();
        }}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="事件标题" name="title" rules={[{ required: true, message: '请输入事件标题' }]}>
                <Input placeholder="请输入事件标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="事件类型" name="type" rules={[{ required: true, message: '请选择事件类型' }]}>
                <Select placeholder="请选择事件类型">
                  <Option value="emergency">紧急事件</Option>
                  <Option value="maintenance">维护保养</Option>
                  <Option value="community">社区活动</Option>
                  <Option value="safety">安全事件</Option>
                  <Option value="service">服务事件</Option>
                  <Option value="other">其他事件</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="影响程度" name="impact" rules={[{ required: true, message: '请选择影响程度' }]}>
                <Select placeholder="请选择影响程度">
                  <Option value="low">低影响</Option>
                  <Option value="medium">中等影响</Option>
                  <Option value="high">高影响</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="事件分类" name="category" rules={[{ required: true, message: '请输入事件分类' }]}>
                <Input placeholder="如：设备故障" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="事发地点" name="location" rules={[{ required: true, message: '请输入事发地点' }]}>
                <Input placeholder="请输入事发地点" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="创建时间" name="createTime" rules={[{ required: true, message: '请选择创建时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="报告人" name="reportedBy" rules={[{ required: true, message: '请输入报告人姓名' }]}>
                <Input placeholder="请输入报告人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="reporterPhone" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="事件描述" name="description" rules={[{ required: true, message: '请输入事件描述' }]}>
            <Input.TextArea rows={4} placeholder="请详细描述事件经过" />
          </Form.Item>

          {editingEvent && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="负责人" name="assignedTo">
                    <Input placeholder="请输入负责人" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="负责部门" name="department">
                    <Input placeholder="请输入负责部门" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="处理期限" name="deadline">
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择状态">
                      <Option value="pending">待处理</Option>
                      <Option value="processing">处理中</Option>
                      <Option value="resolved">已解决</Option>
                      <Option value="closed">已关闭</Option>
                      <Option value="cancelled">已取消</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item label="处理方案" name="solution">
                <Input.TextArea rows={3} placeholder="请输入处理方案" />
              </Form.Item>

              <Form.Item label="处理成本" name="cost">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="请输入处理成本" 
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                />
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

export default EventManagementPage;
