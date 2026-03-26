import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      storeLogin(data.token, data.user);
      navigate('/dashboard');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_16px_rgba(255,215,0,0.25)] bg-gradient-to-br from-[#FFD700] to-[#EAB308]">
          <ThunderboltOutlined className="text-[28px] text-[#1a1a1a]" />
        </div>
        <Title level={3} className="!mb-1">Sign In to AutoReach</Title>
        <Text type="secondary" className="text-sm">AI-powered outreach, built for you.</Text>
      </div>

      {mutation.isError && (
        <Alert
          message={(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.'}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-4">
        <Form.Item
          label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</span>}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
          className="!mb-4"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input 
                {...field} 
                prefix={<MailOutlined className="text-gray-400 mr-2" />} 
                placeholder="you@email.com" 
                size="large"
                className="!rounded-lg hover:!border-[#FFD700] focus:!border-[#FFD700] focus:!shadow-[0_0_0_2px_rgba(255,215,0,0.1)]"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</span>}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
          className="!mb-6"
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password 
                {...field} 
                prefix={<LockOutlined className="text-gray-400 mr-2" />} 
                placeholder="••••••••" 
                size="large"
                className="!rounded-lg hover:!border-[#FFD700] focus:!border-[#FFD700] focus:!shadow-[0_0_0_2px_rgba(255,215,0,0.1)]"
              />
            )}
          />
        </Form.Item>

        <Form.Item className="!mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={mutation.isPending} 
            block 
            size="large"
            className="!bg-[#FFD700] !text-black !font-bold !rounded-lg !h-12 hover:!bg-[#EAB308] border-none shadow-md"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-6">
        <Text type="secondary" className="text-sm">
          Don't have an account? <Link to="/signup" className="text-black font-semibold underline decoration-[#FFD700] decoration-2 underline-offset-4 hover:text-[#EAB308]">Sign up</Link>
        </Text>
      </div>
    </div>
  );
}
