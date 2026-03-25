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
import '../styles/DashboardPage.css';

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
    <div className="dashboard-page">
      <div className="page-header">
        <Space direction="vertical" size={0}>
          <Title level={2}>AI Intelligence Dashboard</Title>
          <Paragraph type="secondary">
            Strategic pulse of your outreach operations. Powered by real-time AI analytics.
          </Paragraph>
        </Space>
      </div>

      <Row gutter={[24, 24]} className="stats-row">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stat-card" bordered={false}>
              <Skeleton loading={isSummaryLoading} active paragraph={{ rows: 1 }}>
                <Statistic
                  title={<Text type="secondary">{stat.title}</Text>}
                  value={stat.value}
                  prefix={<span style={{ color: stat.color, marginRight: 8 }}>{stat.icon}</span>}
                  valueStyle={{ fontWeight: 700 }}
                />
              </Skeleton>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Space><BulbOutlined /> Strategic AI Insights</Space>}
            extra={<Button type="link">View All</Button>}
            className="main-card premium-shadow"
          >
            {isInsightsLoading ? (
              <Skeleton active />
            ) : insights?.insights.length ? (
              <List
                itemLayout="horizontal"
                dataSource={insights.insights}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Button type="primary" size="small" ghost onClick={() => navigate('/generate')}>Execute</Button>]}
                  >
                    <List.Item.Meta
                      title={<Space>{item.title} <Tag color={item.priority === 'HIGH' ? 'red' : 'gold'}>{item.priority} Priority</Tag></Space>}
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
            title={<Space><HistoryOutlined /> Recent Pulse</Space>} 
            className="side-card"
          >
            {isActivityLoading ? (
              <Skeleton active />
            ) : activity?.activities.length ? (
              <List
                size="small"
                dataSource={activity.activities}
                renderItem={(item) => (
                  <List.Item>
                    <Space direction="vertical" size={0}>
                      <Text type="secondary" style={{ fontSize: '11px' }}>{item.timestamp}</Text>
                      <Space>
                        <Tag color={item.type === 'OUTREACH' ? 'blue' : 'orange'} style={{ fontSize: '10px' }}>{item.type}</Tag>
                        <Text style={{ fontSize: '13px' }}>{item.title}</Text>
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

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card 
            className="action-card yellow-gradient-bg"
            bordered={false}
            onClick={() => navigate('/generate')}
          >
            <div className="action-card-content">
              <Title level={4}>Execute New Outreach</Title>
              <Paragraph>Leverage advanced generative AI to create personalized, high-converting messages based on your professional profile.</Paragraph>
              <Button type="default" icon={<ArrowRightOutlined />}>Start Generation</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            className="action-card"
            onClick={() => navigate('/profile')}
          >
            <div className="action-card-content">
              <Title level={4}>Professional Profile Management</Title>
              <Paragraph>Manage your professional experience and preferences to optimize AI-powered matching and precision.</Paragraph>
              <Button type="primary" icon={<ArrowRightOutlined />}>Refine Profile</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
