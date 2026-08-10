import type { Metadata } from "next";
import "./globals.css";
import { VendorProvider } from "@/context/VendorContext";

export const metadata: Metadata = {
  title: "AuraMart Vendor Panel",
  description: "Manage your AuraMart and Flado store listings, fulfill orders, track payouts, and grow your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <VendorProvider>
          {children}
        </VendorProvider>
      </body>
    </html>
  );
}

