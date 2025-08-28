import React, { useState, useEffect, useRef } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  List, 
  Badge,
  Tooltip,
  Select,
  Input,
  theme,
  Switch,
  Drawer,
  Modal,
  Slider,
  message,
  Table
} from 'antd';
import {
  EnvironmentOutlined,
  HomeOutlined,
  CameraOutlined,
  CarOutlined,
  TrophyOutlined,
  SearchOutlined,
  BarsOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  BuildOutlined,
  FireOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SignalFilled,
  ExclamationCircleOutlined,
  BellOutlined,
  RadarChartOutlined,
  GlobalOutlined,
  CompassOutlined,
  AimOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

interface MapPoint {
  id: string;
  name: string;
  type: 'building' | 'camera' | 'facility' | 'parking' | 'entrance' | 'fitness' | 'sensor' | 'emergency' | 'patrol' | 'service';
  location: { x: number; y: number };
  status: 'normal' | 'warning' | 'danger' | 'offline' | 'maintenance';
  description: string;
  grid: string;
  population?: number;
  devices?: number;
  lastUpdate?: string;
  temperature?: number;
  humidity?: number;
  noise?: number;
  signal?: number;
  alerts?: number;
  isOnline?: boolean;
  buildingInfo?: {
    floors: number;
    units: number;
    households: number;
    residents: number;
  };
}

interface GridInfo {
  id: string;
  name: string;
  population: number;
  households: number;
  buildings: number;
  cameras: number;
  events: number;
  status: 'normal' | 'warning' | 'danger';
  color: string;
  area: number;
  density: number;
  alertLevel: number;
  onlineDevices: number;
  totalDevices: number;
  lastUpdated: string;
}

interface AlertInfo {
  id: string;
  type: 'security' | 'fire' | 'medical' | 'infrastructure' | 'environmental';
  level: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  time: string;
  status: 'active' | 'resolved' | 'processing';
  pointId?: string;
}

interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  icon: React.ReactNode;
}

const GISMapPage: React.FC = () => {
  const { token } = useToken();
  const mapRef = useRef<HTMLDivElement>(null);
  
  // 基础状态
  const [selectedGrid, setSelectedGrid] = useState<string>('all');
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [grids, setGrids] = useState<GridInfo[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [alerts, setAlerts] = useState<AlertInfo[]>([]);
  
  // UI状态
  const [isLayerDrawerVisible, setIsLayerDrawerVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(true);
  
  // 图层配置
  const [layerConfigs, setLayerConfigs] = useState<LayerConfig[]>([
    { id: 'building', name: '建筑楼宇', visible: true, opacity: 1, icon: <BuildOutlined /> },
    { id: 'camera', name: '监控设备', visible: true, opacity: 1, icon: <CameraOutlined /> },
    { id: 'sensor', name: '环境传感器', visible: true, opacity: 1, icon: <RadarChartOutlined /> },
    { id: 'emergency', name: '应急设施', visible: true, opacity: 1, icon: <ExclamationCircleOutlined /> },
    { id: 'patrol', name: '巡逻路线', visible: false, opacity: 0.7, icon: <CompassOutlined /> },
    { id: 'service', name: '公共服务', visible: true, opacity: 1, icon: <HomeOutlined /> }
  ]);

  useEffect(() => {
    // 生成大型社区地图数据
    const generateMapData = () => {
      const buildings = [];
      const cameras = [];
      const sensors = [];
      const facilities = [];
      
      // 生成20栋楼宇
      for (let i = 1; i <= 20; i++) {
        buildings.push({
          id: `building-${i}`,
          name: `${i}号楼`,
          type: 'building' as const,
          location: { 
            x: 150 + (i % 5) * 160 + Math.random() * 40,
            y: 100 + Math.floor((i - 1) / 5) * 120 + Math.random() * 30
          },
          status: (Math.random() > 0.9 ? 'warning' : 'normal') as 'normal' | 'warning' | 'danger' | 'offline' | 'maintenance',
          description: `居民住宅楼，${6 + Math.floor(Math.random() * 6)}层，${60 + Math.floor(Math.random() * 80)}户`,
          grid: `${String.fromCharCode(65 + Math.floor((i - 1) / 7))}区网格`,
          population: 180 + Math.floor(Math.random() * 240),
          buildingInfo: {
            floors: 6 + Math.floor(Math.random() * 6),
            units: 2 + Math.floor(Math.random() * 2),
            households: 60 + Math.floor(Math.random() * 80),
            residents: 180 + Math.floor(Math.random() * 240)
          },
          lastUpdate: new Date().toISOString()
        });
      }

      // 生成监控设备
      for (let i = 1; i <= 45; i++) {
        cameras.push({
          id: `camera-${i}`,
          name: `监控点${i}`,
          type: 'camera' as const,
          location: {
            x: 80 + Math.random() * 720,
            y: 60 + Math.random() * 480
          },
          status: (Math.random() > 0.95 ? 'offline' : (Math.random() > 0.9 ? 'warning' : 'normal')) as 'normal' | 'warning' | 'danger' | 'offline' | 'maintenance',
          description: `高清智能摄像头，${Math.random() > 0.7 ? '人脸识别' : '行为分析'}功能`,
          grid: `${String.fromCharCode(65 + Math.floor(Math.random() * 3))}区网格`,
          signal: 70 + Math.floor(Math.random() * 30),
          isOnline: Math.random() > 0.05,
          lastUpdate: new Date().toISOString()
        });
      }

      // 生成环境传感器
      for (let i = 1; i <= 25; i++) {
        sensors.push({
          id: `sensor-${i}`,
          name: `环境传感器${i}`,
          type: 'sensor' as const,
          location: {
            x: 100 + Math.random() * 680,
            y: 80 + Math.random() * 440
          },
          status: (Math.random() > 0.92 ? 'maintenance' : 'normal') as 'normal' | 'warning' | 'danger' | 'offline' | 'maintenance',
          description: '空气质量、噪音、温湿度监测',
          grid: `${String.fromCharCode(65 + Math.floor(Math.random() * 3))}区网格`,
          temperature: 15 + Math.random() * 20,
          humidity: 40 + Math.random() * 40,
          noise: 30 + Math.random() * 50,
          lastUpdate: new Date().toISOString()
        });
      }

      // 生成公共设施
      const facilityTypes = ['parking', 'facility', 'fitness', 'emergency', 'service'];
      const facilityNames = ['停车场', '社区中心', '健身区', '应急点', '服务站'];
      
      for (let i = 1; i <= 30; i++) {
        const typeIndex = Math.floor(Math.random() * facilityTypes.length);
        facilities.push({
          id: `facility-${i}`,
          name: `${facilityNames[typeIndex]}${Math.ceil(i / facilityTypes.length)}`,
          type: facilityTypes[typeIndex] as any,
          location: {
            x: 120 + Math.random() * 640,
            y: 100 + Math.random() * 400
          },
          status: (Math.random() > 0.95 ? 'warning' : 'normal') as 'normal' | 'warning' | 'danger' | 'offline' | 'maintenance',
          description: getFacilityDescription(facilityTypes[typeIndex]),
          grid: `${String.fromCharCode(65 + Math.floor(Math.random() * 3))}区网格`,
          devices: Math.floor(Math.random() * 10) + 1,
          lastUpdate: new Date().toISOString()
        });
      }

      return [...buildings, ...cameras, ...sensors, ...facilities];
    };

    const getFacilityDescription = (type: string) => {
      const descriptions = {
        parking: '智能停车场，车位引导系统',
        facility: '社区服务中心，便民服务',
        fitness: '户外健身器材，全民健身',
        emergency: '应急避难点，消防设施',
        service: '物业服务站，便民服务'
      };
      return descriptions[type as keyof typeof descriptions] || '公共设施';
    };

    setMapPoints(generateMapData());

    // 生成网格数据 - 修正为1200人口，合理的覆盖面积
    setGrids([
      {
        id: 'A区网格',
        name: 'A区网格',
        population: 420,
        households: 168,
        buildings: 7,
        cameras: 18,
        events: 24,
        status: 'normal',
        color: '#52c41a',
        area: 3.2,
        density: 131,
        alertLevel: 1,
        onlineDevices: 42,
        totalDevices: 45,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'B区网格',
        name: 'B区网格',
        population: 450,
        households: 180,
        buildings: 7,
        cameras: 15,
        events: 18,
        status: 'warning',
        color: '#faad14',
        area: 2.8,
        density: 161,
        alertLevel: 2,
        onlineDevices: 38,
        totalDevices: 42,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'C区网格',
        name: 'C区网格',
        population: 330,
        households: 132,
        buildings: 6,
        cameras: 12,
        events: 15,
        status: 'normal',
        color: '#1890ff',
        area: 2.4,
        density: 138,
        alertLevel: 1,
        onlineDevices: 35,
        totalDevices: 36,
        lastUpdated: new Date().toISOString()
      }
    ]);

    // 生成告警数据
    setAlerts([
      {
        id: 'alert-1',
        type: 'security',
        level: 'medium',
        location: '15号楼门前',
        description: '异常人员聚集，需要关注',
        time: '2025-08-15 14:30:00',
        status: 'active',
        pointId: 'camera-15'
      },
      {
        id: 'alert-2',
        type: 'environmental',
        level: 'low',
        location: '社区广场',
        description: '噪音水平偏高',
        time: '2025-08-15 13:45:00',
        status: 'processing',
        pointId: 'sensor-8'
      },
      {
        id: 'alert-3',
        type: 'infrastructure',
        level: 'high',
        location: '地下停车场',
        description: '照明系统故障',
        time: '2025-08-15 12:20:00',
        status: 'resolved',
        pointId: 'facility-12'
      }
    ]);

    // 模拟实时更新
    const interval = setInterval(() => {
      if (realTimeMode) {
        setMapPoints(prev => prev.map(point => ({
          ...point,
          lastUpdate: new Date().toISOString(),
          // 随机更新传感器数据
          ...(point.type === 'sensor' && {
            temperature: point.temperature ? point.temperature + (Math.random() - 0.5) * 2 : undefined,
            humidity: point.humidity ? Math.max(0, Math.min(100, point.humidity + (Math.random() - 0.5) * 5)) : undefined,
            noise: point.noise ? Math.max(0, point.noise + (Math.random() - 0.5) * 10) : undefined
          })
        })));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeMode]);

  const getPointIcon = (type: string) => {
    const icons = {
      building: <BuildOutlined />,
      camera: <CameraOutlined />,
      facility: <HomeOutlined />,
      parking: <CarOutlined />,
      entrance: <LoadingOutlined />,
      fitness: <TrophyOutlined />,
      sensor: <RadarChartOutlined />,
      emergency: <ExclamationCircleOutlined />,
      patrol: <CompassOutlined />,
      service: <SettingOutlined />
    };
    return icons[type as keyof typeof icons] || <EnvironmentOutlined />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      normal: token.colorSuccess,
      warning: token.colorWarning,
      danger: token.colorError,
      offline: token.colorTextSecondary,
      maintenance: token.colorInfo
    };
    return colors[status as keyof typeof colors] || token.colorTextSecondary;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      normal: <CheckCircleOutlined />,
      warning: <AlertOutlined />,
      danger: <FireOutlined />,
      offline: <InfoCircleOutlined />,
      maintenance: <SettingOutlined />
    };
    return icons[status as keyof typeof icons] || <InfoCircleOutlined />;
  };

  const getAlertLevelColor = (level: string) => {
    const colors = {
      low: token.colorInfo,
      medium: token.colorWarning,
      high: token.colorError,
      critical: '#ff1744'
    };
    return colors[level as keyof typeof colors] || token.colorTextSecondary;
  };

  const filteredPoints = mapPoints.filter(point => {
    const matchesGrid = selectedGrid === 'all' || point.grid === selectedGrid;
    const matchesLayer = selectedLayer === 'all' || point.type === selectedLayer;
    const matchesSearch = searchText === '' || 
      point.name.toLowerCase().includes(searchText.toLowerCase()) ||
      point.description.toLowerCase().includes(searchText.toLowerCase());
    
    // 图层可见性过滤
    const layerConfig = layerConfigs.find(config => config.id === point.type);
    const isLayerVisible = layerConfig?.visible ?? true;
    
    return matchesGrid && matchesLayer && matchesSearch && isLayerVisible;
  });

  const selectedGridInfo = grids.find(g => g.id === selectedGrid);
  const activeAlerts = alerts.filter(alert => alert.status === 'active');

  const handlePointClick = (point: MapPoint) => {
    setSelectedPoint(point);
    message.info(`已选择: ${point.name}`);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev / 1.2, 0.5));
  };



  const updateLayerVisibility = (layerId: string, visible: boolean) => {
    setLayerConfigs(prev => prev.map(config => 
      config.id === layerId ? { ...config, visible } : config
    ));
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setLayerConfigs(prev => prev.map(config => 
      config.id === layerId ? { ...config, opacity } : config
    ));
  };

  return (
    <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* 专业的页面标题 */}
      <Card
        style={{
          marginBottom: '20px', 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ margin: 0, color: 'white' }}>
              <GlobalOutlined style={{ marginRight: '12px' }} />
              智慧社区GIS地图平台
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              实时监控 • 智能分析 • 可视化管理
            </Paragraph>
          </Col>
          <Col>
            <Space size="middle">
              <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <SignalFilled style={{ marginRight: '6px', color: '#52c41a' }} />
                <Text style={{ color: 'white', fontSize: '12px' }}>系统在线</Text>
              </div>
              <Switch
                checked={realTimeMode}
                onChange={setRealTimeMode}
                checkedChildren="实时"
                unCheckedChildren="静态"
              />
              <Button 
                type="primary" 
                ghost 
                size="small"
                icon={<RadarChartOutlined />}
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                {showHeatmap ? '关闭热力图' : '热力图'}
            </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 精美的统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={12} sm={6} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center', 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>总人口</span>}
              value={2847}
              suffix="人"
              valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}
              prefix={<HomeOutlined style={{ color: 'white' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center', 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(252, 182, 159, 0.3)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(0,0,0,0.7)', fontSize: '12px' }}>在线设备</span>}
              value={Math.round((grids.reduce((sum, grid) => sum + grid.onlineDevices, 0) / grids.reduce((sum, grid) => sum + grid.totalDevices, 0)) * 100)}
              suffix="%"
              valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#d46b08' }}
              prefix={<CompassOutlined style={{ color: '#d46b08' }} />}
            />
            <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', marginTop: '4px' }}>
              {grids.reduce((sum, grid) => sum + grid.onlineDevices, 0)}/{grids.reduce((sum, grid) => sum + grid.totalDevices, 0)} 台设备
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center', 
              borderRadius: '12px',
              background: activeAlerts.length > 0 
                ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
                : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              border: 'none',
              boxShadow: activeAlerts.length > 0 
                ? '0 4px 20px rgba(255, 154, 158, 0.3)'
                : '0 4px 20px rgba(168, 237, 234, 0.3)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(0,0,0,0.7)', fontSize: '12px' }}>实时告警</span>}
              value={activeAlerts.length}
              suffix="条"
              valueStyle={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: activeAlerts.length > 0 ? '#c41d7f' : '#52c41a' 
              }}
              prefix={
                activeAlerts.length > 0 
                  ? <BellOutlined style={{ color: '#c41d7f' }} />
                  : <CheckCircleOutlined style={{ color: '#52c41a' }} />
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center', 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(210, 153, 194, 0.3)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(0,0,0,0.7)', fontSize: '12px' }}>覆盖面积</span>}
              value={grids.reduce((sum, grid) => sum + grid.area, 0).toFixed(1)}
              suffix="公顷"
              valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#7cb305' }}
              prefix={<EnvironmentOutlined style={{ color: '#7cb305' }} />}
            />
            <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', marginTop: '4px' }}>
              约 {(grids.reduce((sum, grid) => sum + grid.area, 0) * 15).toFixed(0)} 亩
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
                {/* 左侧控制面板 */}
        <Col xs={24} lg={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 智能搜索控制 */}
            <Card 
              title={
                <Space>
                  <SearchOutlined />
                  <span style={{ fontSize: '14px' }}>智能搜索</span>
                </Space>
              }
              style={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Input
                  placeholder="搜索建筑、设备、区域..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
                
                <Select
                  style={{ width: '100%' }}
                  value={selectedGrid}
                  onChange={setSelectedGrid}
                  placeholder="选择网格区域"
                >
                  <Select.Option value="all">
                    <Space>
                      <GlobalOutlined />
                      全部网格
                    </Space>
                  </Select.Option>
                  {grids.map(grid => (
                    <Select.Option key={grid.id} value={grid.id}>
                      <Space>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: grid.color 
                        }} />
                        {grid.name}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
                
                <Select
                  style={{ width: '100%' }}
                  value={selectedLayer}
                  onChange={setSelectedLayer}
                  placeholder="图层类型"
                >
                  <Select.Option value="all">
                    <Space><GlobalOutlined />全部图层</Space>
                  </Select.Option>
                  <Select.Option value="building">
                    <Space><BuildOutlined />建筑楼宇</Space>
                  </Select.Option>
                  <Select.Option value="camera">
                    <Space><CameraOutlined />监控设备</Space>
                  </Select.Option>
                  <Select.Option value="sensor">
                    <Space><RadarChartOutlined />环境传感器</Space>
                  </Select.Option>
                </Select>
              </Space>
            </Card>

                        {/* 网格详情统计 */}
            {selectedGridInfo && (
              <Card 
                title={
                  <Space>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: selectedGridInfo.color 
                    }} />
                    <span style={{ fontSize: '14px' }}>{selectedGridInfo.name}详情</span>
                  </Space>
                }
                style={{ 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #f0f0f0'
                }}
              >
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: token.colorPrimary }}>
                        {2847}
                      </div>
                      <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
                        总人口
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: token.colorSuccess }}>
                        {selectedGridInfo.buildings}
                      </div>
                      <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
                        建筑数
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: token.colorWarning }}>
                        {selectedGridInfo.cameras}
                      </div>
                      <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
                        监控点
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: token.colorInfo }}>
                        {selectedGridInfo.area}
                      </div>
                      <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
                        公顷
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

                        {/* 智能告警监控 */}
            <Card 
              title={
                <Space size="small">
                  <BellOutlined style={{ color: activeAlerts.length > 0 ? '#ff4d4f' : '#52c41a' }} />
                  <span style={{ fontSize: '14px' }}>智能告警</span>
                  {activeAlerts.length > 0 && (
                    <Badge count={activeAlerts.length} size="small" />
                  )}
                </Space>
              } 
              extra={
                activeAlerts.length > 0 && (
                  <Button size="small" type="link" onClick={() => setIsAlertModalVisible(true)}>
                    查看全部
                  </Button>
                )
              }
              style={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}
            >
              {activeAlerts.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: token.colorTextSecondary, 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f6ffed 0%, #f6ffed 100%)',
                  borderRadius: '8px',
                  border: '1px solid #b7eb8f'
                }}>
                  <CheckCircleOutlined style={{ 
                    fontSize: '32px', 
                    marginBottom: '12px', 
                    color: '#52c41a' 
                  }} />
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                    系统运行正常
                  </div>
                  <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
                    无异常事件
                  </div>
                </div>
              ) : (
                <List
                  dataSource={activeAlerts.slice(0, 3)}
                  renderItem={(alert) => (
                    <List.Item style={{ 
                      padding: '12px 0', 
                      border: 'none',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                          <Tag 
                            color={getAlertLevelColor(alert.level)} 
                            style={{ margin: 0, marginRight: '8px', fontWeight: 'bold' }}
                          >
                            {alert.level.toUpperCase()}
                          </Tag>
                          <Text strong style={{ fontSize: '13px' }}>{alert.location}</Text>
                        </div>
                        <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                          {alert.description}
                        </Text>
                        <div style={{ fontSize: '11px', color: token.colorTextTertiary, marginTop: '4px' }}>
                          {alert.time}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Space>
                    </Col>

        {/* 右侧地图区域 */}
        <Col xs={24} lg={18}>
          <Card 
            title={
              <Space>
                <GlobalOutlined style={{ color: token.colorPrimary }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>智慧社区全景地图</span>
                {realTimeMode && (
                  <Tag color="green" style={{ marginLeft: '8px' }}>
                    <SignalFilled style={{ marginRight: '4px' }} />
                    实时监控
                  </Tag>
                )}
              </Space>
            }
            extra={
              <Space size="small">
                <Tooltip title="放大地图">
                  <Button size="small" icon={<ZoomInOutlined />} onClick={handleZoomIn} />
                </Tooltip>
                <Tooltip title="缩小地图">
                  <Button size="small" icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
                </Tooltip>
                <Tooltip title="重置视图">
                  <Button size="small" icon={<AimOutlined />} onClick={() => setMapZoom(1)} />
                </Tooltip>
                <Tooltip title="图层管理">
                  <Button size="small" icon={<BarsOutlined />} onClick={() => setIsLayerDrawerVisible(true)} />
                </Tooltip>
              </Space>
            }
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0'
            }}
          >
            <div
              ref={mapRef}
              style={{
                height: '600px',
                background: '#f8f9fa',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #e9ecef',
                transform: `scale(${mapZoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* 简洁的网格背景 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />

              {/* 规整的网格区域 */}
              {grids.map((grid, index) => (
                <div
                  key={grid.id}
                           style={{ 
                    position: 'absolute',
                    left: 60 + index * 180,
                    top: 60,
                    width: 160,
                    height: 120,
                    border: `2px solid ${grid.color}`,
                    borderRadius: '6px',
                    background: `${grid.color}08`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: grid.color
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div>{grid.name}</div>
                    <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
                      {grid.population}人
                    </div>
                  </div>
                </div>
              ))}

              {/* 规整排列的建筑点位 */}
              {filteredPoints
                .filter(point => point.type === 'building')
                .map((point, index) => {
                  const gridIndex = grids.findIndex(g => g.id === point.grid);
                  const buildingIndex = filteredPoints
                    .filter(p => p.type === 'building' && p.grid === point.grid)
                    .findIndex(p => p.id === point.id);
                  
                  // 在网格内规整排列建筑
                  const x = 80 + gridIndex * 180 + (buildingIndex % 4) * 30;
                  const y = 200 + Math.floor(buildingIndex / 4) * 40;
                  
                  return (
                <Tooltip
                  key={point.id}
                  title={
                    <div>
                      <div><strong>{point.name}</strong></div>
                      <div>{point.description}</div>
                      <div>状态: {point.status}</div>
                          {point.buildingInfo && (
                            <>
                              <div>楼层: {point.buildingInfo.floors}层</div>
                              <div>居民: {point.buildingInfo.residents}人</div>
                            </>
                          )}
                    </div>
                  }
                >
                  <div
                    style={{ 
                      position: 'absolute',
                          left: x,
                          top: y,
                      width: '24px',
                      height: '24px',
                          borderRadius: '4px',
                          backgroundColor: getStatusColor(point.status),
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '1px solid white',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handlePointClick(point)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.2)';
                          e.currentTarget.style.zIndex = '100';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.zIndex = '10';
                        }}
                      >
                        {getPointIcon(point.type)}
                      </div>
                    </Tooltip>
                  );
                })}

              {/* 其他设备点位 */}
              {filteredPoints
                .filter(point => point.type !== 'building')
                .map((point, index) => {
                  const gridIndex = grids.findIndex(g => g.id === point.grid);
                  const deviceIndex = filteredPoints
                    .filter(p => p.type !== 'building' && p.grid === point.grid)
                    .findIndex(p => p.id === point.id);
                  
                  // 在网格内分散排列其他设备
                  const x = 70 + gridIndex * 180 + (deviceIndex % 5) * 25 + Math.random() * 10;
                  const y = 320 + Math.floor(deviceIndex / 5) * 25 + Math.random() * 10;
                  
                  return (
                    <Tooltip
                      key={point.id}
                      title={
                        <div>
                          <div><strong>{point.name}</strong></div>
                          <div>{point.description}</div>
                          <div>状态: {point.status}</div>
                          {point.temperature && <div>温度: {point.temperature.toFixed(1)}°C</div>}
                          {point.signal && <div>信号: {point.signal}%</div>}
                        </div>
                      }
                    >
                      <div
                        style={{ 
                          position: 'absolute',
                          left: x,
                          top: y,
                          width: '16px',
                          height: '16px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(point.status),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                          border: '1px solid white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          fontSize: '8px',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handlePointClick(point)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.3)';
                          e.currentTarget.style.zIndex = '50';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.zIndex = '5';
                        }}
                  >
                    {getPointIcon(point.type)}
                </div>
                </Tooltip>
                  );
                })}

              {/* 简化的图例 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  fontSize: '11px'
                }}
              >
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>状态</div>
                {[
                  { label: '正常', color: token.colorSuccess },
                  { label: '警告', color: token.colorWarning },
                  { label: '离线', color: token.colorTextSecondary }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: item.color, 
                      marginRight: '6px' 
                    }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* 简化的信息面板 */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255,255,255,0.95)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                fontSize: '11px'
              }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <SignalFilled style={{ color: token.colorSuccess, marginRight: '6px' }} />
                  <span>在线</span>
                </div>
                <div>点位: {filteredPoints.length}</div>
                <div>缩放: {Math.round(mapZoom * 100)}%</div>
              </div>
                        </div>
            </Card>
        </Col>
      </Row>

      {/* 图层管理抽屉 */}
      <Drawer
        title="图层管理"
        placement="right"
        onClose={() => setIsLayerDrawerVisible(false)}
        open={isLayerDrawerVisible}
        width={400}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {layerConfigs.map(config => (
            <Card key={config.id} size="small" style={{ borderRadius: '8px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    {config.icon}
                    <Text strong>{config.name}</Text>
                  </Space>
                  <Switch
                    checked={config.visible}
                    onChange={(visible) => updateLayerVisibility(config.id, visible)}
                  />
                </div>
                {config.visible && (
                  <div>
                    <Text>透明度</Text>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={config.opacity}
                      onChange={(opacity) => updateLayerOpacity(config.id, opacity)}
                    />
                  </div>
                )}
              </Space>
            </Card>
          ))}
        </Space>
      </Drawer>

      {/* 告警详情模态框 */}
      <Modal
        title="实时告警中心"
        open={isAlertModalVisible}
        onCancel={() => setIsAlertModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          size="small"
          dataSource={alerts}
          columns={[
            {
              title: '级别',
              dataIndex: 'level',
              key: 'level',
              render: (level) => (
                <Tag color={getAlertLevelColor(level)}>
                  {level.toUpperCase()}
                </Tag>
              )
            },
            {
              title: '类型',
              dataIndex: 'type',
              key: 'type'
            },
            {
              title: '位置',
              dataIndex: 'location',
              key: 'location'
            },
            {
              title: '描述',
              dataIndex: 'description',
              key: 'description'
            },
            {
              title: '时间',
              dataIndex: 'time',
              key: 'time'
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={status === 'active' ? 'red' : status === 'processing' ? 'orange' : 'green'}>
                  {status === 'active' ? '活跃' : status === 'processing' ? '处理中' : '已解决'}
                </Tag>
              )
            }
          ]}
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      {/* 点位详情模态框 */}
      <Modal
        title={selectedPoint?.name}
        open={!!selectedPoint}
        onCancel={() => setSelectedPoint(null)}
        footer={null}
        width={600}
      >
        {selectedPoint && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="基本信息" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>类型：</Text>
                  <Space>
                    {getPointIcon(selectedPoint.type)}
                    {selectedPoint.type}
                  </Space>
                </Col>
                <Col span={12}>
                  <Text strong>状态：</Text>
                  <Space>
                    {getStatusIcon(selectedPoint.status)}
                    <Tag color={getStatusColor(selectedPoint.status)}>
                      {selectedPoint.status}
                    </Tag>
                  </Space>
                </Col>
                <Col span={24} style={{ marginTop: '12px' }}>
                  <Text strong>描述：</Text>
                  <Paragraph>{selectedPoint.description}</Paragraph>
                </Col>
              </Row>
            </Card>

            {selectedPoint.buildingInfo && (
              <Card title="建筑信息" size="small">
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic title="楼层" value={selectedPoint.buildingInfo.floors} suffix="层" />
                  </Col>
                  <Col span={6}>
                    <Statistic title="单元" value={selectedPoint.buildingInfo.units} suffix="个" />
                  </Col>
                  <Col span={6}>
                    <Statistic title="户数" value={selectedPoint.buildingInfo.households} suffix="户" />
                  </Col>
                  <Col span={6}>
                    <Statistic title="居民" value={selectedPoint.buildingInfo.residents} suffix="人" />
                  </Col>
                </Row>
              </Card>
            )}

            {(selectedPoint.temperature || selectedPoint.humidity || selectedPoint.noise) && (
              <Card title="环境数据" size="small">
                <Row gutter={16}>
                  {selectedPoint.temperature && (
                    <Col span={8}>
                      <Statistic 
                        title="温度" 
                        value={selectedPoint.temperature.toFixed(1)} 
                        suffix="°C"
                        valueStyle={{ color: selectedPoint.temperature > 30 ? token.colorError : token.colorSuccess }}
                      />
                    </Col>
                  )}
                  {selectedPoint.humidity && (
                    <Col span={8}>
                      <Statistic 
                        title="湿度" 
                        value={selectedPoint.humidity.toFixed(1)} 
                        suffix="%"
                        valueStyle={{ color: token.colorInfo }}
                      />
                    </Col>
                  )}
                  {selectedPoint.noise && (
                    <Col span={8}>
                      <Statistic 
                        title="噪音" 
                        value={selectedPoint.noise.toFixed(1)} 
                        suffix="dB"
                        valueStyle={{ color: selectedPoint.noise > 60 ? token.colorWarning : token.colorSuccess }}
                      />
                    </Col>
                  )}
                </Row>
              </Card>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default GISMapPage;