import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import './globals.css'

const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', preferred);
  } catch(e) {}
})();
`

export const metadata: Metadata = {
  title: { default: 'KRISHN — Interactive Lab', template: '%s | Your Name' },
  description: 'Computer Vision, Systems Programming, and Full-Stack Web Development.',
  openGraph: {
    title: 'Krishn Kumar — Interactive Lab',
    description: 'Computer Vision, Systems Programming, and Full-Stack Web Development.',
    url: 'https://yourname.dev',
    siteName: 'KRISHN',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}