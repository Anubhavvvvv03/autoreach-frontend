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

  const messages = history?.messages || [];

  const steps = [
    { title: 'Parameters', icon: <UserOutlined /> },
    { title: 'Synthesis', icon: <ThunderboltOutlined /> },
    { title: 'Optimization', icon: <SendOutlined /> },
  ];

  return (
    <div className="pb-10">
      <div className="mb-8">
        <Title level={2} className="!mb-1">AI Strategic Outreach</Title>
        <Paragraph type="secondary" className="!mb-0">
          Enter target details to generate a high-performing, personalized outreach message using our custom-tuned LLM.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="!rounded-2xl shadow-premium !border-[#e5e4e7] p-4 bg-white overflow-hidden">
            <Steps 
              current={currentStep} 
              items={steps} 
              className="mb-10"
            />

            {currentStep === 0 && (
              <Form 
                form={form} 
                layout="vertical" 
                initialValues={{ tone: 'professional' }}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Target Company</span>} name="company" rules={[{ required: true }]}>
                      <Input prefix={<ProjectOutlined className="text-gray-400 mr-2" />} placeholder="e.g. Google" size="large" className="!rounded-lg" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Target Role</span>} name="role" rules={[{ required: true }]}>
                      <Input placeholder="e.g. Senior Frontend Engineer" size="large" className="!rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Recruiter Name</span>} name="recruiter" rules={[{ required: true }]}>
                      <Input prefix={<UserOutlined className="text-gray-400 mr-2" />} placeholder="e.g. Jane Smith" size="large" className="!rounded-lg" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tone of Voice</span>} name="tone">
                      <Select size="large" className="!rounded-lg">
                        <Select.Option value="professional">Professional & Technical</Select.Option>
                        <Select.Option value="confident">Confident & Bold</Select.Option>
                        <Select.Option value="enthusiastic">Enthusiastic & Driven</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Strategic Context</span>} name="context">
                  <TextArea 
                    rows={4} 
                    className="!rounded-lg"
                    placeholder="List specific experiences or themes you want to emphasize..." 
                  />
                </Form.Item>
                <Divider className="!border-black/5" />
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  icon={<ThunderboltOutlined />}
                  onClick={handleGenerate}
                  loading={mutation.isPending}
                  className="!bg-[#FFD700] !text-black !border-none !rounded-lg !font-bold py-6 shadow-md hover:!bg-[#EAB308]"
                >
                  Generate Strategic Message
                </Button>
              </Form>
            )}

            {currentStep === 1 && (
              <div className="text-center py-16 px-8 animate-pulse text-gray-500">
                <ThunderboltOutlined spin className="text-6xl text-[#FFD700] mb-6" />
                <Title level={3} className="!mb-2">Synthesizing...</Title>
                <Paragraph className="text-sm font-medium">Cross-referencing your profile with target requirements.</Paragraph>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Result
                  status="success"
                  title={<span className="font-bold underline decoration-[#FFD700] decoration-4 underline-offset-8">AI Generation Complete</span>}
                  subTitle="Our intelligence engine has crafted a tailored outreach message for you."
                  className="!pb-0"
                />
                <div className="mt-8">
                  <div className="bg-[#f8f9fa] border border-[#FFD700]/30 border-dashed rounded-xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ThunderboltOutlined className="text-4xl" />
                    </div>
                    <Text className="text-gray-700 leading-relaxed font-serif text-[15px] whitespace-pre-wrap">{generatedContent}</Text>
                  </div>
                  <Space className="mt-8 w-full justify-center">
                    <Button icon={<CopyOutlined />} onClick={copyToClipboard} size="large" className="!rounded-lg min-w-[140px] font-medium">Copy Message</Button>
                    <Button type="primary" size="large" onClick={() => {
                      setCurrentStep(0);
                      form.resetFields();
                    }} className="!bg-black !text-white !border-none !rounded-lg min-w-[140px] font-bold shadow-md hover:!opacity-80">
                      Generate New
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={<Space className="font-bold"><HistoryOutlined className="text-[#FFD700]" /> Generation History</Space>} 
            className="!rounded-2xl !border-[#e5e4e7] !shadow-sm bg-white"
          >
            {isHistoryLoading ? (
              <Skeleton active />
            ) : messages.length ? (
              <List
                size="small"
                dataSource={messages}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Button type="link" size="small" onClick={() => {
                      setGeneratedContent(item.text);
                      setCurrentStep(2);
                    }} className="!text-[#FFD700] font-bold">View</Button>]}
                    className="!px-0 !py-3 !border-black/5"
                  >
                    <List.Item.Meta
                      title={<Text className="font-bold text-[13.5px] tracking-tight">{item.company}</Text>}
                      description={<Text type="secondary" className="text-[11px] font-medium uppercase tracking-wide opacity-70">{item.role}</Text>}
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
