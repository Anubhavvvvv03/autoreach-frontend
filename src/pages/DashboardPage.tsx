import { Typography, Card, Row, Col, Button } from 'antd';
import { ThunderboltOutlined, RocketOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardPage.css';

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <Title level={2}>Welcome back 👋</Title>
        <Paragraph>
          <Text type="secondary" style={{ fontSize: '1.1rem' }}>{user?.email}</Text>
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="dashboard-cards">
        <Col xs={24} md={12} lg={10}>
          <Card 
            hoverable
            className="stat-card yellow-border-hover"
            cover={
              <div className="card-icon-wrapper">
                <ThunderboltOutlined className="stat-icon" />
              </div>
            }
            actions={[
              <Button type="link" onClick={() => navigate('/resume')} icon={<ArrowRightOutlined />}>
                Get Started
              </Button>
            ]}
          >
            <Card.Meta 
              title="Resume Outreach"
              description="Upload your resume to auto-fill your profile and generate personalized outreach messages."
            />
          </Card>
        </Col>
        
        <Col xs={24} md={12} lg={10}>
          <Card 
            hoverable
            className="stat-card yellow-border-hover"
            cover={
              <div className="card-icon-wrapper">
                <RocketOutlined className="stat-icon" style={{ color: '#52c41a' }} />
              </div>
            }
            actions={[
              <Button type="link" onClick={() => navigate('/profile')} icon={<ArrowRightOutlined />}>
                Complete Profile
              </Button>
            ]}
          >
            <Card.Meta 
              title="Smart Profile"
              description="Manage your professional experience and preferences to optimize AI-powered matching."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
