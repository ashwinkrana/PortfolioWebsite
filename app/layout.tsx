import type { Metadata, Viewport } from "next";
import MotionPreferences from "@/components/MotionPreferences";
import SmoothScroll from "@/components/SmoothScroll";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const title = "Ashwin Kumar | Full-stack Developer";
const description =
  "Computer science undergrad who builds full-stack products and then actually keeps them running. Looking for a software engineering internship, summer 2027.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s · Ashwin Kumar" },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", locale: "en_US", url: "/" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#cdeaf0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <MotionPreferences>
          <SmoothScroll />
          {children}
        </MotionPreferences>
      </body>
    </html>
  );
}
