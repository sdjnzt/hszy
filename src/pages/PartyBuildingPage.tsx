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
  Rate,
  Alert,
  Calendar,
  theme
} from 'antd';
import {
  FlagOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  TeamOutlined,
  BookOutlined,
  TrophyOutlined,
  StarOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  FireOutlined,
  CrownOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { Option } = Select;
const { TabPane } = Tabs;

interface PartyMember {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  joinDate: string;
  branch: string;
  position: string;
  status: 'active' | 'inactive' | 'transferred';
  education: string;
  address: string;
  birthDate: string;
  gender: 'male' | 'female';
  occupation: string;
  partyAge: number;
  contribution: number;
  lastActivity: string;
  avatar?: string;
}

interface PartyActivity {
  id: string;
  title: string;
  type: 'study' | 'volunteer' | 'meeting' | 'training' | 'other';
  date: string;
  location: string;
  organizer: string;
  participants: number;
  maxParticipants: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  materials: string[];
  feedback: number;
  images: string[];
}

interface StudyMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'audio' | 'presentation';
  category: string;
  uploadDate: string;
  author: string;
  fileSize: string;
  downloads: number;
  rating: number;
  description: string;
  tags: string[];
}

const PartyBuildingPage: React.FC = () => {
  const { token } = useToken();
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [activities, setActivities] = useState<PartyActivity[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [selectedMember, setSelectedMember] = useState<PartyMember | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingMember, setEditingMember] = useState<PartyMember | null>(null);
  const [activeTab, setActiveTab] = useState('members');
  const [form] = Form.useForm();

  useEffect(() => {
    // 丰富的党员数据 - 使用真实中文姓名
    const generateMembers = () => {
      const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕'];
      const maleNames = ['建国', '建华', '志强', '志明', '海龙', '海峰', '文华', '文军', '明辉', '明强', '德华', '德胜', '国栋', '国强', '永强', '永康', '世杰', '世华', '家豪', '家辉', '俊杰', '俊华', '晓东', '晓明', '春华', '春林', '正华', '正强', '庆华', '庆林', '立新', '立华', '成龙', '成华', '伟强', '伟华', '振华', '振国', '兴华', '兴国'];
      const femaleNames = ['秀英', '秀华', '丽华', '丽娜', '春梅', '春花', '雪梅', '雪莲', '淑华', '淑英', '美华', '美玲', '桂英', '桂华', '玉兰', '玉梅', '凤英', '凤华', '红梅', '红英', '翠花', '翠英', '金花', '金英', '银花', '银英', '彩霞', '彩云', '晓燕', '晓红', '小芳', '小红', '志红', '志英', '慧敏', '慧娟', '静雯', '静怡', '婷婷', '娟娟'];
      const branches = ['第一党支部', '第二党支部', '第三党支部', '物业党支部', '业委会党支部'];
      const positions = ['支部书记', '副书记', '组织委员', '宣传委员', '纪检委员', '青年委员', '党员', '入党积极分子'];
      const educations = ['博士', '研究生', '本科', '大专', '高中', '中专'];
      const occupations = ['社区工作者', '教师', '医生', '工程师', '会计', '律师', '护士', '警察', '公务员', '企业管理', '退休人员', '个体经营', '技术员', '销售员', '服务员'];
      const areas = ['金宇路', '建设路', '太白路', '洸河路', '红星路', '济安桥路', '共青团路', '琵琶山路', '古槐路', '车站西路', '任城大道', '火炬路', '车站南路', '开元路', '观音阁街', '南池路', '龙行路', '吴泰闸路'];

      const members: PartyMember[] = [];
      for (let i = 1; i <= 68; i++) {
        const gender = Math.random() > 0.6 ? 'male' : 'female';
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        const givenNames = gender === 'male' ? maleNames : femaleNames;
        const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
        const name = surname + givenName;
        
        const birthYear = 1955 + Math.floor(Math.random() * 40);
        const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;
        
        const joinYear = Math.max(birthYear + 18, 2008 + Math.floor(Math.random() * 16));
        const joinMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const joinDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const joinDate = `${joinYear}-${joinMonth}-${joinDay}`;
        
        const branch = branches[Math.floor(Math.random() * branches.length)];
        const isLeader = Math.random() > 0.85;
        const position = isLeader ? 
          positions[Math.floor(Math.random() * 6)] : 
          positions[6 + Math.floor(Math.random() * 2)];
        
        const area = areas[Math.floor(Math.random() * areas.length)];
        const houseNum = Math.floor(Math.random() * 300) + 1;
        const partyAge = 2024 - joinYear;
        
        members.push({
          id: String(i),
          name,
          idCard: `3708${birthYear}${birthMonth}${birthDay}${String(Math.floor(Math.random() * 9000) + 1000)}`,
          phone: `1${3 + Math.floor(Math.random() * 7)}${String(Math.floor(Math.random() * 100000000)).padStart(9, '0')}`,
          joinDate,
          branch,
          position,
          status: (Math.random() > 0.03 ? 'active' : 'inactive') as 'active' | 'inactive' | 'transferred',
          education: educations[Math.floor(Math.random() * educations.length)],
          address: `济宁市任城区${area}${houseNum}号`,
          birthDate,
          gender: gender as 'male' | 'female',
          occupation: occupations[Math.floor(Math.random() * occupations.length)],
          partyAge: Math.max(partyAge, 0),
          contribution: Math.floor(Math.random() * 25) + 75,
          lastActivity: `2025-08-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`
        });
      }
      return members;
    };

    setMembers(generateMembers());

    // 模拟党建活动数据
    // 丰富的党建活动数据
    const generateActivities = () => {
      const studyTopics = [
        '学习贯彻党的二十大精神专题研讨', '习近平新时代中国特色社会主义思想学习',
        '党史学习教育专题讲座', '《论党的自我革命》专题学习', '新时代党的建设总要求学习讨论',
        '社会主义核心价值观专题教育', '党章党规党纪学习教育', '红色经典读书分享会'
      ];
      
      const volunteerActivities = [
        '社区环境整治志愿服务', '关爱空巢老人志愿活动', '文明城市创建宣传活动',
        '疫情防控志愿服务', '交通文明劝导活动', '爱心义诊健康服务',
        '法律援助便民服务', '青少年课业辅导志愿服务'
      ];
      
      const meetings = [
        '党员民主评议会', '支部组织生活会', '党员发展大会',
        '党费收缴专题会议', '党建工作部署会', '党风廉政建设专题会'
      ];
      
      const allActivities = [...studyTopics, ...volunteerActivities, ...meetings];
      const activityTypes: ('study' | 'volunteer' | 'meeting' | 'training' | 'other')[] = ['study', 'volunteer', 'meeting', 'training', 'other'];
      const locations = ['社区会议室', '党员活动室', '社区广场', '文化活动中心', '多功能厅'];
      const organizers = ['陈建华', '张志强', '李秀英', '王德华', '刘明辉', '杨春花', '赵国栋'];
      
      const activities: PartyActivity[] = [];
      for (let i = 1; i <= 24; i++) {
        const dayOffset = Math.floor(Math.random() * 60) - 30;
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        
        const maxParticipants = 15 + Math.floor(Math.random() * 25);
        const participants = Math.floor(Math.random() * maxParticipants);
        const status = (dayOffset < 0 ? 'completed' : dayOffset < 3 ? 'ongoing' : 'planned') as 'planned' | 'ongoing' | 'completed' | 'cancelled';
        
        activities.push({
          id: String(i),
          title: allActivities[Math.floor(Math.random() * allActivities.length)],
          type: activityTypes[Math.floor(Math.random() * activityTypes.length)] as 'study' | 'volunteer' | 'meeting' | 'training' | 'other',
          date: dateStr,
          location: locations[Math.floor(Math.random() * locations.length)],
          organizer: organizers[Math.floor(Math.random() * organizers.length)],
          participants,
          maxParticipants,
          status,
          description: '提升党员素质，加强组织建设，服务社区群众。',
          materials: ['活动方案.pdf', '学习材料.docx'],
          feedback: status === 'completed' ? Number((Math.random() * 1 + 4).toFixed(1)) : 0,
          images: status === 'completed' ? [`activity_${i}.jpg`] : []
        });
      }
      
      return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    setActivities(generateActivities());

    // 丰富的学习资料数据
    const generateStudyMaterials = () => {
      const documents = [
        { title: '党的二十大报告全文', category: '重要文件', author: '中央办公厅', size: '2.5MB' },
        { title: '习近平新时代中国特色社会主义思想学习纲要', category: '理论学习', author: '中宣部', size: '3.2MB' },
        { title: '中国共产党章程', category: '党章党规', author: '中央组织部', size: '1.2MB' },
        { title: '中国共产党纪律处分条例', category: '党章党规', author: '中央纪委', size: '1.8MB' },
        { title: '基层党建工作指导手册', category: '工作指导', author: '组织部', size: '2.1MB' },
        { title: '党员发展工作细则', category: '工作指导', author: '组织部', size: '1.5MB' },
        { title: '党支部工作条例', category: '制度规范', author: '中央办公厅', size: '1.3MB' },
        { title: '党员教育管理工作条例', category: '制度规范', author: '中央组织部', size: '1.6MB' },
        { title: '关于加强和改进新时代党建工作的意见', category: '政策文件', author: '中央组织部', size: '0.8MB' },
        { title: '社区党建工作实务指南', category: '实务指南', author: '民政部', size: '2.3MB' },
        { title: '党史学习教育读本', category: '党史教育', author: '党史研究室', size: '4.1MB' },
        { title: '红色故事集锦', category: '党史教育', author: '宣传部', size: '3.5MB' },
        { title: '新时代党员行为规范', category: '行为准则', author: '中央组织部', size: '0.9MB' },
        { title: '党风廉政建设学习资料', category: '廉政教育', author: '中央纪委', size: '2.8MB' },
        { title: '志愿服务活动指导手册', category: '实务指南', author: '文明办', size: '1.7MB' }
      ];
      
      const videos = [
        { title: '党的二十大精神解读', category: '视频课程', author: '中央党校', size: '256MB' },
        { title: '基层党建工作实务', category: '视频课程', author: '组织部', size: '189MB' },
        { title: '党员发展程序演示', category: '操作指南', author: '培训中心', size: '134MB' },
        { title: '红色教育纪录片', category: '红色影视', author: '央视', size: '445MB' },
        { title: '优秀党员事迹报告', category: '先进典型', author: '宣传部', size: '167MB' }
      ];
      
      const materials: StudyMaterial[] = [];
      
      documents.forEach((doc, index) => {
        materials.push({
          id: String(index + 1),
          title: doc.title,
          type: 'document' as const,
          category: doc.category,
          uploadDate: `2025-08-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`,
          author: doc.author,
          fileSize: doc.size,
          downloads: Math.floor(Math.random() * 200) + 50,
          rating: Number((Math.random() * 1 + 4).toFixed(1)),
          description: `${doc.title}，用于党员学习和组织建设。`,
          tags: doc.title.slice(0, 6).split('').slice(0, 3)
        });
      });
      
      videos.forEach((video, index) => {
        materials.push({
          id: String(documents.length + index + 1),
          title: video.title,
          type: 'video' as const,
          category: video.category,
          uploadDate: `2025-08-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`,
          author: video.author,
          fileSize: video.size,
          downloads: Math.floor(Math.random() * 150) + 30,
          rating: Number((Math.random() * 1 + 4).toFixed(1)),
          description: `${video.title}，视频教学资料。`,
          tags: video.title.slice(0, 6).split('').slice(0, 3)
        });
      });
      
      return materials.sort((a, b) => b.downloads - a.downloads);
    };

    setStudyMaterials(generateStudyMaterials());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return token.colorSuccess;
      case 'inactive': return token.colorWarning;
      case 'transferred': return token.colorTextSecondary;
      default: return token.colorTextSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '正常';
      case 'inactive': return '停止';
      case 'transferred': return '转出';
      default: return status;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'study': return token.colorPrimary;
      case 'volunteer': return token.colorSuccess;
      case 'meeting': return token.colorWarning;
      case 'training': return token.colorInfo;
      default: return token.colorTextSecondary;
    }
  };

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'study': return '学习活动';
      case 'volunteer': return '志愿服务';
      case 'meeting': return '组织会议';
      case 'training': return '培训活动';
      default: return '其他活动';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = searchText === '' || 
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.phone.includes(searchText) ||
      member.idCard.includes(searchText);
    const matchesBranch = selectedBranch === 'all' || member.branch === selectedBranch;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleAddMember = () => {
    setEditingMember(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditMember = (member: PartyMember) => {
    setEditingMember(member);
    form.setFieldsValue({
      ...member,
      joinDate: dayjs(member.joinDate),
      birthDate: dayjs(member.birthDate)
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (member: PartyMember) => {
    setSelectedMember(member);
    setIsDrawerVisible(true);
  };

  const handleDeleteMember = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个党员吗？删除后将无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        setMembers(members.filter(member => member.id !== id));
        message.success('删除成功');
      }
    });
  };

  // 统计数据
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const averageContribution = members.reduce((sum, m) => sum + m.contribution, 0) / members.length;
  const totalActivities = activities.length;

  // 图表配置
  const branchChartOption = {
    title: { text: '党支部分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '党员数量',
      type: 'pie',
      radius: '50%',
      data: Object.entries(
        members.reduce((acc, member) => {
          acc[member.branch] = (acc[member.branch] || 0) + 1;
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

  const contributionChartOption = {
    title: { text: '党员贡献度统计', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: members.map(m => m.name.length > 3 ? m.name.substring(0, 3) + '...' : m.name)
    },
    yAxis: { type: 'value', max: 100 },
    series: [{
      name: '贡献度',
      type: 'bar',
      data: members.map(m => m.contribution),
      itemStyle: { color: token.colorPrimary }
    }]
  };

  const columns = [
    {
      title: '党员信息',
      key: 'member',
      render: (record: PartyMember) => (
        <Space>
          <Avatar size={48} style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {record.occupation} | 党龄{record.partyAge}年
            </div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              手机: {record.phone}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '党支部',
      dataIndex: 'branch',
      key: 'branch',
      render: (branch: string) => (
        <Tag color="blue" icon={<TeamOutlined />}>
          {branch}
        </Tag>
      ),
      filters: [
        { text: '第一党支部', value: '第一党支部' },
        { text: '第二党支部', value: '第二党支部' },
        { text: '第三党支部', value: '第三党支部' }
      ],
      onFilter: (value: any, record: PartyMember) => record.branch === value
    },
    {
      title: '职务',
      dataIndex: 'position',
      key: 'position',
      render: (position: string) => (
        <Tag color={position.includes('书记') ? 'red' : position.includes('委员') ? 'orange' : 'default'}>
          {position}
        </Tag>
      )
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
      filters: [
        { text: '正常', value: 'active' },
        { text: '停止', value: 'inactive' },
        { text: '转出', value: 'transferred' }
      ],
      onFilter: (value: any, record: PartyMember) => record.status === value
    },
    {
      title: '贡献度',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (contribution: number) => (
        <div>
          <Progress percent={contribution} size="small" />
          <div style={{ fontSize: '12px', textAlign: 'center' }}>{contribution}分</div>
        </div>
      ),
      sorter: (a: PartyMember, b: PartyMember) => a.contribution - b.contribution
    },
    {
      title: '最后活动',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (date: string) => (
        <div style={{ fontSize: '12px' }}>
          <ClockCircleOutlined style={{ marginRight: '4px' }} />
          {date}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PartyMember) => (
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
            onClick={() => handleEditMember(record)}
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteMember(record.id)}
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
          background: 'linear-gradient(135deg, #ff4757 0%, #c44569 100%)',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <FlagOutlined style={{ marginRight: '12px' }} />
              党建管理系统
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
              加强基层党组织建设，提升党员管理水平，推进党建工作信息化
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddMember}>
                新增党员
              </Button>
              <Button type="primary" ghost icon={<CalendarOutlined />}>
                活动安排
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
              title="党员总数"
              value={totalMembers}
              suffix="人"
              valueStyle={{ color: token.colorPrimary }}
              prefix={<TeamOutlined />}
            />
            <Progress percent={Math.round((activeMembers / totalMembers) * 100)} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="在册党员"
              value={activeMembers}
              suffix={`/ ${totalMembers}`}
              valueStyle={{ color: token.colorSuccess }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress 
              percent={Math.round((activeMembers / totalMembers) * 100)} 
              size="small" 
              status="active" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="平均贡献度"
              value={averageContribution.toFixed(1)}
              suffix="/100"
              valueStyle={{ color: token.colorWarning }}
              prefix={<StarOutlined />}
            />
            <Progress percent={averageContribution} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="本月活动"
              value={totalActivities}
              suffix="场"
              valueStyle={{ color: token.colorError }}
              prefix={<FireOutlined />}
            />
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px' }}>
              已完成: {activities.filter(a => a.status === 'completed').length}场
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span><TeamOutlined />党员管理</span>} key="members">
            {/* 搜索和筛选 */}
            <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="1">
                  <Input
                    placeholder="搜索党员姓名、手机号、身份证号..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="党支部"
                    value={selectedBranch}
                    onChange={setSelectedBranch}
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="all">全部支部</Option>
                    <Option value="第一党支部">第一党支部</Option>
                    <Option value="第二党支部">第二党支部</Option>
                    <Option value="第三党支部">第三党支部</Option>
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
                    <Option value="active">正常</Option>
                    <Option value="inactive">停止</Option>
                    <Option value="transferred">转出</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            {/* 党员列表 */}
            <Table
              columns={columns}
              dataSource={filteredMembers}
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

          <TabPane tab={<span><CalendarOutlined />党建活动</span>} key="activities">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <List
                  dataSource={activities}
                  renderItem={(activity) => (
                    <List.Item>
                      <Card style={{ width: '100%' }}>
                        <Row align="middle">
                          <Col flex="1">
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                              {activity.title}
                            </div>
                            <Space wrap>
                              <Tag color={getActivityTypeColor(activity.type)}>
                                {getActivityTypeText(activity.type)}
                              </Tag>
                              <Tag color={activity.status === 'completed' ? 'success' : 
                                         activity.status === 'ongoing' ? 'processing' : 
                                         activity.status === 'planned' ? 'warning' : 'default'}>
                                {activity.status === 'completed' ? '已完成' : 
                                 activity.status === 'ongoing' ? '进行中' : 
                                 activity.status === 'planned' ? '计划中' : '已取消'}
                              </Tag>
                              <span><CalendarOutlined /> {activity.date}</span>
                              <span><TeamOutlined /> {activity.participants}/{activity.maxParticipants}人</span>
                            </Space>
                            <div style={{ marginTop: '8px', color: token.colorTextSecondary }}>
                              {activity.description}
                            </div>
                          </Col>
                          <Col>
                            <Space direction="vertical" align="center">
                              {activity.feedback && (
                                <Rate disabled defaultValue={activity.feedback} style={{ fontSize: '12px' }} />
                              )}
                              <Button type="primary" size="small">
                                查看详情
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </Col>
              <Col xs={24} lg={8}>
                <Card title="活动日历" style={{ marginBottom: '16px' }}>
                  <Calendar 
                    fullscreen={false}
                    dateCellRender={(value) => {
                      const dateStr = value.format('YYYY-MM-DD');
                      const activitiesOnDate = activities.filter(
                        activity => activity.date === dateStr
                      );
                      return (
                        <div>
                          {activitiesOnDate.map(activity => (
                            <div key={activity.id} style={{ fontSize: '10px', color: token.colorPrimary }}>
                              {activity.title.substring(0, 8)}...
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                </Card>
                <Card title="活动统计">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Statistic title="本月活动" value={totalActivities} suffix="场" />
                    <Statistic title="参与人次" value={activities.reduce((sum, a) => sum + a.participants, 0)} />
                    <Statistic title="平均评分" value={4.8} suffix="/5.0" />
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><BookOutlined />学习资料</span>} key="materials">
            <Row gutter={[24, 24]}>
              {studyMaterials.map((material) => (
                <Col xs={24} sm={12} lg={8} key={material.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button type="link" icon={<EyeOutlined />}>预览</Button>,
                      <Button type="link" icon={<FileTextOutlined />}>下载</Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: token.colorPrimary }} />}
                      title={material.title}
                      description={
                        <div>
                          <Tag color="blue">{material.category}</Tag>
                          <div style={{ marginTop: '8px', fontSize: '12px', color: token.colorTextSecondary }}>
                            {material.description}
                          </div>
                          <div style={{ marginTop: '8px' }}>
                            <Space>
                              <span>{material.fileSize}</span>
                              <span>{material.downloads} 下载</span>
                              <Rate disabled defaultValue={material.rating} style={{ fontSize: '12px' }} />
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><TrophyOutlined />数据分析</span>} key="analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="党支部分布" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={branchChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="党员贡献度" style={{ borderRadius: '12px' }}>
                  <ReactECharts option={contributionChartOption} style={{ height: '300px' }} />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 党员详情抽屉 */}
      <Drawer
        title="党员详细信息"
        placement="right"
        width={600}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedMember && (
          <div>
            <Card size="small" style={{ marginBottom: '16px', textAlign: 'center' }}>
              <Avatar size={80} style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
              <div style={{ marginTop: '12px' }}>
                <Text strong style={{ fontSize: '18px' }}>{selectedMember.name}</Text>
              </div>
              <Tag color="red" style={{ marginTop: '8px' }}>
                {selectedMember.position}
              </Tag>
            </Card>
            
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="身份证号">{selectedMember.idCard}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedMember.phone}</Descriptions.Item>
              <Descriptions.Item label="入党时间">{selectedMember.joinDate}</Descriptions.Item>
              <Descriptions.Item label="党龄">{selectedMember.partyAge}年</Descriptions.Item>
              <Descriptions.Item label="所属支部">{selectedMember.branch}</Descriptions.Item>
              <Descriptions.Item label="学历">{selectedMember.education}</Descriptions.Item>
              <Descriptions.Item label="职业">{selectedMember.occupation}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(selectedMember.status)}>
                  {getStatusText(selectedMember.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="贡献度" span={2}>
                <Progress percent={selectedMember.contribution} />
              </Descriptions.Item>
              <Descriptions.Item label="居住地址" span={2}>
                {selectedMember.address}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      {/* 新增/编辑党员模态框 */}
      <Modal
        title={editingMember ? '编辑党员信息' : '新增党员'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            const formattedValues = {
              ...values,
              joinDate: values.joinDate.format('YYYY-MM-DD'),
              birthDate: values.birthDate.format('YYYY-MM-DD'),
              id: editingMember?.id || Date.now().toString(),
              partyAge: dayjs().diff(values.joinDate, 'year'),
              contribution: editingMember?.contribution || 0,
              lastActivity: editingMember?.lastActivity || dayjs().format('YYYY-MM-DD')
            };

            if (editingMember) {
              setMembers(members.map(member => 
                member.id === editingMember.id ? { ...member, ...formattedValues } : member
              ));
              message.success('更新成功');
            } else {
              setMembers([...members, formattedValues as PartyMember]);
              message.success('添加成功');
            }
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingMember(null);
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
                <Select placeholder="请选择性别">
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
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
              <Form.Item label="入党时间" name="joinDate" rules={[{ required: true, message: '请选择入党时间' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="所属支部" name="branch" rules={[{ required: true, message: '请选择所属支部' }]}>
                <Select placeholder="请选择所属支部">
                  <Option value="第一党支部">第一党支部</Option>
                  <Option value="第二党支部">第二党支部</Option>
                  <Option value="第三党支部">第三党支部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职务" name="position" rules={[{ required: true, message: '请输入职务' }]}>
                <Input placeholder="请输入职务" />
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
          
          <Form.Item label="居住地址" name="address" rules={[{ required: true, message: '请输入居住地址' }]}>
            <Input placeholder="请输入详细地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PartyBuildingPage;
