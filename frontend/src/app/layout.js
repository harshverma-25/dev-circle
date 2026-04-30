import { Inter, Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: "DevCircle — Elite Developer Interview Platform",
    template: "%s | DevCircle",
  },
  description:
    "Practice technical interviews live with peers. Real-time, peer-to-peer mock interview sessions for developers. Join 500+ developers mastering their interview skills.",
  keywords: [
    "interview practice",
    "technical interviews",
    "coding interview",
    "peer to peer learning",
    "developer community",
    "mock interviews",
    "FAANG preparation",
  ],
  authors: [{ name: "DevCircle", url: "https://devcircle.com" }],
  creator: "DevCircle",
  publisher: "DevCircle",
  metadataBase: new URL("https://devcircle.com"),
  openGraph: {
    title: "DevCircle — Master Technical Interviews Together",
    description:
      "Practice technical interviews live with peers. Real-time, peer-to-peer mock interview sessions for developers.",
    url: "https://devcircle.com",
    siteName: "DevCircle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevCircle Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevCircle — Master Technical Interviews Together",
    description:
      "Practice technical interviews live with peers. Real-time, peer-to-peer mock interview sessions for developers.",
    images: ["/og-image.png"],
    creator: "@devcircle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${outfit.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="color-scheme" content="dark" />
        
        {/* Viewport settings */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-full flex flex-col bg-gradient-to-br from-[#0a0a0f] via-[#0b0b0f] to-black text-white text-base font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}