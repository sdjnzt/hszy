import React, { useState, useEffect } from 'react';
import { generateLargeCommunityData } from '../data/largeCommunityData';
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
  Upload,
  Radio,
  InputNumber,
  theme
} from 'antd';
import {
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  UserOutlined,
  WomanOutlined,
  ManOutlined,
  HomeOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  BookOutlined,
  CrownOutlined,
  SafetyOutlined,
  CarOutlined,
  BankOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;

// 手机号脱敏处理函数
const maskPhoneNumber = (phone: string, showMasked: boolean = true): string => {
  if (!phone || phone.length < 7) return phone;
  return showMasked ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : phone;
};

// 身份证号脱敏处理函数
const maskIdCard = (idCard: string, showMasked: boolean = true): string => {
  if (!idCard || idCard.length < 10) return idCard;
  return showMasked ? idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2') : idCard;
};

export interface Resident {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  gender: 'male' | 'female';
  birthDate: string;
  age: number;
  nationality: string;
  education: string;
  occupation: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  address: string;
  building: string;
  unit: string;
  room: string;
  residenceType: 'owner' | 'tenant' | 'relative' | 'other';
  moveInDate: string;
  householdRole: 'head' | 'spouse' | 'child' | 'parent' | 'other';
  politicalStatus: string;
  healthStatus: 'healthy' | 'chronic' | 'disabled' | 'other';
  emergencyContact: string;
  emergencyPhone: string;
  registrationStatus: 'registered' | 'temporary' | 'unregistered';
  photoUrl?: string;
  tags: string[];
  notes?: string;
}

export interface Household {
  id: string;
  address: string;
  building: string;
  unit: string;
  room: string;
  householdHead: string;
  memberCount: number;
  members: string[];
  registrationDate: string;
  householdType: 'family' | 'single' | 'group' | 'other';
  area: number;
  propertyType: 'owned' | 'rented' | 'public' | 'other';
  status: 'active' | 'moved' | 'demolished';
}

export interface PopulationStatistics {
  totalPopulation: number;
  maleCount: number;
  femaleCount: number;
  ageGroups: Record<string, number>;
  educationLevels: Record<string, number>;
  occupationTypes: Record<string, number>;
  registrationTypes: Record<string, number>;
}

const PopulationManagementPage: React.FC = () => {
  const { token } = useToken();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [statistics, setStatistics] = useState<PopulationStatistics | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [activeTab, setActiveTab] = useState('residents');
  const [householdPage, setHouseholdPage] = useState(1);
  const [householdPageSize, setHouseholdPageSize] = useState(12);
  const [showMaskedData, setShowMaskedData] = useState(true); // 是否显示脱敏数据
  const [form] = Form.useForm();

  useEffect(() => {
    // 生成大型社区人口数据
    const { residents: mockResidents, households: mockHouseholds, buildings: availableBuildings } = generateLargeCommunityData();


    setResidents(mockResidents);
    setHouseholds(mockHouseholds);


    // 计算统计数据
    const stats: PopulationStatistics = {
      totalPopulation: mockResidents.length,
      maleCount: mockResidents.filter(r => r.gender === 'male').length,
      femaleCount: mockResidents.filter(r => r.gender === 'female').length,
      ageGroups: {
        '0-18': mockResidents.filter(r => r.age < 18).length,
        '18-35': mockResidents.filter(r => r.age >= 18 && r.age < 35).length,
        '35-60': mockResidents.filter(r => r.age >= 35 && r.age < 60).length,
        '60+': mockResidents.filter(r => r.age >= 60).length,
      },
      educationLevels: mockResidents.reduce((acc, r) => {
        acc[r.education] = (acc[r.education] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      occupationTypes: mockResidents.reduce((acc, r) => {
        acc[r.occupation] = (acc[r.occupation] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      registrationTypes: mockResidents.reduce((acc, r) => {
        acc[r.registrationStatus] = (acc[r.registrationStatus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    setStatistics(stats);
  }, []);

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? <ManOutlined /> : <WomanOutlined />;
  };

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? token.colorPrimary : token.colorError;
  };

  const getRegistrationColor = (status: string) => {
    switch (status) {
      case 'registered': return token.colorSuccess;
      case 'temporary': return token.colorWarning;
      case 'unregistered': return token.colorError;
      default: return token.colorTextSecondary;
    }
  };

  const getRegistrationText = (status: string) => {
    switch (status) {
      case 'registered': return '已登记';
      case 'temporary': return '暂住';
      case 'unregistered': return '未登记';
      default: return status;
    }
  };

  const getResidenceTypeColor = (type: string) => {
    switch (type) {
      case 'owner': return token.colorSuccess;
      case 'tenant': return token.colorWarning;
      case 'relative': return token.colorInfo;
      default: return token.colorTextSecondary;
    }
  };

  const getResidenceTypeText = (type: string) => {
    switch (type) {
      case 'owner': return '业主';
      case 'tenant': return '租户';
      case 'relative': return '亲属';
      default: return '其他';
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = searchText === '' || 
      resident.name.toLowerCase().includes(searchText.toLowerCase()) ||
      resident.phone.includes(searchText) ||
      resident.idCard.includes(searchText) ||
      resident.address.toLowerCase().includes(searchText.toLowerCase());
    const matchesBuilding = selectedBuilding === 'all' || resident.building === selectedBuilding;
    const matchesStatus = selectedStatus === 'all' || resident.registrationStatus === selectedStatus;
    const matchesGender = selectedGender === 'all' || resident.gender === selectedGender;
    
    return matchesSearch && matchesBuilding && matchesStatus && matchesGender;
  });

  // 计算户籍数据分页
  const startIndex = (householdPage - 1) * householdPageSize;
  const endIndex = startIndex + householdPageSize;
  const paginatedHouseholds = households.slice(startIndex, endIndex);

  const handleAddResident = () => {
    setEditingResident(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditResident = (resident: Resident) => {
    setEditingResident(resident);
    form.setFieldsValue({
      ...resident,
      birthDate: dayjs(resident.birthDate),
      moveInDate: dayjs(resident.moveInDate)
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIsDrawerVisible(true);
  };

  const handleDeleteResident = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个居民信息吗？删除后将无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        setResidents(residents.filter(resident => resident.id !== id));
        message.success('删除成功');
      }
    });
  };

  // 图表配置
  const ageGroupChartOption = {
    title: { text: '年龄结构分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '人数',
      type: 'pie',
      radius: '50%',
      data: statistics ? Object.entries(statistics.ageGroups).map(([name, value]) => ({ name, value })) : [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const educationChartOption = {
    title: { text: '教育程度统计', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: statistics ? Object.keys(statistics.educationLevels) : []
    },
    yAxis: { type: 'value' },
    series: [{
      name: '人数',
      type: 'bar',
      data: statistics ? Object.values(statistics.educationLevels) : [],
      itemStyle: { color: token.colorPrimary }
    }]
  };

  const columns = [
    {
      title: '基本信息',
      key: 'basic',
      render: (record: Resident) => (
        <Space>
          <Avatar
            size={48}
            style={{
              backgroundColor: getGenderColor(record.gender),
              color: 'white'
            }}
            icon={getGenderIcon(record.gender)}
          />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {record.name}
              <Space style={{ marginLeft: '8px' }}>
                {record.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {record.age}岁 | {record.nationality} | {record.occupation}
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              <PhoneOutlined /> {maskPhoneNumber(record.phone, showMaskedData)}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '居住信息',
      key: 'residence',
      render: (record: Resident) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            <HomeOutlined /> {record.building} {record.unit} {record.room}
          </div>
          <Tag color={getResidenceTypeColor(record.residenceType)}>
            {getResidenceTypeText(record.residenceType)}
          </Tag>
          <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '4px' }}>
            入住时间: {record.moveInDate}
          </div>
        </div>
      )
    },
    {
      title: '登记状态',
      dataIndex: 'registrationStatus',
      key: 'registrationStatus',
      render: (status: string, record: Resident) => (
        <Space direction="vertical" size="small">
          <Tag color={getRegistrationColor(status)}>
            {getRegistrationText(status)}
          </Tag>
          <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
            户籍角色: {record.householdRole === 'head' ? '户主' : 
                    record.householdRole === 'spouse' ? '配偶' : 
                    record.householdRole === 'child' ? '子女' : '其他'}
          </div>
        </Space>
      ),
      filters: [
        { text: '已登记', value: 'registered' },
        { text: '暂住', value: 'temporary' },
        { text: '未登记', value: 'unregistered' }
      ],
      onFilter: (value: any, record: Resident) => record.registrationStatus === value
    },
    {
      title: '证件信息',
      key: 'documents',
      render: (record: Resident) => (
        <div style={{ fontSize: '12px' }}>
          <div><IdcardOutlined /> {maskIdCard(record.idCard, showMaskedData)}</div>
          <div style={{ marginTop: '4px', color: token.colorTextSecondary }}>
            出生日期: {record.birthDate}
          </div>
          <div style={{ color: token.colorTextSecondary }}>
            婚姻状况: {record.maritalStatus === 'married' ? '已婚' : 
                     record.maritalStatus === 'single' ? '未婚' : 
                     record.maritalStatus === 'divorced' ? '离异' : '丧偶'}
          </div>
        </div>
      )
    },
    {
      title: '健康状况',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status: string) => (
        <Tag color={status === 'healthy' ? 'success' : 
                   status === 'chronic' ? 'warning' : 
                   status === 'disabled' ? 'error' : 'default'}>
          {status === 'healthy' ? '健康' : 
           status === 'chronic' ? '慢性病' : 
           status === 'disabled' ? '残疾' : '其他'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Resident) => (
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
            onClick={() => handleEditResident(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteResident(record.id)}
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
              <TeamOutlined style={{ marginRight: '12px' }} />
              人口管理系统
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              全面掌握社区人口信息，实现精准化服务管理
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<UploadOutlined />}>
                批量导入
              </Button>
              <Button type="primary" ghost icon={<DownloadOutlined />}>
                导出数据
              </Button>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddResident}>
                新增居民
              </Button>
            </Space>
          </Col>
        </Row>
        <Row style={{ marginTop: '16px' }}>
          <Col>
            <Space>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                <SafetyOutlined style={{ marginRight: '6px' }} />
                数据脱敏：
              </span>
              <Button 
                size="small" 
                type={showMaskedData ? 'primary' : 'default'}
                onClick={() => setShowMaskedData(!showMaskedData)}
              >
                {showMaskedData ? '已开启' : '已关闭'}
              </Button>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                {showMaskedData ? '敏感信息已脱敏显示' : '显示完整信息'}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="总人口"
              value={2847|| 0}
              suffix="人"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<TeamOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              户籍人口: {residents.filter(r => r.registrationStatus === 'registered').length}人
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="男性人口"
              value={1530 || 0}
              suffix="人"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<ManOutlined />}
            />
            <Progress 
              percent={statistics ? Math.round((statistics.maleCount / statistics.totalPopulation) * 100) : 0} 
              size="small" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="女性人口"
              value={1317 || 0}
              suffix="人"
              valueStyle={{ color: token.colorError }}
              prefix={<WomanOutlined />}
            />
            <Progress 
              percent={statistics ? Math.round((statistics.femaleCount / statistics.totalPopulation) * 100) : 0} 
              size="small" 
              strokeColor={token.colorError}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="户籍总数"
              value={950}
              suffix="户"
              valueStyle={{ color: token.colorSuccess }}
              prefix={<HomeOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              平均户规模: {statistics ? (statistics.totalPopulation / households.length).toFixed(1) : 0}人/户
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><UserOutlined />居民信息</span>} key="residents">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索姓名、电话、身份证号、地址..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="楼栋"
                    value={selectedBuilding}
                    onChange={setSelectedBuilding}
                    style={{ width: 100 }}
                    allowClear
                  >
                    <Option value="all">全部楼栋</Option>
                    <Option value="1号楼">1号楼</Option>
                    <Option value="2号楼">2号楼</Option>
                    <Option value="3号楼">3号楼</Option>
                    <Option value="4号楼">4号楼</Option>
                    <Option value="5号楼">5号楼</Option>
                    <Option value="6号楼">6号楼</Option>
                    <Option value="7号楼">7号楼</Option>
                    <Option value="8号楼">8号楼</Option>
                    <Option value="9号楼">9号楼</Option>
                    <Option value="10号楼">10号楼</Option>
                    <Option value="11号楼">11号楼</Option>
                    <Option value="12号楼">12号楼</Option>
                    <Option value="13号楼">13号楼</Option>
                    <Option value="14号楼">14号楼</Option>
                    <Option value="15号楼">15号楼</Option>
                    <Option value="16号楼">16号楼</Option>
                    <Option value="17号楼">17号楼</Option>
                    <Option value="18号楼">18号楼</Option>
                    <Option value="19号楼">19号楼</Option>
                    <Option value="20号楼">20号楼</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="性别"
                    value={selectedGender}
                    onChange={setSelectedGender}
                    style={{ width: 80 }}
                    allowClear
                  >
                    <Option value="all">全部</Option>
                    <Option value="male">男</Option>
                    <Option value="female">女</Option>
                  </Select>
                </Col>
                <Col>
                  <Select
                    placeholder="登记状态"
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    style={{ width: 100 }}
                    allowClear
                  >
                    <Option value="all">全部状态</Option>
                    <Option value="registered">已登记</Option>
                    <Option value="temporary">暂住</Option>
                    <Option value="unregistered">未登记</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            {/* 居民列表 */}
            <Table
              columns={columns}
              dataSource={filteredResidents}
              rowKey="id"
              pagination={{
                total: filteredResidents.length,
                defaultPageSize: 20,
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                pageSizeOptions: ['10', '20', '50', '100'],
                size: 'default'
              }}
              scroll={{ x: 1400 }}
            />
          </TabPane>

          <TabPane tab={<span><HomeOutlined />户籍信息</span>} key="households">
            <Row gutter={[24, 24]}>
              {paginatedHouseholds.map((household) => (
                <Col xs={24} sm={12} lg={8} key={household.id}>
                  <Card
                    hoverable
                    title={
                      <Space>
                        <HomeOutlined />
                        {household.address}
                      </Space>
                    }
                    extra={
                      <Tag color={household.status === 'active' ? 'success' : 'default'}>
                        {household.status === 'active' ? '正常' : '迁出'}
                      </Tag>
                    }
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
                      <Button type="link" icon={<EditOutlined />}>编辑</Button>
                    ]}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="户主">{household.householdHead}</Descriptions.Item>
                      <Descriptions.Item label="户籍人数">{household.memberCount}人</Descriptions.Item>
                      <Descriptions.Item label="户籍类型">
                        {household.householdType === 'family' ? '家庭户' : 
                         household.householdType === 'single' ? '单人户' : 
                         household.householdType === 'group' ? '集体户' : '其他'}
                      </Descriptions.Item>
                      <Descriptions.Item label="房屋面积">{household.area}㎡</Descriptions.Item>
                      <Descriptions.Item label="产权性质">
                        <Tag color={household.propertyType === 'owned' ? 'success' : 
                                   household.propertyType === 'rented' ? 'warning' : 'default'}>
                          {household.propertyType === 'owned' ? '自有' : 
                           household.propertyType === 'rented' ? '租赁' : 
                           household.propertyType === 'public' ? '公房' : '其他'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="登记日期">{household.registrationDate}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {/* 户籍分页 */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  共 {households.length} 户，当前显示第 {(householdPage - 1) * householdPageSize + 1}-{Math.min(householdPage * householdPageSize, households.length)} 户
                </div>
                <Space>
                  <Button 
                    disabled={householdPage === 1}
                    onClick={() => setHouseholdPage(prev => prev - 1)}
                  >
                    上一页
                  </Button>
                  <span>第 {householdPage} 页，共 {Math.ceil(households.length / householdPageSize)} 页</span>
                  <Button 
                    disabled={householdPage >= Math.ceil(households.length / householdPageSize)}
                    onClick={() => setHouseholdPage(prev => prev + 1)}
                  >
                    下一页
                  </Button>
                  <Select
                    value={householdPageSize}
                    onChange={(value) => {
                      setHouseholdPageSize(value);
                      setHouseholdPage(1);
                    }}
                    style={{ width: 100 }}
                  >
                    <Option value={6}>6条/页</Option>
                    <Option value={12}>12条/页</Option>
                    <Option value={24}>24条/页</Option>
                    <Option value={48}>48条/页</Option>
                  </Select>
                </Space>
              </Space>
            </div>
          </TabPane>

          <TabPane tab={<span><BarChartOutlined />数据统计</span>} key="statistics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="年龄结构分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={ageGroupChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="教育程度统计" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={educationChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="人口详细统计" style={{ borderRadius: '12px' }}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Statistic title="平均年龄" value={residents.reduce((sum, r) => sum + r.age, 0) / residents.length || 0} precision={1} suffix="岁" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="登记率" value={Math.round((residents.filter(r => r.registrationStatus === 'registered').length / residents.length) * 100)} suffix="%" />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="户均人口" value={residents.length / households.length} precision={1} suffix="人/户" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 居民详情抽屉 */}
      <Drawer
        title="居民详细信息"
        placement="right"
        width={600}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedResident && (
          <div>
            <Card size="small" style={{ marginBottom: '16px', textAlign: 'center' }}>
              <Avatar size={80} style={{ backgroundColor: getGenderColor(selectedResident.gender) }} icon={getGenderIcon(selectedResident.gender)} />
              <div style={{ marginTop: '12px' }}>
                <Text strong style={{ fontSize: '18px' }}>{selectedResident.name}</Text>
              </div>
              <Space style={{ marginTop: '8px' }}>
                {selectedResident.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </Card>
            
            <Descriptions column={2} bordered size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="身份证号">{maskIdCard(selectedResident.idCard)}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{maskPhoneNumber(selectedResident.phone)}</Descriptions.Item>
              <Descriptions.Item label="性别">{selectedResident.gender === 'male' ? '男' : '女'}</Descriptions.Item>
              <Descriptions.Item label="年龄">{selectedResident.age}岁</Descriptions.Item>
              <Descriptions.Item label="出生日期">{selectedResident.birthDate}</Descriptions.Item>
              <Descriptions.Item label="民族">{selectedResident.nationality}</Descriptions.Item>
              <Descriptions.Item label="学历">{selectedResident.education}</Descriptions.Item>
              <Descriptions.Item label="职业">{selectedResident.occupation}</Descriptions.Item>
              <Descriptions.Item label="婚姻状况">
                {selectedResident.maritalStatus === 'married' ? '已婚' : 
                 selectedResident.maritalStatus === 'single' ? '未婚' : 
                 selectedResident.maritalStatus === 'divorced' ? '离异' : '丧偶'}
              </Descriptions.Item>
              <Descriptions.Item label="政治面貌">{selectedResident.politicalStatus}</Descriptions.Item>
              <Descriptions.Item label="健康状况">
                <Tag color={selectedResident.healthStatus === 'healthy' ? 'success' : 
                           selectedResident.healthStatus === 'chronic' ? 'warning' : 
                           selectedResident.healthStatus === 'disabled' ? 'error' : 'default'}>
                  {selectedResident.healthStatus === 'healthy' ? '健康' : 
                   selectedResident.healthStatus === 'chronic' ? '慢性病' : 
                   selectedResident.healthStatus === 'disabled' ? '残疾' : '其他'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="登记状态">
                <Tag color={getRegistrationColor(selectedResident.registrationStatus)}>
                  {getRegistrationText(selectedResident.registrationStatus)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="居住地址" span={2}>{selectedResident.address}</Descriptions.Item>
              <Descriptions.Item label="居住性质">
                <Tag color={getResidenceTypeColor(selectedResident.residenceType)}>
                  {getResidenceTypeText(selectedResident.residenceType)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="入住时间">{selectedResident.moveInDate}</Descriptions.Item>
              <Descriptions.Item label="户籍角色">
                {selectedResident.householdRole === 'head' ? '户主' : 
                 selectedResident.householdRole === 'spouse' ? '配偶' : 
                 selectedResident.householdRole === 'child' ? '子女' : 
                 selectedResident.householdRole === 'parent' ? '父母' : '其他'}
              </Descriptions.Item>
              <Descriptions.Item label="紧急联系人">{selectedResident.emergencyContact}</Descriptions.Item>
              <Descriptions.Item label="紧急联系电话">{maskPhoneNumber(selectedResident.emergencyPhone)}</Descriptions.Item>
              {selectedResident.notes && (
                <Descriptions.Item label="备注" span={2}>{selectedResident.notes}</Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Drawer>

      {/* 新增/编辑居民模态框 */}
      <Modal
        title={editingResident ? '编辑居民信息' : '新增居民'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            const birthDate = values.birthDate.format('YYYY-MM-DD');
            const age = dayjs().diff(values.birthDate, 'year');
            const formattedValues = {
              ...values,
              birthDate,
              age,
              moveInDate: values.moveInDate.format('YYYY-MM-DD'),
              id: editingResident?.id || Date.now().toString(),
              tags: editingResident?.tags || [],
              address: `${values.building} ${values.unit} ${values.room}`
            };

            if (editingResident) {
              setResidents(residents.map(resident => 
                resident.id === editingResident.id ? { ...resident, ...formattedValues } : resident
              ));
              message.success('更新成功');
            } else {
              setResidents([...residents, formattedValues as Resident]);
              message.success('添加成功');
            }
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingResident(null);
          form.resetFields();
        }}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请选择性别' }]}>
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="身份证号" name="idCard" rules={[{ required: true, message: '请输入身份证号' }]}>
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="出生日期" name="birthDate" rules={[{ required: true, message: '请选择出生日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="民族" name="nationality" rules={[{ required: true, message: '请输入民族' }]}>
                <Input placeholder="请输入民族" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="楼栋" name="building" rules={[{ required: true, message: '请输入楼栋' }]}>
                <Input placeholder="如：1号楼" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="单元" name="unit" rules={[{ required: true, message: '请输入单元' }]}>
                <Input placeholder="如：1单元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="房号" name="room" rules={[{ required: true, message: '请输入房号' }]}>
                <Input placeholder="如：201" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="居住性质" name="residenceType" rules={[{ required: true, message: '请选择居住性质' }]}>
                <Select placeholder="请选择居住性质">
                  <Option value="owner">业主</Option>
                  <Option value="tenant">租户</Option>
                  <Option value="relative">亲属</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="入住时间" name="moveInDate" rules={[{ required: true, message: '请选择入住时间' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="学历" name="education" rules={[{ required: true, message: '请选择学历' }]}>
                <Select placeholder="请选择学历">
                  <Option value="小学">小学</Option>
                  <Option value="初中">初中</Option>
                  <Option value="高中">高中</Option>
                  <Option value="中专">中专</Option>
                  <Option value="大专">大专</Option>
                  <Option value="本科">本科</Option>
                  <Option value="硕士">硕士</Option>
                  <Option value="博士">博士</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职业" name="occupation" rules={[{ required: true, message: '请输入职业' }]}>
                <Input placeholder="请输入职业" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="婚姻状况" name="maritalStatus" rules={[{ required: true, message: '请选择婚姻状况' }]}>
                <Select placeholder="请选择婚姻状况">
                  <Option value="single">未婚</Option>
                  <Option value="married">已婚</Option>
                  <Option value="divorced">离异</Option>
                  <Option value="widowed">丧偶</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="户籍角色" name="householdRole" rules={[{ required: true, message: '请选择户籍角色' }]}>
                <Select placeholder="请选择户籍角色">
                  <Option value="head">户主</Option>
                  <Option value="spouse">配偶</Option>
                  <Option value="child">子女</Option>
                  <Option value="parent">父母</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="政治面貌" name="politicalStatus">
                <Select placeholder="请选择政治面貌">
                  <Option value="群众">群众</Option>
                  <Option value="党员">党员</Option>
                  <Option value="团员">团员</Option>
                  <Option value="民主党派">民主党派</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="健康状况" name="healthStatus">
                <Select placeholder="请选择健康状况">
                  <Option value="healthy">健康</Option>
                  <Option value="chronic">慢性病</Option>
                  <Option value="disabled">残疾</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="紧急联系人" name="emergencyContact">
                <Input placeholder="请输入紧急联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="紧急联系电话" name="emergencyPhone">
                <Input placeholder="请输入紧急联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="备注" name="notes">
            <Input.TextArea rows={3} placeholder="可选备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PopulationManagementPage;
