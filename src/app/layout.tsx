import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Menu from "@/components/Menu";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Email - System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="invisible-scrollbar">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <div className="flex flex-col min-h-screen">
          <div className="z-10">
            <Menu />
          </div>
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
