import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanvei Villas — Premium Villas in Dar es Salaam",
  description:
    "Book luxury furnished villas in Tabata Kinyerezi, Dar es Salaam, Tanzania. Direct booking, no middlemen.",
  metadataBase: new URL("https://vanveivillas.com"),
  openGraph: {
    title: "Vanvei Villas — Premium Villas in Dar es Salaam",
    description:
      "Luxury furnished villas in Tabata Kinyerezi, Dar es Salaam. Fully equipped, full AC, free WiFi & parking. Book directly — no middlemen.",
    url: "https://vanveivillas.com",
    siteName: "Vanvei Villas",
    images: [
      {
        url: "/images/apartments/vv-09.jpg",
        width: 1200,
        height: 800,
        alt: "Vanvei Villas — Premium Villas in Dar es Salaam",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanvei Villas — Premium Villas in Dar es Salaam",
    description:
      "Luxury furnished villas in Tabata Kinyerezi, Dar es Salaam. Direct booking, no middlemen.",
    images: ["/images/apartments/vv-09.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>
          {children}
          <WhatsAppFloat />
        </ToastProvider>
      </body>
    </html>
  );
}
