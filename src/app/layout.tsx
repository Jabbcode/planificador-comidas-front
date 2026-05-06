import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import AppShell from '@/components/layout/AppShell'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NutriPlan',
  description: 'Planificador de comidas semanal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="h-full bg-background text-on-surface">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
