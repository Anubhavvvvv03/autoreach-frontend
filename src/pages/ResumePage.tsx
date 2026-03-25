import { Typography, Upload, message, Card, Space, Divider, Row, Col, List, Tag, Badge, Progress, Button } from 'antd';
import { 
  ThunderboltOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { uploadResume, getResumeJobStatus } from '../services/resumeService';
import '../styles/ResumePage.css';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

export default function ResumePage() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      message.success('Resume uploaded successfully. Analyzing Career DNA...');
      setActiveJobId(data.jobId);
    },
    onError: () => {
      message.error('Resume upload failed.');
    }
  });

  const { data: jobStatus } = useQuery({
    queryKey: ['resume-job', activeJobId],
    queryFn: () => getResumeJobStatus(activeJobId!),
    enabled: !!activeJobId,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      return (data?.status === 'COMPLETED' || data?.status === 'FAILED' ? false : 2000);
    },
  });

  const uploadProps = {
    name: 'file',
    multiple: false,
    customRequest: ({ file, onSuccess, onError }: any) => {
      uploadMutation.mutate(file, {
        onSuccess: () => onSuccess('ok'),
        onError: (err) => onError(err),
      });
    },
    accept: '.pdf',
    showUploadList: false,
  };

  return (
    <div className="resume-page">
      <div className="page-header">
        <Space direction="vertical" size={0}>
          <Title level={2}>Strategic Resume Intelligence</Title>
          <Paragraph type="secondary">
            Our AI engine extracts core competencies and experiences to build your strategic profile.
          </Paragraph>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card className="upload-container shadow-sm">
            {activeJobId && jobStatus?.status !== 'COMPLETED' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <ThunderboltOutlined spin style={{ fontSize: 48, color: 'var(--accent)', marginBottom: 24 }} />
                <Title level={4}>Analyzing Your Professional DNA</Title>
                <Paragraph>Progress: {jobStatus?.progress || 0}%</Paragraph>
                <Progress percent={jobStatus?.progress || 0} status="active" strokeColor="var(--accent)" />
              </div>
            ) : (
              <Dragger {...uploadProps} className="resume-dragger">
                <div className="dragger-content">
                  <p className="ant-upload-drag-icon">
                    <ThunderboltOutlined style={{ color: 'var(--accent)', fontSize: 48 }} />
                  </p>
                  <Title level={4}>Establish Your Career DNA</Title>
                  <Paragraph type="secondary">
                    Drag and drop your professional PDF resume to initialize AI parsing.
                  </Paragraph>
                  <Tag color="gold">Enterprise Standard PDF Required</Tag>
                </div>
              </Dragger>
            )}

            <div className="parsing-guidelines">
              <Divider orientation={"left" as any}><Text strong>Intelligence Guidelines</Text></Divider>
              <List
                size="small"
                dataSource={[
                  { icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />, text: 'Automatic skill extraction and verification' },
                  { icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />, text: 'Project history and impact analysis' },
                  { icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />, text: 'Max file size: 5MB (Professional PDF only)' },
                ]}
                renderItem={item => (
                  <List.Item style={{ border: 'none', padding: '4px 0' }}>
                    <Space>{item.icon} <Text>{item.text}</Text></Space>
                  </List.Item>
                )}
              />
            </div>
          </Card>

          {jobStatus?.status === 'COMPLETED' && (
            <Card className="shadow-sm yellow-gradient-bg" style={{ marginTop: 24 }}>
              <Title level={5}>Parsing Success</Title>
              <Paragraph>{jobStatus.results?.experienceSummary}</Paragraph>
              <Button type="primary" onClick={() => setActiveJobId(null)}>Upload Another</Button>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={9}>
          <Card 
            title={<Space><SolutionOutlined /> Extraction Capabilities</Space>}
            className="info-sidebar-card shadow-sm"
          >
            <div className="capability-item">
              <Badge status="processing" color="gold" text={<Text strong>Entity Recognition</Text>} />
              <Paragraph style={{ fontSize: '13px' }} type="secondary">Extracts companies, roles, and dates with high precision.</Paragraph>
            </div>
            <Divider dashed style={{ margin: '12px 0' }} />
            <div className="capability-item">
              <Badge status="processing" color="gold" text={<Text strong>Skill Taxonomy</Text>} />
              <Paragraph style={{ fontSize: '13px' }} type="secondary">Maps your experience to global professional skill standards.</Paragraph>
            </div>
            <Divider dashed style={{ margin: '12px 0' }} />
            <div className="capability-item">
              <Badge status="processing" color="gold" text={<Text strong>Sentiment Analysis</Text>} />
              <Paragraph style={{ fontSize: '13px' }} type="secondary">Detects the tone and impact of your professional achievements.</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
