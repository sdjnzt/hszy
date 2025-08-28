import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Checkbox,
  message,
  Row,
  Col,
  Divider,
  theme
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  HomeOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 模拟用户数据
  const mockUsers = [
    { username: 'admin', password: '123456', role: '系统管理员', name: '管理员' },
    { username: 'community', password: '123456', role: '社区管理员', name: '张志强' },
    { username: 'property', password: '123456', role: '物业管理员', name: '李秀英' },
    { username: 'security', password: '123456', role: '安保人员', name: '王德华' },
    { username: 'service', password: '123456', role: '服务人员', name: '刘明辉' }
  ];

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    
    // 模拟登录验证
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === values.username && u.password === values.password);
      
      if (user) {
        // 存储用户信息到localStorage
        localStorage.setItem('user', JSON.stringify({
          username: user.username,
          name: user.name,
          role: user.role,
          loginTime: new Date().toISOString()
        }));
        
        message.success(`欢迎回来，${user.name}！`);
        navigate('/');
      } else {
        message.error('用户名或密码错误');
      }
      
      setLoading(false);
    }, 1000);
  };

  const quickLogin = (username: string) => {
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      form.setFieldsValue({ username: user.username, password: user.password });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row gutter={[48, 0]} align="middle" style={{ width: '100%', maxWidth: '1200px' }}>
        {/* 左侧介绍区域 */}
        <Col xs={24} lg={12}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '72px', marginBottom: '24px' }}>
              <HomeOutlined />
            </div>
            <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
              济宁华颂智慧社区平台
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '32px' }}>
              科技赋能社区管理，数字化提升居民体验
            </Paragraph>
            
            {/* 功能特点 */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '16px' }}>
                <SafetyOutlined style={{ marginRight: '12px', fontSize: '20px' }} />
                <span style={{ fontSize: '16px' }}>安全可靠的数据管理</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <UserOutlined style={{ marginRight: '12px', fontSize: '20px' }} />
                <span style={{ fontSize: '16px' }}>全方位的人员管理</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <HomeOutlined style={{ marginRight: '12px', fontSize: '20px' }} />
                <span style={{ fontSize: '16px' }}>智能化的社区服务</span>
              </div>
            </div>
          </div>
        </Col>

        {/* 右侧登录区域 */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            bodyStyle={{ padding: '48px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2} style={{ marginBottom: '8px' }}>
                欢迎登录
              </Title>
              <Text type="secondary">
                请输入您的账号密码进入系统
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住密码</Checkbox>
                  </Form.Item>
                  <Button type="link" style={{ padding: 0 }}>
                    忘记密码？
                  </Button>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            <Divider>
              <Text type="secondary">快速登录</Text>
            </Divider>

            {/* 快速登录按钮 */}
            <div style={{ textAlign: 'center' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Button
                      size="small"
                      block
                      onClick={() => quickLogin('admin')}
                      style={{ borderRadius: '6px' }}
                    >
                      管理员
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      size="small"
                      block
                      onClick={() => quickLogin('community')}
                      style={{ borderRadius: '6px' }}
                    >
                      社区管理员
                    </Button>
                  </Col>
                </Row>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Button
                      size="small"
                      block
                      onClick={() => quickLogin('property')}
                      style={{ borderRadius: '6px' }}
                    >
                      物业管理员
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      size="small"
                      block
                      onClick={() => quickLogin('security')}
                      style={{ borderRadius: '6px' }}
                    >
                      安保人员
                    </Button>
                  </Col>
                </Row>
              </Space>
              
        
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
