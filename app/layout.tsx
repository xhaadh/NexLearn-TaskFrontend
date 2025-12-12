import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NexLearn",
  description: "NexLearn frontend test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-[#e9f1f4]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
