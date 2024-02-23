import type { Metadata } from "next";
import { NavBar } from '@/components';
import "./globals.css";


export const metadata: Metadata = {
  title: "Exercise Repetition and Posture Tracking",
  description: "Exercise Repetition and Posture Tracking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en">
      <body className="relative h-full">
        <main className="min-h-screen">
          {/*<NavBar />*/}
          {children}
          {/* <Footer.tsx/> */}
        </main>
      </body>
    </html>
  );
}
