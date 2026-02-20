import { ClientProviders } from "@/components/providers/ClientProviders";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "김씨 부산댁 제주도 여행 🍊",
  description:
    "2026년 5월, 김씨 부산댁가 제주도로 떠납니다! 한라산보다 높은 우리 가족 텐션, 흑돼지보다 맛있는 우리 추억 🐷",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "김씨 부산댁 여행",
  },
  openGraph: {
    title: "김씨 부산댁 제주도 여행 🍊",
    description:
      "한라산보다 높은 텐션, 흑돼지보다 맛있는 추억! 5월 22일~25일, 김씨 부산댁 제주 정복기 🌴",
    type: "website",
    locale: "ko_KR",
    siteName: "김씨 부산댁 여행 일정표",
  },
  twitter: {
    card: "summary",
    title: "김씨 부산댁 제주도 여행 🍊",
    description:
      "한라산보다 높은 텐션, 흑돼지보다 맛있는 추억! 5월 22일~25일, 김씨 부산댁 제주 정복기 🌴",
  },
  keywords: ["가족여행", "제주도", "김씨 부산댁", "여행일정"],
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
