import type { Metadata } from "next";
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
    <html lang="en">
      <body className="relative">
        {/* <NavBar/> */}
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
