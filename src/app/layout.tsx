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
    icon: "/images/speak-app-icon.png",
    apple: "/images/speak-app-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  /** Cream under the iOS status bar; Safari bottom chrome stays system black */
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
