import type { Metadata, Viewport } from 'next';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { ClientProviders } from '@/components/providers/ClientProviders';
import './globals.css';

export const metadata: Metadata = {
  title: '가족 여행 일정',
  description: '2025년 5월 가족 여행 일정 공유',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const theme = createTheme({
  primaryColor: 'blue',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ClientProviders>
            <div className="mx-auto max-w-md min-h-screen bg-white">
              {children}
            </div>
          </ClientProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
