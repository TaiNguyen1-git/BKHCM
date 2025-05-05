import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { RoomProvider } from "./context/RoomContext";
import { BookingProvider } from "./context/BookingContext";
import { DeviceProvider } from "./context/DeviceContext";
import { ReportProvider } from "./context/ReportContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SettingsProvider } from "./context/SettingsContext";
import ThemeSettingsSync from "./components/ThemeSettingsSync";
import LanguageSettingsSync from "./components/LanguageSettingsSync";
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
          <AuthProvider>
            <UserProvider>
              <RoomProvider>
                <BookingProvider>
                  <DeviceProvider>
                    <ReportProvider>
                      <FeedbackProvider>
                        <NotificationProvider>
                          <SettingsProvider>
                            <ThemeSettingsSync />
                            <LanguageSettingsSync />
                            {children}
                          </SettingsProvider>
                        </NotificationProvider>
                      </FeedbackProvider>
                    </ReportProvider>
                  </DeviceProvider>
                </BookingProvider>
              </RoomProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
