import "./globals.css"
import { Metadata } from "next";
import LayoutProvider from "@/components/providers/layout-provider";
import { font } from "@/lib/font";

export const metadata: Metadata = {
  title: {
    default: "HomeBook",
    template: "%s | HomeBook"
  },
  description: "",
};

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${font.className} antialiased`}
    >
      <head />
      <body>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  )
}