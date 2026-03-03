import '../styles/globals.css';

export const metadata = {
  title: 'CompetencyFolio v3 — Evidence-Based Professional Portfolio',
  description: 'Built on the WEF 2030 Skills Framework with CARE & ACRE reflection models. Created by Dr. Rohan Jowallah.',
  keywords: 'competency portfolio, skills-based hiring, WEF 2030, AI readiness, CARE framework, ACRE framework, digital badges, micro-credentials',
  authors: [{ name: 'Dr. Rohan Jowallah' }],
  openGraph: {
    title: 'CompetencyFolio v3',
    description: 'Evidence-Based Professional Portfolio built on WEF 2030 Skills Framework',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased">
        {children}
      </body>
    </html>
  );
}
