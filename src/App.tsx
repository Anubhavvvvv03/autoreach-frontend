import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp } from 'antd';
import Router from './Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ffcc00', // Yellow/Gold
            colorInfo: '#ffcc00',
            borderRadius: 6,
            colorBgBase: '#ffffff', // White background
          },
          components: {
            Button: {
              colorPrimary: '#ffcc00',
              colorPrimaryHover: '#ffd633',
              colorPrimaryActive: '#e6b800',
              colorTextLightSolid: '#000000', // Black text on yellow buttons
            },
            Layout: {
              colorBgHeader: '#ffffff',
              colorBgBody: '#f5f5f5',
            },
          },
        }}
      >
        <AntApp>
          <Router />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
