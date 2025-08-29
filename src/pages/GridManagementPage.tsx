import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Select, 
  Space, 
  Typography, 
  Tag, 
  List, 
  Avatar,
  Badge,
  Tooltip,
  Divider,
  Statistic,
  Progress,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Tabs,
  Tree,
  TreeSelect,
  Descriptions,
  Steps,
  Timeline,
  Alert,
  Drawer,
  Image
} from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  HomeOutlined,
  ToolOutlined,
  HeartOutlined,
  FileTextOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  SettingOutlined,
  MonitorOutlined,
  DatabaseOutlined,
  CloudOutlined,
  WifiOutlined,
  CameraOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  CompassOutlined,
  BuildOutlined,
  CarOutlined,
  ShopOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  BookOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const { RangePicker } = DatePicker;

interface GridUnit {
  id: string;
  name: string;
  code: string;
  area: number; // 面积，单位：平方米
  population: number;
  households: number;
  buildings: number;
  manager: string;
  managerPhone: string;
  status: 'active' | 'inactive' | 'maintenance';
  description: string;
  coordinates: [number, number];
  createdAt: string;
  type: 'residential' | 'commercial' | 'mixed';
  facilities: string[];
  organizations: string[];
}

interface GridPerson {
  id: string;
  name: string;
  gridId: string;
  gridName: string;
  type: 'resident' | 'worker' | 'visitor' | 'manager';
  phone: string;
  address: string;
  status: 'normal' | 'warning' | 'alert';
  lastUpdate: string;
  idCard: string;
  workUnit: string;
  emergencyContact: string;
}

interface GridEvent {
  id: string;
  title: string;
  gridId: string;
  gridName: string;
  type: 'safety' | 'environment' | 'facility' | 'service' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  reporter: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  location: string;
  images: string[];
}

interface GridOrganization {
  id: string;
  name: string;
  gridId: string;
  gridName: string;
  type: 'property' | 'security' | 'medical' | 'education' | 'commercial' | 'government';
  contact: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  services: string[];
  staffCount: number;
  rating: number;
}

interface GridFacility {
  id: string;
  name: string;
  gridId: string;
  gridName: string;
  type: 'infrastructure' | 'public' | 'security' | 'environmental';
  status: 'normal' | 'maintenance' | 'fault';
  lastInspection: string;
  nextInspection: string;
  manager: string;
  description: string;
}

const GridManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGrid, setSelectedGrid] = useState<string>('all');
  const [gridModalVisible, setGridModalVisible] = useState(false);
  const [personModalVisible, setPersonModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [organizationModalVisible, setOrganizationModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 网格单元数据
  const [gridUnits, setGridUnits] = useState<GridUnit[]>([
    {
      id: '1',
      name: 'A区住宅网格',
      code: 'GRID-A-001',
      area: 25000,
      population: 1250,
      households: 380,
      buildings: 12,
      manager: '张明',
      managerPhone: '13800138001',
      status: 'active',
      description: '主要住宅区域，包含多层住宅楼和配套设施',
      coordinates: [116.397, 39.916],
      createdAt: '2024-01-15',
      type: 'residential',
      facilities: ['健身器材', '儿童游乐场', '停车场'],
      organizations: ['物业服务中心', '社区卫生站', '便民服务站']
    },
    {
      id: '2',
      name: 'B区商业网格',
      code: 'GRID-B-001',
      area: 18000,
      population: 850,
      households: 120,
      buildings: 8,
      manager: '李华',
      managerPhone: '13800138002',
      status: 'active',
      description: '商业服务区域，包含商铺、餐饮、服务设施',
      coordinates: [116.398, 39.917],
      createdAt: '2024-01-20',
      type: 'commercial',
      facilities: ['商业街', '停车场', '公共卫生间'],
      organizations: ['商业管理办公室', '安保服务中心', '清洁服务队']
    },
    {
      id: '3',
      name: 'C区综合网格',
      code: 'GRID-C-001',
      area: 32000,
      population: 1680,
      households: 420,
      buildings: 15,
      manager: '王强',
      managerPhone: '13800138003',
      status: 'active',
      description: '综合功能区域，住宅、商业、公共服务混合',
      coordinates: [116.396, 39.918],
      createdAt: '2024-02-01',
      type: 'mixed',
      facilities: ['综合服务中心', '文化活动中心', '体育设施'],
      organizations: ['社区居委会', '文化活动中心', '体育协会']
    }
  ]);

  // 网格人员数据
  const [gridPersons, setGridPersons] = useState<GridPerson[]>([
    {
      id: '1',
      name: '刘威',
      gridId: '1',
      gridName: 'A区住宅网格',
      type: 'resident',
      phone: '139****9001',
      address: 'A区1号楼2单元301室',
      status: 'normal',
      lastUpdate: '2024-05-20',
      idCard: '370101199001011234',
      workUnit: '济宁华颂置业有限公司',
      emergencyContact: '李四 13900139002'
    },
    {
      id: '2',
      name: '李响',
      gridId: '1',
      gridName: 'A区住宅网格',
      type: 'manager',
      phone: '139****9503',
      address: 'A区物业办公室',
      status: 'normal',
      lastUpdate: '2024-05-20',
      idCard: '370101198505051234',
      workUnit: '物业服务中心',
      emergencyContact: '王五 13900139004'
    }
  ]);

  // 网格事件数据
  const [gridEvents, setGridEvents] = useState<GridEvent[]>([
    {
      id: '1',
      title: '路灯故障报修',
      gridId: '1',
      gridName: 'A区住宅网格',
      type: 'facility',
      priority: 'medium',
      status: 'processing',
      reporter: '张三',
      assignee: '维修队',
      createdAt: '2024-05-20 09:30:00',
      updatedAt: '2024-05-20 14:20:00',
      description: 'A区1号楼前路灯不亮，影响夜间照明',
      location: 'A区1号楼前',
      images: ['/images/facility/lamp1.jpg']
    },
    {
      id: '2',
      title: '垃圾分类指导',
      gridId: '2',
      gridName: 'B区商业网格',
      type: 'service',
      priority: 'low',
      status: 'completed',
      reporter: '环保志愿者',
      assignee: '社区服务队',
      createdAt: '2024-05-19 10:00:00',
      updatedAt: '2024-05-19 16:00:00',
      description: '在B区商业街开展垃圾分类宣传活动',
      location: 'B区商业街',
      images: ['/images/service/activity1.jpg']
    }
  ]);

  // 网格组织数据
  const [gridOrganizations, setGridOrganizations] = useState<GridOrganization[]>([
    {
      id: '1',
      name: '物业服务中心',
      gridId: '1',
      gridName: 'A区住宅网格',
      type: 'property',
      contact: '张明',
      phone: '0537-12345678',
      address: 'A区物业办公室',
      status: 'active',
      services: ['物业管理', '维修服务', '清洁服务'],
      staffCount: 15,
      rating: 4.5
    },
    {
      id: '2',
      name: '社区卫生站',
      gridId: '1',
      gridName: 'A区住宅网格',
      type: 'medical',
      contact: '李医生',
      phone: '0537-87654321',
      address: 'A区卫生服务站',
      status: 'active',
      services: ['基础医疗', '健康咨询', '疫苗接种'],
      staffCount: 8,
      rating: 4.8
    }
  ]);

  // 网格设施数据
  const [gridFacilities, setGridFacilities] = useState<GridFacility[]>([
    {
      id: '1',
      name: '健身器材区',
      gridId: '1',
      gridName: 'A区住宅网格',
      type: 'public',
      status: 'normal',
      lastInspection: '2024-05-15',
      nextInspection: '2024-06-15',
      manager: '张明',
      description: '包含跑步机、健身车、力量训练器材等'
    },
    {
      id: '2',
      name: '监控系统',
      gridId: '1',
      gridName: 'A区住宅网格',
      type: 'security',
      status: 'normal',
      lastInspection: '2024-05-18',
      nextInspection: '2024-06-18',
      manager: '李华',
      description: '高清监控摄像头，覆盖主要出入口和公共区域'
    }
  ]);

  // 网格统计概览
  const gridStats = {
    totalGrids: gridUnits.length,
    activeGrids: gridUnits.filter(g => g.status === 'active').length,
    totalPopulation: gridUnits.reduce((sum, g) => sum + g.population, 0),
    totalHouseholds: gridUnits.reduce((sum, g) => sum + g.households, 0),
    totalBuildings: gridUnits.reduce((sum, g) => sum + g.buildings, 0),
    totalEvents: gridEvents.length,
    pendingEvents: gridEvents.filter(e => e.status === 'pending').length,
    totalOrganizations: gridOrganizations.length,
    totalFacilities: gridFacilities.length
  };

  // 处理网格状态颜色
  const getGridStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#52c41a';
      case 'inactive': return '#ff4d4f';
      case 'maintenance': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  // 处理网格状态图标
  const getGridStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleOutlined />;
      case 'inactive': return <ExclamationCircleOutlined />;
      case 'maintenance': return <ToolOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  // 处理事件优先级颜色
  const getEventPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return '#fa8c16';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // 处理事件状态颜色
  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#faad14';
      case 'processing': return '#1890ff';
      case 'completed': return '#52c41a';
      case 'cancelled': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  // 网格管理表格列定义
  const gridColumns = [
    {
      title: '网格名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GridUnit) => (
        <Space>
          <ApartmentOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
          <Tag color="blue">{record.code}</Tag>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          residential: { text: '住宅', color: 'green' },
          commercial: { text: '商业', color: 'blue' },
          mixed: { text: '综合', color: 'purple' }
        };
        const config = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      render: (area: number) => `${(area / 10000).toFixed(2)}万㎡`
    },
    {
      title: '人口/户数',
      key: 'population',
      render: (record: GridUnit) => (
        <div>
          <div>{record.population}人</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.households}户</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getGridStatusColor(status)} icon={getGridStatusIcon(status)}>
          {status === 'active' ? '正常' : status === 'inactive' ? '停用' : '维护中'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (record: GridUnit) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => showGridDetail(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => editGrid(record)}
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  // 显示网格详情
  const showGridDetail = (grid: GridUnit) => {
    setSelectedItem(grid);
    setDetailDrawerVisible(true);
  };

  // 编辑网格
  const editGrid = (grid: GridUnit) => {
    setSelectedItem(grid);
    setGridModalVisible(true);
  };

  // 添加新网格
  const addNewGrid = () => {
    setSelectedItem(null);
    setGridModalVisible(true);
  };

  // 网格人口分布图表配置
  const gridPopulationOption = {
    title: {
      text: '各网格人口分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['人口数量', '户数', '建筑数'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: gridUnits.map(grid => grid.name),
      axisLabel: { rotate: 45 }
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        position: 'left'
      }
    ],
    series: [
      {
        name: '人口数量',
        type: 'bar',
        data: gridUnits.map(grid => grid.population),
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '户数',
        type: 'bar',
        data: gridUnits.map(grid => grid.households),
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '建筑数',
        type: 'bar',
        data: gridUnits.map(grid => grid.buildings),
        itemStyle: { color: '#faad14' }
      }
    ]
  };

  // 事件处理效率图表配置
  const eventEfficiencyOption = {
    title: {
      text: '事件处理效率分析',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: 10
    },
    series: [
      {
        name: '事件状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: gridEvents.filter(e => e.status === 'pending').length, name: '待处理', itemStyle: { color: '#faad14' } },
          { value: gridEvents.filter(e => e.status === 'processing').length, name: '处理中', itemStyle: { color: '#1890ff' } },
          { value: gridEvents.filter(e => e.status === 'completed').length, name: '已完成', itemStyle: { color: '#52c41a' } },
          { value: gridEvents.filter(e => e.status === 'cancelled').length, name: '已取消', itemStyle: { color: '#ff4d4f' } }
        ]
      }
    ]
  };

  // 网格类型分布图表配置
  const gridTypeOption = {
    title: {
      text: '网格类型分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: 10
    },
    series: [
      {
        name: '网格类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: gridUnits.filter(g => g.type === 'residential').length, name: '住宅网格', itemStyle: { color: '#52c41a' } },
          { value: gridUnits.filter(g => g.type === 'commercial').length, name: '商业网格', itemStyle: { color: '#1890ff' } },
          { value: gridUnits.filter(g => g.type === 'mixed').length, name: '综合网格', itemStyle: { color: '#722ed1' } }
        ]
      }
    ]
  };

  // 设施状态统计图表配置
  const facilityStatusOption = {
    title: {
      text: '设施状态统计',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['正常', '维护中', '故障'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['健身器材', '监控设备', '照明设施', '道路设施', '其他设施']
    },
    yAxis: {
      type: 'value',
      name: '设施数量'
    },
    series: [
      {
        name: '正常',
        type: 'bar',
        stack: 'total',
        data: [8, 12, 15, 10, 6],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '维护中',
        type: 'bar',
        stack: 'total',
        data: [2, 1, 3, 2, 1],
        itemStyle: { color: '#faad14' }
      },
      {
        name: '故障',
        type: 'bar',
        stack: 'total',
        data: [1, 0, 1, 1, 0],
        itemStyle: { color: '#ff4d4f' }
      }
    ]
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <ApartmentOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              网格化管理平台
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              依托统一管理平台和数字化平台，将区域标准划分成统一的单元网格，通过对单元网格的人、地、物、情、事、组织的管理，建立监督和处置相互分离的形式
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={addNewGrid}
              >
                新增网格
              </Button>
              <Button 
                icon={<ImportOutlined />}
                onClick={() => message.info('批量导入功能开发中...')}
              >
                批量导入
              </Button>
              <Button 
                icon={<ExportOutlined />}
                onClick={() => message.info('数据导出功能开发中...')}
              >
                导出数据
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 网格管理概览统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="网格总数"
              value={5}
              suffix="个"
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<ApartmentOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
            />
            <Progress 
              percent={Math.round((gridStats.activeGrids / gridStats.totalGrids) * 100)} 
              size="small" 
              status="active"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="总人口数"
              value={2847}
              suffix="人"
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
            />
            <Progress 
              percent={Math.round((gridStats.totalPopulation / 5000) * 100)} 
              size="small" 
              status="active"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="事件总数"
              value={gridStats.totalEvents}
              suffix="起"
              valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<FileTextOutlined style={{ fontSize: '24px', color: '#faad14' }} />}
            />
            <Progress 
              percent={Math.round((gridStats.totalEvents / 100) * 100)} 
              size="small" 
              status="active"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="管理效率"
              value={Math.round((gridStats.activeGrids / gridStats.totalGrids) * 100)}
              suffix="%"
              valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ fontSize: '24px', color: '#722ed1' }} />}
            />
            <Progress 
              percent={Math.round((gridStats.activeGrids / gridStats.totalGrids) * 100)} 
              size="small" 
              status="active"
            />
          </Card>
        </Col>
      </Row>

      {/* 网格管理主要内容 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
          <TabPane tab="网格概览" key="overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title="网格单元管理" style={{ borderRadius: '12px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Space>
                      <Input.Search
                        placeholder="搜索网格名称或代码"
                        style={{ width: 300 }}
                        onSearch={setSearchText}
                      />
                      <Select
                        placeholder="状态筛选"
                        style={{ width: 150 }}
                        value={filterStatus}
                        onChange={setFilterStatus}
                      >
                        <Option value="all">全部状态</Option>
                        <Option value="active">正常</Option>
                        <Option value="inactive">停用</Option>
                        <Option value="maintenance">维护中</Option>
                      </Select>
                    </Space>
                  </div>
                  <Table
                    dataSource={gridUnits.filter(grid => 
                      (filterStatus === 'all' || grid.status === filterStatus) &&
                      (searchText === '' || 
                       grid.name.toLowerCase().includes(searchText.toLowerCase()) ||
                       grid.code.toLowerCase().includes(searchText.toLowerCase()))
                    )}
                    columns={gridColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="middle"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="网格分布统计" style={{ borderRadius: '12px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>住宅网格</span>
                      <span>{gridUnits.filter(g => g.type === 'residential').length}个</span>
                    </div>
                    <Progress percent={Math.round((gridUnits.filter(g => g.type === 'residential').length / gridUnits.length) * 100)} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>商业网格</span>
                      <span>{gridUnits.filter(g => g.type === 'commercial').length}个</span>
                    </div>
                    <Progress percent={Math.round((gridUnits.filter(g => g.type === 'commercial').length / gridUnits.length) * 100)} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>综合网格</span>
                      <span>{gridUnits.filter(g => g.type === 'mixed').length}个</span>
                    </div>
                    <Progress percent={Math.round((gridUnits.filter(g => g.type === 'mixed').length / gridUnits.length) * 100)} />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="人员管理" key="persons">
            <Card title="网格人员管理" style={{ borderRadius: '12px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setPersonModalVisible(true)}
                  >
                    新增人员
                  </Button>
                  <Input.Search
                    placeholder="搜索人员姓名或电话"
                    style={{ width: 300 }}
                  />
                </Space>
              </div>
              <Table
                dataSource={gridPersons}
                columns={[
                  { title: '姓名', dataIndex: 'name', key: 'name' },
                  { title: '类型', dataIndex: 'type', key: 'type',
                    render: (type: string) => {
                      const typeMap: Record<string, { text: string; color: string }> = {
                        resident: { text: '居民', color: 'green' },
                        worker: { text: '工作人员', color: 'blue' },
                        visitor: { text: '访客', color: 'orange' },
                        manager: { text: '管理员', color: 'purple' }
                      };
                      const config = typeMap[type] || { text: type, color: 'default' };
                      return <Tag color={config.color}>{config.text}</Tag>;
                    }
                  },
                  { title: '所属网格', dataIndex: 'gridName', key: 'gridName' },
                  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
                  { title: '状态', dataIndex: 'status', key: 'status',
                    render: (status: string) => (
                      <Tag color={status === 'normal' ? 'green' : status === 'warning' ? 'orange' : 'red'}>
                        {status === 'normal' ? '正常' : status === 'warning' ? '警告' : '异常'}
                      </Tag>
                    )
                  },
                  { title: '操作', key: 'action',
                    render: (record: GridPerson) => (
                      <Space size="small">
                        <Button type="link" icon={<EyeOutlined />}>查看</Button>
                        <Button type="link" icon={<EditOutlined />}>编辑</Button>
                      </Space>
                    )
                  }
                ]}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </Card>
          </TabPane>

          <TabPane tab="事件管理" key="events">
            <Card title="网格事件管理" style={{ borderRadius: '12px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setEventModalVisible(true)}
                  >
                    新增事件
                  </Button>
                  <Select placeholder="事件类型" style={{ width: 150 }}>
                    <Option value="all">全部类型</Option>
                    <Option value="safety">安全事件</Option>
                    <Option value="environment">环境问题</Option>
                    <Option value="facility">设施维护</Option>
                    <Option value="service">便民服务</Option>
                  </Select>
                  <Select placeholder="处理状态" style={{ width: 150 }}>
                    <Option value="all">全部状态</Option>
                    <Option value="pending">待处理</Option>
                    <Option value="processing">处理中</Option>
                    <Option value="completed">已完成</Option>
                  </Select>
                </Space>
              </div>
              <Table
                dataSource={gridEvents}
                columns={[
                  { title: '事件标题', dataIndex: 'title', key: 'title' },
                  { title: '所属网格', dataIndex: 'gridName', key: 'gridName' },
                  { title: '类型', dataIndex: 'type', key: 'type',
                    render: (type: string) => {
                      const typeMap: Record<string, { text: string; color: string }> = {
                        safety: { text: '安全事件', color: 'red' },
                        environment: { text: '环境问题', color: 'green' },
                        facility: { text: '设施维护', color: 'blue' },
                        service: { text: '便民服务', color: 'purple' },
                        other: { text: '其他', color: 'default' }
                      };
                      const config = typeMap[type] || { text: type, color: 'default' };
                      return <Tag color={config.color}>{config.text}</Tag>;
                    }
                  },
                  { title: '优先级', dataIndex: 'priority', key: 'priority',
                    render: (priority: string) => (
                      <Tag color={getEventPriorityColor(priority)}>
                        {priority === 'urgent' ? '紧急' : 
                         priority === 'high' ? '高' : 
                         priority === 'medium' ? '中' : '低'}
                      </Tag>
                    )
                  },
                  { title: '状态', dataIndex: 'status', key: 'status',
                    render: (status: string) => (
                      <Tag color={getEventStatusColor(status)}>
                        {status === 'pending' ? '待处理' : 
                         status === 'processing' ? '处理中' : 
                         status === 'completed' ? '已完成' : '已取消'}
                      </Tag>
                    )
                  },
                  { title: '操作', key: 'action',
                    render: (record: GridEvent) => (
                      <Space size="small">
                        <Button type="link" icon={<EyeOutlined />}>查看</Button>
                        <Button type="link" icon={<EditOutlined />}>编辑</Button>
                      </Space>
                    )
                  }
                ]}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </Card>
          </TabPane>

          <TabPane tab="组织管理" key="organizations">
            <Card title="网格组织管理" style={{ borderRadius: '12px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setOrganizationModalVisible(true)}
                >
                  新增组织
                </Button>
              </div>
              <Row gutter={[24, 24]}>
                {gridOrganizations.map(org => (
                  <Col xs={24} sm={12} lg={8} key={org.id}>
                    <Card 
                      style={{ borderRadius: '12px' }}
                      actions={[
                        <Button type="link" icon={<EyeOutlined />}>查看</Button>,
                        <Button type="link" icon={<EditOutlined />}>编辑</Button>
                      ]}
                    >
                      <Card.Meta
                        avatar={
                          <Avatar 
                            size={64} 
                            icon={
                              org.type === 'property' ? <HomeOutlined /> :
                              org.type === 'security' ? <SafetyOutlined /> :
                              org.type === 'medical' ? <MedicineBoxOutlined /> :
                              org.type === 'education' ? <BookOutlined /> :
                              org.type === 'commercial' ? <ShopOutlined /> :
                              <BankOutlined />
                            }
                            style={{ backgroundColor: '#1890ff' }}
                          />
                        }
                        title={org.name}
                        description={
                          <div>
                            <div>类型: {org.type}</div>
                            <div>联系人: {org.contact}</div>
                            <div>电话: {org.phone}</div>
                            <div>评分: <span style={{ color: '#faad14' }}>{org.rating}⭐</span></div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </TabPane>

          <TabPane tab="设施管理" key="facilities">
            <Card title="网格设施管理" style={{ borderRadius: '12px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                >
                  新增设施
                </Button>
              </div>
              <Table
                dataSource={gridFacilities}
                columns={[
                  { title: '设施名称', dataIndex: 'name', key: 'name' },
                  { title: '所属网格', dataIndex: 'gridName', key: 'gridName' },
                  { title: '类型', dataIndex: 'type', key: 'type',
                    render: (type: string) => {
                      const typeMap: Record<string, { text: string; color: string }> = {
                        infrastructure: { text: '基础设施', color: 'blue' },
                        public: { text: '公共设施', color: 'green' },
                        security: { text: '安防设施', color: 'red' },
                        environmental: { text: '环境设施', color: 'purple' }
                      };
                      const config = typeMap[type] || { text: type, color: 'default' };
                      return <Tag color={config.color}>{config.text}</Tag>;
                    }
                  },
                  { title: '状态', dataIndex: 'status', key: 'status',
                    render: (status: string) => (
                      <Tag color={status === 'normal' ? 'green' : status === 'maintenance' ? 'orange' : 'red'}>
                        {status === 'normal' ? '正常' : status === 'maintenance' ? '维护中' : '故障'}
                      </Tag>
                    )
                  },
                  { title: '下次检查', dataIndex: 'nextInspection', key: 'nextInspection' },
                  { title: '操作', key: 'action',
                    render: (record: GridFacility) => (
                      <Space size="small">
                        <Button type="link" icon={<EyeOutlined />}>查看</Button>
                        <Button type="link" icon={<EditOutlined />}>编辑</Button>
                      </Space>
                    )
                  }
                ]}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </Card>
          </TabPane>

          <TabPane tab="数据分析" key="analysis">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="网格人口分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={gridPopulationOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="事件处理效率" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={eventEfficiencyOption} style={{ height: '300px' }} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24} lg={12}>
                <Card title="网格类型分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={gridTypeOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="设施状态统计" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={facilityStatusOption} style={{ height: '300px' }} />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 网格详情抽屉 */}
      <Drawer
        title="网格详情"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedItem && (
          <div>
            <Descriptions title="基本信息" bordered column={1}>
              <Descriptions.Item label="网格名称">{selectedItem.name}</Descriptions.Item>
              <Descriptions.Item label="网格代码">{selectedItem.code}</Descriptions.Item>
              <Descriptions.Item label="网格类型">
                {selectedItem.type === 'residential' ? '住宅' : 
                 selectedItem.type === 'commercial' ? '商业' : '综合'}
              </Descriptions.Item>
              <Descriptions.Item label="面积">{selectedItem.area}㎡</Descriptions.Item>
              <Descriptions.Item label="人口数量">{selectedItem.population}人</Descriptions.Item>
              <Descriptions.Item label="户数">{selectedItem.households}户</Descriptions.Item>
              <Descriptions.Item label="建筑数量">{selectedItem.buildings}栋</Descriptions.Item>
              <Descriptions.Item label="网格管理员">{selectedItem.manager}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedItem.managerPhone}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedItem.createdAt}</Descriptions.Item>
              <Descriptions.Item label="网格描述">{selectedItem.description}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={4}>配套设施</Title>
            <div style={{ marginBottom: '16px' }}>
              {selectedItem.facilities.map((facility: string, index: number) => (
                <Tag key={index} color="blue" style={{ marginBottom: '8px' }}>{facility}</Tag>
              ))}
            </div>
            
            <Title level={4}>服务组织</Title>
            <div>
              {selectedItem.organizations.map((org: string, index: number) => (
                <Tag key={index} color="green" style={{ marginBottom: '8px' }}>{org}</Tag>
              ))}
            </div>
          </div>
        )}
      </Drawer>

      {/* 网格管理模态框 */}
      <Modal
        title={selectedItem ? '编辑网格' : '新增网格'}
        open={gridModalVisible}
        onCancel={() => setGridModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="网格名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入网格名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="网格代码" name="code" rules={[{ required: true }]}>
                <Input placeholder="请输入网格代码" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="网格类型" name="type" rules={[{ required: true }]}>
                <Select placeholder="请选择网格类型">
                  <Option value="residential">住宅</Option>
                  <Option value="commercial">商业</Option>
                  <Option value="mixed">综合</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="网格状态" name="status" rules={[{ required: true }]}>
                <Select placeholder="请选择网格状态">
                  <Option value="active">正常</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="maintenance">维护中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="面积(㎡)" name="area" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入面积" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="人口数量" name="population" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入人口数量" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="户数" name="households" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入户数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="建筑数量" name="buildings" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入建筑数量" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="网格管理员" name="manager" rules={[{ required: true }]}>
                <Input placeholder="请输入管理员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="managerPhone" rules={[{ required: true }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="网格描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入网格描述" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => message.success('保存成功')}>
                保存
              </Button>
              <Button onClick={() => setGridModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GridManagementPage;
