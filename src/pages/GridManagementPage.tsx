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
  DatePicker,
  Upload,
  message,
  Tabs
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
  ImportOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import ChartWrapper from '../components/ChartWrapper';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

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
}

interface GridOrganization {
  id: string;
  name: string;
  gridId: string;
  gridName: string;
  type: 'property' | 'security' | 'medical' | 'education' | 'commercial';
  contact: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  description: string;
}

const GridManagementPage: React.FC = () => {
  const [gridUnits, setGridUnits] = useState<GridUnit[]>([]);
  const [gridPersons, setGridPersons] = useState<GridPerson[]>([]);
  const [gridEvents, setGridEvents] = useState<GridEvent[]>([]);
  const [gridOrganizations, setGridOrganizations] = useState<GridOrganization[]>([]);
  const [selectedGrid, setSelectedGrid] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGrid, setEditingGrid] = useState<GridUnit | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // 模拟网格单元数据
    setGridUnits([
      {
        id: 'grid1',
        name: 'A区网格',
        code: 'GRID-A-001',
        area: 25000,
        population: 856,
        households: 268,
        buildings: 12,
        manager: '张网格员',
        managerPhone: '13800138001',
        status: 'active',
        description: 'A区住宅网格，包含12栋高层住宅',
        coordinates: [116.586, 35.415],
        createdAt: '2025-08-01'
      },
      {
        id: 'grid2',
        name: 'B区网格',
        code: 'GRID-B-001',
        area: 22000,
        population: 742,
        households: 234,
        buildings: 10,
        manager: '李网格员',
        managerPhone: '13800138002',
        status: 'active',
        description: 'B区花园洋房网格，绿化率高',
        coordinates: [116.588, 35.417],
        createdAt: '2025-08-01'
      },
      {
        id: 'grid3',
        name: '商业区网格',
        code: 'GRID-C-001',
        area: 15000,
        population: 0,
        households: 0,
        buildings: 8,
        manager: '王网格员',
        managerPhone: '13800138003',
        status: 'active',
        description: '商业配套网格，包含超市、餐饮等',
        coordinates: [116.586, 35.418],
        createdAt: '2025-08-01'
      },
      {
        id: 'grid4',
        name: '公共设施网格',
        code: 'GRID-D-001',
        area: 18000,
        population: 0,
        households: 0,
        buildings: 3,
        manager: '赵网格员',
        managerPhone: '13800138004',
        status: 'active',
        description: '公共设施网格，包含健身中心、医院等',
        coordinates: [116.585, 35.417],
        createdAt: '2025-08-01'
      },
      {
        id: 'grid5',
        name: 'C区网格',
        code: 'GRID-C-002',
        area: 20000,
        population: 693,
        households: 210,
        buildings: 9,
        manager: '钱网格员',
        managerPhone: '13800138005',
        status: 'active',
        description: 'C区改善型住宅为主，配套完善',
        coordinates: [116.589, 35.416],
        createdAt: '2025-08-05'
      },
      {
        id: 'grid6',
        name: 'D区网格',
        code: 'GRID-D-002',
        area: 17500,
        population: 512,
        households: 162,
        buildings: 7,
        manager: '孙网格员',
        managerPhone: '13800138006',
        status: 'active',
        description: 'D区刚需住宅，社区活力较强',
        coordinates: [116.584, 35.416],
        createdAt: '2025-08-06'
      },
      {
        id: 'grid7',
        name: '学校配套网格',
        code: 'GRID-E-001',
        area: 9000,
        population: 0,
        households: 0,
        buildings: 5,
        manager: '周网格员',
        managerPhone: '13800138007',
        status: 'active',
        description: '覆盖学校及周边配套，重点关照上放学高峰',
        coordinates: [116.587, 35.419],
        createdAt: '2025-08-08'
      },
      {
        id: 'grid8',
        name: '景观绿地网格',
        code: 'GRID-F-001',
        area: 12000,
        population: 0,
        households: 0,
        buildings: 2,
        manager: '吴网格员',
        managerPhone: '13800138008',
        status: 'active',
        description: '覆盖中心景观绿地与慢行系统',
        coordinates: [116.585, 35.414],
        createdAt: '2025-08-10'
      }
    ]);

    // 模拟网格人员数据
    setGridPersons([
      {
        id: 'p1',
        name: '张三',
        gridId: 'grid1',
        gridName: 'A区网格',
        type: 'resident',
        phone: '13900139001',
        address: 'A区1号楼101室',
        status: 'normal',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p2',
        name: '李明',
        gridId: 'grid1',
        gridName: 'A区网格',
        type: 'resident',
        phone: '13900139002',
        address: 'A区2号楼202室',
        status: 'normal',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p3',
        name: '王五',
        gridId: 'grid2',
        gridName: 'B区网格',
        type: 'resident',
        phone: '13900139003',
        address: 'B区1号楼101室',
        status: 'warning',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p4',
        name: '赵六',
        gridId: 'grid2',
        gridName: 'B区网格',
        type: 'resident',
        phone: '13900139004',
        address: 'B区2号楼302室',
        status: 'normal',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p5',
        name: '刘备',
        gridId: 'grid3',
        gridName: '商业区网格',
        type: 'worker',
        phone: '13900139005',
        address: '商业街A段-物业管理处',
        status: 'normal',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p6',
        name: '关羽',
        gridId: 'grid3',
        gridName: '商业区网格',
        type: 'worker',
        phone: '13900139006',
        address: '商业街B段-安保岗亭',
        status: 'normal',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p7',
        name: '张飞',
        gridId: 'grid4',
        gridName: '公共设施网格',
        type: 'worker',
        phone: '13900139007',
        address: '社区医院后勤',
        status: 'normal',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p8',
        name: '小明',
        gridId: 'grid5',
        gridName: 'C区网格',
        type: 'resident',
        phone: '13900139008',
        address: 'C区3号楼1101室',
        status: 'normal',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p9',
        name: '小红',
        gridId: 'grid6',
        gridName: 'D区网格',
        type: 'resident',
        phone: '13900139009',
        address: 'D区2号楼902室',
        status: 'warning',
        lastUpdate: '2025-08-15'
      },
      {
        id: 'p10',
        name: '巡逻员-甲',
        gridId: 'grid7',
        gridName: '学校配套网格',
        type: 'worker',
        phone: '13900139010',
        address: '学校东门巡逻点',
        status: 'normal',
        lastUpdate: '2025-08-15'
      }
    ]);

    // 模拟网格事件数据
    setGridEvents([
      {
        id: 'e1',
        title: '电梯故障',
        gridId: 'grid1',
        gridName: 'A区网格',
        type: 'facility',
        priority: 'high',
        status: 'processing',
        reporter: '张三',
        assignee: '维修部',
        createdAt: '2025-08-15 10:00',
        updatedAt: '2025-08-15 14:00',
        description: 'A区1号楼电梯故障，需要维修'
      },
      {
        id: 'e2',
        title: '垃圾箱满溢',
        gridId: 'grid2',
        gridName: 'B区网格',
        type: 'environment',
        priority: 'medium',
        status: 'completed',
        reporter: '李明',
        assignee: '保洁部',
        createdAt: '2025-08-15 08:00',
        updatedAt: '2025-08-15 09:00',
        description: 'B区垃圾箱满溢，已清理'
      },
      {
        id: 'e3',
        title: '路灯故障',
        gridId: 'grid6',
        gridName: 'D区网格',
        type: 'facility',
        priority: 'low',
        status: 'pending',
        reporter: '居民-赵',
        assignee: '工程部',
        createdAt: '2025-08-15 07:30',
        updatedAt: '2025-08-15 07:30',
        description: 'D区主路一盏路灯不亮'
      },
      {
        id: 'e4',
        title: '商铺噪音扰民',
        gridId: 'grid3',
        gridName: '商业区网格',
        type: 'service',
        priority: 'medium',
        status: 'processing',
        reporter: '居民-钱',
        assignee: '综治办',
        createdAt: '2025-08-15 22:10',
        updatedAt: '2025-08-15 22:40',
        description: '夜间商铺外摆播放音乐过大'
      },
      {
        id: 'e5',
        title: '地库渗水',
        gridId: 'grid5',
        gridName: 'C区网格',
        type: 'facility',
        priority: 'high',
        status: 'processing',
        reporter: '保安-孙',
        assignee: '工程部',
        createdAt: '2025-08-15 06:10',
        updatedAt: '2025-08-15 06:40',
        description: 'C区地库局部渗水需排查'
      },
      {
        id: 'e6',
        title: '绿地垃圾',
        gridId: 'grid8',
        gridName: '景观绿地网格',
        type: 'environment',
        priority: 'low',
        status: 'completed',
        reporter: '管理员',
        assignee: '保洁部',
        createdAt: '2025-08-14 18:30',
        updatedAt: '2025-08-14 19:00',
        description: '绿地角落有少量垃圾，已清理'
      }
    ]);

    // 模拟网格组织数据
    setGridOrganizations([
      {
        id: 'org1',
        name: '物业服务中心',
        gridId: 'grid1',
        gridName: 'A区网格',
        type: 'property',
        contact: '物业经理',
        phone: '0537-8888888',
        address: 'A区物业办公室',
        status: 'active',
        description: 'A区物业服务管理'
      },
      {
        id: 'org2',
        name: '社区医院',
        gridId: 'grid4',
        gridName: '公共设施网格',
        type: 'medical',
        contact: '医院主任',
        phone: '0537-9999999',
        address: '社区医院',
        status: 'active',
        description: '社区医疗服务'
      },
      {
        id: 'org3',
        name: '社区综治办',
        gridId: 'grid3',
        gridName: '商业区网格',
        type: 'commercial',
        contact: '综治办主任',
        phone: '0537-6666666',
        address: '商业街管理处',
        status: 'active',
        description: '商业区综合治理协调'
      },
      {
        id: 'org4',
        name: '社区学校',
        gridId: 'grid7',
        gridName: '学校配套网格',
        type: 'education',
        contact: '校办主任',
        phone: '0537-7777777',
        address: '社区学校',
        status: 'active',
        description: '学校教育与社区联动'
      },
      {
        id: 'org5',
        name: '社区安保队',
        gridId: 'grid2',
        gridName: 'B区网格',
        type: 'security',
        contact: '安保队长',
        phone: '0537-5555555',
        address: 'B区安保岗亭',
        status: 'active',
        description: '社区治安与夜间巡逻'
      }
    ]);
  }, []);

  const handleAddGrid = () => {
    setEditingGrid(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditGrid = (grid: GridUnit) => {
    setEditingGrid(grid);
    form.setFieldsValue(grid);
    setIsModalVisible(true);
  };

  const handleDeleteGrid = (gridId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个网格单元吗？',
      onOk: () => {
        setGridUnits(gridUnits.filter(grid => grid.id !== gridId));
        message.success('删除成功');
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingGrid) {
        // 编辑现有网格
        setGridUnits(gridUnits.map(grid => 
          grid.id === editingGrid.id ? { ...grid, ...values } : grid
        ));
        message.success('更新成功');
      } else {
        // 添加新网格
        const newGrid: GridUnit = {
          ...values,
          id: `grid${Date.now()}`,
          code: `GRID-${values.name.charAt(0)}-${String(gridUnits.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString().split('T')[0],
          coordinates: [116.586, 35.415]
        };
        setGridUnits([...gridUnits, newGrid]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  // 统计数据
  const totalGrids = gridUnits.length;
  const totalPopulation = gridUnits.reduce((sum, grid) => sum + grid.population, 0);
  const totalHouseholds = gridUnits.reduce((sum, grid) => sum + grid.households, 0);
  const totalBuildings = gridUnits.reduce((sum, grid) => sum + grid.buildings, 0);
  const totalEvents = gridEvents.length;

  // 图表数据
  const gridPopulationData = gridUnits.map(grid => ({
    grid: grid.name,
    population: grid.population,
    households: grid.households
  }));

  const eventTypeData = Object.entries(
    gridEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    name: type === 'safety' ? '安全事件' : 
          type === 'environment' ? '环境问题' : 
          type === 'facility' ? '设施维护' : 
          type === 'service' ? '服务问题' : '其他',
    count
  })).filter(item => item.count !== undefined && item.count !== null);

  const columns = [
    {
      title: '网格名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '网格代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      key: 'area',
      render: (area: number) => area.toLocaleString(),
    },
    {
      title: '人口',
      dataIndex: 'population',
      key: 'population',
    },
    {
      title: '户数',
      dataIndex: 'households',
      key: 'households',
    },
    {
      title: '建筑数',
      dataIndex: 'buildings',
      key: 'buildings',
    },
    {
      title: '网格员',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'active' ? 'green' : 
          status === 'inactive' ? 'red' : 'orange'
        }>
          {status === 'active' ? '正常' : 
           status === 'inactive' ? '停用' : '维护中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: GridUnit) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} size="small">
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEditGrid(record)}>
            编辑
          </Button>
          <Button type="link" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDeleteGrid(record.id)}>
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
          <AppstoreOutlined style={{ marginRight: '8px' }} />
          网格管理
        </Title>
        <Text type="secondary">依托统一管理和数字化平台，实现网格化精细管理</Text>
      </div>

      {/* 核心统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="网格总数"
              value={totalGrids}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总人口数"
              value={2847}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="户籍总数"
              value={totalHouseholds}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="事件总数"
              value={totalEvents}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 网格管理主要内容 */}
      <Tabs defaultActiveKey="grids" size="large">
        <TabPane tab="网格单元" key="grids">
          <Card
            title="网格单元管理"
            extra={
              <Space>
                <Button icon={<SearchOutlined />}>搜索</Button>
                <Button icon={<FilterOutlined />}>筛选</Button>
                <Button icon={<ExportOutlined />}>导出</Button>
                <Button icon={<ImportOutlined />}>导入</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGrid}>
                  新增网格
                </Button>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={gridUnits}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="人员管理" key="persons">
          <Card title="网格人员管理">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Select
                  placeholder="选择网格"
                  style={{ width: 200, marginBottom: 16 }}
                  value={selectedGrid}
                  onChange={setSelectedGrid}
                >
                  <Option value="all">全部网格</Option>
                  {gridUnits.map(grid => (
                    <Option key={grid.id} value={grid.id}>{grid.name}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={gridPersons.filter(person => 
                selectedGrid === 'all' || person.gridId === selectedGrid
              )}
              renderItem={(person) => (
                <List.Item>
                  <Card size="small">
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<UserOutlined />} 
                          style={{ 
                            backgroundColor: person.status === 'normal' ? '#52c41a' : 
                                           person.status === 'warning' ? '#faad14' : '#ff4d4f' 
                          }}
                        />
                      }
                      title={
                        <Space>
                          {person.name}
                          <Tag color={
                            person.type === 'resident' ? 'blue' : 
                            person.type === 'worker' ? 'green' : 
                            person.type === 'visitor' ? 'orange' : 'purple'
                          }>
                            {person.type === 'resident' ? '居民' : 
                             person.type === 'worker' ? '工作人员' : 
                             person.type === 'visitor' ? '访客' : '管理员'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div>网格：{person.gridName}</div>
                          <div>电话：{person.phone}</div>
                          <div>地址：{person.address}</div>
                          <div>状态：{person.status === 'normal' ? '正常' : 
                                     person.status === 'warning' ? '警告' : '警报'}</div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane tab="事件管理" key="events">
          <Card title="网格事件管理">
            <List
              dataSource={gridEvents.filter(event => 
                selectedGrid === 'all' || event.gridId === selectedGrid
              )}
              renderItem={(event) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        {event.title}
                        <Tag color={
                          event.priority === 'urgent' ? 'red' : 
                          event.priority === 'high' ? 'orange' : 
                          event.priority === 'medium' ? 'blue' : 'green'
                        }>
                          {event.priority === 'urgent' ? '紧急' : 
                           event.priority === 'high' ? '高' : 
                           event.priority === 'medium' ? '中' : '低'}
                        </Tag>
                        <Tag color={
                          event.status === 'pending' ? 'orange' : 
                          event.status === 'processing' ? 'blue' : 
                          event.status === 'completed' ? 'green' : 'red'
                        }>
                          {event.status === 'pending' ? '待处理' : 
                           event.status === 'processing' ? '处理中' : 
                           event.status === 'completed' ? '已完成' : '已取消'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>网格：{event.gridName}</div>
                        <div>报告人：{event.reporter}</div>
                        <div>处理人：{event.assignee}</div>
                        <div>创建时间：{event.createdAt}</div>
                        <div>更新时间：{event.updatedAt}</div>
                        <div>描述：{event.description}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane tab="组织管理" key="organizations">
          <Card title="网格组织管理">
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={gridOrganizations.filter(org => 
                selectedGrid === 'all' || org.gridId === selectedGrid
              )}
              renderItem={(org) => (
                <List.Item>
                  <Card size="small">
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<TeamOutlined />} 
                          style={{ backgroundColor: org.status === 'active' ? '#52c41a' : '#ff4d4f' }}
                        />
                      }
                      title={
                        <Space>
                          {org.name}
                          <Tag color={
                            org.type === 'property' ? 'blue' : 
                            org.type === 'security' ? 'green' : 
                            org.type === 'medical' ? 'red' : 
                            org.type === 'education' ? 'purple' : 'orange'
                          }>
                            {org.type === 'property' ? '物业' : 
                             org.type === 'security' ? '安保' : 
                             org.type === 'medical' ? '医疗' : 
                             org.type === 'education' ? '教育' : '商业'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div>网格：{org.gridName}</div>
                          <div>联系人：{org.contact}</div>
                          <div>电话：{org.phone}</div>
                          <div>地址：{org.address}</div>
                          <div>状态：{org.status === 'active' ? '活跃' : '停用'}</div>
                          <div>描述：{org.description}</div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane tab="数据分析" key="analysis">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="网格人口分布">
                {gridPopulationData && gridPopulationData.length > 0 && gridPopulationData.every(item => item.population !== undefined && item.population !== null) && (
                  <ChartWrapper height={300}>
                    <Column
                      data={gridPopulationData}
                      xField="grid"
                      yField="population"
                      height={300}
                      color="#1890ff"
                      label={{
                        position: 'top',
                      }}
                      autoFit={false}
                    />
                  </ChartWrapper>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="事件类型分布">
                {eventTypeData && eventTypeData.length > 0 && eventTypeData.every(item => item.count !== undefined && item.count !== null) && (
                  <ChartWrapper height={300}>
                    <Pie
                      data={eventTypeData}
                      angleField="count"
                      colorField="name"
                      height={300}
                      radius={0.8}
                      label={{
                        position: 'outside',
                        content: (data: any) => data.name,
                      }}
                      autoFit={false}
                    />
                  </ChartWrapper>
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 新增/编辑网格模态框 */}
      <Modal
        title={editingGrid ? '编辑网格' : '新增网格'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="网格名称"
                rules={[{ required: true, message: '请输入网格名称' }]}
              >
                <Input placeholder="请输入网格名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="area"
                label="面积(平方米)"
                rules={[{ required: true, message: '请输入面积' }]}
              >
                <Input type="number" placeholder="请输入面积" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="population"
                label="人口数量"
                rules={[{ required: true, message: '请输入人口数量' }]}
              >
                <Input type="number" placeholder="请输入人口数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="households"
                label="户数"
                rules={[{ required: true, message: '请输入户数' }]}
              >
                <Input type="number" placeholder="请输入户数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="buildings"
                label="建筑数量"
                rules={[{ required: true, message: '请输入建筑数量' }]}
              >
                <Input type="number" placeholder="请输入建筑数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="manager"
                label="网格员"
                rules={[{ required: true, message: '请输入网格员姓名' }]}
              >
                <Input placeholder="请输入网格员姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="managerPhone"
            label="网格员电话"
            rules={[{ required: true, message: '请输入网格员电话' }]}
          >
            <Input placeholder="请输入网格员电话" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入网格描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GridManagementPage;
