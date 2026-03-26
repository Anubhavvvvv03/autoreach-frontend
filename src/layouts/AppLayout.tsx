import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Breadcrumb, Divider, Drawer, Popover, Badge, List, Tag } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined,
  MenuOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;

export default function AppLayout() {
  const { logout, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard" onClick={() => setMobileMenuVisible(false)}>Intelligence Dashboard</Link>,
    },
    {
      key: '/generate',
      icon: <PlusOutlined />,
      label: <Link to="/generate" onClick={() => setMobileMenuVisible(false)}>Message Generation</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile" onClick={() => setMobileMenuVisible(false)}>Professional Profile</Link>,
    },
    {
      key: '/resume',
      icon: <FileTextOutlined />,
      label: <Link to="/resume" onClick={() => setMobileMenuVisible(false)}>Resume Analysis</Link>,
    },
  ];

  const notifications = [
    { title: 'Resume Parsed', time: '5m ago', type: 'success', icon: <CheckCircleOutlined className="text-green-500" /> },
    { title: 'New Opportunity', time: '1h ago', type: 'info', icon: <InfoCircleOutlined className="text-blue-500" /> },
    { title: 'System Updated', time: '2h ago', type: 'info', icon: <ThunderboltOutlined className="text-yellow-500" /> },
  ];

  const notificationContent = (
    <div className="w-80">
      <div className="flex items-center justify-between mb-4 px-1">
        <Text strong className="text-lg">Notifications</Text>
        <Tag color="gold">{notifications.length} New</Tag>
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item className="hover:bg-gray-50 cursor-pointer transition-colors p-3 rounded-lg border-none mb-1">
            <List.Item.Meta
              avatar={<div className="mt-1">{item.icon}</div>}
              title={<Text strong className="text-[13px]">{item.title}</Text>}
              description={<Text type="secondary" className="text-[11px]">{item.time}</Text>}
            />
          </List.Item>
        )}
      />
      <Divider className="my-2" />
      <Button type="link" block className="!text-[#DAA520] font-bold">View All Notifications</Button>
    </div>
  );

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

  const SidebarContent = () => (
    <>
      <div className="h-16 px-6 flex items-center gap-3 border-b border-black/5 mb-2">
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
        <div className="flex items-center gap-2 py-2 px-2">
          <div className="w-2 h-2 bg-[#1a1a1a] rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.1)]"></div>
          <Text type="secondary" className="!text-[12px]">System Operational</Text>
        </div>
      </div>
    </>
  );

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sider */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={260}
        trigger={null}
        className="hidden lg:block !bg-gradient-to-b !from-[#FFD700] !to-[#EAB308] !border-r-0 min-h-screen sticky top-0 left-0 shadow-[4px_0_24px_rgba(255,215,0,0.1)] z-20"
      >
        <SidebarContent />
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: 'none' }}
        className="lg:hidden [&_.ant-drawer-content]:!bg-gradient-to-b [&_.ant-drawer-content]:!from-[#FFD700] [&_.ant-drawer-content]:!to-[#EAB308]"
      >
        <SidebarContent />
      </Drawer>

      <Layout className="bg-[#f8f9fa]">
        <Header className="!bg-white !px-4 md:!px-6 flex items-center justify-between border-b border-[#e5e4e7] !h-16 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className="lg:hidden text-lg"
            />
            <Breadcrumb
              className="hidden sm:block"
              items={[
                { title: 'Home' },
                { title: location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard' }
              ]}
            />
            <Title level={5} className="!mb-0 sm:hidden">
              {location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard'}
            </Title>
          </div>
          <div className="flex items-center">
            <Space size={window.innerWidth < 768 ? 'small' : 'large'}>
              <Popover content={notificationContent} trigger="click" placement="bottomRight" arrow>
                <Badge count={3} size="small" offset={[-2, 2]} color="#1a1a1a">
                  <Button type="text" icon={<BellOutlined className="text-lg" />} className="text-[#4A4A4A]" />
                </Badge>
              </Popover>
              <Dropdown menu={profileMenuItems} placement="bottomRight" arrow>
                <div className="flex items-center gap-2 md:gap-3 px-1 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                  <Avatar
                    className="!bg-[#FFD700] !text-[#1a1a1a] shadow-sm"
                    icon={<UserOutlined />}
                  />
                  <div className="hidden sm:flex flex-col leading-tight">
                    <Text strong className="text-[0.85rem] block truncate max-w-[100px]">{user?.email?.split('@')[0] || 'User'}</Text>
                    <Text type="secondary" className="text-[0.7rem]">Professional</Text>
                  </div>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content className="p-4 md:p-6 min-h-[calc(100vh-64px-70px)]">
          <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </Content>

        <Footer className="text-center p-6 bg-white border-t border-[#e5e4e7] flex flex-col gap-3 items-center">
          <Text type="secondary" className="text-sm">AutoReach AI ©2024 Crafted for Professional Excellence</Text>
          <Space split={<Divider type="vertical" className="!border-gray-200" />}>
            <Link to="/terms" className="text-gray-500 hover:text-primary text-xs">Terms</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-primary text-xs">Privacy</Link>
            <Link to="/support" className="text-gray-500 hover:text-primary text-xs">Support</Link>
          </Space>
        </Footer>
      </Layout>
    </Layout>
  );
}
