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
    <Layout className="min-h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={260}
        className="!bg-gradient-to-b !from-[#FFD700] !to-[#EAB308] !border-r-0 sticky top-0 left-0 h-screen shadow-[4px_0_24px_rgba(255,215,0,0.1)] z-10"
      >
        <div className="h-16 px-6 flex items-center gap-3 border-b border-black/5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-md">
            <ThunderboltOutlined className="text-xl text-[#1a1a1a]" />
          </div>
          <span className="font-bold text-[1.1rem] tracking-tight text-[#1a1a1a]">AutoReach AI</span>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="!bg-transparent !border-e-0 !p-2 [&_.ant-menu-item]:!h-11 [&_.ant-menu-item]:!leading-[44px] [&_.ant-menu-item]:!rounded-lg [&_.ant-menu-item]:!mb-1 [&_.ant-menu-item]:!text-[#1a1a1a] [&_.ant-menu-item-selected]:!bg-white/40 [&_.ant-menu-item-selected]:!text-black [&_.ant-menu-item-selected]:!font-semibold"
        />
        <div className="absolute bottom-0 w-full p-4 bg-transparent mt-auto">
          <Divider className="!my-3 !border-black/5" />
          <div className="flex items-center gap-2 py-2">
            <div className="w-2 h-2 bg-[#1a1a1a] rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.1)]"></div>
            <Text type="secondary" className="!text-[12px]">System Operational</Text>
          </div>
        </div>
      </Sider>
      <Layout className="bg-[#f8f9fa]">
        <Header className="!bg-white !px-6 flex items-center justify-between border-b border-[#e5e4e7] !h-16 !leading-[64px] shadow-sm">
          <div className="flex items-center">
            <Breadcrumb
              items={[
                { title: 'Home' },
                { title: location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard' }
              ]}
            />
          </div>
          <div className="flex items-center">
            <Space size="large">
              <Button type="text" icon={<BellOutlined />} className="text-[#4A4A4A]" />
              <Dropdown menu={profileMenuItems} placement="bottomRight" arrow>
                <div className="flex items-center gap-3 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                  <Avatar 
                    className="!bg-[#FFD700] !text-[#1a1a1a]" 
                    icon={<UserOutlined />} 
                  />
                  <div className="hidden md:flex flex-col leading-tight">
                    <Text strong className="text-[0.85rem] block truncate max-w-[120px]">{user?.email?.split('@')[0] || 'User'}</Text>
                    <Text type="secondary" className="text-[0.75rem]">Professional</Text>
                  </div>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content className="p-6 min-h-[calc(100vh-64px-70px)]">
          <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </Content>
        <Footer className="text-center p-6 bg-white border-t border-[#e5e4e7] flex flex-col gap-3 items-center">
          <Text type="secondary" className="text-sm">AutoReach AI ©2024 Crafted for Professional Excellence</Text>
          <Space split={<Divider type="vertical" className="!border-gray-200" />}>
            <Link to="/terms" className="text-gray-500 hover:text-primary">Terms</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-primary">Privacy</Link>
            <Link to="/support" className="text-gray-500 hover:text-primary">Support</Link>
          </Space>
        </Footer>
      </Layout>
    </Layout>
  );
}
