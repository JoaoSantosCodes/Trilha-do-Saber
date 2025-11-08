import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import Script from 'next/script'

const lexend = Lexend({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'optional',
})

export const metadata: Metadata = {
  title: 'Trilha do Saber - App de Reforço Escolar',
  description: 'Aplicativo de reforço escolar interativo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${lexend.variable} font-display`} suppressHydrationWarning>
        <Script
          id="remove-extension-attributes"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                const removeExtensionAttributes = () => {
                  try {
                    const removeAttributes = (element) => {
                      if (element && element.hasAttribute && element.hasAttribute('bis_skin_checked')) {
                        element.removeAttribute('bis_skin_checked');
                      }
                    };
                    
                    if (document.documentElement) removeAttributes(document.documentElement);
                    if (document.body) removeAttributes(document.body);
                    
                    const allElements = document.querySelectorAll('*');
                    allElements.forEach((el) => {
                      if (el instanceof HTMLElement) {
                        removeAttributes(el);
                      }
                    });
                  } catch (e) {
                    // Silently ignore errors
                  }
                };
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
                } else {
                  removeExtensionAttributes();
                }
                
                setTimeout(removeExtensionAttributes, 100);
                setTimeout(removeExtensionAttributes, 500);
              })();
            `,
          }}
        />
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

