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
  Checkbox,
  Radio,
  theme
} from 'antd';
import {
  ProjectOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
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
  CalendarOutlined,
  BellOutlined,
  BookOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DollarOutlined,
  TrophyOutlined,
  CrownOutlined,
  RocketOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const { RangePicker } = DatePicker;

interface WorkTask {
  id: string;
  title: string;
  type: 'routine' | 'project' | 'emergency' | 'inspection' | 'meeting' | 'training';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
  category: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  department: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progress: number;
  workload: number; // 预计工时（小时）
  actualWorkload?: number; // 实际工时
  tags: string[];
  subtasks: SubTask[];
  attachments: WorkAttachment[];
  comments: WorkComment[];
  requirements: string[];
  deliverables: string[];
  budget?: number;
  actualCost?: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
}

interface SubTask {
  id: string;
  title: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate: string;
  progress: number;
  description: string;
}

interface WorkAttachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'other';
  url: string;
  uploadTime: string;
  uploader: string;
  size: string;
}

interface WorkComment {
  id: string;
  content: string;
  author: string;
  createTime: string;
  type: 'comment' | 'update' | 'issue';
}

interface WorkReport {
  id: string;
  taskId: string;
  taskTitle: string;
  reporter: string;
  reportDate: string;
  period: string;
  progress: number;
  completedWork: string;
  nextPlan: string;
  issues: string[];
  suggestions: string[];
  workHours: number;
  satisfaction: number;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  skills: string[];
  workload: number; // 当前工作负荷（百分比）
  performance: number; // 绩效评分
  totalTasks: number;
  completedTasks: number;
  averageRating: number;
  status: 'available' | 'busy' | 'leave' | 'training';
}

const WorkManagementPage: React.FC = () => {
  const { token } = useToken();
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [editingTask, setEditingTask] = useState<WorkTask | null>(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟工作任务数据
    setTasks([
      {
        id: '1',
        title: '社区设施安全检查',
        type: 'inspection',
        priority: 'high',
        status: 'in-progress',
        category: '安全管理',
        description: '对社区内所有公共设施进行全面安全检查，包括健身器材、儿童游乐设施、照明设备等',
        assignedTo: ['赵磊', '李明'],
        assignedBy: '物业经理',
        department: '安全管理部',
        startDate: '2025-08-15',
        endDate: '2025-08-25',
        actualStartDate: '2025-08-15',
        progress: 60,
        workload: 40,
        actualWorkload: 25,
        tags: ['安全检查', '设施维护', '风险评估'],
        subtasks: [
          {
            id: '1',
            title: '健身器材检查',
            assignedTo: '赵磊',
            status: 'completed',
            startDate: '2025-08-15',
            endDate: '2025-08-18',
            progress: 100,
            description: '检查所有健身器材的安全性和功能性'
          },
          {
            id: '2',
            title: '儿童游乐设施检查',
            assignedTo: '李明',
            status: 'in-progress',
            startDate: '2025-08-19',
            endDate: '2025-08-22',
            progress: 70,
            description: '检查儿童游乐设施的安全性'
          },
          {
            id: '3',
            title: '照明设备检查',
            assignedTo: '赵磊',
            status: 'pending',
            startDate: '2025-08-23',
            endDate: '2025-08-25',
            progress: 0,
            description: '检查社区照明设备运行状况'
          }
        ],
        attachments: [
          {
            id: '1',
            name: '安全检查清单',
            type: 'document',
            url: '/attachments/safety_checklist.pdf',
            uploadTime: '2025-08-15 09:00:00',
            uploader: '赵磊',
            size: '2.1MB'
          }
        ],
        comments: [
          {
            id: '1',
            content: '健身器材检查已完成，发现2台设备需要维修',
            author: '赵磊',
            createTime: '2025-08-18 16:30:00',
            type: 'update'
          }
        ],
        requirements: ['专业检测工具', '安全防护装备', '检查记录表'],
        deliverables: ['安全检查报告', '问题清单', '整改建议'],
        budget: 5000,
        actualCost: 3200,
        riskLevel: 'medium',
        notes: '需要重点关注老旧设施的安全性'
      },
      {
        id: '2',
        title: '社区文化活动策划',
        type: 'project',
        priority: 'medium',
        status: 'pending',
        category: '社区服务',
        description: '策划春节期间社区文化活动，包括文艺演出、游戏互动、美食展示等',
        assignedTo: ['王强', '赵明'],
        assignedBy: '社区主任',
        department: '社区服务部',
        startDate: '2025-08-22',
        endDate: '2025-08-05',
        progress: 20,
        workload: 80,
        tags: ['文化活动', '春节', '居民服务'],
        subtasks: [
          {
            id: '1',
            title: '活动方案设计',
            assignedTo: '王强',
            status: 'in-progress',
            startDate: '2025-08-22',
            endDate: '2025-08-26',
            progress: 50,
            description: '制定详细的活动方案和流程'
          },
          {
            id: '2',
            title: '资源采购',
            assignedTo: '赵明',
            status: 'pending',
            startDate: '2025-08-27',
            endDate: '2025-08-30',
            progress: 0,
            description: '采购活动所需物资和设备'
          }
        ],
        attachments: [],
        comments: [],
        requirements: ['活动场地', '音响设备', '装饰用品', '安全保障'],
        deliverables: ['活动方案', '预算清单', '执行计划', '效果评估'],
        budget: 15000,
        riskLevel: 'low'
      },
      {
        id: '3',
        title: '物业费收缴工作',
        type: 'routine',
        priority: 'medium',
        status: 'completed',
        category: '财务管理',
        description: '进行本月物业费收缴工作，包括费用核算、催缴通知、收款记录等',
        assignedTo: ['钱亮'],
        assignedBy: '财务主管',
        department: '财务部',
        startDate: '2025-08-01',
        endDate: '2025-08-15',
        actualStartDate: '2025-08-01',
        actualEndDate: '2025-08-14',
        progress: 100,
        workload: 30,
        actualWorkload: 28,
        tags: ['物业费', '财务管理', '收缴'],
        subtasks: [
          {
            id: '1',
            title: '费用核算',
            assignedTo: '钱亮',
            status: 'completed',
            startDate: '2025-08-01',
            endDate: '2025-08-05',
            progress: 100,
            description: '核算各户物业费用'
          },
          {
            id: '2',
            title: '催缴通知',
            assignedTo: '钱亮',
            status: 'completed',
            startDate: '2025-08-06',
            endDate: '2025-08-10',
            progress: 100,
            description: '向未缴费住户发送催缴通知'
          }
        ],
        attachments: [
          {
            id: '1',
            name: '收费统计表',
            type: 'document',
            url: '/attachments/fee_statistics.xlsx',
            uploadTime: '2025-08-14 18:00:00',
            uploader: '钱亮',
            size: '1.5MB'
          }
        ],
        comments: [
          {
            id: '1',
            content: '本月收缴率达到95%，较上月提升3%',
            author: '钱亮',
            createTime: '2025-08-14 18:30:00',
            type: 'update'
          }
        ],
        requirements: ['收费系统', '打印设备', '催缴通知单'],
        deliverables: ['收费统计报表', '欠费清单', '收缴分析报告'],
        budget: 2000,
        actualCost: 1800,
        riskLevel: 'low',
        notes: '收缴效果良好，需要继续保持'
      }
    ]);

    // 模拟工作报告数据
    setReports([
      {
        id: '1',
        taskId: '1',
        taskTitle: '社区设施安全检查',
        reporter: '张伟',
        reportDate: '2025-08-20',
        period: '2024年第3周',
        progress: 60,
        completedWork: '完成了健身器材检查，发现并记录了2处安全隐患；开始儿童游乐设施检查',
        nextPlan: '继续完成儿童游乐设施检查，准备开始照明设备检查',
        issues: ['部分健身器材螺丝松动', '游乐设施防护垫老化'],
        suggestions: ['建议加强日常巡检', '制定设备更新计划'],
        workHours: 25,
        satisfaction: 4
      },
      {
        id: '2',
        taskId: '3',
        taskTitle: '物业费收缴工作',
        reporter: '钱亮',
        reportDate: '2025-08-14',
        period: '2024年1月上半月',
        progress: 100,
        completedWork: '完成本月物业费收缴，收缴率95%，整理完成收费统计报表',
        nextPlan: '准备下月收费计划，优化收费流程',
        issues: ['个别住户拒绝缴费', '银行转账手续繁琐'],
        suggestions: ['推广线上缴费方式', '加强政策宣传'],
        workHours: 28,
        satisfaction: 5
      }
    ]);

    // 模拟员工数据
    setEmployees([
      {
        id: '1',
        name: '张伟',
        department: '安全管理部',
        position: '安全主管',
        phone: '13800138001',
        email: 'zhangsan@community.com',
        skills: ['安全检查', '设备维护', '风险评估'],
        workload: 80,
        performance: 4.5,
        totalTasks: 15,
        completedTasks: 12,
        averageRating: 4.3,
        status: 'busy'
      },
      {
        id: '2',
        name: '李明',
        department: '安全管理部',
        position: '安全员',
        phone: '13800138002',
        email: 'lisi@community.com',
        skills: ['设施检查', '安全培训'],
        workload: 60,
        performance: 4.2,
        totalTasks: 12,
        completedTasks: 10,
        averageRating: 4.1,
        status: 'busy'
      },
      {
        id: '3',
        name: '王强',
        department: '社区服务部',
        position: '活动策划员',
        phone: '13800138003',
        email: 'wangwu@community.com',
        skills: ['活动策划', '项目管理', '文案写作'],
        workload: 45,
        performance: 4.7,
        totalTasks: 10,
        completedTasks: 9,
        averageRating: 4.6,
        status: 'available'
      },
      {
        id: '4',
        name: '钱亮',
        department: '财务部',
        position: '财务专员',
        phone: '13800138004',
        email: 'qianliang@community.com',
        skills: ['财务管理', '数据分析', '系统操作'],
        workload: 70,
        performance: 4.8,
        totalTasks: 8,
        completedTasks: 8,
        averageRating: 4.7,
        status: 'available'
      }
    ]);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'routine': return <ClockCircleOutlined />;
      case 'project': return <ProjectOutlined />;
      case 'emergency': return <WarningOutlined />;
      case 'inspection': return <EyeOutlined />;
      case 'meeting': return <TeamOutlined />;
      case 'training': return <BookOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return token.colorPrimary;
      case 'project': return token.colorSuccess;
      case 'emergency': return token.colorError;
      case 'inspection': return token.colorWarning;
      case 'meeting': return token.colorInfo;
      case 'training': return '#722ed1';
      default: return token.colorTextSecondary;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'routine': return '日常工作';
      case 'project': return '项目任务';
      case 'emergency': return '紧急任务';
      case 'inspection': return '检查任务';
      case 'meeting': return '会议任务';
      case 'training': return '培训任务';
      default: return '其他任务';
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
      case 'completed': return token.colorSuccess;
      case 'in-progress': return token.colorPrimary;
      case 'pending': return token.colorWarning;
      case 'overdue': return token.colorError;
      case 'cancelled': return token.colorTextSecondary;
      default: return token.colorTextSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'in-progress': return '进行中';
      case 'pending': return '待开始';
      case 'overdue': return '已延期';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return token.colorError;
      case 'medium': return token.colorWarning;
      case 'low': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return '高风险';
      case 'medium': return '中等风险';
      case 'low': return '低风险';
      default: return level;
    }
  };

  const getEmployeeStatusColor = (status: string) => {
    switch (status) {
      case 'available': return token.colorSuccess;
      case 'busy': return token.colorWarning;
      case 'leave': return token.colorTextSecondary;
      case 'training': return token.colorInfo;
      default: return token.colorTextSecondary;
    }
  };

  const getEmployeeStatusText = (status: string) => {
    switch (status) {
      case 'available': return '空闲';
      case 'busy': return '忙碌';
      case 'leave': return '请假';
      case 'training': return '培训';
      default: return status;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchText === '' || 
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase()) ||
      task.assignedTo.some(person => person.toLowerCase().includes(searchText.toLowerCase()));
    const matchesType = selectedType === 'all' || task.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || task.department === selectedDepartment;
    
    let matchesDateRange = true;
    if (dateRange[0] && dateRange[1]) {
      const taskStartDate = dayjs(task.startDate);
      const taskEndDate = dayjs(task.endDate);
      matchesDateRange = (taskStartDate.isAfter(dateRange[0].startOf('day')) && 
                         taskStartDate.isBefore(dateRange[1].endOf('day'))) ||
                        (taskEndDate.isAfter(dateRange[0].startOf('day')) && 
                         taskEndDate.isBefore(dateRange[1].endOf('day')));
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDepartment && matchesDateRange;
  });

  const handleAddTask = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTask = (task: WorkTask) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      startDate: dayjs(task.startDate),
      endDate: dayjs(task.endDate),
      actualStartDate: task.actualStartDate ? dayjs(task.actualStartDate) : null,
      actualEndDate: task.actualEndDate ? dayjs(task.actualEndDate) : null
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (task: WorkTask) => {
    setSelectedTask(task);
    setIsDrawerVisible(true);
  };

  const handleDeleteTask = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个工作任务吗？删除后将无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        setTasks(tasks.filter(task => task.id !== id));
        message.success('删除成功');
      }
    });
  };

  // 统计数据
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue' || (t.status !== 'completed' && dayjs(t.endDate).isBefore(dayjs()))).length;
  const totalBudget = tasks.reduce((sum, t) => sum + (t.budget || 0), 0);
  const actualCost = tasks.reduce((sum, t) => sum + (t.actualCost || 0), 0);

  // 图表配置
  const taskTypeChartOption = {
    title: { text: '任务类型分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '任务数量',
      type: 'pie',
      radius: '50%',
      data: Object.entries(
        tasks.reduce((acc, task) => {
          acc[getTypeText(task.type)] = (acc[getTypeText(task.type)] || 0) + 1;
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

  const workloadChartOption = {
    title: { text: '部门工作负荷', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: Array.from(new Set(tasks.map(t => t.department)))
    },
    yAxis: { type: 'value' },
    series: [{
      name: '任务数量',
      type: 'bar',
      data: Array.from(new Set(tasks.map(t => t.department))).map(dept => 
        tasks.filter(t => t.department === dept).length
      ),
      itemStyle: { color: token.colorPrimary }
    }]
  };

  const columns = [
    {
      title: '任务信息',
      key: 'task',
      render: (record: WorkTask) => (
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
              {record.category} | {record.department}
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              负责人: {record.assignedTo.join(', ')}
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
        { text: '日常工作', value: 'routine' },
        { text: '项目任务', value: 'project' },
        { text: '紧急任务', value: 'emergency' },
        { text: '检查任务', value: 'inspection' },
        { text: '会议任务', value: 'meeting' },
        { text: '培训任务', value: 'training' }
      ],
      onFilter: (value: any, record: WorkTask) => record.type === value
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string, record: WorkTask) => (
        <Space direction="vertical" size="small">
          <Tag color={getPriorityColor(priority)}>
            {getPriorityText(priority)}
          </Tag>
          <Tag color={getRiskLevelColor(record.riskLevel)}>
            {getRiskLevelText(record.riskLevel)}
          </Tag>
        </Space>
      ),
      sorter: (a: WorkTask, b: WorkTask) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      }
    },
    {
      title: '状态与进度',
      key: 'status',
      render: (record: WorkTask) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(record.status)}>
            {getStatusText(record.status)}
          </Tag>
          <Progress percent={record.progress} size="small" />
          <div style={{ fontSize: '12px', textAlign: 'center' }}>
            {record.progress}% 完成
          </div>
        </Space>
      ),
      filters: [
        { text: '待开始', value: 'pending' },
        { text: '进行中', value: 'in-progress' },
        { text: '已完成', value: 'completed' },
        { text: '已延期', value: 'overdue' },
        { text: '已取消', value: 'cancelled' }
      ],
      onFilter: (value: any, record: WorkTask) => record.status === value
    },
    {
      title: '时间信息',
      key: 'time',
      render: (record: WorkTask) => (
        <div style={{ fontSize: '12px' }}>
          <div><CalendarOutlined /> 计划: {record.startDate} ~ {record.endDate}</div>
          {record.actualStartDate && (
            <div><ClockCircleOutlined /> 实际开始: {record.actualStartDate}</div>
          )}
          {record.actualEndDate && (
            <div><CheckCircleOutlined /> 实际完成: {record.actualEndDate}</div>
          )}
          <div style={{ 
            color: dayjs(record.endDate).isBefore(dayjs()) && record.status !== 'completed' ? 
              token.colorError : token.colorTextSecondary 
          }}>
            {dayjs(record.endDate).isBefore(dayjs()) && record.status !== 'completed' ? 
              `延期 ${dayjs().diff(dayjs(record.endDate), 'day')} 天` : 
              `剩余 ${dayjs(record.endDate).diff(dayjs(), 'day')} 天`}
          </div>
        </div>
      )
    },
    {
      title: '工作量',
      key: 'workload',
      render: (record: WorkTask) => (
        <div style={{ fontSize: '12px' }}>
          <div>预计: {record.workload}小时</div>
          {record.actualWorkload && (
            <div>实际: {record.actualWorkload}小时</div>
          )}
          {record.budget && (
            <div style={{ color: token.colorSuccess }}>
              预算: ¥{record.budget.toLocaleString()}
            </div>
          )}
          {record.actualCost && (
            <div style={{ color: record.actualCost > (record.budget || 0) ? token.colorError : token.colorSuccess }}>
              成本: ¥{record.actualCost.toLocaleString()}
            </div>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WorkTask) => (
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
          {(record.status === 'in-progress' || record.status === 'pending') && (
            <Button
              type="text"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: '标记为已完成',
                  content: '确定要将此任务标记为已完成吗？',
                  onOk: () => {
                    setTasks(tasks.map(t => 
                      t.id === record.id ? { 
                        ...t, 
                        status: 'completed', 
                        progress: 100,
                        actualEndDate: dayjs().format('YYYY-MM-DD')
                      } : t
                    ));
                    message.success('任务已标记为完成');
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
            onClick={() => handleDeleteTask(record.id)}
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
              <ProjectOutlined style={{ marginRight: '12px' }} />
              工作管理系统
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              统一管理各类工作任务，科学分配人力资源，提升工作效率和质量
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddTask}>
                新建任务
              </Button>
              <Button type="primary" ghost icon={<BarChartOutlined />}>
                工作报告
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
              延期任务: {overdueTasks}个
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="预算执行率"
              value={totalBudget > 0 ? Math.round((actualCost / totalBudget) * 100) : 0}
              suffix="%"
              valueStyle={{ color: token.colorError }}
              prefix={<DollarOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              实际成本: ¥{actualCost.toLocaleString()}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><FileTextOutlined />任务列表</span>} key="tasks">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索任务标题、描述、负责人..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="任务类型"
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部类型</Option>
                    <Option value="routine">日常工作</Option>
                    <Option value="project">项目任务</Option>
                    <Option value="emergency">紧急任务</Option>
                    <Option value="inspection">检查任务</Option>
                    <Option value="meeting">会议任务</Option>
                    <Option value="training">培训任务</Option>
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
                    <Option value="pending">待开始</Option>
                    <Option value="in-progress">进行中</Option>
                    <Option value="completed">已完成</Option>
                    <Option value="overdue">已延期</Option>
                    <Option value="cancelled">已取消</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="部门"
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部部门</Option>
                    <Option value="安全管理部">安全管理部</Option>
                    <Option value="社区服务部">社区服务部</Option>
                    <Option value="财务部">财务部</Option>
                    <Option value="物业管理部">物业管理部</Option>
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

            {/* 任务列表 */}
            <Table
              columns={columns}
              dataSource={filteredTasks}
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

          <TabPane tab={<span><TeamOutlined />人员管理</span>} key="employees">
            <Row gutter={[24, 24]}>
              {employees.map((employee) => (
                <Col xs={24} sm={12} lg={8} key={employee.id}>
                  <Card
                    hoverable
                    title={
                      <Space>
                        <Avatar size={40} icon={<UserOutlined />} />
                        {employee.name}
                      </Space>
                    }
                    extra={
                      <Tag color={getEmployeeStatusColor(employee.status)}>
                        {getEmployeeStatusText(employee.status)}
                      </Tag>
                    }
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<CalendarOutlined />}>分配任务</Button>
                    ]}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="部门">{employee.department}</Descriptions.Item>
                      <Descriptions.Item label="职位">{employee.position}</Descriptions.Item>
                      <Descriptions.Item label="联系方式">
                        <div><PhoneOutlined /> {employee.phone}</div>
                        <div style={{ fontSize: '11px' }}>{employee.email}</div>
                      </Descriptions.Item>
                      <Descriptions.Item label="工作负荷">
                        <Progress percent={employee.workload} size="small" />
                        <div style={{ fontSize: '11px', textAlign: 'center' }}>{employee.workload}%</div>
                      </Descriptions.Item>
                      <Descriptions.Item label="绩效评分">
                        <Rate disabled defaultValue={employee.performance} style={{ fontSize: '12px' }} />
                        <span style={{ marginLeft: '8px' }}>{employee.performance}</span>
                      </Descriptions.Item>
                      <Descriptions.Item label="任务完成">
                        {employee.completedTasks}/{employee.totalTasks} 
                        <span style={{ marginLeft: '8px', fontSize: '11px' }}>
                          (完成率: {Math.round((employee.completedTasks / employee.totalTasks) * 100)}%)
                        </span>
                      </Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: '12px' }}>
                      <Text strong>技能标签:</Text>
                      <div style={{ marginTop: '4px' }}>
                        {employee.skills.map(skill => (
                          <Tag key={skill}>{skill}</Tag>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><BookOutlined />工作报告</span>} key="reports">
            <List
              dataSource={reports}
              renderItem={(report) => (
                <List.Item>
                  <Card style={{ width: '100%' }}>
                    <Row>
                      <Col flex="1">
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                          {report.taskTitle} - {report.period}报告
                        </div>
                        <Space wrap style={{ marginBottom: '12px' }}>
                          <Tag>报告人: {report.reporter}</Tag>
                          <Tag>报告日期: {report.reportDate}</Tag>
                          <Tag color="blue">工作时长: {report.workHours}小时</Tag>
                          <Rate disabled defaultValue={report.satisfaction} style={{ fontSize: '12px' }} />
                        </Space>
                        
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong>完成工作:</Text>
                          <div style={{ marginTop: '4px', color: token.colorTextSecondary }}>
                            {report.completedWork}
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong>下期计划:</Text>
                          <div style={{ marginTop: '4px', color: token.colorTextSecondary }}>
                            {report.nextPlan}
                          </div>
                        </div>
                        
                        {report.issues.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <Text strong>遇到问题:</Text>
                            <ul style={{ margin: '4px 0 0 16px', color: token.colorTextSecondary }}>
                              {report.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {report.suggestions.length > 0 && (
                          <div>
                            <Text strong>改进建议:</Text>
                            <ul style={{ margin: '4px 0 0 16px', color: token.colorTextSecondary }}>
                              {report.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Col>
                      <Col>
                        <div style={{ textAlign: 'center' }}>
                          <Progress
                            type="circle"
                            percent={report.progress}
                            size={80}
                          />
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            任务进度
                          </div>
                          <Space direction="vertical" style={{ marginTop: '16px' }}>
                            <Button type="primary" size="small">
                              查看详情
                            </Button>
                            <Button size="small">
                              评价反馈
                            </Button>
                          </Space>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab={<span><BarChartOutlined />数据分析</span>} key="analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="任务类型分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={taskTypeChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="部门工作负荷" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={workloadChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="工作效率统计" style={{ borderRadius: '12px' }}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Statistic title="任务完成率" value={Math.round((completedTasks / totalTasks) * 100)} suffix="%" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="平均任务周期" value={8.5} suffix="天" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="员工平均满意度" value={4.4} suffix="/5.0" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 任务详情抽屉 */}
      <Drawer
        title="任务详细信息"
        placement="right"
        width={800}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedTask && (
          <div>
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                {selectedTask.title}
              </div>
              <Space wrap>
                <Tag color={getTypeColor(selectedTask.type)} icon={getTypeIcon(selectedTask.type)}>
                  {getTypeText(selectedTask.type)}
                </Tag>
                <Tag color={getPriorityColor(selectedTask.priority)}>
                  {getPriorityText(selectedTask.priority)}优先级
                </Tag>
                <Tag color={getStatusColor(selectedTask.status)}>
                  {getStatusText(selectedTask.status)}
                </Tag>
                <Tag color={getRiskLevelColor(selectedTask.riskLevel)}>
                  {getRiskLevelText(selectedTask.riskLevel)}
                </Tag>
              </Space>
            </Card>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="任务分类">{selectedTask.category}</Descriptions.Item>
              <Descriptions.Item label="所属部门">{selectedTask.department}</Descriptions.Item>
              <Descriptions.Item label="负责人">{selectedTask.assignedTo.join(', ')}</Descriptions.Item>
              <Descriptions.Item label="分配人">{selectedTask.assignedBy}</Descriptions.Item>
              <Descriptions.Item label="计划开始">{selectedTask.startDate}</Descriptions.Item>
              <Descriptions.Item label="计划结束">{selectedTask.endDate}</Descriptions.Item>
              {selectedTask.actualStartDate && (
                <Descriptions.Item label="实际开始">{selectedTask.actualStartDate}</Descriptions.Item>
              )}
              {selectedTask.actualEndDate && (
                <Descriptions.Item label="实际结束">{selectedTask.actualEndDate}</Descriptions.Item>
              )}
              <Descriptions.Item label="预计工时">{selectedTask.workload}小时</Descriptions.Item>
              {selectedTask.actualWorkload && (
                <Descriptions.Item label="实际工时">{selectedTask.actualWorkload}小时</Descriptions.Item>
              )}
              {selectedTask.budget && (
                <Descriptions.Item label="预算">¥{selectedTask.budget.toLocaleString()}</Descriptions.Item>
              )}
              {selectedTask.actualCost && (
                <Descriptions.Item label="实际成本">¥{selectedTask.actualCost.toLocaleString()}</Descriptions.Item>
              )}
              <Descriptions.Item label="任务描述" span={2}>
                {selectedTask.description}
              </Descriptions.Item>
            </Descriptions>

            {/* 任务进度 */}
            <Card title="任务进度" size="small" style={{ marginBottom: '16px' }}>
              <Progress percent={selectedTask.progress} />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                {selectedTask.progress}% 完成
              </div>
            </Card>

            {/* 子任务 */}
            {selectedTask.subtasks.length > 0 && (
              <Card title="子任务列表" size="small" style={{ marginBottom: '16px' }}>
                <List
                  dataSource={selectedTask.subtasks}
                  renderItem={(subtask) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            size="small"
                            style={{ 
                              backgroundColor: subtask.status === 'completed' ? token.colorSuccess : 
                                             subtask.status === 'in-progress' ? token.colorPrimary : token.colorWarning 
                            }}
                            icon={subtask.status === 'completed' ? <CheckCircleOutlined /> : 
                                  subtask.status === 'in-progress' ? <ClockCircleOutlined /> : <ExclamationCircleOutlined />}
                          />
                        }
                        title={
                          <Space>
                            {subtask.title}
                            <Tag color={subtask.status === 'completed' ? 'success' : 
                                       subtask.status === 'in-progress' ? 'processing' : 'warning'}>
                              {subtask.status === 'completed' ? '已完成' : 
                               subtask.status === 'in-progress' ? '进行中' : '待开始'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            <div>负责人: {subtask.assignedTo}</div>
                            <div>时间: {subtask.startDate} ~ {subtask.endDate}</div>
                            <div>{subtask.description}</div>
                            <Progress percent={subtask.progress} size="small" style={{ marginTop: '4px' }} />
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 需求和交付物 */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Card title="任务需求" size="small">
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {selectedTask.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="交付物" size="small">
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {selectedTask.deliverables.map((deliverable, index) => (
                      <li key={index}>{deliverable}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            </Row>

            {/* 附件 */}
            {selectedTask.attachments.length > 0 && (
              <Card title="相关附件" size="small" style={{ marginBottom: '16px' }}>
                <List
                  dataSource={selectedTask.attachments}
                  renderItem={(attachment) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ backgroundColor: token.colorPrimary }}
                            icon={<FileTextOutlined />}
                          />
                        }
                        title={attachment.name}
                        description={
                          <div>
                            <div>类型: {attachment.type === 'document' ? '文档' : 
                                     attachment.type === 'image' ? '图片' : 
                                     attachment.type === 'video' ? '视频' : '其他'}</div>
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

            {/* 工作日志 */}
            {selectedTask.comments.length > 0 && (
              <Card title="工作日志" size="small">
                <Timeline>
                  {selectedTask.comments.map((comment) => (
                    <Timeline.Item
                      key={comment.id}
                      color={comment.type === 'update' ? 'blue' : 
                             comment.type === 'issue' ? 'red' : 'green'}
                    >
                      <div style={{ fontWeight: 'bold' }}>
                        {comment.author} - {comment.createTime}
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        {comment.content}
                      </div>
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
        title={editingTask ? '编辑工作任务' : '新建工作任务'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            const formattedValues = {
              ...values,
              startDate: values.startDate.format('YYYY-MM-DD'),
              endDate: values.endDate.format('YYYY-MM-DD'),
              actualStartDate: values.actualStartDate ? values.actualStartDate.format('YYYY-MM-DD') : undefined,
              actualEndDate: values.actualEndDate ? values.actualEndDate.format('YYYY-MM-DD') : undefined,
              id: editingTask?.id || Date.now().toString(),
              subtasks: editingTask?.subtasks || [],
              attachments: editingTask?.attachments || [],
              comments: editingTask?.comments || [],
              tags: editingTask?.tags || []
            };

            if (editingTask) {
              setTasks(tasks.map(task => 
                task.id === editingTask.id ? { ...task, ...formattedValues } : task
              ));
              message.success('更新成功');
            } else {
              setTasks([...tasks, formattedValues as WorkTask]);
              message.success('添加成功');
            }
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTask(null);
          form.resetFields();
        }}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="任务标题" name="title" rules={[{ required: true, message: '请输入任务标题' }]}>
                <Input placeholder="请输入任务标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="任务类型" name="type" rules={[{ required: true, message: '请选择任务类型' }]}>
                <Select placeholder="请选择任务类型">
                  <Option value="routine">日常工作</Option>
                  <Option value="project">项目任务</Option>
                  <Option value="emergency">紧急任务</Option>
                  <Option value="inspection">检查任务</Option>
                  <Option value="meeting">会议任务</Option>
                  <Option value="training">培训任务</Option>
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
              <Form.Item label="风险级别" name="riskLevel" rules={[{ required: true, message: '请选择风险级别' }]}>
                <Select placeholder="请选择风险级别">
                  <Option value="low">低风险</Option>
                  <Option value="medium">中等风险</Option>
                  <Option value="high">高风险</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务分类" name="category" rules={[{ required: true, message: '请输入任务分类' }]}>
                <Input placeholder="如：安全管理" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="负责部门" name="department" rules={[{ required: true, message: '请输入负责部门' }]}>
                <Input placeholder="请输入负责部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="分配人" name="assignedBy" rules={[{ required: true, message: '请输入分配人' }]}>
                <Input placeholder="请输入分配人" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="计划开始日期" name="startDate" rules={[{ required: true, message: '请选择开始日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="计划结束日期" name="endDate" rules={[{ required: true, message: '请选择结束日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="预计工时" name="workload" rules={[{ required: true, message: '请输入预计工时' }]}>
                <InputNumber style={{ width: '100%' }} placeholder="小时" min={1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="预算" name="budget">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="请输入预算金额（元）" 
                  min={0}
                  addonBefore="¥"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务进度" name="progress">
                <InputNumber style={{ width: '100%' }} placeholder="%" min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="任务描述" name="description" rules={[{ required: true, message: '请输入任务描述' }]}>
            <Input.TextArea rows={4} placeholder="请详细描述任务内容和要求" />
          </Form.Item>

          <Form.Item label="负责人" name="assignedTo" rules={[{ required: true, message: '请选择负责人' }]}>
            <Select mode="multiple" placeholder="请选择负责人">
              {employees.map(emp => (
                <Option key={emp.id} value={emp.name}>{emp.name} - {emp.department}</Option>
              ))}
            </Select>
          </Form.Item>

          {editingTask && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="实际开始日期" name="actualStartDate">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="实际结束日期" name="actualEndDate">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="实际工时" name="actualWorkload">
                    <InputNumber style={{ width: '100%' }} placeholder="小时" min={0} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="实际成本" name="actualCost">
                    <InputNumber 
                      style={{ width: '100%' }} 
                      placeholder="请输入实际成本（元）" 
                      min={0}
                      addonBefore="¥"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="任务状态" name="status">
                <Select placeholder="请选择状态">
                  <Option value="pending">待开始</Option>
                  <Option value="in-progress">进行中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="overdue">已延期</Option>
                  <Option value="cancelled">已取消</Option>
                </Select>
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

export default WorkManagementPage;
