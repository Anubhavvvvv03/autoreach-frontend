import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, theme } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  LogoutOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import '../styles/AppLayout.css';

const { Content, Sider } = Layout;

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: '/resume',
      icon: <FileTextOutlined />,
      label: 'Resume',
      onClick: () => navigate('/resume'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        theme="light"
        className="app-sidebar"
        style={{
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div className="sidebar-brand">
          <ThunderboltOutlined className="brand-icon" />
          <span>AutoReach</span>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="sidebar-menu"
        />

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <Button 
            type="text" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            block
            className="logout-btn"
          >
            Logout
          </Button>
        </div>
      </Sider>
      <Layout>
        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
