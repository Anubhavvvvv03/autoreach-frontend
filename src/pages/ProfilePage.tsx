import { Typography, Empty, Button, Form, Input, Card, Space, Divider, message } from 'antd';
import { UserOutlined, UploadOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import '../styles/ProfilePage.css';

const { Title, Paragraph, Text } = Typography;

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  title: z.string().min(2, 'Professional title is required'),
  bio: z.string().optional(),
  location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      title: '',
      bio: '',
      location: '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log('Profile update:', data);
    message.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <Title level={2}>Your Profile</Title>
        <Paragraph>
          <Text type="secondary">Manage your skills, experience, and projects used to generate outreach messages.</Text>
        </Paragraph>
      </div>

      {!isEditing ? (
        <Card className="profile-card shadow-sm">
          <Empty
            image={<UserOutlined style={{ fontSize: 64, color: 'var(--accent)' }} />}
            description={
              <Space direction="vertical" align="center">
                <Text strong style={{ fontSize: '1.2rem' }}>No profile details yet</Text>
                <Text type="secondary">Upload a resume to auto-fill your profile, or add your details manually.</Text>
              </Space>
            }
          >
            <Space size="middle" style={{ marginTop: 16 }}>
              <Button type="primary" icon={<UploadOutlined />} size="large">
                Upload Resume
              </Button>
              <Button icon={<EditOutlined />} size="large" onClick={() => setIsEditing(true)}>
                Add Manually
              </Button>
            </Space>
          </Empty>
        </Card>
      ) : (
        <Card title="Edit Profile" className="profile-card shadow-sm">
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              label="Full Name"
              validateStatus={errors.fullName ? 'error' : ''}
              help={errors.fullName?.message}
            >
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => <Input {...field} placeholder="John Doe" size="large" />}
              />
            </Form.Item>

            <Form.Item
              label="Professional Title"
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title?.message}
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Software Engineer" size="large" />}
              />
            </Form.Item>

            <Form.Item
              label="Bio"
              validateStatus={errors.bio ? 'error' : ''}
              help={errors.bio?.message}
            >
              <Controller
                name="bio"
                control={control}
                render={({ field }) => <Input.TextArea {...field} rows={4} placeholder="Tell us about yourself..." />}
              />
            </Form.Item>

            <Divider />

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsEditing(false)} size="large">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                Save Changes
              </Button>
            </Space>
          </Form>
        </Card>
      )}
    </div>
  );
}
