import { Typography, Card, Form, Input, Button, Space, Divider, message, Steps, Result, Row, Col, List, Skeleton, Empty, Select } from 'antd';
import { 
  ThunderboltOutlined, 
  SendOutlined, 
  UserOutlined,
  ProjectOutlined,
  CopyOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateMessage, getGenerationHistory } from '../services/messageService';
import '../styles/MessageGenerationPage.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function MessageGenerationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedContent, setGeneratedContent] = useState('');
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['generation-history'],
    queryFn: getGenerationHistory,
  });

  const mutation = useMutation({
    mutationFn: generateMessage,
    onSuccess: (data) => {
      setGeneratedContent(data.text);
      setCurrentStep(2);
      queryClient.invalidateQueries({ queryKey: ['generation-history'] });
      message.success('Strategic message generated successfully!');
    },
    onError: () => {
      message.error('Generation failed. Please refine your inputs.');
      setCurrentStep(1); // Go back or show error
    }
  });

  const handleGenerate = async () => {
    try {
      const values = await form.validateFields();
      setCurrentStep(1);
      mutation.mutate(values);
    } catch (err) {
      // Form validation failed
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    message.success('Message copied to clipboard');
  };

  const steps = [
    { title: 'Parameters', icon: <UserOutlined /> },
    { title: 'Synthesis', icon: <ThunderboltOutlined /> },
    { title: 'Optimization', icon: <SendOutlined /> },
  ];

  return (
    <div className="generation-page">
      <div className="page-header">
        <Title level={2}>AI Strategic Outreach</Title>
        <Paragraph type="secondary">
          Enter target details to generate a high-performing, personalized outreach message using our custom-tuned LLM.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="generation-card premium-shadow">
            <Steps 
              current={currentStep} 
              items={steps} 
              style={{ marginBottom: 40 }}
            />

            {currentStep === 0 && (
              <Form 
                form={form} 
                layout="vertical" 
                initialValues={{ tone: 'professional' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Target Company" name="company" rules={[{ required: true }]}>
                      <Input prefix={<ProjectOutlined />} placeholder="e.g. Google" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Target Role" name="role" rules={[{ required: true }]}>
                      <Input placeholder="e.g. Senior Frontend Engineer" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Recruiter Name" name="recruiter" rules={[{ required: true }]}>
                      <Input prefix={<UserOutlined />} placeholder="e.g. Jane Smith" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Tone of Voice" name="tone">
                      <Select size="large">
                        <Select.Option value="professional">Professional & Technical</Select.Option>
                        <Select.Option value="confident">Confident & Bold</Select.Option>
                        <Select.Option value="enthusiastic">Enthusiastic & Driven</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Strategic Context" name="context">
                  <TextArea 
                    rows={4} 
                    placeholder="List specific experiences or themes you want to emphasize..." 
                  />
                </Form.Item>
                <Divider />
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  icon={<ThunderboltOutlined />}
                  onClick={handleGenerate}
                  loading={mutation.isPending}
                >
                  Generate Strategic Message
                </Button>
              </Form>
            )}

            {currentStep === 1 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <ThunderboltOutlined spin style={{ fontSize: 64, color: 'var(--accent)', marginBottom: 24 }} />
                <Title level={3}>Synthesizing...</Title>
                <Paragraph>Cross-referencing your profile with target requirements.</Paragraph>
              </div>
            )}

            {currentStep === 2 && (
              <div className="result-container">
                <Result
                  status="success"
                  title="AI Generation Complete"
                  subTitle="Our intelligence engine has crafted a tailored outreach message for you."
                />
                <Card className="message-preview-card" style={{ background: '#f8f9fa' }}>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{generatedContent}</Text>
                </Card>
                <Space style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
                  <Button icon={<CopyOutlined />} onClick={copyToClipboard} size="large">Copy Message</Button>
                  <Button type="primary" size="large" onClick={() => {
                    setCurrentStep(0);
                    form.resetFields();
                  }}>Generate New</Button>
                </Space>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<Space><HistoryOutlined /> Generation History</Space>} className="side-card">
            {isHistoryLoading ? (
              <Skeleton active />
            ) : history?.messages.length ? (
              <List
                size="small"
                dataSource={history.messages}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Button type="link" size="small" onClick={() => {
                      setGeneratedContent(item.text);
                      setCurrentStep(2);
                    }}>View</Button>]}
                  >
                    <List.Item.Meta
                      title={<Text strong style={{ fontSize: '13px' }}>{item.company}</Text>}
                      description={<Text type="secondary" style={{ fontSize: '11px' }}>{item.role}</Text>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No history yet" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
