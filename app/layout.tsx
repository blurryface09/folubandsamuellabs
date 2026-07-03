import type { Metadata } from "next";
import { Exo_2, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800","900"],
});
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["300","400","500","700"],
});

export const metadata: Metadata = {
  title: "Folub & Samuel Labs | Technology & Cybersecurity",
  description: "FSLabs — software development, cybersecurity, and digital solutions from Lagos, Nigeria. RC No. 9637480.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${exo2.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#050505] text-[#F5F0E8] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
