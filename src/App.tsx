import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, message } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  FlagOutlined,
  HeartOutlined,
  SafetyOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  CalendarOutlined,
  ProjectOutlined,
  BarChartOutlined,
  ApartmentOutlined
} from '@ant-design/icons';

// 导入核心页面组件
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PersonPage from './pages/PersonPage';
import GISMapPage from './pages/GISMapPage';
import FitnessEquipmentPage from './pages/FitnessEquipmentPage';

// 导入智慧社区七大模块页面
import PartyBuildingPage from './pages/PartyBuildingPage';
import PublicServicePage from './pages/PublicServicePage';
import PatrolManagementPage from './pages/PatrolManagementPage';
import PopulationManagementPage from './pages/PopulationManagementPage';
import ComprehensiveGovernancePage from './pages/ComprehensiveGovernancePage';
import EventManagementPage from './pages/EventManagementPage';
import WorkManagementPage from './pages/WorkManagementPage';

// 导入数据分析和网格管理页面
import DataAnalysis from './pages/DataAnalysis';
import GridManagementPage from './pages/GridManagementPage';

// 导入登录页面
import LoginPage from './pages/LoginPage';

const { Header, Sider, Content } = Layout;

// 核心功能菜单项
const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '智慧社区首页' },
  { key: '/dashboard', icon: <AppstoreOutlined />, label: '监控指挥中心' },
  { key: '/gis-map', icon: <EnvironmentOutlined />, label: 'GIS地图平台' },
  { key: '/persons', icon: <UserOutlined />, label: '人员管理' },
  { key: '/fitness-equipment', icon: <TrophyOutlined />, label: '健身器材' },
  { key: '/party-building', icon: <FlagOutlined />, label: '党建管理' },
  { key: '/public-service', icon: <HeartOutlined />, label: '便民服务' },
  { key: '/patrol-management', icon: <SafetyOutlined />, label: '巡查管理' },
  { key: '/population-management', icon: <TeamOutlined />, label: '人口管理' },
  { key: '/comprehensive-governance', icon: <SecurityScanOutlined />, label: '综合治理' },
  { key: '/event-management', icon: <CalendarOutlined />, label: '事件管理' },
  { key: '/work-management', icon: <ProjectOutlined />, label: '工作管理' },
  { key: '/data-analysis', icon: <BarChartOutlined />, label: '数据分析' },
  { key: '/grid-management', icon: <ApartmentOutlined />, label: '网格管理' },
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 检查登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate, location]);

  // 如果未登录且不在登录页，重定向到登录页
  if (!user && location.pathname !== '/login') {
    return <LoginPage />;
  }

  // 如果在登录页且已登录，重定向到首页
  if (user && location.pathname === '/login') {
    navigate('/');
    return null;
  }

  // 如果在登录页，显示登录页
  if (location.pathname === '/login') {
    return <LoginPage />;
  }

  // 处理管理员菜单点击
  const handleAdminMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        message.info('个人资料功能开发中...');
        break;
      case 'settings':
        message.info('账户设置功能开发中...');
        break;
      case 'logout':
        localStorage.removeItem('user');
        setUser(null);
        message.success('已安全退出登录');
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 固定左侧菜单栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 1001,
          overflow: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        <div 
          className="logo" 
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: collapsed ? '16px' : '18px',
            fontWeight: 'bold',
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)'
          }}
        >
          {collapsed ? '华颂' : '济宁华颂置业'}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            borderRight: 0,
            marginTop: '16px'
          }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        {/* 顶部导航栏 */}
        <Header 
          style={{
            padding: '0 24px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? 80 : 200,
            zIndex: 1000,
            transition: 'left 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* 左侧：折叠按钮和面包屑 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                marginRight: '16px'
              }}
            />
            <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              济宁华颂置业有限公司智慧社区平台
            </Typography.Title>
          </div>

          {/* 右侧：通知、用户信息等 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 通知按钮 */}
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '18px' }}
              title="系统通知"
            >
              {notificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '16px',
                  textAlign: 'center',
                  lineHeight: 1
                }}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
            
            {/* 管理员下拉菜单 */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: '个人资料',
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: '账户设置',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    danger: true,
                  },
                ],
                onClick: handleAdminMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: 4 }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography.Text style={{ fontSize: '14px', color: '#333', lineHeight: 1.2 }}>
                    {user?.name || '管理员'}
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: '12px', color: '#666', lineHeight: 1.2 }}>
                    {user?.role || '系统管理员'}
                  </Typography.Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* 主内容区域 */}
        <Content
          style={{
            marginTop: 64, // Header高度
            minHeight: 'calc(100vh - 64px)',
            background: '#f0f2f5',
            overflow: 'auto'
          }}
        >
          <Routes>
            {/* 登录页面 */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* 核心功能页面 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gis-map" element={<GISMapPage />} />
            <Route path="/persons" element={<PersonPage />} />
            <Route path="/fitness-equipment" element={<FitnessEquipmentPage />} />
            
            {/* 智慧社区七大模块页面 */}
            <Route path="/party-building" element={<PartyBuildingPage />} />
            <Route path="/public-service" element={<PublicServicePage />} />
            <Route path="/patrol-management" element={<PatrolManagementPage />} />
            <Route path="/population-management" element={<PopulationManagementPage />} />
            <Route path="/comprehensive-governance" element={<ComprehensiveGovernancePage />} />
            <Route path="/event-management" element={<EventManagementPage />} />
            <Route path="/work-management" element={<WorkManagementPage />} />
            
            {/* 数据分析和网格管理页面 */}
            <Route path="/data-analysis" element={<DataAnalysis />} />
            <Route path="/grid-management" element={<GridManagementPage />} />
            
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App; 