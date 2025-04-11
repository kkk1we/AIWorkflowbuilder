import './globals.css';
import type { Metadata } from 'next';
import AppSidebar from '@/components/AppSidebar'; // Adjust path as needed

export const metadata: Metadata = {
  title: 'ModularAI Pipeline Builder',
  description: 'Build AI pipelines with reusable modular components',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
