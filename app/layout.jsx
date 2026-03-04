import '../styles/globals.css';

export const metadata = {
  title: 'CompetencyFolio v3 — Evidence-Based Professional Portfolio',
  description: 'Map skills to WEF 2030 standards. Build verifiable evidence. Earn digital badges. Designed by Dr. Rohan Jowallah, Educator and AI Consultant.',
  keywords: 'competency portfolio, skills-based hiring, WEF 2030, AI readiness, CARE framework, ACRE framework, digital badges, micro-credentials',
  authors: [{ name: 'Dr. Rohan Jowallah' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CompetencyFolio',
  },
  openGraph: {
    title: 'CompetencyFolio v3',
    description: 'Evidence-Based Professional Portfolio built on WEF 2030 Skills Framework. Designed by Dr. Rohan Jowallah.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#115e59',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CompetencyFolio" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
