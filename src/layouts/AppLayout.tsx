import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Breadcrumb, Divider } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  LogoutOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/AppLayout.css';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

export default function AppLayout() {
  const { logout, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Intelligence Dashboard</Link>,
    },
    {
      key: '/generate',
      icon: <PlusOutlined />,
      label: <Link to="/generate">Message Generation</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Professional Profile</Link>,
    },
    {
      key: '/resume',
      icon: <FileTextOutlined />,
      label: <Link to="/resume">Resume Analysis</Link>,
    },
  ];

  const profileMenuItems: any = {
    items: [
      {
        key: 'profile',
        label: 'My Profile',
        icon: <UserOutlined />,
        onClick: () => navigate('/profile'),
      },
      {
        key: 'settings',
        label: 'Account Settings',
        icon: <SettingOutlined />,
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        label: 'Sign Out',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="app-sider"
        width={260}
      >
        <div className="sidebar-brand">
          <div className="brand-icon yellow-gradient-bg">
            <ThunderboltOutlined style={{ fontSize: '20px' }} />
          </div>
          <span className="brand-text">AutoReach AI</span>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="app-menu"
        />
        <div className="sidebar-footer">
          <Divider style={{ margin: '12px 0', borderColor: '#f0f0f0' }} />
          <div className="system-status">
            <div className="status-dot"></div>
            <Text type="secondary" style={{ fontSize: '12px' }}>System Operational</Text>
          </div>
        </div>
      </Sider>
      <Layout className="main-layout">
        <Header className="app-header">
          <div className="header-left">
            <Breadcrumb
              items={[
                { title: 'Home' },
                { title: location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard' }
              ]}
            />
          </div>
          <div className="header-right">
            <Space size="large">
              <Button type="text" icon={<BellOutlined />} className="header-action-btn" />
              <Dropdown menu={profileMenuItems} placement="bottomRight" arrow>
                <div className="profile-trigger">
                  <Avatar 
                    style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }} 
                    icon={<UserOutlined />} 
                  />
                  <div className="user-info-brief">
                    <Text strong className="user-name">{user?.email?.split('@')[0] || 'User'}</Text>
                    <Text type="secondary" className="user-role">Professional</Text>
                  </div>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content className="app-content">
          <div className="content-inner page-transition-enter-active">
            <Outlet />
          </div>
        </Content>
        <Footer className="app-footer">
          <Text type="secondary">AutoReach AI ©2024 Crafted for Professional Excellence</Text>
          <Space split={<Divider type="vertical" />}>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/support">Support</Link>
          </Space>
        </Footer>
      </Layout>
    </Layout>
  );
}
