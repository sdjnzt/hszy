import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Progress, 
  Badge, 
  Typography, 
  Space, 
  Divider,
  Timeline,
  Alert,
  Radio,
  Select,
  Tabs,
  Button,
  Tooltip,
  Avatar,
  List,
  Drawer,
  Modal,
  Input,
  DatePicker,
  Switch,
  Flex,
  Dropdown,
  MenuProps,
  InputNumber,
  theme,
  Descriptions
} from 'antd';
import { 
  VideoCameraOutlined, 
  PhoneOutlined, 
  SafetyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  WifiOutlined,
  BarsOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  FireOutlined,
  EyeOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  SettingOutlined,
  BellOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  UserOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  MonitorOutlined,
  ApiOutlined,
  GlobalOutlined,
  HomeOutlined,
  RocketOutlined,
  HeartOutlined,
  MoreOutlined,
  StarOutlined,
  TeamOutlined,
  DatabaseOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CarOutlined,
  IdcardOutlined,
  CameraOutlined,
  AlertOutlined,
  ControlOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  UserSwitchOutlined,
  FileProtectOutlined,
  AuditOutlined,
  SolutionOutlined,
  BuildOutlined,
  CrownOutlined,
  FlagOutlined,
  BulbOutlined
} from '@ant-design/icons';

import { statistics, devices, safetyEvents } from '../data/mockData';
import { faceData } from '../data/faceData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { useToken } = theme;

interface RealTimeData {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
  timestamp: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface DeviceStatus {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastSeen: string;
  location: string;
  performance: number;
  grid: string;
}

interface GridMonitor {
  id: string;
  name: string;
  population: number;
  devices: number;
  events: number;
  status: 'normal' | 'warning' | 'danger';
  lastUpdate: string;
}

interface SecurityEvent {
  id: string;
  type: 'suspicious' | 'intrusion' | 'fire' | 'medical' | 'other';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'pending' | 'processing' | 'resolved';
  description: string;
  grid: string;
}

const Dashboard: React.FC = () => {
  const { token } = useToken();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    cpu: 45,
    memory: 68,
    network: 32,
    storage: 78,
    timestamp: new Date().toLocaleString()
  });
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>([]);
  const [gridMonitors, setGridMonitors] = useState<GridMonitor[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceStatus | null>(null);
  const [deviceDetailVisible, setDeviceDetailVisible] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState<GridMonitor | null>(null);
  const [gridDetailVisible, setGridDetailVisible] = useState(false);

  useEffect(() => {
    // 模拟实时数据更新
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        cpu: Math.floor(Math.random() * 30) + 30,
        memory: Math.floor(Math.random() * 20) + 60,
        network: Math.floor(Math.random() * 25) + 25,
        storage: Math.floor(Math.random() * 15) + 70,
        timestamp: new Date().toLocaleString()
      }));
    }, 5000);

    // 模拟系统告警
    setSystemAlerts([
      {
        id: '1',
        type: 'warning',
        message: 'CPU使用率超过80%',
        timestamp: '2025-08-15 15:30:00',
        severity: 'medium'
      },
      {
        id: '2',
        type: 'error',
        message: '数据库连接失败',
        timestamp: '2025-08-15 15:25:00',
        severity: 'high'
      },
      {
        id: '3',
        type: 'info',
        message: '系统维护完成',
        timestamp: '2025-08-15 15:20:00',
        severity: 'low'
      }
    ]);

    // 模拟设备状态
    setDeviceStatuses([
      {
        id: '1',
        name: '监控摄像头-01',
        type: 'Camera',
        status: 'online',
        lastSeen: '2025-08-15 15:30:00',
        location: 'A区大门',
        performance: 95,
        grid: 'A区网格'
      },
      {
        id: '2',
        name: '门禁系统-02',
        type: 'Access Control',
        status: 'online',
        lastSeen: '2025-08-15 15:30:00',
        location: 'B区侧门',
        performance: 88,
        grid: 'B区网格'
      },
      {
        id: '3',
        name: '环境传感器-03',
        type: 'Sensor',
        status: 'maintenance',
        lastSeen: '2025-08-15 14:00:00',
        location: 'C区花园',
        performance: 0,
        grid: 'C区网格'
      },
      {
        id: '4',
        name: '健身器材监控-01',
        type: 'Fitness Monitor',
        status: 'online',
        lastSeen: '2025-08-15 15:30:00',
        location: '社区广场',
        performance: 92,
        grid: 'A区网格'
      }
    ]);

    // 模拟网格监控数据
    setGridMonitors([
      {
        id: '1',
        name: 'A区网格',
        population: 1200,
        devices: 65,
        events: 45,
        status: 'normal',
        lastUpdate: '2025-08-15 15:30:00'
      },
      {
        id: '2',
        name: 'B区网格',
        population: 950,
        devices: 52,
        events: 38,
        status: 'warning',
        lastUpdate: '2025-08-15 15:30:00'
      },
      {
        id: '3',
        name: 'C区网格',
        population: 697,
        devices: 39,
        events: 73,
        status: 'normal',
        lastUpdate: '2025-08-15 15:30:00'
      }
    ]);

    // 模拟安全事件
    setSecurityEvents([
    {
      id: '1',
        type: 'suspicious',
        location: 'A区3号楼',
        severity: 'high',
        timestamp: '2025-08-15 15:30:00',
        status: 'processing',
        description: '发现可疑人员，已通知安保人员处理',
        grid: 'A区网格'
    },
    {
      id: '2',
        type: 'intrusion',
        location: 'B区侧门',
        severity: 'medium',
        timestamp: '2025-08-15 15:25:00',
        status: 'resolved',
        description: '门禁系统检测到异常进入，已确认是居民',
        grid: 'B区网格'
    },
    {
      id: '3',
        type: 'fire',
        location: 'C区花园',
        severity: 'low',
        timestamp: '2025-08-15 15:20:00',
        status: 'resolved',
        description: '烟雾传感器误报，已检查确认无异常',
        grid: 'C区网格'
      }
    ]);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return token.colorSuccess;
      case 'offline': return token.colorError;
      case 'maintenance': return token.colorWarning;
      case 'error': return token.colorError;
      default: return token.colorTextSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleOutlined />;
      case 'offline': return <CloseCircleOutlined />;
      case 'maintenance': return <ToolOutlined />;
      case 'error': return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff4d4f';
      case 'high': return '#ff7875';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getGridStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return token.colorSuccess;
      case 'warning': return token.colorWarning;
      case 'danger': return token.colorError;
      default: return token.colorTextSecondary;
    }
  };

  const getGridStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircleOutlined />;
      case 'warning': return <AlertOutlined />;
      case 'danger': return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getSecurityEventIcon = (type: string) => {
    switch (type) {
      case 'suspicious': return <UserOutlined />;
      case 'intrusion': return <SecurityScanOutlined />;
      case 'fire': return <FireOutlined />;
      case 'medical': return <HeartOutlined />;
      default: return <AlertOutlined />;
    }
  };

  const performanceCards = [
    {
      title: 'CPU使用率',
      value: realTimeData.cpu,
      suffix: '%',
      icon: <LineChartOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      status: realTimeData.cpu > 80 ? 'warning' : realTimeData.cpu > 60 ? 'normal' : 'good'
    },
    {
      title: '内存使用率',
      value: realTimeData.memory,
      suffix: '%',
      icon: <DatabaseOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      status: realTimeData.memory > 85 ? 'warning' : realTimeData.memory > 70 ? 'normal' : 'good'
    },
    {
      title: '网络使用率',
      value: realTimeData.network,
      suffix: '%',
      icon: <WifiOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      status: realTimeData.network > 75 ? 'warning' : realTimeData.network > 50 ? 'normal' : 'good'
    },
    {
      title: '存储使用率',
      value: realTimeData.storage,
      suffix: '%',
      icon: <CloudOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      status: realTimeData.storage > 90 ? 'warning' : realTimeData.storage > 80 ? 'normal' : 'good'
    }
  ];

  const deviceColumns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DeviceStatus) => (
        <Space>
          <Avatar 
            size="small" 
            style={{ backgroundColor: getStatusColor(record.status) }}
            icon={getStatusIcon(record.status)}
          />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusIcon(status)} {status}
        </Tag>
      )
    },
    {
      title: '性能',
      dataIndex: 'performance',
      key: 'performance',
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value > 80 ? 'success' : value > 60 ? 'normal' : 'exception'}
        />
      )
    },
    {
      title: '所属网格',
      dataIndex: 'grid',
      key: 'grid',
      render: (text: string) => <Tag color="purple">{text}</Tag>
    },
    {
      title: '最后在线',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DeviceStatus) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setSelectedDevice(record);
              setDeviceDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button type="link" size="small">控制</Button>
        </Space>
      )
    }
  ];

  const gridColumns = [
    {
      title: '网格名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GridMonitor) => (
        <Space>
          <Avatar 
            size="small" 
            style={{ backgroundColor: getGridStatusColor(record.status) }}
            icon={getGridStatusIcon(record.status)}
          />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '人口数量',
      dataIndex: 'population',
      key: 'population',
      render: (value: number) => <Text strong>{value}人</Text>
    },
    {
      title: '设备数量',
      dataIndex: 'devices',
      key: 'devices',
      render: (value: number) => <Tag color="blue">{value}台</Tag>
    },
    {
      title: '事件数量',
      dataIndex: 'events',
      key: 'events',
      render: (value: number) => <Tag color="orange">{value}起</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getGridStatusColor(status)}>
          {getGridStatusIcon(status)} {status}
        </Tag>
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: GridMonitor) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setSelectedGrid(record);
              setGridDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button type="link" size="small">监控</Button>
        </Space>
      )
    }
  ];

  const securityColumns = [
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, record: SecurityEvent) => (
        <Space>
          <Avatar 
            size="small" 
            style={{ backgroundColor: getSeverityColor(record.severity) }}
            icon={getSecurityEventIcon(type)}
          />
          <span>{type === 'suspicious' ? '可疑人员' : type === 'intrusion' ? '入侵检测' : type === 'fire' ? '火灾报警' : type === 'medical' ? '医疗求助' : '其他'}</span>
        </Space>
      )
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity === 'critical' ? '严重' : severity === 'high' ? '高' : severity === 'medium' ? '中' : '低'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'pending' ? 'orange' : 
          status === 'processing' ? 'blue' : 
          'green'
        }>
          {status === 'pending' ? '待处理' : status === 'processing' ? '处理中' : '已解决'}
        </Tag>
      )
    },
    {
      title: '所属网格',
      dataIndex: 'grid',
      key: 'grid',
      render: (text: string) => <Tag color="purple">{text}</Tag>
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SecurityEvent) => (
        <Space>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">处理</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题和操作栏 */}
      <Card
        style={{
        marginBottom: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <DashboardOutlined style={{ marginRight: '12px' }} />
              智慧社区监控指挥中心
          </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0' }}>
              实时监控社区动态，智能管理设备状态，保障社区安全
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button 
                  type="primary"
                ghost 
                icon={<ReloadOutlined />} 
                onClick={() => window.location.reload()}
              >
                刷新
            </Button>
                <Button 
                type="primary" 
                ghost 
                icon={<FullscreenOutlined />}
              >
                全屏
              </Button>
        </Space>
          </Col>
        </Row>
      </Card>

      {/* 性能指标卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {performanceCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              style={{ 
                background: card.gradient,
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ padding: '24px', textAlign: 'center' }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ color: 'white' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {card.icon}
                  </div>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>{card.title}</span>}
                  value={card.value}
                  suffix={<span style={{ color: 'rgba(255,255,255,0.9)' }}>{card.suffix}</span>}
                  valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                />
                <div style={{ marginTop: '16px' }}>
                  <Tag 
                    color={card.status === 'good' ? 'success' : card.status === 'warning' ? 'warning' : 'default'}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
                  >
                    {card.status === 'good' ? '正常' : card.status === 'warning' ? '注意' : '一般'}
                  </Tag>
                    </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要内容区域 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
        <TabPane tab="系统概览" key="overview">
          <Row gutter={[24, 24]}>
            {/* 系统告警 */}
            <Col xs={24} lg={12}>
                     <Card 
             title={
                  <Flex align="center" gap="8">
                    <AlertOutlined style={{ color: token.colorWarning }} />
                    <span>系统告警</span>
                    <Badge count={systemAlerts.length} style={{ backgroundColor: token.colorWarning }} />
                  </Flex>
                }
                style={{ marginBottom: '24px', borderRadius: '12px' }}
                extra={
                  <Button type="primary" size="small">
                    查看全部
                  </Button>
                }
              >
                <List
                  dataSource={systemAlerts}
                  renderItem={(alert) => (
                    <List.Item
                      actions={[
                        <Tag color={getSeverityColor(alert.severity)} key="severity">
                          {alert.severity}
                        </Tag>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: getSeverityColor(alert.severity),
                              color: 'white'
                            }}
                            icon={
                              alert.type === 'error' ? <ExclamationCircleOutlined /> :
                              alert.type === 'warning' ? <AlertOutlined /> :
                              alert.type === 'success' ? <CheckCircleOutlined /> :
                              <InfoCircleOutlined />
                            }
                          />
                        }
            title={
              <Space>
                            <span>{alert.message}</span>
                            <Badge 
                              status={
                                alert.severity === 'critical' ? 'error' :
                                alert.severity === 'high' ? 'warning' :
                                alert.severity === 'medium' ? 'processing' :
                                'success'
                              } 
                            />
              </Space>
            }
                        description={
                          <div>
                            <div><ClockCircleOutlined /> {alert.timestamp}</div>
                    </div>
                        }
                      />
                </List.Item>
              )}
            />
          </Card>
        </Col>

            {/* 网格监控概览 */}
            <Col xs={24} lg={12}>
          <Card 
            title={
                  <Flex align="center" gap="8">
                    <ApartmentOutlined style={{ color: token.colorPrimary }} />
                    <span>网格监控概览</span>
                  </Flex>
                }
                style={{ borderRadius: '12px' }}
              >
                <List
                  dataSource={gridMonitors}
                  renderItem={(grid) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: getGridStatusColor(grid.status),
                              color: 'white'
                            }}
                            icon={getGridStatusIcon(grid.status)}
                          />
                        }
                        title={grid.name}
                        description={
                          <div>
                            <div>人口: {grid.population}人 | 设备: {grid.devices}台</div>
                            <div>事件: {grid.events}起 | 状态: {grid.status}</div>
                  </div>
                        }
                      />
                    </List.Item>
                  )}
                />
          </Card>
        </Col>
      </Row>
        </TabPane>

        <TabPane tab="设备监控" key="devices">
          <Card 
            title={
              <Flex align="center" gap="8">
                <MonitorOutlined style={{ color: token.colorPrimary }} />
                <span>设备状态监控</span>
              </Flex>
            }
            style={{ borderRadius: '12px' }}
            extra={
              <Space>
              <Select 
                defaultValue="all" 
                style={{ width: 120 }}
                  size="small"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="online">在线</Option>
                  <Option value="offline">离线</Option>
                  <Option value="maintenance">维护中</Option>
              </Select>
                <Button type="primary" size="small">
                  设备管理
                </Button>
              </Space>
            }
          >
            <Table
              columns={deviceColumns}
              dataSource={deviceStatuses}
              rowKey="id"
              pagination={false}
              size="small"
            />
                    </Card>
        </TabPane>

        <TabPane tab="网格管理" key="grids">
          <Card 
            title={
              <Flex align="center" gap="8">
                <ApartmentOutlined style={{ color: token.colorSuccess }} />
                <span>网格管理监控</span>
              </Flex>
            }
            style={{ borderRadius: '12px' }}
            extra={
              <Button type="primary" size="small">
                网格配置
              </Button>
            }
          >
            <Table
              columns={gridColumns}
              dataSource={gridMonitors}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </TabPane>

        <TabPane tab="安全事件" key="security">
      <Card 
        title={
              <Flex align="center" gap="8">
                <SafetyCertificateOutlined style={{ color: token.colorWarning }} />
                <span>安全事件监控</span>
              </Flex>
            }
            style={{ borderRadius: '12px' }}
            extra={
            <Space>
              <Select 
                  defaultValue="all" 
                style={{ width: 120 }}
                size="small"
              >
                  <Option value="all">全部类型</Option>
                  <Option value="suspicious">可疑人员</Option>
                  <Option value="intrusion">入侵检测</Option>
                  <Option value="fire">火灾报警</Option>
              </Select>
                <Button type="primary" size="small">
                  事件处理
                </Button>
            </Space>
        }
      >
        <Table
              columns={securityColumns}
              dataSource={securityEvents}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
        </TabPane>
      </Tabs>

      {/* 设备详情抽屉 */}
      <Drawer
        title="设备详情"
        placement="right"
        onClose={() => setDeviceDetailVisible(false)}
        open={deviceDetailVisible}
        width={400}
      >
        {selectedDevice && (
          <div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="设备名称">{selectedDevice.name}</Descriptions.Item>
              <Descriptions.Item label="设备类型">{selectedDevice.type}</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={getStatusColor(selectedDevice.status)}>
                  {getStatusIcon(selectedDevice.status)} {selectedDevice.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="性能指标">
                <Progress percent={selectedDevice.performance} />
              </Descriptions.Item>
              <Descriptions.Item label="位置">{selectedDevice.location}</Descriptions.Item>
              <Descriptions.Item label="所属网格">{selectedDevice.grid}</Descriptions.Item>
              <Descriptions.Item label="最后在线">{selectedDevice.lastSeen}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" icon={<ControlOutlined />}>
                远程控制
          </Button>
              <Button icon={<SettingOutlined />}>
                设备设置
              </Button>
            </Space>
                    </div>
        )}
      </Drawer>

      {/* 网格详情抽屉 */}
      <Drawer
        title="网格详情"
        placement="right"
        onClose={() => setGridDetailVisible(false)}
        open={gridDetailVisible}
        width={400}
      >
        {selectedGrid && (
          <div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="网格名称">{selectedGrid.name}</Descriptions.Item>
              <Descriptions.Item label="人口数量">{selectedGrid.population}人</Descriptions.Item>
              <Descriptions.Item label="设备数量">{selectedGrid.devices}台</Descriptions.Item>
              <Descriptions.Item label="事件数量">{selectedGrid.events}起</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={getGridStatusColor(selectedGrid.status)}>
                  {getGridStatusIcon(selectedGrid.status)} {selectedGrid.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="最后更新">{selectedGrid.lastUpdate}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" icon={<MonitorOutlined />}>
                实时监控
                </Button>
                              <Button icon={<EnvironmentOutlined />}>
                  地图查看
                </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Dashboard; 