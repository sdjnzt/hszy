import React, { useState, useEffect } from 'react';
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
  Switch,
  Upload,
  message,
  Tabs,
  Alert,
  Descriptions,
  Image
} from 'antd';
import {
  CameraOutlined,
  BulbOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  CarOutlined,
  MedicineBoxOutlined,
  ShopOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface MonitoringDevice {
  id: string;
  name: string;
  type: 'camera' | 'sensor' | 'light' | 'access' | 'elevator';
  location: string;
  area: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastUpdate: string;
  coordinates: [number, number];
  description: string;
  ipAddress: string;
  port: number;
  resolution: string;
  fps: number;
  storage: number; // GB
  recording: boolean;
  nightVision: boolean;
  motionDetection: boolean;
  faceRecognition: boolean;
  manufacturer: string;
  model: string;
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface DeviceStatus {
  online: number;
  offline: number;
  maintenance: number;
  error: number;
}

interface AreaCoverage {
  area: string;
  totalDevices: number;
  onlineDevices: number;
  coverage: number; // 百分比
}

const MonitoringDevicePage: React.FC = () => {
  const [devices, setDevices] = useState<MonitoringDevice[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<MonitoringDevice | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<MonitoringDevice | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟监控设备数据
    setDevices([
      // 社区广场监控
      {
        id: 'cam1',
        name: '社区广场主监控',
        type: 'camera',
        location: '社区广场中心',
        area: '社区广场',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.587, 35.416],
        description: '社区广场主监控，覆盖广场全区域',
        ipAddress: '192.168.1.101',
        port: 8080,
        resolution: '4K',
        fps: 30,
        storage: 1000,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: true,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      {
        id: 'cam2',
        name: '社区广场入口监控',
        type: 'camera',
        location: '社区广场入口',
        area: '社区广场',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.587, 35.416],
        description: '广场入口监控，人员进出记录',
        ipAddress: '192.168.1.102',
        port: 8080,
        resolution: '2K',
        fps: 25,
        storage: 500,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: true,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      // 社区活动中心监控
      {
        id: 'cam3',
        name: '活动中心大厅监控',
        type: 'camera',
        location: '社区活动中心大厅',
        area: '社区活动中心',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.585, 35.417],
        description: '活动中心大厅监控，活动安全监控',
        ipAddress: '192.168.1.103',
        port: 8080,
        resolution: '4K',
        fps: 30,
        storage: 1000,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: true,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      // 商贸市场监控
      {
        id: 'cam4',
        name: '商业街主监控',
        type: 'camera',
        location: '商业街中心',
        area: '商贸市场',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.586, 35.418],
        description: '商业街主监控，商业活动监控',
        ipAddress: '192.168.1.104',
        port: 8080,
        resolution: '4K',
        fps: 30,
        storage: 1000,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: true,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      // 小区出入口监控
      {
        id: 'cam5',
        name: 'A区大门监控',
        type: 'camera',
        location: 'A区大门',
        area: '小区出入口',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.586, 35.415],
        description: 'A区大门监控，人员车辆进出记录',
        ipAddress: '192.168.1.105',
        port: 8080,
        resolution: '4K',
        fps: 30,
        storage: 1000,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: true,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      {
        id: 'cam6',
        name: 'B区大门监控',
        type: 'camera',
        location: 'B区大门',
        area: '小区出入口',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.588, 35.417],
        description: 'B区大门监控，人员车辆进出记录',
        ipAddress: '192.168.1.106',
        port: 8080,
        resolution: '4K',
        fps: 30,
        storage: 1000,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: true,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      // 地下停车场监控
      {
        id: 'cam7',
        name: '地下停车场主监控',
        type: 'camera',
        location: '地下停车场中心',
        area: '地下停车场',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.587, 35.415],
        description: '地下停车场主监控，车辆安全监控',
        ipAddress: '192.168.1.107',
        port: 8080,
        resolution: '4K',
        fps: 30,
        storage: 1000,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: false,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      // 电梯监控
      {
        id: 'cam8',
        name: 'A区1号楼电梯监控',
        type: 'elevator',
        location: 'A区1号楼电梯',
        area: '电梯监控',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.586, 35.415],
        description: 'A区1号楼电梯监控，电梯安全监控',
        ipAddress: '192.168.1.108',
        port: 8080,
        resolution: '2K',
        fps: 25,
        storage: 500,
        recording: true,
        nightVision: false,
        motionDetection: true,
        faceRecognition: false,
        manufacturer: '海康威视',
        model: 'DS-2CD2T47G1-L',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      // 智慧路灯
      {
        id: 'light1',
        name: '智慧路灯A1',
        type: 'light',
        location: 'A区主干道',
        area: '智慧路灯',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.586, 35.415],
        description: 'A区主干道智慧路灯，集成监控功能',
        ipAddress: '192.168.1.201',
        port: 8080,
        resolution: '2K',
        fps: 20,
        storage: 200,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: false,
        manufacturer: '华为',
        model: 'Huawei-Light-001',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      },
      // 门禁设备
      {
        id: 'access1',
        name: 'A区门禁系统',
        type: 'access',
        location: 'A区大门',
        area: '门禁系统',
        status: 'online',
        lastUpdate: '2025-08-15 15:30',
        coordinates: [116.586, 35.415],
        description: 'A区门禁系统，人员进出控制',
        ipAddress: '192.168.1.301',
        port: 8080,
        resolution: '1K',
        fps: 15,
        storage: 100,
        recording: true,
        nightVision: true,
        motionDetection: true,
        faceRecognition: true,
        manufacturer: '海康威视',
        model: 'DS-K1T671M',
        installDate: '2025-08-01',
        lastMaintenance: '2025-08-10',
        nextMaintenance: '2025-08-10'
      }
    ]);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'camera':
        return <CameraOutlined style={{ color: '#1890ff' }} />;
      case 'sensor':
        return <SafetyCertificateOutlined style={{ color: '#52c41a' }} />;
      case 'light':
        return <BulbOutlined style={{ color: '#faad14' }} />;
      case 'access':
        return <KeyOutlined style={{ color: '#722ed1' }} />;
      case 'elevator':
        return <VideoCameraOutlined style={{ color: '#13c2c2' }} />;
      default:
        return <SafetyCertificateOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      case 'maintenance':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'maintenance':
        return '维护中';
      case 'error':
        return '故障';
      default:
        return '未知';
    }
  };

  const getAreaIcon = (area: string) => {
    switch (area) {
      case '社区广场':
        return <TrophyOutlined style={{ color: '#52c41a' }} />;
      case '社区活动中心':
        return <HomeOutlined style={{ color: '#1890ff' }} />;
      case '商贸市场':
        return <ShopOutlined style={{ color: '#faad14' }} />;
      case '小区出入口':
        return <EnvironmentOutlined style={{ color: '#722ed1' }} />;
      case '地下停车场':
        return <CarOutlined style={{ color: '#13c2c2' }} />;
      case '电梯监控':
        return <VideoCameraOutlined style={{ color: '#ff4d4f' }} />;
      case '智慧路灯':
        return <BulbOutlined style={{ color: '#faad14' }} />;
      case '门禁系统':
        return <KeyOutlined style={{ color: '#722ed1' }} />;
      default:
        return <EnvironmentOutlined />;
    }
  };

  const handleAddDevice = () => {
    setEditingDevice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditDevice = (device: MonitoringDevice) => {
    setEditingDevice(device);
    form.setFieldsValue(device);
    setIsModalVisible(true);
  };

  const handleDeleteDevice = (deviceId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个监控设备吗？',
      onOk: () => {
        setDevices(devices.filter(device => device.id !== deviceId));
        message.success('删除成功');
      }
    });
  };

  const handleViewDevice = (device: MonitoringDevice) => {
    setSelectedDevice(device);
    setIsDetailModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingDevice) {
        // 编辑现有设备
        setDevices(devices.map(device => 
          device.id === editingDevice.id ? { ...device, ...values } : device
        ));
        message.success('更新成功');
      } else {
        // 添加新设备
        const newDevice: MonitoringDevice = {
          ...values,
          id: `device${Date.now()}`,
          lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
          coordinates: [116.586, 35.415],
          installDate: new Date().toISOString().split('T')[0],
          lastMaintenance: new Date().toISOString().split('T')[0],
          nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        setDevices([...devices, newDevice]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const filteredDevices = devices.filter(device => {
    const areaMatch = selectedArea === 'all' || device.area === selectedArea;
    const typeMatch = selectedType === 'all' || device.type === selectedType;
    return areaMatch && typeMatch;
  });

  // 统计数据
  const deviceStatus: DeviceStatus = devices.reduce((acc, device) => {
    acc[device.status]++;
    return acc;
  }, { online: 0, offline: 0, maintenance: 0, error: 0 });

  const areaCoverage: AreaCoverage[] = Object.entries(
    devices.reduce((acc, device) => {
      if (!acc[device.area]) {
        acc[device.area] = { total: 0, online: 0 };
      }
      acc[device.area].total++;
      if (device.status === 'online') {
        acc[device.area].online++;
      }
      return acc;
    }, {} as Record<string, { total: number; online: number }>)
  ).map(([area, stats]) => ({
    area,
    totalDevices: stats.total,
    onlineDevices: stats.online,
    coverage: Math.round((stats.online / stats.total) * 100)
  }));

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: MonitoringDevice) => (
        <Space>
          {getDeviceIcon(record.type)}
          {name}
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          camera: '监控摄像头',
          sensor: '传感器',
          light: '智慧路灯',
          access: '门禁设备',
          elevator: '电梯监控'
        };
        return typeMap[type as keyof typeof typeMap] || type;
      },
    },
    {
      title: '安装位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      key: 'area',
      render: (area: string) => (
        <Space>
          {getAreaIcon(area)}
          {area}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MonitoringDevice) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => handleViewDevice(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEditDevice(record)}>
            编辑
          </Button>
          <Button type="link" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDeleteDevice(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <CameraOutlined style={{ marginRight: '8px' }} />
          监控设备管理
        </Title>
        <Text type="secondary">社区各处及智慧灯杆上的智能摄像头管理，实现全方位监控覆盖</Text>
      </div>

      {/* 设备状态统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={deviceStatus.online}
              prefix={<CameraOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={deviceStatus.offline}
              prefix={<CameraOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="维护中"
              value={deviceStatus.maintenance}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="故障设备"
              value={deviceStatus.error}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 区域覆盖统计 */}
      <Card title="区域监控覆盖" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {areaCoverage.map((coverage) => (
            <Col xs={24} sm={12} md={6} key={coverage.area}>
              <Card size="small">
                <Statistic
                  title={coverage.area}
                  value={coverage.coverage}
                  suffix="%"
                  valueStyle={{ color: coverage.coverage >= 80 ? '#52c41a' : coverage.coverage >= 60 ? '#faad14' : '#ff4d4f' }}
                />
                <Progress
                  percent={coverage.coverage}
                  size="small"
                  strokeColor={coverage.coverage >= 80 ? '#52c41a' : coverage.coverage >= 60 ? '#faad14' : '#ff4d4f'}
                />
                <Text type="secondary">
                  {coverage.onlineDevices}/{coverage.totalDevices} 设备在线
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 设备管理主要内容 */}
      <Card
        title="监控设备管理"
        extra={
          <Space>
            <Select
              placeholder="选择区域"
              style={{ width: 150 }}
              value={selectedArea}
              onChange={setSelectedArea}
            >
              <Option value="all">全部区域</Option>
              <Option value="社区广场">社区广场</Option>
              <Option value="社区活动中心">社区活动中心</Option>
              <Option value="商贸市场">商贸市场</Option>
              <Option value="小区出入口">小区出入口</Option>
              <Option value="地下停车场">地下停车场</Option>
              <Option value="电梯监控">电梯监控</Option>
              <Option value="智慧路灯">智慧路灯</Option>
              <Option value="门禁系统">门禁系统</Option>
            </Select>
            <Select
              placeholder="设备类型"
              style={{ width: 150 }}
              value={selectedType}
              onChange={setSelectedType}
            >
              <Option value="all">全部类型</Option>
              <Option value="camera">监控摄像头</Option>
              <Option value="sensor">传感器</Option>
              <Option value="light">智慧路灯</Option>
              <Option value="access">门禁设备</Option>
              <Option value="elevator">电梯监控</Option>
            </Select>
            <Button icon={<SearchOutlined />}>搜索</Button>
            <Button icon={<FilterOutlined />}>筛选</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button icon={<ImportOutlined />}>导入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDevice}>
              新增设备
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredDevices}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 新增/编辑设备模态框 */}
      <Modal
        title={editingDevice ? '编辑监控设备' : '新增监控设备'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select placeholder="请选择设备类型">
                  <Option value="camera">监控摄像头</Option>
                  <Option value="sensor">传感器</Option>
                  <Option value="light">智慧路灯</Option>
                  <Option value="access">门禁设备</Option>
                  <Option value="elevator">电梯监控</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="安装位置"
                rules={[{ required: true, message: '请输入安装位置' }]}
              >
                <Input placeholder="请输入安装位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="area"
                label="所属区域"
                rules={[{ required: true, message: '请选择所属区域' }]}
              >
                <Select placeholder="请选择所属区域">
                  <Option value="社区广场">社区广场</Option>
                  <Option value="社区活动中心">社区活动中心</Option>
                  <Option value="商贸市场">商贸市场</Option>
                  <Option value="小区出入口">小区出入口</Option>
                  <Option value="地下停车场">地下停车场</Option>
                  <Option value="电梯监控">电梯监控</Option>
                  <Option value="智慧路灯">智慧路灯</Option>
                  <Option value="门禁系统">门禁系统</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ipAddress"
                label="IP地址"
                rules={[{ required: true, message: '请输入IP地址' }]}
              >
                <Input placeholder="请输入IP地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="port"
                label="端口"
                rules={[{ required: true, message: '请输入端口' }]}
              >
                <Input type="number" placeholder="请输入端口" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="resolution"
                label="分辨率"
                rules={[{ required: true, message: '请输入分辨率' }]}
              >
                <Select placeholder="请选择分辨率">
                  <Option value="1K">1K</Option>
                  <Option value="2K">2K</Option>
                  <Option value="4K">4K</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fps"
                label="帧率"
                rules={[{ required: true, message: '请输入帧率' }]}
              >
                <Input type="number" placeholder="请输入帧率" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="制造商"
                rules={[{ required: true, message: '请输入制造商' }]}
              >
                <Input placeholder="请输入制造商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="model"
                label="型号"
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="设备描述"
          >
            <Input.TextArea rows={3} placeholder="请输入设备描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 设备详情模态框 */}
      <Modal
        title="设备详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedDevice && (
          <div>
            <Alert
              message={`设备状态：${getStatusText(selectedDevice.status)}`}
              type={selectedDevice.status === 'online' ? 'success' : 
                    selectedDevice.status === 'offline' ? 'error' : 
                    selectedDevice.status === 'maintenance' ? 'warning' : 'error'}
              style={{ marginBottom: '16px' }}
            />
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="设备名称">{selectedDevice.name}</Descriptions.Item>
              <Descriptions.Item label="设备类型">
                {selectedDevice.type === 'camera' ? '监控摄像头' : 
                 selectedDevice.type === 'sensor' ? '传感器' : 
                 selectedDevice.type === 'light' ? '智慧路灯' : 
                 selectedDevice.type === 'access' ? '门禁设备' : '电梯监控'}
              </Descriptions.Item>
              <Descriptions.Item label="安装位置">{selectedDevice.location}</Descriptions.Item>
              <Descriptions.Item label="所属区域">{selectedDevice.area}</Descriptions.Item>
              <Descriptions.Item label="IP地址">{selectedDevice.ipAddress}</Descriptions.Item>
              <Descriptions.Item label="端口">{selectedDevice.port}</Descriptions.Item>
              <Descriptions.Item label="分辨率">{selectedDevice.resolution}</Descriptions.Item>
              <Descriptions.Item label="帧率">{selectedDevice.fps} FPS</Descriptions.Item>
              <Descriptions.Item label="存储容量">{selectedDevice.storage} GB</Descriptions.Item>
              <Descriptions.Item label="制造商">{selectedDevice.manufacturer}</Descriptions.Item>
              <Descriptions.Item label="型号">{selectedDevice.model}</Descriptions.Item>
              <Descriptions.Item label="安装日期">{selectedDevice.installDate}</Descriptions.Item>
              <Descriptions.Item label="最后维护">{selectedDevice.lastMaintenance}</Descriptions.Item>
              <Descriptions.Item label="下次维护">{selectedDevice.nextMaintenance}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="功能特性" bordered column={2}>
              <Descriptions.Item label="录像功能">
                <Tag color={selectedDevice.recording ? 'green' : 'red'}>
                  {selectedDevice.recording ? '启用' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="夜视功能">
                <Tag color={selectedDevice.nightVision ? 'green' : 'red'}>
                  {selectedDevice.nightVision ? '启用' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="移动侦测">
                <Tag color={selectedDevice.motionDetection ? 'green' : 'red'}>
                  {selectedDevice.motionDetection ? '启用' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="人脸识别">
                <Tag color={selectedDevice.faceRecognition ? 'green' : 'red'}>
                  {selectedDevice.faceRecognition ? '启用' : '禁用'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button type="primary" icon={<PlayCircleOutlined />}>
                  实时预览
                </Button>
                <Button icon={<PauseCircleOutlined />}>
                  暂停预览
                </Button>
                <Button icon={<ReloadOutlined />}>
                  刷新状态
                </Button>
                <Button icon={<SettingOutlined />}>
                  设备配置
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MonitoringDevicePage;
