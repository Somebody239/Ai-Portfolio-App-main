import type { Metadata, Viewport } from 'next'
import '../styles/global.css'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Path2Uni',
  description: 'AI-powered university application portfolio management',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
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

