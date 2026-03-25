import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import Router from './Router';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#FFD700', // Premium Golden Yellow
            colorInfo: '#FFD700',
            borderRadius: 8,
            colorBgBase: '#ffffff',
            colorLink: '#DAA520', // GoldenRod for links
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          },
          components: {
            Button: {
              colorPrimary: '#FFD700',
              colorPrimaryHover: '#FFC400',
              colorPrimaryActive: '#E6B000',
              colorTextLightSolid: '#1a1a1a', // Dark text on yellow buttons
              borderRadius: 6,
              controlHeightLG: 48,
            },
            Layout: {
              colorBgHeader: '#ffffff',
              colorBgBody: '#fcfcfc',
              colorBgTrigger: '#1a1a1a',
            },
            Menu: {
              colorItemBgSelected: 'rgba(255, 255, 255, 0.4)',
              colorItemTextSelected: '#000000',
              colorItemText: '#1a1a1a',
            },
            Card: {
              borderRadiusLG: 12,
              colorBorderSecondary: '#f0f0f0',
            },
            Input: {
              activeBorderColor: '#FFD700',
              hoverBorderColor: '#FFD700',
            },
          },
        }}
      >
        <AntApp>
          {isLoading ? (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Router />
          )}
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
