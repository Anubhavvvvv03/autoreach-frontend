import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signup } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      storeLogin(data.token, data.user);
      navigate('/dashboard');
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    mutation.mutate({ email: data.email, password: data.password, fullName: (data as any).fullName || 'New User' });
  };

  return (
    <div className="auth-form-container">
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="auth-logo yellow-gradient-bg" style={{ 
          width: 56, height: 56, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 16px var(--accent-glow)' 
        }}>
          <ThunderboltOutlined style={{ fontSize: 28, color: '#1a1a1a' }} />
        </div>
        <Title level={3}>Join AutoReach AI</Title>
        <Text type="secondary">Start Your Strategic Outreach Journey Today</Text>
      </div>

      {mutation.isError && (
        <Alert
          message={(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Signup failed. Please try again.'}
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

        <Form.Item
          label="Confirm Password"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
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
            {mutation.isPending ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text type="secondary">
          Already have an account? <Link to="/login">Sign in</Link>
        </Text>
      </div>
    </div>
  );
}
