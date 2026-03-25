import { Typography, Button, Form, Input, Card, Space, Divider, message, Row, Col, Tag, Badge, Skeleton } from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  SaveOutlined, 
  MailOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  GithubOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, getProfileSyncStatus } from '../services/profileService';
import '../styles/ProfilePage.css';

const { Title, Paragraph, Text } = Typography;

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  title: z.string().min(2, 'Professional title is required'),
  bio: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { data: syncStatus } = useQuery({
    queryKey: ['profile-sync'],
    queryFn: getProfileSyncStatus,
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        title: profile.title,
        bio: profile.bio,
        location: profile.location,
        linkedin: profile.socialLinks?.linkedin || '',
        github: profile.socialLinks?.github || '',
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      message.success('Strategic profile updated successfully!');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      message.error('Failed to update profile.');
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    mutation.mutate({
      fullName: data.fullName,
      title: data.title,
      bio: data.bio,
      location: data.location,
      socialLinks: {
        linkedin: data.linkedin,
        github: data.github,
      }
    });
  };

  if (isLoading) return <Skeleton active style={{ padding: 48 }} />;

  return (
    <div className="profile-page">
      <div className="page-header">
        <Space direction="vertical" size={0}>
          <Title level={2}>Strategic Professional Profile</Title>
          <Paragraph type="secondary">
            Manage your professional identity and skills to optimize AI-driven outreach performance.
          </Paragraph>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="profile-sidebar-card shadow-sm">
            <div className="profile-avatar-container">
              <Badge count={<ThunderboltOutlined style={{ color: '#FFD700' }} />} offset={[-10, 10]}>
                <div className="profile-avatar yellow-gradient-bg">
                  <UserOutlined style={{ fontSize: 48, color: '#1a1a1a' }} />
                </div>
              </Badge>
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{profile?.fullName}</Title>
              <Text type="secondary">{profile?.title}</Text>
            </div>
            
            <Divider style={{ margin: '24px 0' }} />
            
            <div className="profile-quick-info">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space><EnvironmentOutlined /> <Text>{profile?.location}</Text></Space>
                {profile?.socialLinks?.linkedin && <Space><LinkedinOutlined /> <Text>LinkedIn Connected</Text></Space>}
                {profile?.socialLinks?.github && <Space><GithubOutlined /> <Text>GitHub Connected</Text></Space>}
                <Space><IdcardOutlined /> <Text>Verified Professional</Text></Space>
              </Space>
            </div>

            <Button 
              block 
              type={isEditing ? 'default' : 'primary'} 
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />} 
              style={{ marginTop: 24 }}
              loading={mutation.isPending}
              onClick={() => isEditing ? handleSubmit(onSubmit)() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Refine Profile'}
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card className="profile-main-card shadow-sm">
            {!isEditing ? (
              <div className="profile-details-view">
                <section>
                  <Title level={5}>Professional Summary</Title>
                  <Paragraph>
                    {profile?.bio || 'No professional bio provided.'}
                  </Paragraph>
                </section>
                
                <Divider />
                
                <section>
                  <Space style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ margin: 0 }}>Core Competencies</Title>
                    <Tag color="gold">Verified</Tag>
                  </Space>
                  <div className="skills-tags">
                    {profile?.skills.length ? profile.skills.map(skill => (
                      <Tag key={skill} className="skill-tag">{skill}</Tag>
                    )) : <Text type="secondary">No skills listed.</Text>}
                  </div>
                </section>

                <Divider />

                <section className="profile-status">
                  <Title level={5}>AI Integration Status</Title>
                  {syncStatus?.items.map(item => (
                    <div className="status-item" style={{ marginTop: 8 }} key={item.id}>
                      {item.status === 'SUCCESS' ? 
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} /> :
                        <ThunderboltOutlined style={{ color: '#faad14', marginRight: 8 }} />
                      }
                      <Text>{item.label}: {item.status}</Text>
                    </div>
                  ))}
                </section>
              </div>
            ) : (
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Full Name" validateStatus={errors.fullName ? 'error' : ''}>
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Professional Title" validateStatus={errors.title ? 'error' : ''}>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Professional Bio">
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => <Input.TextArea {...field} rows={6} placeholder="Describe your professional journey..." />}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Location">
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => <Input {...field} prefix={<EnvironmentOutlined />} size="large" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="LinkedIn URL">
                      <Controller
                        name="linkedin"
                        control={control}
                        render={({ field }) => <Input {...field} prefix={<LinkedinOutlined />} size="large" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 24 }}>
                  <Button onClick={() => setIsEditing(false)} size="large">Cancel</Button>
                  <Button type="primary" icon={<SaveOutlined />} size="large" onClick={handleSubmit(onSubmit)} loading={mutation.isPending}>
                    Sync Profile
                  </Button>
                </Space>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
