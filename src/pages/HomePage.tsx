import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress, 
  Table, 
  Tag, 
  Button, 
  Space,
  Typography,
  Divider,
  Avatar,
  List,
  Badge,
  Timeline,
  Flex,
  Tooltip,
  theme,
  Tabs,

} from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  FileTextOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  FireOutlined,
  TrophyOutlined,
  HeartOutlined,
  StarOutlined,
  MonitorOutlined,
  RocketOutlined,
  GlobalOutlined,
  CameraOutlined,
  SecurityScanOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BuildOutlined,
  SafetyOutlined,
  UserSwitchOutlined,
  FileProtectOutlined,
  AuditOutlined,
  SolutionOutlined,
  ApartmentOutlined,
  BankOutlined,
  CarOutlined,
  HomeFilled,
  CrownOutlined,
  FlagOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  WifiOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ExclamationCircleOutlined,
  IdcardOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import ErrorBoundary from '../components/ErrorBoundary';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { useToken } = theme;

interface CommunityStats {
  totalPopulation: number;
  totalHouseholds: number;
  totalHouses: number;
  totalEvents: number;
  totalPatrols: number;
  totalServices: number;
  totalPartyMembers: number;
  totalGrids: number;
  totalDevices: number;
  totalCameras: number;
  totalFitnessEquipment: number;
}

interface RecentEvent {
  id: string;
  type: string;
  location: string;
  status: string;
  timestamp: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  grid: string;
}

interface PatrolRecord {
  id: string;
  patroller: string;
  route: string;
  startTime: string;
  endTime: string;
  status: string;
  issues: string[];
  grid: string;
}

interface GridInfo {
  id: string;
  name: string;
  population: number;
  households: number;
  events: number;
  devices: number;
  status: 'normal' | 'warning' | 'danger';
}

interface DeviceStatus {
  id: string;
  name: string;
  type: 'camera' | 'sensor' | 'light' | 'fitness';
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  grid: string;
}

const HomePage: React.FC = () => {
  const { token } = useToken();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<CommunityStats>({
    totalPopulation: 0,
    totalHouseholds: 0,
    totalHouses: 0,
    totalEvents: 0,
    totalPatrols: 0,
    totalServices: 0,
    totalPartyMembers: 0,
    totalGrids: 0,
    totalDevices: 0,
    totalCameras: 0,
    totalFitnessEquipment: 0
  });

  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [patrolRecords, setPatrolRecords] = useState<PatrolRecord[]>([]);
  const [gridData, setGridData] = useState<GridInfo[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceStatus[]>([]);

  useEffect(() => {
    // 模拟数据加载
    setStats({
      totalPopulation: 2847,
      totalHouseholds: 892,
      totalHouses: 1200,
      totalEvents: 156,
      totalPatrols: 89,
      totalServices: 234,
      totalPartyMembers: 156,
      totalGrids: 24,
      totalDevices: 156,
      totalCameras: 89,
      totalFitnessEquipment: 45
    });

    setRecentEvents([
      {
        id: '1',
        type: '安全事件',
        location: 'A区3号楼',
        status: '处理中',
        timestamp: '2025-08-15 14:30',
        description: '发现可疑人员，已通知安保人员处理',
        priority: 'high',
        grid: 'A区网格'
      },
      {
        id: '2',
        type: '设备维护',
        location: 'B区电梯',
        status: '已完成',
        timestamp: '2025-08-15 12:00',
        description: '电梯故障维修完成，恢复正常运行',
        priority: 'medium',
        grid: 'B区网格'
      },
      {
        id: '3',
        type: '环境清洁',
        location: '社区广场',
        status: '进行中',
        timestamp: '2025-08-15 10:00',
        description: '定期环境清洁工作正在进行',
        priority: 'low',
        grid: 'C区网格'
      }
    ]);

    setPatrolRecords([
      {
        id: '1',
        patroller: '王立松',
        route: 'A区巡逻路线',
        startTime: '08:00',
        endTime: '12:00',
        status: '已完成',
        issues: ['发现垃圾未清理', '路灯故障'],
        grid: 'A区网格'
      },
      {
        id: '2',
        patroller: '张晓东',
        route: 'B区巡逻路线',
        startTime: '14:00',
        endTime: '18:00',
        status: '进行中',
        issues: [],
        grid: 'B区网格'
      }
    ]);

    setGridData([
      { id: '1', name: 'A区网格', population: 1200, households: 380, events: 45, devices: 65, status: 'normal' },
      { id: '2', name: 'B区网格', population: 950, households: 320, events: 38, devices: 52, status: 'warning' },
      { id: '3', name: 'C区网格', population: 697, households: 192, events: 73, devices: 39, status: 'normal' }
    ]);

    setDeviceData([
      { id: '1', name: '监控摄像头-01', type: 'camera', location: 'A区大门', status: 'online', grid: 'A区网格' },
      { id: '2', name: '门禁系统-02', type: 'sensor', location: 'B区侧门', status: 'online', grid: 'B区网格' },
      { id: '3', name: '环境传感器-03', type: 'sensor', location: 'C区花园', status: 'maintenance', grid: 'C区网格' },
      { id: '4', name: '健身器材-01', type: 'fitness', location: '社区广场', status: 'online', grid: 'A区网格' }
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return '#ff7875';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <FireOutlined />;
      case 'high': return <AlertOutlined />;
      case 'medium': return <ClockCircleOutlined />;
      case 'low': return <CheckCircleOutlined />;
      default: return <ClockCircleOutlined />;
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

  // 八大模块数据
  const moduleData = [
    {
      key: 'overview',
      title: '首页概览',
      icon: <HomeOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stats: [
        { label: '总人口', value: stats.totalPopulation, suffix: '人', icon: <TeamOutlined /> },
        { label: '总户数', value: stats.totalHouseholds, suffix: '户', icon: <HomeFilled /> },
        { label: '房屋总数', value: stats.totalHouses, suffix: '套', icon: <BankOutlined /> },
        { label: '网格数量', value: stats.totalGrids, suffix: '个', icon: <ApartmentOutlined /> }
      ]
    },
    {
      key: 'party',
      title: '党建管理',
      icon: <CrownOutlined />,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      stats: [
        { label: '党员总数', value: stats.totalPartyMembers, suffix: '人', icon: <CrownOutlined /> },
        { label: '党建活动', value: 12, suffix: '次', icon: <FlagOutlined /> },
        { label: '组织建设', value: 8, suffix: '个', icon: <BuildOutlined /> }
      ]
    },
    {
      key: 'service',
      title: '便民服务',
      icon: <HeartOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      stats: [
        { label: '服务次数', value: stats.totalServices, suffix: '次', icon: <HeartOutlined /> },
        { label: '满意度', value: 96, suffix: '%', icon: <StarOutlined /> },
        { label: '服务类型', value: 15, suffix: '种', icon: <SolutionOutlined /> }
      ]
    },
    {
      key: 'patrol',
      title: '巡查管理',
      icon: <SecurityScanOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stats: [
        { label: '巡查次数', value: stats.totalPatrols, suffix: '次', icon: <SecurityScanOutlined /> },
        { label: '发现问题', value: 23, suffix: '个', icon: <AlertOutlined /> },
        { label: '处理率', value: 95, suffix: '%', icon: <CheckCircleOutlined /> }
      ]
    },
    {
      key: 'population',
      title: '人口管理',
      icon: <UserOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stats: [
        { label: '常住人口', value: stats.totalPopulation, suffix: '人', icon: <UserOutlined /> },
        { label: '流动人口', value: 156, suffix: '人', icon: <UserSwitchOutlined /> },
        { label: '户籍人口', value: stats.totalHouseholds, suffix: '户', icon: <IdcardOutlined /> }
      ]
    },
    {
      key: 'comprehensive',
      title: '综合治理',
      icon: <SafetyOutlined />,
      color: '#13c2c2',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      stats: [
        { label: '安全事件', value: 45, suffix: '起', icon: <SafetyOutlined /> },
        { label: '矛盾纠纷', value: 12, suffix: '件', icon: <AuditOutlined /> },
        { label: '化解率', value: 98, suffix: '%', icon: <CheckCircleOutlined /> }
      ]
    },
    {
      key: 'work',
      title: '工作管理',
      icon: <FileProtectOutlined />,
      color: '#eb2f96',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      stats: [
        { label: '工作任务', value: 89, suffix: '项', icon: <FileProtectOutlined /> },
        { label: '完成率', value: 87, suffix: '%', icon: <CheckCircleOutlined /> },
        { label: '在办事项', value: 12, suffix: '项', icon: <ClockCircleOutlined /> }
      ]
    },
    {
      key: 'events',
      title: '事件管理',
      icon: <AlertOutlined />,
      color: '#fa8c16',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      stats: [
        { label: '事件总数', value: stats.totalEvents, suffix: '起', icon: <AlertOutlined /> },
        { label: '处理中', value: 23, suffix: '起', icon: <ClockCircleOutlined /> },
        { label: '已解决', value: 133, suffix: '起', icon: <CheckCircleOutlined /> }
      ]
    }
  ];

  // 基础数据统计（图表数据已替换为占位符）

  return (
    <ErrorBoundary>
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        {/* 欢迎横幅 */}
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
                <HomeOutlined style={{ marginRight: '12px' }} />
                智慧社区综合管理平台
        </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
                依托GIS地图平台，实现社区可视化管理，通过网格化管理提升社区治理效能
              </Paragraph>
            </Col>
            <Col>
              <Avatar size={80} style={{ background: 'rgba(255,255,255,0.2)' }}>
                <GlobalOutlined style={{ fontSize: '40px', color: 'white' }} />
              </Avatar>
            </Col>
          </Row>
        </Card>

        {/* 八大模块导航 */}
        <Card
          title={
            <Flex align="center" gap="8">
              <ApartmentOutlined style={{ color: token.colorPrimary }} />
              <span>智慧社区八大模块</span>
            </Flex>
          }
          style={{ marginBottom: '24px', borderRadius: '12px' }}
        >
          <Row gutter={[16, 16]}>
            {moduleData.map((module) => (
              <Col xs={24} sm={12} md={8} lg={6} key={module.key}>
                <Card
                  style={{
                    background: module.gradient,
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '20px', textAlign: 'center' }}
                  hoverable
                  onClick={() => setActiveTab(module.key)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ color: 'white' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                      {module.icon}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
                      {module.title}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {module.stats.length} 项指标
                    </div>
      </div>
          </Card>
        </Col>
            ))}
          </Row>
          </Card>

        {/* 主要内容区域 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
          {moduleData.map((module) => (
            <TabPane tab={module.title} key={module.key}>
              <div style={{ padding: '20px 0' }}>
                {/* 模块统计卡片 */}
                <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                  {module.stats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                      <Card
                        style={{
                          background: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                        }}
                        bodyStyle={{ padding: '24px', textAlign: 'center' }}
                      >
                        <div style={{ fontSize: '32px', color: module.color, marginBottom: '16px' }}>
                          {stat.icon}
                        </div>
            <Statistic
                          title={stat.label}
                          value={stat.value}
                          suffix={stat.suffix}
                          valueStyle={{ color: module.color, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
                  ))}
      </Row>

                {/* 模块特定内容 */}
                {module.key === 'overview' && (
                  <Row gutter={[24, 24]}>
                    {/* 核心数据概览 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
                          <Flex align="center" gap="8">
                            <BarChartOutlined style={{ color: token.colorPrimary }} />
                            <span>核心数据概览</span>
                          </Flex>
                        }
                        style={{ borderRadius: '12px' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                <Statistic
                                title="监控设备"
                                value={stats.totalDevices}
                                suffix="台"
                                valueStyle={{ color: token.colorPrimary }}
                              />
                              <Progress percent={85} size="small" />
                            </Card>
              </Col>
              <Col span={12}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                <Statistic
                                title="健身器材"
                                value={stats.totalFitnessEquipment}
                                suffix="套"
                                valueStyle={{ color: token.colorSuccess }}
                              />
                              <Progress percent={92} size="small" status="active" />
                            </Card>
              </Col>
            </Row>
          </Card>
        </Col>

                    {/* 网格管理概览 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
                          <Flex align="center" gap="8">
                            <ApartmentOutlined style={{ color: token.colorSuccess }} />
                            <span>网格管理概览</span>
                          </Flex>
                        }
                        style={{ borderRadius: '12px' }}
                      >
                        <List
                          dataSource={gridData}
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
                                    <div>人口: {grid.population}人 | 户数: {grid.households}户</div>
                                    <div>事件: {grid.events}起 | 设备: {grid.devices}台</div>
                                  </div>
                                }
                              />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
                )}

                {module.key === 'population' && (
                  <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
                      <Card title="人口变化趋势" style={{ borderRadius: '12px' }}>
                        <div style={{ height: 300, padding: '20px' }}>
                          <div style={{ 
                            height: '100%', 
                            background: '#f0f0f0', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666'
                          }}>
                            人口趋势图表
                          </div>
                    </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Card title="人口分布" style={{ borderRadius: '12px' }}>
                        <div style={{ height: 300, padding: '20px' }}>
                          <div style={{ 
                            height: '100%', 
                            background: '#f0f0f0', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666'
                          }}>
                            人口分布图表
                    </div>
                  </div>
                      </Card>
                    </Col>
                  </Row>
                )}

                {module.key === 'events' && (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <Card title="事件类型分布" style={{ borderRadius: '12px' }}>
                        <div style={{ height: 300, padding: '20px' }}>
                          <div style={{ 
                            height: '100%', 
                            background: '#f0f0f0', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666'
                          }}>
                            事件类型分布图表
                          </div>
                        </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
                      <Card title="最近事件" style={{ borderRadius: '12px' }}>
                        <List
                          dataSource={recentEvents}
                          renderItem={(event) => (
                            <List.Item
                              actions={[
                                <Tag color={getPriorityColor(event.priority)} key="priority">
                                  {getPriorityIcon(event.priority)} {event.priority}
                                </Tag>
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar 
                                    style={{ 
                                      backgroundColor: getPriorityColor(event.priority),
                                      color: 'white'
                                    }}
                                    icon={getPriorityIcon(event.priority)}
                                  />
                                }
            title={
              <Space>
                                    <span>{event.type}</span>
                                    <Badge 
                                      status={event.status === '已完成' ? 'success' : event.status === '处理中' ? 'processing' : 'default'} 
                                      text={event.status} 
                                    />
              </Space>
            }
                                description={
                                  <div>
                                    <div><EnvironmentOutlined /> {event.location}</div>
                                    <div><ClockCircleOutlined /> {event.timestamp}</div>
                                    <div>{event.description}</div>
                                    <div><ApartmentOutlined /> {event.grid}</div>
                    </div>
                                }
                              />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
                )}

                {module.key === 'patrol' && (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <Card title="巡查记录" style={{ borderRadius: '12px' }}>
                        <Timeline
                          items={patrolRecords.map((record) => ({
                            color: record.status === '已完成' ? 'green' : 'blue',
                            children: (
                              <div>
                                <div style={{ fontWeight: 'bold' }}>{record.patroller}</div>
                                <div style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
                                  {record.route}
                                </div>
                                <div style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
                                  {record.startTime} - {record.endTime}
                                </div>
                                <Tag color={record.status === '已完成' ? 'success' : 'processing'}>
                                  {record.status}
                                </Tag>
                                <div style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
                                  <ApartmentOutlined /> {record.grid}
                                </div>
                              </div>
                            )
                          }))}
                        />
          </Card>
        </Col>
                    <Col xs={24} lg={12}>
                      <Card title="网格巡查统计" style={{ borderRadius: '12px' }}>
                        <div style={{ height: 300, padding: '20px' }}>
                          <div style={{ 
                            height: '100%', 
                            background: '#f0f0f0', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666'
                          }}>
                            网格巡查统计图表
                          </div>
                        </div>
          </Card>
        </Col>
      </Row>
                )}
              </div>
            </TabPane>
          ))}
        </Tabs>

        {/* GIS地图平台入口 */}
        <Card
          title={
            <Flex align="center" gap="8">
                             <EnvironmentOutlined style={{ color: token.colorPrimary }} />
               <span>GIS地图平台</span>
            </Flex>
          }
          style={{ marginTop: '24px', borderRadius: '12px' }}
          extra={
            <Button type="primary" icon={<GlobalOutlined />}>
              进入地图
            </Button>
          }
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <div style={{ 
                height: '300px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div>社区GIS地图平台</div>
                  <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
                    可视化展示社区地貌、构成及分布，实现社区可视化管理
                  </div>
                </div>
              </div>
          </Col>
            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="监控点位"
                    value={stats.totalCameras}
                    suffix="个"
                    valueStyle={{ color: token.colorPrimary }}
                  />
                  <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                    覆盖社区广场、活动中心、商贸市场等
                  </div>
                </Card>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="智能设备"
                    value={stats.totalDevices}
                    suffix="台"
                    valueStyle={{ color: token.colorSuccess }}
                  />
                  <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                    包括摄像头、传感器、智慧灯杆等
                  </div>
                </Card>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="健身器材"
                    value={stats.totalFitnessEquipment}
                    suffix="套"
                    valueStyle={{ color: token.colorWarning }}
                  />
                  <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                    提升小区娱乐设施设备水平
                  </div>
                </Card>
              </Space>
          </Col>
        </Row>
      </Card>
    </div>
    </ErrorBoundary>
  );
};

export default HomePage;
