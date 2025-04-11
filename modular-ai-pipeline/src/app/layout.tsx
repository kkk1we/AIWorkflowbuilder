import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ModularAI Pipeline Builder',
  description: 'Build AI pipelines with reusable modular components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}