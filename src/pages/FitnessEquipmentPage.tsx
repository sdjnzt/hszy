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
  theme,
  Table,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  message,
  Drawer,
  Progress,
  Timeline,
  List,
  QRCode,
  Tooltip,
  Descriptions,
  Upload,
  Tabs,
  Switch,
  Rate,
  Alert,
  Steps,
  Calendar,
  Popconfirm,
  Image,
  TreeSelect
} from 'antd';
import {
  TrophyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ImportOutlined,
  ExportOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  StarOutlined,
  FireOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined as CheckCircleIcon,
  QrcodeOutlined,
  HistoryOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  SettingOutlined,
  WarningOutlined,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  MonitorOutlined,
  ScanOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  GiftOutlined,
  RocketOutlined,
  CrownOutlined,
  FlagOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;

interface FitnessEquipment {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'recreation';
  brand: string;
  model: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  status: 'normal' | 'maintenance' | 'repair' | 'retired';
  usageCount: number;
  lastMaintenance: string;
  nextMaintenance: string;
  responsiblePerson: string;
  cost: number;
  grid: string;
  description: string;
  qrCode: string;
  specifications: Record<string, string>;
  images: string[];
  rating: number;
  manufacturer: string;
  serialNumber: string;
  installationDate: string;
  lifespan: number;
  energyConsumption?: number;
  safetyLevel: 'A' | 'B' | 'C';
  userManual: string;
  maintenanceContract: string;
  insuranceInfo: string;
}

interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'routine' | 'repair' | 'inspection' | 'upgrade';
  date: string;
  technician: string;
  description: string;
  cost: number;
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  parts: string[];
  beforeImages: string[];
  afterImages: string[];
  nextSchedule?: string;
  notes: string;
}

interface UsageRecord {
  id: string;
  equipmentId: string;
  date: string;
  duration: number;
  users: number;
  satisfaction: number;
  issues: string[];
}

const FitnessEquipmentPage: React.FC = () => {
  const { token } = useToken();
  const [equipment, setEquipment] = useState<FitnessEquipment[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<FitnessEquipment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMaintenanceDrawerVisible, setIsMaintenanceDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGrid, setSelectedGrid] = useState<string>('all');
  const [editingEquipment, setEditingEquipment] = useState<FitnessEquipment | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟健身器材数据
    setEquipment([
      {
        id: '1',
        name: '智能跑步机 Pro',
        type: 'cardio',
        brand: '舒华',
        model: 'SH-T6800i',
        purchaseDate: '2025-08-15',
        warrantyExpiry: '2027-01-15',
        location: '社区广场健身区A区',
        status: 'normal',
        usageCount: 1250,
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10',
        responsiblePerson: '张三',
        cost: 12500,
        grid: 'A区网格',
        description: '智能跑步机，配备心率监测、坡度调节、多种运动程序',
        qrCode: 'FE001',
        specifications: {
          '最大速度': '20km/h',
          '坡度范围': '0-15%',
          '跑带尺寸': '1400×510mm',
          '最大承重': '150kg',
          '功率': '3.5HP'
        },
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        rating: 4.8,
        manufacturer: '舒华体育股份有限公司',
        serialNumber: 'SH240115001',
        installationDate: '2025-08-20',
        lifespan: 10,
        energyConsumption: 2.5,
        safetyLevel: 'A',
        userManual: 'manual_sh_t6800i.pdf',
        maintenanceContract: 'contract_001.pdf',
        insuranceInfo: 'insurance_001.pdf'
      },
      {
        id: '2',
        name: '磁控动感单车',
        type: 'cardio',
        brand: '英派斯',
        model: 'YP-B3000',
        purchaseDate: '2025-08-15',
        warrantyExpiry: '2027-01-15',
        location: '社区广场健身区B区',
        status: 'normal',
        usageCount: 980,
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10',
        responsiblePerson: '李明',
        cost: 4200,
        grid: 'A区网格',
        description: '磁控阻力系统，静音设计，可调节座椅和把手',
        qrCode: 'FE002',
        specifications: {
          '阻力系统': '磁控',
          '飞轮重量': '22kg',
          '座椅调节': '上下前后4向调节',
          '最大承重': '120kg',
          '显示屏': 'LCD多功能显示'
        },
        images: ['/api/placeholder/400/300'],
        rating: 4.5,
        manufacturer: '青岛英派斯健康科技股份有限公司',
        serialNumber: 'YP240115002',
        installationDate: '2025-08-20',
        lifespan: 8,
        safetyLevel: 'A',
        userManual: 'manual_yp_b3000.pdf',
        maintenanceContract: 'contract_002.pdf',
        insuranceInfo: 'insurance_002.pdf'
      },
      {
        id: '3',
        name: '多功能史密斯机',
        type: 'strength',
        brand: '力健',
        model: 'LJ-SM5000',
        purchaseDate: '2025-08-15',
        warrantyExpiry: '2027-01-15',
        location: '社区广场健身区C区',
        status: 'maintenance',
        usageCount: 650,
        lastMaintenance: '2025-08-05',
        nextMaintenance: '2025-08-05',
        responsiblePerson: '王五',
        cost: 18000,
        grid: 'A区网格',
        description: '多功能力量训练器械，包含深蹲、卧推、引体向上等功能',
        qrCode: 'FE003',
        specifications: {
          '导轨长度': '2.2m',
          '配重片': '100kg标准配重',
          '训练功能': '深蹲、卧推、划船等',
          '材质': '优质钢材',
          '安全装置': '多重安全锁定'
        },
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        rating: 4.9,
        manufacturer: '宁波力健体育器材有限公司',
        serialNumber: 'LJ240115003',
        installationDate: '2025-08-20',
        lifespan: 15,
        safetyLevel: 'A',
        userManual: 'manual_lj_sm5000.pdf',
        maintenanceContract: 'contract_003.pdf',
        insuranceInfo: 'insurance_003.pdf'
      },
      {
        id: '4',
        name: '专业瑜伽垫套装',
        type: 'flexibility',
        brand: '迪卡侬',
        model: 'DK-YOGA-001',
        purchaseDate: '2025-08-15',
        warrantyExpiry: '2025-01-15',
        location: '社区活动中心瑜伽室',
        status: 'normal',
        usageCount: 520,
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10',
        responsiblePerson: '赵六',
        cost: 280,
        grid: 'B区网格',
        description: '防滑瑜伽垫，厚度6mm，含瑜伽砖、拉力带等配件',
        qrCode: 'FE004',
        specifications: {
          '材质': 'TPE环保材料',
          '厚度': '6mm',
          '尺寸': '183×61cm',
          '防滑性': '双面防滑纹理',
          '配件': '瑜伽砖×2、拉力带×1'
        },
        images: ['/api/placeholder/400/300'],
        rating: 4.3,
        manufacturer: '迪卡侬（上海）体育用品有限公司',
        serialNumber: 'DK240115004',
        installationDate: '2025-08-20',
        lifespan: 3,
        safetyLevel: 'B',
        userManual: 'manual_dk_yoga.pdf',
        maintenanceContract: '',
        insuranceInfo: ''
      },
      {
        id: '5',
        name: '平衡训练球',
        type: 'balance',
        brand: '迪卡侬',
        model: 'DK-BALL-65',
        purchaseDate: '2025-08-15',
        warrantyExpiry: '2025-01-15',
        location: '社区活动中心康复区',
        status: 'normal',
        usageCount: 380,
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10',
        responsiblePerson: '赵六',
        cost: 120,
        grid: 'B区网格',
        description: '65cm直径平衡球，适合平衡训练和康复运动',
        qrCode: 'FE005',
        specifications: {
          '直径': '65cm',
          '材质': 'PVC防爆材料',
          '最大承重': '120kg',
          '充气方式': '专用充气泵',
          '防爆': '是'
        },
        images: ['/api/placeholder/400/300'],
        rating: 4.2,
        manufacturer: '迪卡侬（上海）体育用品有限公司',
        serialNumber: 'DK240115005',
        installationDate: '2025-08-20',
        lifespan: 5,
        safetyLevel: 'B',
        userManual: 'manual_dk_ball.pdf',
        maintenanceContract: '',
        insuranceInfo: ''
      },
      {
        id: '6',
        name: '专业乒乓球台',
        type: 'recreation',
        brand: '红双喜',
        model: 'DHS-T2828',
        purchaseDate: '2025-08-15',
        warrantyExpiry: '2027-01-15',
        location: '社区活动中心乒乓球室',
        status: 'normal',
        usageCount: 720,
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10',
        responsiblePerson: '钱七',
        cost: 3800,
        grid: 'B区网格',
        description: '国际标准乒乓球台，包含球网、球拍等配件',
        qrCode: 'FE006',
        specifications: {
          '台面尺寸': '2740×1525mm',
          '台面厚度': '25mm',
          '高度': '760mm',
          '材质': '高密度纤维板',
          '配件': '球网、球拍×4、乒乓球×20'
        },
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        rating: 4.7,
        manufacturer: '上海红双喜股份有限公司',
        serialNumber: 'DHS240115006',
        installationDate: '2025-08-20',
        lifespan: 12,
        safetyLevel: 'A',
        userManual: 'manual_dhs_t2828.pdf',
        maintenanceContract: 'contract_006.pdf',
        insuranceInfo: 'insurance_006.pdf'
      }
    ]);

    // 模拟维护记录
    setMaintenanceRecords([
      {
        id: '1',
        equipmentId: '1',
        equipmentName: '智能跑步机 Pro',
        type: 'routine',
        date: '2025-08-10',
        technician: '张师傅',
        description: '常规保养：清洁跑带、检查电机、润滑导轨、校准传感器',
        cost: 300,
        status: 'completed',
        parts: ['润滑油', '清洁剂'],
        beforeImages: ['/api/placeholder/200/150'],
        afterImages: ['/api/placeholder/200/150'],
        nextSchedule: '2025-08-10',
        notes: '设备运行正常，建议定期使用设备自带清洁程序'
      },
      {
        id: '2',
        equipmentId: '3',
        equipmentName: '多功能史密斯机',
        type: 'repair',
        date: '2025-08-20',
        technician: '李师傅',
        description: '更换磨损滑轮，调整配重系统，检查安全锁定机制',
        cost: 680,
        status: 'in-progress',
        parts: ['滑轮×4', '安全锁定器'],
        beforeImages: ['/api/placeholder/200/150'],
        afterImages: [],
        notes: '发现滑轮磨损严重，已更换，正在调试配重系统'
      },
      {
        id: '3',
        equipmentId: '6',
        equipmentName: '专业乒乓球台',
        type: 'inspection',
        date: '2025-08-25',
        technician: '王师傅',
        description: '季度安全检查：台面平整度检测、支架稳定性检查',
        cost: 150,
        status: 'scheduled',
        parts: [],
        beforeImages: [],
        afterImages: [],
        notes: '计划进行台面平整度精密测量'
      }
    ]);

    // 模拟使用记录
    setUsageRecords([
      {
        id: '1',
        equipmentId: '1',
        date: '2025-08-20',
        duration: 180,
        users: 12,
        satisfaction: 4.8,
        issues: []
      },
      {
        id: '2',
        equipmentId: '2',
        date: '2025-08-20',
        duration: 150,
        users: 8,
        satisfaction: 4.5,
        issues: ['座椅调节稍紧']
      },
      {
        id: '3',
        equipmentId: '6',
        date: '2025-08-20',
        duration: 240,
        users: 16,
        satisfaction: 4.7,
        issues: []
      }
    ]);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio': return <FireOutlined />;
      case 'strength': return <ThunderboltOutlined />;
      case 'flexibility': return <HeartOutlined />;
      case 'balance': return <BulbOutlined />;
      case 'recreation': return <StarOutlined />;
      default: return <TrophyOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cardio': return token.colorError;
      case 'strength': return token.colorWarning;
      case 'flexibility': return token.colorSuccess;
      case 'balance': return token.colorInfo;
      case 'recreation': return token.colorPrimary;
      default: return token.colorTextSecondary;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'cardio': return '有氧运动';
      case 'strength': return '力量训练';
      case 'flexibility': return '柔韧性训练';
      case 'balance': return '平衡训练';
      case 'recreation': return '休闲娱乐';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return token.colorSuccess;
      case 'maintenance': return token.colorWarning;
      case 'repair': return token.colorError;
      case 'retired': return token.colorTextSecondary;
      default: return token.colorTextSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircleIcon />;
      case 'maintenance': return <ToolOutlined />;
      case 'repair': return <ExclamationCircleOutlined />;
      case 'retired': return <ClockCircleOutlined />;
      default: return <CheckCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常运行';
      case 'maintenance': return '维护中';
      case 'repair': return '维修中';
      case 'retired': return '已退役';
      default: return status;
    }
  };

  const getSafetyLevelColor = (level: string) => {
    switch (level) {
      case 'A': return token.colorSuccess;
      case 'B': return token.colorWarning;
      case 'C': return token.colorError;
      default: return token.colorTextSecondary;
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = searchText === '' || 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesGrid = selectedGrid === 'all' || item.grid === selectedGrid;
    
    return matchesSearch && matchesType && matchesStatus && matchesGrid;
  });

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditEquipment = (item: FitnessEquipment) => {
    setEditingEquipment(item);
    form.setFieldsValue({
      ...item,
      purchaseDate: dayjs(item.purchaseDate),
      warrantyExpiry: dayjs(item.warrantyExpiry),
      installationDate: dayjs(item.installationDate)
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (item: FitnessEquipment) => {
    setSelectedEquipment(item);
    setIsDrawerVisible(true);
  };

  const handleDeleteEquipment = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个健身器材吗？删除后将无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        setEquipment(equipment.filter(item => item.id !== id));
        message.success('删除成功');
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
        warrantyExpiry: values.warrantyExpiry.format('YYYY-MM-DD'),
        installationDate: values.installationDate.format('YYYY-MM-DD'),
        id: editingEquipment?.id || Date.now().toString(),
        qrCode: editingEquipment?.qrCode || `FE${Date.now().toString().slice(-3)}`,
        usageCount: editingEquipment?.usageCount || 0,
        images: editingEquipment?.images || [],
        specifications: editingEquipment?.specifications || {},
        lastMaintenance: editingEquipment?.lastMaintenance || '',
        nextMaintenance: editingEquipment?.nextMaintenance || ''
      };

      if (editingEquipment) {
        setEquipment(equipment.map(item => 
          item.id === editingEquipment.id ? { ...item, ...formattedValues } : item
        ));
        message.success('更新成功');
      } else {
        setEquipment([...equipment, formattedValues as FitnessEquipment]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingEquipment(null);
    form.resetFields();
  };

  const handleMaintenanceRecord = (item: FitnessEquipment) => {
    setSelectedEquipment(item);
    setIsMaintenanceDrawerVisible(true);
  };

  // 统计数据
  const totalEquipment = equipment.length;
  const totalCost = equipment.reduce((sum, item) => sum + item.cost, 0);
  const normalEquipment = equipment.filter(item => item.status === 'normal').length;
  const maintenanceEquipment = equipment.filter(item => item.status === 'maintenance' || item.status === 'repair').length;
  const averageRating = equipment.reduce((sum, item) => sum + item.rating, 0) / equipment.length;
  const totalUsage = equipment.reduce((sum, item) => sum + item.usageCount, 0);

  // 图表配置
  const typeChartOption = {
    title: { text: '设备类型分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '设备数量',
      type: 'pie',
      radius: '50%',
      data: Object.entries(
        equipment.reduce((acc, item) => {
          acc[getTypeText(item.type)] = (acc[getTypeText(item.type)] || 0) + 1;
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

  const usageChartOption = {
    title: { text: '设备使用统计', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: equipment.map(item => item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name)
    },
    yAxis: { type: 'value' },
    series: [{
      name: '使用次数',
      type: 'bar',
      data: equipment.map(item => item.usageCount),
      itemStyle: { color: token.colorPrimary }
    }]
  };

  const columns = [
    {
      title: '设备信息',
      key: 'equipment',
      render: (record: FitnessEquipment) => (
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
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {record.brand} {record.model}
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              编号: {record.serialNumber}
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
        { text: '有氧运动', value: 'cardio' },
        { text: '力量训练', value: 'strength' },
        { text: '柔韧性训练', value: 'flexibility' },
        { text: '平衡训练', value: 'balance' },
        { text: '休闲娱乐', value: 'recreation' }
      ],
      onFilter: (value: any, record: FitnessEquipment) => record.type === value
    },
    {
      title: '位置 & 网格',
      key: 'location',
      render: (record: FitnessEquipment) => (
        <div>
          <div><EnvironmentOutlined style={{ color: token.colorPrimary }} /> {record.location}</div>
          <Tag color="blue">{record.grid}</Tag>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: FitnessEquipment) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
          <Tag color={getSafetyLevelColor(record.safetyLevel)}>
            安全等级: {record.safetyLevel}
          </Tag>
        </Space>
      ),
      filters: [
        { text: '正常运行', value: 'normal' },
        { text: '维护中', value: 'maintenance' },
        { text: '维修中', value: 'repair' },
        { text: '已退役', value: 'retired' }
      ],
      onFilter: (value: any, record: FitnessEquipment) => record.status === value
    },
    {
      title: '使用情况',
      key: 'usage',
      render: (record: FitnessEquipment) => (
        <Space direction="vertical" size="small">
          <div>
            <Badge count={record.usageCount} style={{ backgroundColor: token.colorPrimary }} />
            <span style={{ marginLeft: '8px', fontSize: '12px' }}>次使用</span>
          </div>
          <Rate disabled defaultValue={record.rating} style={{ fontSize: '12px' }} />
        </Space>
      ),
      sorter: (a: FitnessEquipment, b: FitnessEquipment) => a.usageCount - b.usageCount
    },
    {
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      sorter: (a: FitnessEquipment, b: FitnessEquipment) => a.cost - b.cost,
      render: (cost: number) => (
        <Text strong style={{ color: token.colorSuccess }}>
          ¥{cost.toLocaleString()}
        </Text>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FitnessEquipment) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="维护记录">
            <Button
              type="text"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleMaintenanceRecord(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditEquipment(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个设备吗？"
            onConfirm={() => handleDeleteEquipment(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
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
              <TrophyOutlined style={{ marginRight: '12px' }} />
              健身器材智能管理系统
        </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              全方位健身器材采购、维护、使用数据管理，提升社区健身服务质量
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<ImportOutlined />}>
                批量导入
              </Button>
              <Button type="primary" ghost icon={<ExportOutlined />}>
                导出报表
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEquipment}>
                添加设备
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
              title="设备总数"
              value={totalEquipment}
              suffix="台"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<TrophyOutlined />}
            />
            <Progress percent={Math.round((normalEquipment / totalEquipment) * 100)} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="总投资"
              value={totalCost}
              suffix="元"
              valueStyle={{ color: token.colorSuccess }}
              prefix={<DollarOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              平均成本: ¥{Math.round(totalCost / totalEquipment).toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="正常设备"
              value={normalEquipment}
              suffix={`/ ${totalEquipment}`}
              valueStyle={{ color: token.colorSuccess }}
              prefix={<CheckCircleIcon />}
            />
            <Progress 
              percent={Math.round((normalEquipment / totalEquipment) * 100)} 
              size="small" 
              status="active" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="平均评分"
              value={averageRating.toFixed(1)}
              suffix="/5.0"
              valueStyle={{ color: token.colorWarning }}
              prefix={<StarOutlined />}
            />
            <Rate disabled defaultValue={averageRating} style={{ fontSize: '14px' }} />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><FileTextOutlined />设备列表</span>} key="list">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索设备名称、品牌、位置、编号..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col>
                <Select
                    placeholder="设备类型"
                  value={selectedType}
                  onChange={setSelectedType}
                    style={{ width: 120 }}
                    allowClear
                >
                  <Option value="all">全部类型</Option>
                  <Option value="cardio">有氧运动</Option>
                  <Option value="strength">力量训练</Option>
                  <Option value="flexibility">柔韧性</Option>
                    <Option value="balance">平衡训练</Option>
                    <Option value="recreation">休闲娱乐</Option>
                </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="设备状态"
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部状态</Option>
                    <Option value="normal">正常运行</Option>
                    <Option value="maintenance">维护中</Option>
                    <Option value="repair">维修中</Option>
                    <Option value="retired">已退役</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="网格区域"
                    value={selectedGrid}
                    onChange={setSelectedGrid}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部网格</Option>
                    <Option value="A区网格">A区网格</Option>
                    <Option value="B区网格">B区网格</Option>
                    <Option value="C区网格">C区网格</Option>
                  </Select>
                </Col>
                <Col>
                  <Button icon={<FilterOutlined />}>
                    高级筛选
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* 设备列表 */}
            <Table
              columns={columns}
              dataSource={filteredEquipment}
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

          <TabPane tab={<span><BarChartOutlined />数据分析</span>} key="analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="设备类型分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={typeChartOption} style={{ height: '300px' }} />
          </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="设备使用统计" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={usageChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="设备维护时间线" style={{ borderRadius: '12px' }}>
                  <Timeline
                    items={maintenanceRecords.map((record) => ({
                      color: record.status === 'completed' ? 'green' : 
                             record.status === 'in-progress' ? 'blue' : 'orange',
                      children: (
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{record.equipmentName}</div>
                          <div style={{ color: token.colorTextSecondary }}>
                            {record.type === 'routine' ? '例行维护' : 
                             record.type === 'repair' ? '维修' : 
                             record.type === 'inspection' ? '检查' : '升级'} - {record.date}
                          </div>
                          <div>{record.description}</div>
                          <Tag color={record.status === 'completed' ? 'success' : 
                                     record.status === 'in-progress' ? 'processing' : 'warning'}>
                            {record.status === 'completed' ? '已完成' : 
                             record.status === 'in-progress' ? '进行中' : '已计划'}
                          </Tag>
                        </div>
                      )
                    }))}
                  />
                </Card>
              </Col>
            </Row>
        </TabPane>

          <TabPane tab={<span><CalendarOutlined />维护计划</span>} key="maintenance">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title="维护日历" style={{ borderRadius: '12px' }}>
                  <Calendar 
                    mode="month"
                    dateCellRender={(value) => {
                      const dateStr = value.format('YYYY-MM-DD');
                      const maintenanceOnDate = maintenanceRecords.filter(
                        record => record.date === dateStr || record.nextSchedule === dateStr
                      );
                      return (
                        <div>
                          {maintenanceOnDate.map(record => (
                            <div key={record.id} style={{ fontSize: '10px', color: token.colorPrimary }}>
                              {record.equipmentName}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="维护提醒" style={{ borderRadius: '12px', marginBottom: '16px' }}>
            <List
                    dataSource={equipment.filter(item => {
                      const nextMaintenance = dayjs(item.nextMaintenance);
                      const today = dayjs();
                      return nextMaintenance.diff(today, 'day') <= 7;
                    })}
                    renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                          avatar={<Avatar icon={<WarningOutlined />} style={{ backgroundColor: token.colorWarning }} />}
                          title={item.name}
                          description={`维护日期: ${item.nextMaintenance}`}
                  />
                </List.Item>
              )}
            />
          </Card>
                <Card title="维护统计" style={{ borderRadius: '12px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Statistic title="本月维护" value={3} suffix="次" />
                    <Statistic title="维护成本" value={1130} prefix="¥" />
                    <Statistic title="平均修复时间" value={2.5} suffix="天" />
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 设备详情抽屉 */}
      <Drawer
        title="设备详细信息"
        placement="right"
        width={800}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedEquipment && (
          <div>
            {/* 设备基本信息 */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar
                      size={80}
                      style={{
                        backgroundColor: getTypeColor(selectedEquipment.type),
                        color: 'white'
                      }}
                      icon={getTypeIcon(selectedEquipment.type)}
                    />
                    <div style={{ marginTop: '12px' }}>
                      <Text strong style={{ fontSize: '16px' }}>{selectedEquipment.name}</Text>
                    </div>
                    <Tag color={getTypeColor(selectedEquipment.type)} style={{ marginTop: '8px' }}>
                      {getTypeText(selectedEquipment.type)}
                    </Tag>
                    <div style={{ marginTop: '12px' }}>
                      <QRCode value={selectedEquipment.qrCode} size={100} />
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>设备编码</div>
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="品牌型号">
                      {selectedEquipment.brand} {selectedEquipment.model}
                    </Descriptions.Item>
                    <Descriptions.Item label="序列号">
                      {selectedEquipment.serialNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="采购成本">
                      <Text strong style={{ color: token.colorSuccess }}>
                        ¥{selectedEquipment.cost.toLocaleString()}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="使用评分">
                      <Rate disabled defaultValue={selectedEquipment.rating} style={{ fontSize: '14px' }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="使用次数">
                      <Badge count={selectedEquipment.usageCount} style={{ backgroundColor: token.colorPrimary }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="安全等级">
                      <Tag color={getSafetyLevelColor(selectedEquipment.safetyLevel)}>
                        等级 {selectedEquipment.safetyLevel}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            {/* 详细信息标签页 */}
            <Tabs defaultActiveKey="basic">
              <TabPane tab="基本信息" key="basic">
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="制造商">{selectedEquipment.manufacturer}</Descriptions.Item>
                  <Descriptions.Item label="采购日期">{selectedEquipment.purchaseDate}</Descriptions.Item>
                  <Descriptions.Item label="安装日期">{selectedEquipment.installationDate}</Descriptions.Item>
                  <Descriptions.Item label="保修到期">{selectedEquipment.warrantyExpiry}</Descriptions.Item>
                  <Descriptions.Item label="预期寿命">{selectedEquipment.lifespan} 年</Descriptions.Item>
                  <Descriptions.Item label="能耗">{selectedEquipment.energyConsumption || '无'} kW</Descriptions.Item>
                  <Descriptions.Item label="安装位置" span={2}>{selectedEquipment.location}</Descriptions.Item>
                  <Descriptions.Item label="所属网格">{selectedEquipment.grid}</Descriptions.Item>
                  <Descriptions.Item label="负责人">{selectedEquipment.responsiblePerson}</Descriptions.Item>
                  <Descriptions.Item label="设备描述" span={2}>
                    {selectedEquipment.description}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane tab="技术规格" key="specs">
                <Descriptions column={1} bordered size="small">
                  {Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                    <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
                  ))}
                </Descriptions>
        </TabPane>

        <TabPane tab="维护记录" key="maintenance">
            <List
                  dataSource={maintenanceRecords.filter(record => record.equipmentId === selectedEquipment.id)}
              renderItem={(record) => (
                <List.Item>
                  <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: record.status === 'completed' ? token.colorSuccess : 
                                             record.status === 'in-progress' ? token.colorPrimary : token.colorWarning 
                            }}
                            icon={<ToolOutlined />}
                          />
                        }
                    title={
                      <Space>
                            <span>{record.type === 'routine' ? '例行维护' : record.type === 'repair' ? '维修' : '检查'}</span>
                            <Tag color={record.status === 'completed' ? 'success' : 
                                       record.status === 'in-progress' ? 'processing' : 'warning'}>
                          {record.status === 'completed' ? '已完成' : 
                               record.status === 'in-progress' ? '进行中' : '已计划'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                            <div>日期: {record.date}</div>
                            <div>技术员: {record.technician}</div>
                            <div>费用: ¥{record.cost}</div>
                            <div>描述: {record.description}</div>
                            {record.notes && <div>备注: {record.notes}</div>}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
        </TabPane>

              <TabPane tab="文档资料" key="documents">
                <List>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} />}
                      title="用户手册"
                      description={selectedEquipment.userManual || '暂无'}
                    />
                    <Button type="link" icon={<DownloadOutlined />}>下载</Button>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} />}
                      title="维护合同"
                      description={selectedEquipment.maintenanceContract || '暂无'}
                    />
                    <Button type="link" icon={<DownloadOutlined />}>下载</Button>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<SafetyOutlined />} />}
                      title="保险信息"
                      description={selectedEquipment.insuranceInfo || '暂无'}
                    />
                    <Button type="link" icon={<DownloadOutlined />}>下载</Button>
                  </List.Item>
                </List>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>

      {/* 维护记录抽屉 */}
      <Drawer
        title="维护记录管理"
        placement="right"
        width={600}
        open={isMaintenanceDrawerVisible}
        onClose={() => setIsMaintenanceDrawerVisible(false)}
      >
        {selectedEquipment && (
          <div>
            <Alert
              message={`${selectedEquipment.name} 维护记录`}
              description={`当前状态: ${getStatusText(selectedEquipment.status)}`}
              type="info"
              style={{ marginBottom: '16px' }}
            />
            
            <Space style={{ marginBottom: '16px' }}>
              <Button type="primary" icon={<PlusOutlined />}>
                新增维护记录
              </Button>
              <Button icon={<CalendarOutlined />}>
                计划维护
              </Button>
            </Space>

            <Timeline
              items={maintenanceRecords
                .filter(record => record.equipmentId === selectedEquipment.id)
                .map((record) => ({
                  color: record.status === 'completed' ? 'green' : 
                         record.status === 'in-progress' ? 'blue' : 'orange',
                  children: (
                    <Card size="small" style={{ marginBottom: '8px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        {record.type === 'routine' ? '例行维护' : 
                         record.type === 'repair' ? '设备维修' : 
                         record.type === 'inspection' ? '安全检查' : '设备升级'}
                      </div>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="日期">{record.date}</Descriptions.Item>
                        <Descriptions.Item label="技术员">{record.technician}</Descriptions.Item>
                        <Descriptions.Item label="费用">¥{record.cost}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                          <Tag color={record.status === 'completed' ? 'success' : 
                                     record.status === 'in-progress' ? 'processing' : 'warning'}>
                            {record.status === 'completed' ? '已完成' : 
                             record.status === 'in-progress' ? '进行中' : '已计划'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="描述">{record.description}</Descriptions.Item>
                        {record.parts.length > 0 && (
                          <Descriptions.Item label="更换部件">
                            {record.parts.map(part => (
                              <Tag key={part} color="blue">{part}</Tag>
                            ))}
                          </Descriptions.Item>
                        )}
                        {record.notes && (
                          <Descriptions.Item label="备注">{record.notes}</Descriptions.Item>
                        )}
                      </Descriptions>
              </Card>
                  )
                }))}
            />
          </div>
        )}
      </Drawer>

      {/* 新增/编辑设备模态框 */}
      <Modal
        title={editingEquipment ? '编辑设备信息' : '新增健身设备'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备类型" name="type" rules={[{ required: true, message: '请选择设备类型' }]}>
                <Select placeholder="请选择设备类型">
                  <Option value="cardio">有氧运动</Option>
                  <Option value="strength">力量训练</Option>
                  <Option value="flexibility">柔韧性训练</Option>
                  <Option value="balance">平衡训练</Option>
                  <Option value="recreation">休闲娱乐</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请输入品牌' }]}>
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号" name="model" rules={[{ required: true, message: '请输入型号' }]}>
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="制造商" name="manufacturer" rules={[{ required: true, message: '请输入制造商' }]}>
                <Input placeholder="请输入制造商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="序列号" name="serialNumber" rules={[{ required: true, message: '请输入序列号' }]}>
                <Input placeholder="请输入序列号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="采购日期" name="purchaseDate" rules={[{ required: true, message: '请选择采购日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="安装日期" name="installationDate" rules={[{ required: true, message: '请选择安装日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="保修到期" name="warrantyExpiry" rules={[{ required: true, message: '请选择保修到期日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="采购成本" name="cost" rules={[{ required: true, message: '请输入采购成本' }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入成本"
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="预期寿命" name="lifespan" rules={[{ required: true, message: '请输入预期寿命' }]}>
                <InputNumber style={{ width: '100%' }} placeholder="年" min={1} max={50} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="安全等级" name="safetyLevel" rules={[{ required: true, message: '请选择安全等级' }]}>
                <Select placeholder="请选择安全等级">
                  <Option value="A">A级 - 高安全</Option>
                  <Option value="B">B级 - 中等安全</Option>
                  <Option value="C">C级 - 基础安全</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="安装位置" name="location" rules={[{ required: true, message: '请输入安装位置' }]}>
                <Input placeholder="请输入安装位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="所属网格" name="grid" rules={[{ required: true, message: '请选择所属网格' }]}>
                <Select placeholder="请选择所属网格">
                  <Option value="A区网格">A区网格</Option>
                  <Option value="B区网格">B区网格</Option>
                  <Option value="C区网格">C区网格</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="负责人" name="responsiblePerson" rules={[{ required: true, message: '请输入负责人' }]}>
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="能耗 (kW)" name="energyConsumption">
                <InputNumber style={{ width: '100%' }} placeholder="可选" min={0} step={0.1} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="设备描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入设备详细描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FitnessEquipmentPage;
