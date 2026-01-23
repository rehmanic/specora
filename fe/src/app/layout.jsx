import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Specora",
  description: "AI-powered requirements engineering platform. Collaborate, communicate, and create better software specifications.",
  icons: {
    icon: "/specora_favicon_circle.svg",
  },
  keywords: ["requirements engineering", "AI", "collaboration", "software development"],
  authors: [{ name: "Specora Team" }],
  openGraph: {
    title: "Specora",
    description: "AI-powered requirements engineering platform",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
        <Toaster
          richColors
          closeButton
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
