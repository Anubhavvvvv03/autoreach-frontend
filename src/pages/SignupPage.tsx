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
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_16px_rgba(255,215,0,0.25)] bg-gradient-to-br from-[#FFD700] to-[#EAB308]">
          <ThunderboltOutlined className="text-[28px] text-[#1a1a1a]" />
        </div>
        <Title level={3} className="!mb-1">Join AutoReach AI</Title>
        <Text type="secondary" className="text-sm">Start Your Strategic Outreach Journey Today</Text>
      </div>

      {mutation.isError && (
        <Alert
          message={(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Signup failed. Please try again.'}
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
          className="!mb-4"
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

        <Form.Item
          label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirm Password</span>}
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
          className="!mb-6"
        >
          <Controller
            name="confirmPassword"
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
            {mutation.isPending ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-6">
        <Text type="secondary" className="text-sm">
          Already have an account? <Link to="/login" className="text-black font-semibold underline decoration-[#FFD700] decoration-2 underline-offset-4 hover:text-[#EAB308]">Sign in</Link>
        </Text>
      </div>
    </div>
  );
}
