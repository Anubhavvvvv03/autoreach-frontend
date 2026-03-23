import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
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
      storeLogin(data.token, { id: '', email: data.email });
      navigate('/dashboard');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="auth-form-container">
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Welcome back</Title>

      {mutation.isError && (
        <Alert
          message={(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.'}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input 
                {...field} 
                prefix={<MailOutlined className="site-form-item-icon" />} 
                placeholder="you@email.com" 
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password 
                {...field} 
                prefix={<LockOutlined className="site-form-item-icon" />} 
                placeholder="••••••••" 
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={mutation.isPending} 
            block 
            size="large"
            style={{ marginTop: 8 }}
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text type="secondary">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Text>
      </div>
    </div>
  );
}
