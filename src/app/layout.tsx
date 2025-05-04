import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Smart Study Space Management | HCMUT",
  description: "Hệ thống quản lý không gian học tập thông minh và đặt phòng tự động cho sinh viên HCMUT",
  keywords: "study space, hcmut, bách khoa, đặt phòng, học tập, smart classroom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/hcmut.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${roboto.variable} font-sans antialiased bg-gray-100`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
