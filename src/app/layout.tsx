import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Cinematic intro — computer / terminal mono */
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Speak — At-home pet health screening",
  description:
    "Quarterly at-home screening that catches change early — and helps you show up prepared for your vet.",
  icons: {
    icon: [
      { url: "/images/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/speak-app-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/images/speak-app-icon-v2.png", type: "image/png", sizes: "1024x1024" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Speak — At-home pet health screening",
    description:
      "Quarterly at-home screening that catches change early — and helps you show up prepared for your vet.",
    images: [{ url: "/images/speak-app-icon-v2.png", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary",
    images: ["/images/speak-app-icon-v2.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Speak",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  /** Match canvas so iOS doesn't paint a black status strip */
  themeColor: "#f5f0e8",
  /** Prefer resizing the layout when Safari chrome / keyboard shows */
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cream">
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
