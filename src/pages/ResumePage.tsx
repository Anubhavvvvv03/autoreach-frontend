import { Typography, Upload, message, Card, Space } from 'antd';
import { InboxOutlined, FileTextOutlined, ArrowRightOutlined } from '@ant-design/icons';
import '../styles/ResumePage.css';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

export default function ResumePage() {
  const uploadProps = {
    name: 'file',
    multiple: false,
    action: '/api/resume/upload', // Placeholder action
    accept: '.pdf',
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className="resume-page">
      <div className="page-header">
        <Title level={2}>Resume Parsing</Title>
        <Paragraph>
          <Text type="secondary" style={{ fontSize: '1.1rem' }}>
            Upload your PDF resume to automatically extract your skills, experience, and projects.
          </Text>
        </Paragraph>
      </div>

      <Card className="upload-container shadow-sm">
        <Dragger {...uploadProps} className="resume-dragger">
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: 'var(--accent)' }} />
          </p>
          <Title level={4} className="ant-upload-text">Click or drag resume to this area to upload</Title>
          <Paragraph className="ant-upload-hint">
            Support for a single PDF upload. Max size 5MB.
          </Paragraph>
        </Dragger>

        <div className="upload-info">
          <Space direction="vertical" size="small">
            <Text type="secondary">
              <FileTextOutlined /> After uploading, we'll parse your resume using AI.
            </Text>
            <Text type="secondary">
              <ArrowRightOutlined /> You can review and edit the extracted data before saving to your profile.
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
}
