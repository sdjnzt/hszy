import React, { useState, useMemo, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Modal, 
  Descriptions, 
  Tag, 
  Avatar, 
  Space, 
  Button, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tabs, 
  Alert, 
  Progress, 
  Divider, 
  Badge,
  Tooltip,
  Form,
  DatePicker,
  message,
  Flex,
  theme,
  List,
  Timeline,
  Drawer,
  Typography
} from 'antd';
import { 
  persons, 
  Person, 
  dormitoryData 
} from '../data/mockData';
import { 
  UserOutlined, 
  TeamOutlined, 
  HomeOutlined, 
  PhoneOutlined, 
  IdcardOutlined, 
  SafetyOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  ContactsOutlined,
  BarChartOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  FilterOutlined,
  EyeOutlined,
  ApartmentOutlined,
  HeartOutlined,
  StarOutlined,
  TrophyOutlined,
  FireOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  WifiOutlined,
  DatabaseOutlined,
  CloudOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Search } = Input;
const { TabPane } = Tabs;
const { useToken } = theme;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const genderOptions = [
  { value: 'all', label: '全部性别' },
  { value: '男', label: '男' },
  { value: '女', label: '女' },
];

const departmentOptions = [
  { value: 'all', label: '全部部门' },
  { value: '采掘部', label: '采掘部' },
  { value: '机电部', label: '机电部' },
  { value: '安全部', label: '安全部' },
  { value: '后勤部', label: '后勤部' },
  { value: '财务部', label: '财务部' },
  { value: '管理部', label: '管理部' },
];

const shiftOptions = [
  { value: 'all', label: '全部班次' },
  { value: '白班', label: '白班' },
  { value: '夜班', label: '夜班' },
  { value: '倒班', label: '倒班' },
];

const buildingOptions = [
  { value: 'all', label: '全部宿舍楼' },
  { value: '1号楼', label: '1号宿舍楼' },
  { value: '2号楼', label: '2号宿舍楼' },
  { value: '3号楼', label: '3号宿舍楼' },
  { value: '4号楼', label: '4号宿舍楼' },
];

/**
 * 人员档案管理页面
 * 
 * 提供：筛选/搜索、列表展示、统计分析、宿舍管理、导入导出、增删改模拟
 * - 使用 useMemo 优化过滤
 * - 输入搜索采用去抖更新
 * - 表格列支持排序/过滤
 * - 支持行选择与批量操作（前端模拟）
 */
const PersonPage: React.FC = () => {
  const { token } = useToken();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [personDetailVisible, setPersonDetailVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // 去抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // 过滤后的人员数据
  const filteredPersons = useMemo(() => {
    return persons.filter(person => {
      const matchesSearch = debouncedSearch === '' || 
        person.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        person.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        person.phone.includes(debouncedSearch) ||
        person.department.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesGender = genderFilter === 'all' || person.gender === genderFilter;
      const matchesDepartment = departmentFilter === 'all' || person.department === departmentFilter;
        const matchesShift = shiftFilter === 'all' || person.workShift === shiftFilter;
  const matchesBuilding = buildingFilter === 'all' || person.dormitoryNumber === buildingFilter;
      
      return matchesSearch && matchesGender && matchesDepartment && matchesShift && matchesBuilding;
    });
  }, [debouncedSearch, genderFilter, departmentFilter, shiftFilter, buildingFilter]);

  // 统计数据
  const stats = useMemo(() => {
    const total = filteredPersons.length;
    const male = filteredPersons.filter(p => p.gender === '男').length;
    const female = filteredPersons.filter(p => p.gender === '女').length;
    const departments = filteredPersons.reduce((acc, p) => {
      acc[p.department] = (acc[p.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, male, female, departments };
  }, [filteredPersons]);

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Person) => (
        <Space>
        <Avatar 
            size="small" 
            style={{ backgroundColor: record.gender === '男' ? token.colorPrimary : token.colorLink }}
          icon={<UserOutlined />}
          />
          <span>{text}</span>
        </Space>
      ),
      sorter: (a: Person, b: Person) => a.name.localeCompare(b.name),
    },
    {
      title: '工号',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
      sorter: (a: Person, b: Person) => a.id.localeCompare(b.id),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <Tag color={gender === '男' ? 'blue' : 'pink'}>
          {gender === '男' ? '男' : '女'}
        </Tag>
      ),
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value: string | number | boolean, record: Person) => record.gender === value,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => <Tag color="green">{department}</Tag>,
      filters: departmentOptions.filter(opt => opt.value !== 'all').map(opt => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value: string | number | boolean, record: Person) => record.department === value,
    },
    {
      title: '班次',
      dataIndex: 'workShift',
      key: 'workShift',
      render: (shift: string) => <Tag color="orange">{shift}</Tag>,
      filters: shiftOptions.filter(opt => opt.value !== 'all').map(opt => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value: string, record: Person) => record.workShift === value,
    },
    {
      title: '宿舍楼',
      dataIndex: 'dormitoryNumber',
      key: 'dormitoryNumber',
      render: (building: string) => <Tag color="purple">{building}</Tag>,
      filters: buildingOptions.filter(opt => opt.value !== 'all').map(opt => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value: string, record: Person) => record.dormitoryNumber === value,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <Space>
          <PhoneOutlined />
          <span>{phone}</span>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Person) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPerson(record);
              setPersonDetailVisible(true);
            }}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPerson(record);
              setIsModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理删除
  const handleDelete = (person: Person) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${person.name} 的人员档案吗？`,
      onOk() {
        message.success('删除成功');
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的人员');
      return;
    }
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个人员档案吗？`,
      onOk() {
        message.success('批量删除成功');
        setSelectedRowKeys([]);
      },
    });
  };

  // 处理导入
  const handleImport = () => {
    message.info('导入功能开发中...');
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  // 图表数据
  const genderChartData = [
    { name: '男', value: stats.male, color: token.colorPrimary },
    { name: '女', value: stats.female, color: token.colorLink },
  ];

  const departmentChartData = Object.entries(stats.departments).map(([dept, count]) => ({
    name: dept,
    value: count,
  }));

  const shiftChartData = [
    { name: '白班', value: filteredPersons.filter(p => p.workShift === '白班').length },
    { name: '夜班', value: filteredPersons.filter(p => p.workShift === '夜班').length },
    { name: '倒班', value: filteredPersons.filter(p => p.workShift === '倒班').length },
  ];

  const buildingChartData = [
    { name: '1号楼', value: filteredPersons.filter(p => p.dormitoryNumber === '1号楼').length },
    { name: '2号楼', value: filteredPersons.filter(p => p.dormitoryNumber === '2号楼').length },
    { name: '3号楼', value: filteredPersons.filter(p => p.dormitoryNumber === '3号楼').length },
    { name: '4号楼', value: filteredPersons.filter(p => p.dormitoryNumber === '4号楼').length },
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
        bodyStyle={{ padding: '24px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <TeamOutlined style={{ marginRight: '12px' }} />
              智慧社区人员档案管理
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0' }}>
              全面管理社区人员信息，实现人口数据可视化和网格化管理
            </Paragraph>
          </Col>
          <Col>
            <Avatar size={80} style={{ background: 'rgba(255,255,255,0.2)' }}>
              <UserOutlined style={{ fontSize: '40px', color: 'white' }} />
            </Avatar>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                <TeamOutlined />
              </div>
            <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>总人数</span>}
              value={stats.total}
                suffix={<span style={{ color: 'rgba(255,255,255,0.9)' }}>人</span>}
                valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                <UserOutlined />
              </div>
            <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>男性</span>}
              value={stats.male}
                suffix={<span style={{ color: 'rgba(255,255,255,0.9)' }}>人</span>}
                valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                <HeartOutlined />
              </div>
            <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>女性</span>}
              value={stats.female}
                suffix={<span style={{ color: 'rgba(255,255,255,0.9)' }}>人</span>}
                valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                <ApartmentOutlined />
            </div>
            <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>部门数</span>}
                value={Object.keys(stats.departments).length}
                suffix={<span style={{ color: 'rgba(255,255,255,0.9)' }}>个</span>}
                valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
        <TabPane tab="人员档案" key="overview">
          {/* 搜索和筛选 */}
          <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Search
                  placeholder="搜索姓名、工号、电话、部门"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  value={genderFilter}
                  onChange={setGenderFilter}
                  style={{ width: '100%' }}
                  placeholder="性别筛选"
                >
                  {genderOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  style={{ width: '100%' }}
                  placeholder="部门筛选"
                >
                  {departmentOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  value={shiftFilter}
                  onChange={setShiftFilter}
                  style={{ width: '100%' }}
                  placeholder="班次筛选"
                >
                  {shiftOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  value={buildingFilter}
                  onChange={setBuildingFilter}
                  style={{ width: '100%' }}
                  placeholder="宿舍楼筛选"
                >
                  {buildingOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingPerson(null);
                      setIsModalVisible(true);
                    }}
                  >
                    新增人员
                  </Button>
                  <Button 
                    icon={<ImportOutlined />}
                    onClick={handleImport}
                  >
                    导入
                  </Button>
                  <Button 
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                  >
                    导出
                  </Button>
                </Space>
              </Col>
              <Col flex="auto" />
              <Col>
                <Space>
                  <Text>已选择 {selectedRowKeys.length} 项</Text>
                  <Button 
                    danger
                    disabled={selectedRowKeys.length === 0}
                    onClick={handleBatchDelete}
                  >
                    批量删除
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 人员表格 */}
          <Card style={{ borderRadius: '12px' }}>
            <Table
              columns={columns as any}
              dataSource={filteredPersons}
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              pagination={{
                total: filteredPersons.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
          </TabPane>

        <TabPane tab="统计分析" key="analysis">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="性别分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts
                    option={{
                      title: {
                      text: '人员性别分布',
                      left: 'center'
                    },
                    tooltip: {
                      trigger: 'item',
                      formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                      orient: 'vertical',
                      left: 'left'
                    },
                    series: [
                      {
                        name: '性别分布',
                        type: 'pie',
                        radius: '50%',
                        data: genderChartData,
                        emphasis: {
                          itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                        }
                      }
                    ]
                  }}
                  style={{ height: '300px' }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="部门分布" style={{ borderRadius: '12px' }}>
                <ReactECharts
                  option={{
                    title: {
                      text: '人员部门分布',
                      left: 'center'
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                      }
                      },
                      xAxis: {
                        type: 'category',
                      data: departmentChartData.map(item => item.name),
                        axisLabel: {
                        rotate: 45
                        }
                      },
                      yAxis: {
                      type: 'value'
                      },
                    series: [
                      {
                        name: '人数',
                        type: 'bar',
                        data: departmentChartData.map(item => item.value),
                        itemStyle: {
                          color: token.colorPrimary
                          }
                        }
                    ]
                    }}
                    style={{ height: '300px' }}
                  />
                </Card>
              </Col>
            <Col xs={24} lg={12}>
              <Card title="班次分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts
                    option={{
                      title: {
                      text: '人员班次分布',
                      left: 'center'
                      },
                      tooltip: {
                      trigger: 'item'
                    },
                    series: [
                      {
                        name: '班次分布',
                        type: 'pie',
                        radius: '50%',
                        data: shiftChartData,
                        emphasis: {
                          itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                        }
                      }
                    ]
                    }}
                    style={{ height: '300px' }}
                  />
                </Card>
              </Col>
            <Col xs={24} lg={12}>
              <Card title="宿舍楼分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts
                    option={{
                      title: {
                      text: '人员宿舍楼分布',
                      left: 'center'
                      },
                      tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      }
                    },
                    xAxis: {
                      type: 'category',
                      data: buildingChartData.map(item => item.name)
                    },
                    yAxis: {
                      type: 'value'
                    },
                    series: [
                      {
                        name: '人数',
                        type: 'bar',
                        data: buildingChartData.map(item => item.value),
                        itemStyle: {
                          color: token.colorSuccess
                        }
                      }
                    ]
                  }}
                  style={{ height: '300px' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

        <TabPane tab="宿舍管理" key="dormitory">
          <Card title="宿舍信息概览" style={{ borderRadius: '12px' }}>
            <Row gutter={[24, 24]}>
              {buildingOptions.filter(opt => opt.value !== 'all').map(building => {
                                 const buildingPersons = filteredPersons.filter(p => p.dormitoryNumber === building.value);
                const maleCount = buildingPersons.filter(p => p.gender === '男').length;
                const femaleCount = buildingPersons.filter(p => p.gender === '女').length;
                
                return (
                  <Col xs={24} sm={12} lg={6} key={building.value}>
                    <Card 
                      title={
                        <Flex align="center" gap="8">
                          <ApartmentOutlined style={{ color: token.colorPrimary }} />
                          <span>{building.label}</span>
                        </Flex>
                      }
                      style={{ borderRadius: '12px' }}
                    >
                      <Statistic
                        title="总人数"
                        value={buildingPersons.length}
                        suffix="人"
                        valueStyle={{ color: token.colorPrimary }}
                      />
                      <Divider />
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Statistic
                            title="男性"
                            value={maleCount}
                            suffix="人"
                            valueStyle={{ color: token.colorPrimary, fontSize: '16px' }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="女性"
                            value={femaleCount}
                            suffix="人"
                            valueStyle={{ color: token.colorLink, fontSize: '16px' }}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
          </TabPane>
        </Tabs>

      {/* 人员详情抽屉 */}
      <Drawer
        title="人员详情"
        placement="right"
        onClose={() => setPersonDetailVisible(false)}
        open={personDetailVisible}
        width={500}
      >
        {selectedPerson && (
          <div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="姓名">{selectedPerson.name}</Descriptions.Item>
              <Descriptions.Item label="工号">{selectedPerson.id}</Descriptions.Item>
              <Descriptions.Item label="性别">
                <Tag color={selectedPerson.gender === '男' ? 'blue' : 'pink'}>
                  {selectedPerson.gender}
                    </Tag>
                  </Descriptions.Item>
              <Descriptions.Item label="部门">
                <Tag color="green">{selectedPerson.department}</Tag>
                  </Descriptions.Item>
                             <Descriptions.Item label="班次">
                 <Tag color="orange">{selectedPerson.workShift}</Tag>
                  </Descriptions.Item>
               <Descriptions.Item label="宿舍楼">
                 <Tag color="purple">{selectedPerson.dormitoryNumber}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedPerson.phone}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" icon={<EditOutlined />}>
                编辑信息
              </Button>
                             <Button icon={<EnvironmentOutlined />}>
                 查看位置
               </Button>
            </Space>
          </div>
        )}
      </Drawer>

      {/* 新增/编辑人员模态框 */}
      <Modal
        title={editingPerson ? '编辑人员' : '新增人员'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          message.success(editingPerson ? '编辑成功' : '新增成功');
          setIsModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" required>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="工号" required>
                <Input placeholder="请输入工号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="性别" required>
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门" required>
                <Select placeholder="请选择部门">
                  {departmentOptions.filter(opt => opt.value !== 'all').map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="班次" required>
                <Select placeholder="请选择班次">
                  {shiftOptions.filter(opt => opt.value !== 'all').map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="宿舍楼" required>
                <Select placeholder="请选择宿舍楼">
                  {buildingOptions.filter(opt => opt.value !== 'all').map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="联系电话" required>
            <Input placeholder="请输入联系电话" />
              </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonPage; 