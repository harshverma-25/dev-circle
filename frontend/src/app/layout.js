import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevCircle — Elite Developer Interview Platform",
  description:
    "Practice technical interviews live with peers. Real-time, peer-to-peer mock interview sessions for developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body-md">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
