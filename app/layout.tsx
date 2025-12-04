import type { Metadata, Viewport } from 'next'
import '../styles/global.css'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'UniPlanner.ai - Portfolio Management',
  description: 'AI-powered university application portfolio management',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#18181b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Toaster position="top-right" theme="dark" richColors />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}

