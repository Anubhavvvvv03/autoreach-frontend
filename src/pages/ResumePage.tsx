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
    <div className="pb-10">
      <div className="mb-8">
        <Space direction="vertical" size={0}>
          <Title level={2} className="!mb-1">Strategic Resume Intelligence</Title>
          <Paragraph type="secondary" className="!mb-0">
            Our AI engine extracts core competencies and experiences to build your strategic profile.
          </Paragraph>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card className="!rounded-2xl !border-[#e5e4e7] !shadow-sm p-2 bg-white">
            {activeJobId && jobStatus?.status !== 'COMPLETED' ? (
              <div className="text-center py-16 px-8">
                <ThunderboltOutlined spin className="text-5xl text-[#FFD700] mb-6" />
                <Title level={4} className="!mb-2">Analyzing Your Professional DNA</Title>
                <Paragraph className="text-gray-500 mb-6 font-medium">Progress: {jobStatus?.progress || 0}%</Paragraph>
                <Progress percent={jobStatus?.progress || 0} status="active" strokeColor="#FFD700" className="max-w-md mx-auto" />
              </div>
            ) : (
              <Dragger {...uploadProps} className="!border-2 !border-dashed !border-[#e5e4e7] !rounded-2xl !bg-white transition-all hover:!border-[#FFD700] hover:!bg-[#FFD700]/5 group !py-12">
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    <ThunderboltOutlined className="text-5xl text-[#FFD700] group-hover:scale-110 transition-transform" />
                  </p>
                  <Title level={4} className="!mb-2">Establish Your Career DNA</Title>
                  <Paragraph type="secondary" className="max-w-xs mx-auto text-sm">
                    Drag and drop your professional PDF resume to initialize AI parsing.
                  </Paragraph>
                  <Tag color="gold" className="!rounded-full px-4 py-1 font-bold uppercase text-[10px] !mt-4">Enterprise Standard PDF Required</Tag>
                </div>
              </Dragger>
            )}

            <div className="mt-8 px-6 pb-4">
              <Divider orientation={"left" as any}><Text className="text-xs font-bold uppercase tracking-wider text-gray-400">Intelligence Guidelines</Text></Divider>
              <List
                size="small"
                dataSource={[
                  { icon: <CheckCircleOutlined className="text-[#52c41a]" />, text: 'Automatic skill extraction and verification' },
                  { icon: <CheckCircleOutlined className="text-[#52c41a]" />, text: 'Project history and impact analysis' },
                  { icon: <InfoCircleOutlined className="text-[#1890ff]" />, text: 'Max file size: 5MB (Professional PDF only)' },
                ]}
                renderItem={item => (
                  <List.Item className="!border-none !py-1 !px-0">
                    <Space className="text-sm">{item.icon} <Text className="text-gray-600 font-medium">{item.text}</Text></Space>
                  </List.Item>
                )}
              />
            </div>
          </Card>

          {jobStatus?.status === 'COMPLETED' && (
            <Card className="!rounded-2xl !border-none shadow-lg !bg-gradient-to-br !from-[#FFD700] !to-[#EAB308] mt-6 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <ThunderboltOutlined className="text-9xl text-black" />
              </div>
              <Title level={5} className="!mb-2">Parsing Success</Title>
              <Paragraph className="text-[#1a1a1a]/80 font-medium mb-4 leading-relaxed max-w-[90%] break-words">
                {jobStatus.results?.experienceSummary}
              </Paragraph>
              <Button 
                type="primary" 
                onClick={() => setActiveJobId(null)}
                className="!bg-white !text-black !border-none !rounded-lg !font-bold py-5 hover:!bg-white/90"
              >
                Upload Another
              </Button>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={9}>
          <Card 
            title={<Space className="font-bold"><SolutionOutlined className="text-[#FFD700]" /> Extraction Capabilities</Space>}
            className="!rounded-2xl !border-[#e5e4e7] !shadow-sm bg-white"
          >
            <div className="py-2">
              <Badge status="processing" color="#FFD700" text={<Text className="font-bold text-sm tracking-tight capitalize">Entity Recognition</Text>} />
              <Paragraph className="text-[12.5px] text-gray-500 mt-1 leading-snug">Extracts companies, roles, and dates with high precision.</Paragraph>
            </div>
            <Divider dashed className="!my-4 !border-black/5" />
            <div className="py-2">
              <Badge status="processing" color="#FFD700" text={<Text className="font-bold text-sm tracking-tight capitalize">Skill Taxonomy</Text>} />
              <Paragraph className="text-[12.5px] text-gray-500 mt-1 leading-snug">Maps your experience to global professional skill standards.</Paragraph>
            </div>
            <Divider dashed className="!my-4 !border-black/5" />
            <div className="py-2">
              <Badge status="processing" color="#FFD700" text={<Text className="font-bold text-sm tracking-tight capitalize">Sentiment Analysis</Text>} />
              <Paragraph className="text-[12.5px] text-gray-500 mt-1 leading-snug">Detects the tone and impact of your professional achievements.</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
