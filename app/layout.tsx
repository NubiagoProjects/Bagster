import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bagster - Smart Cargo Marketplace for Africa',
  description: 'Connect with reliable carriers across Africa. Get better pricing, faster delivery, and real-time tracking through our intelligent matching engine.',
  keywords: 'cargo, logistics, Africa, shipping, carriers, marketplace, tracking, delivery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  )
} 