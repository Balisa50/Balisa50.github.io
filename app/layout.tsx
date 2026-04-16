import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { ConsoleGreeting } from "@/components/ConsoleGreeting";
import { KonamiEasterEgg } from "@/components/KonamiEasterEgg";
import { FloatingCTA } from "@/components/FloatingCTA";
import { PROFILE } from "@/lib/projects";

const description =
  "ML/AI engineer and data scientist. I build intelligent systems that ship: LLM tooling, applied NLP, and full-stack AI products.";

export const metadata: Metadata = {
  metadataBase: new URL("https://balisa.dev"),
  title: {
    default: `${PROFILE.fullName} · ${PROFILE.title}`,
    template: `%s · ${PROFILE.fullName}`
  },
  description,
  keywords: [
    "Abdoulie Balisa",
    "ML Engineer",
    "AI Engineer",
    "Data Scientist",
    "LLM",
    "TypeScript",
    "Python",
    "Next.js",
    "Portfolio"
  ],
  authors: [{ name: PROFILE.fullName, url: PROFILE.github }],
  creator: PROFILE.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://balisa.dev",
    siteName: `${PROFILE.fullName} · ${PROFILE.title}`,
    title: `${PROFILE.fullName} · ${PROFILE.title}`,
    description
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.fullName} · ${PROFILE.title}`,
    description,
    creator: `@${PROFILE.githubHandle}`
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background font-sans text-text antialiased">
        <SkipLink />
        <ConsoleGreeting />
        {children}
        <FloatingCTA />
        <KonamiEasterEgg />

        {/* Register the service worker (progressive enhancement) */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(){});
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
