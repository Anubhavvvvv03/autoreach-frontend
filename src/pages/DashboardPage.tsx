import { Typography, Card, Row, Col, Button, Statistic, Space, Tag, List, Skeleton, Empty } from 'antd';
import { 
  ThunderboltOutlined, 
  RocketOutlined, 
  ArrowRightOutlined, 
  LineChartOutlined,
  HistoryOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary, getDashboardActivity, getDashboardInsights } from '../services/dashboardService';

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
  });

  const { data: activity, isLoading: isActivityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: getDashboardActivity,
  });

  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['dashboard-insights'],
    queryFn: getDashboardInsights,
  });

  const statsData = summary?.stats || {
    totalOutreach: 0,
    successRate: 0,
    pendingTasks: 0,
    activeCampaigns: 0,
  };

  const stats = [
    { title: 'Total Outreach', value: statsData.totalOutreach, icon: <ThunderboltOutlined />, color: '#FFD700' },
    { title: 'Success Rate', value: `${statsData.successRate}%`, icon: <LineChartOutlined />, color: '#52c41a' },
    { title: 'Pending Tasks', value: statsData.pendingTasks, icon: <HistoryOutlined />, color: '#faad14' },
    { title: 'Active Strategy', value: statsData.activeCampaigns, icon: <RocketOutlined />, color: '#1890ff' },
  ];

  return (
    <div className="pb-10">
      <div className="mb-8">
        <Space direction="vertical" size={0}>
          <Title level={2} className="!mb-1">AI Intelligence Dashboard</Title>
          <Paragraph type="secondary" className="!mb-0">
            Strategic pulse of your outreach operations. Powered by real-time AI analytics.
          </Paragraph>
        </Space>
      </div>

      <Row gutter={[24, 24]} className="mb-6">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="!rounded-2xl !border-[#e5e4e7] !shadow-sm transition-all duration-300 hover:-translate-y-1 hover:!shadow-md hover:!border-[#FFD700]" bordered={false}>
              <Skeleton loading={isSummaryLoading} active paragraph={{ rows: 1 }}>
                <Statistic
                  title={<Text type="secondary" className="text-sm font-medium uppercase tracking-wider">{stat.title}</Text>}
                  value={stat.value}
                  prefix={<span style={{ color: stat.color }} className="mr-2 inline-flex items-center">{stat.icon}</span>}
                  valueStyle={{ fontWeight: 800, fontSize: '1.75rem' }}
                />
              </Skeleton>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} lg={16}>
          <Card 
            title={<Space className="font-bold"><BulbOutlined className="text-[#FFD700]" /> Strategic AI Insights</Space>}
            extra={<Button type="link" className="!text-[#4A4A4A] font-semibold">View All</Button>}
            className="!rounded-2xl shadow-premium !border-[#e5e4e7]"
          >
            {isInsightsLoading ? (
              <Skeleton active />
            ) : insights?.insights.length ? (
              <List
                itemLayout="horizontal"
                dataSource={insights.insights}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Button type="primary" size="small" ghost onClick={() => navigate('/generate')} className="!border-[#FFD700] !text-black hover:!bg-[#FFD700]/10">Execute</Button>]}
                    className="!px-0"
                  >
                    <List.Item.Meta
                      title={<Space>{item.title} <Tag color={item.priority === 'HIGH' ? 'error' : 'warning'} className="!rounded-full px-3">{item.priority} Priority</Tag></Space>}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No insights available yet" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<Space className="font-bold"><HistoryOutlined className="text-[#FFD700]" /> Recent Pulse</Space>} 
            className="!rounded-2xl !border-[#e5e4e7] !shadow-sm"
          >
            {isActivityLoading ? (
              <Skeleton active />
            ) : activity?.activities.length ? (
              <List
                size="small"
                dataSource={activity.activities}
                renderItem={(item) => (
                  <List.Item className="!px-0">
                    <Space direction="vertical" size={0}>
                      <Text type="secondary" className="text-[11px] font-medium opacity-60 uppercase">{item.timestamp}</Text>
                      <Space>
                        <Tag color={item.type === 'OUTREACH' ? 'blue' : 'orange'} className="!text-[10px] !rounded-md uppercase font-bold">{item.type}</Tag>
                        <Text className="text-[13px] font-medium">{item.title}</Text>
                      </Space>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No activity yet" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-8">
        <Col xs={24} md={12}>
          <Card 
            className="!rounded-2xl !border-[#e5e4e7] !shadow-sm transition-all duration-300 hover:-translate-y-1 hover:!shadow-lg !bg-gradient-to-br !from-[#FFD700] !to-[#EAB308] cursor-pointer group"
            bordered={false}
            onClick={() => navigate('/generate')}
          >
            <div className="p-2">
              <Title level={4} className="!mb-2">Execute New Outreach</Title>
              <Paragraph className="!mb-6 opacity-80">Leverage advanced generative AI to create personalized, high-converting messages based on your professional profile.</Paragraph>
              <Button type="default" icon={<ArrowRightOutlined />} className="!bg-white !border-none !rounded-lg !font-bold py-5 group-hover:!bg-white/90">Start Generation</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            className="!rounded-2xl !border-[#e5e4e7] !shadow-sm transition-all duration-300 hover:-translate-y-1 hover:!shadow-lg cursor-pointer group hover:!border-[#FFD700]"
            onClick={() => navigate('/profile')}
          >
            <div className="p-2">
               <Title level={4} className="!mb-2">Professional Profile Management</Title>
               <Paragraph className="!mb-6 text-gray-500">Manage your professional experience and preferences to optimize AI-powered matching and precision.</Paragraph>
               <Button type="primary" icon={<ArrowRightOutlined />} className="!bg-[#FFD700] !text-black !border-none !rounded-lg !font-bold py-5 hover:!bg-[#EAB308]">Refine Profile</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
