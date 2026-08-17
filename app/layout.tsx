import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { PROFILE } from "@/lib/projects";

// Display face. A serif carries the editorial register the layout is going
// for, and Newsreader holds up at large sizes without the fussiness Playfair
// (what the generator suggested) brings to a screen. Body stays on Geist Sans:
// a display serif at paragraph length is a readability problem, not a style.
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const description =
  "AI Systems Developer and Data Science student building intelligent systems that ship: LLM tooling, applied NLP, RAG pipelines, and full-stack AI products.";

export const metadata: Metadata = {
  metadataBase: new URL("https://balisa.dev"),
  title: {
    default: `${PROFILE.fullName} · ${PROFILE.title}`,
    template: `%s · ${PROFILE.fullName}`
  },
  description,
  keywords: [
    "Abdoulie Balisa",
    "AI Systems Developer",
    "Data Science Student",
    "Aspiring Actuary",
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
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}>
      <body className="bg-background font-sans text-text antialiased">
        {/* The animated background, scanline sweep, warp navigation, console
            easter egg and floating CTA were removed rather than restyled.
            None of them carried information, they competed with the work for
            attention, and they cost a Three.js bundle on first paint. */}
        <SkipLink />
        {children}

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
