import type { Metadata } from "next";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  title: "AuraMart Admin Panel",
  description: "Supercharged commerce OS admin console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <MainLayout>{children}</MainLayout>
        </AdminProvider>
      </body>
    </html>
  );
}
