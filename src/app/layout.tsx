import { ClientProviders } from "@/components/providers/ClientProviders";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "가족 여행 일정",
  description: "2026년 5월 가족 여행 일정 공유",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "여행일정",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1b1e" },
  ],
};

const theme = createTheme({
  primaryColor: "blue",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ClientProviders>
            <div className="mx-auto max-w-md min-h-screen">{children}</div>
          </ClientProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
