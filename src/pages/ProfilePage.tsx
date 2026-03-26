import { Typography, Button, Form, Input, Card, Space, Divider, message, Row, Col, Tag, Badge, Skeleton } from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  SaveOutlined, 
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

  if (isLoading) return <Skeleton active className="p-12" />;

  return (
    <div className="pb-10">
      <div className="mb-8">
        <Space direction="vertical" size={0}>
          <Title level={2} className="!mb-1">Strategic Professional Profile</Title>
          <Paragraph type="secondary" className="!mb-0">
            Manage your professional identity and skills to optimize AI-driven outreach performance.
          </Paragraph>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="!rounded-2xl !border-[#e5e4e7] !shadow-sm text-center p-8 bg-white overflow-hidden">
            <div className="flex flex-col items-center">
              <Badge count={<ThunderboltOutlined className="text-[#FFD700] text-sm" />} offset={[-10, 10]}>
                <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(255,215,0,0.25)] bg-gradient-to-br from-[#FFD700] to-[#EAB308]">
                  <UserOutlined className="text-[48px] text-[#1a1a1a]" />
                </div>
              </Badge>
              <Title level={4} className="!mt-4 !mb-1">{profile?.fullName}</Title>
              <Text type="secondary" className="text-sm font-medium">{profile?.title}</Text>
            </div>
            
            <Divider className="!my-6 !border-black/5" />
            
            <div className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <EnvironmentOutlined className="text-[#FFD700] text-base" />
                <Text className="text-sm">{profile?.location || 'Remote'}</Text>
              </div>
              {profile?.socialLinks?.linkedin && (
                <div className="flex items-center gap-3">
                  <LinkedinOutlined className="text-[#0077b5] text-base" />
                  <Text className="text-sm">LinkedIn Connected</Text>
                </div>
              )}
              {profile?.socialLinks?.github && (
                <div className="flex items-center gap-3">
                  <GithubOutlined className="text-black text-base" />
                  <Text className="text-sm">GitHub Connected</Text>
                </div>
              )}
              <div className="flex items-center gap-3">
                <IdcardOutlined className="text-[#FFD700] text-base" />
                <Text className="text-sm">Verified Professional</Text>
              </div>
            </div>

            <Button 
              block 
              type={isEditing ? 'default' : 'primary'} 
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />} 
              size="large"
              className={`!mt-8 !rounded-lg !font-bold ${!isEditing ? '!bg-[#FFD700] !text-black !border-none' : ''}`}
              loading={mutation.isPending}
              onClick={() => isEditing ? handleSubmit(onSubmit)() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Refine Profile'}
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card className="!rounded-2xl !border-[#e5e4e7] !shadow-sm min-h-[500px] bg-white">
            {!isEditing ? (
              <div className="space-y-8">
                <section>
                  <Title level={5} className="!mb-4">Professional Summary</Title>
                  <Paragraph className="text-gray-600 leading-relaxed">
                    {profile?.bio || 'No professional bio provided.'}
                  </Paragraph>
                </section>
                
                <Divider className="!border-black/5" />
                
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Title level={5} className="!mb-0 underline decoration-[#FFD700] decoration-2 underline-offset-4">Core Competencies</Title>
                    <Tag color="gold" className="!rounded-full px-3 text-[10px] font-bold uppercase">Verified</Tag>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills.length ? profile.skills.map(skill => (
                      <Tag key={skill} className="!bg-[#f8f9fa] !border-[#e5e4e7] !rounded-lg !px-4 !py-1.5 !m-0 !text-[#1a1a1a] !text-sm hover:!border-[#FFD700] hover:!bg-white transition-colors cursor-default">
                        {skill}
                      </Tag>
                    )) : <Text type="secondary">No skills listed.</Text>}
                  </div>
                </section>

                <Divider className="!border-black/5" />

                <section>
                  <Title level={5} className="!mb-4">AI Integration Status</Title>
                  <div className="space-y-3">
                    {syncStatus?.items.map(item => (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 bg-gray-50/30" key={item.id}>
                        {item.status === 'SUCCESS' ? 
                          <CheckCircleOutlined className="text-[#52c41a] text-lg" /> :
                          <ThunderboltOutlined className="text-[#faad14] text-lg" />
                        }
                        <div className="flex flex-col">
                          <Text className="text-sm font-semibold">{item.label}</Text>
                          <Text type="secondary" className="text-[11px] uppercase tracking-wide">{item.status}</Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <Form layout="vertical" className="space-y-6">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</span>} validateStatus={errors.fullName ? 'error' : ''} className="!mb-0">
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" className="!rounded-lg" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Professional Title</span>} validateStatus={errors.title ? 'error' : ''} className="!mb-0">
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" className="!rounded-lg" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Professional Bio</span>} className="!mb-0">
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => <Input.TextArea {...field} rows={6} className="!rounded-lg" placeholder="Describe your professional journey..." />}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Location</span>} className="!mb-0">
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => <Input {...field} prefix={<EnvironmentOutlined className="text-gray-400" />} size="large" className="!rounded-lg" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={<span className="text-xs font-bold uppercase tracking-wider text-gray-500">LinkedIn URL</span>} className="!mb-0">
                      <Controller
                        name="linkedin"
                        control={control}
                        render={({ field }) => <Input {...field} prefix={<LinkedinOutlined className="text-[#0077b5]" />} size="large" className="!rounded-lg" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-end gap-3 pt-6 border-t border-black/5">
                  <Button onClick={() => setIsEditing(false)} size="large" className="!rounded-lg min-w-[120px]">Cancel</Button>
                  <Button type="primary" icon={<SaveOutlined />} size="large" onClick={handleSubmit(onSubmit)} loading={mutation.isPending} className="!bg-[#FFD700] !text-black !border-none !rounded-lg !font-bold min-w-[120px] hover:!bg-[#EAB308]">
                    Sync Profile
                  </Button>
                </div>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
