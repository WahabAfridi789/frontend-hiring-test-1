import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster"


const avenir = localFont({
  src: [
    {

      path: "../public/fonts/AvenirLTStd-Black.otf",

      weight: "700",
    },
    {
      path: "../public/fonts/AvenirLTStd-Roman.otf",

      weight: "500",
    },
    {
      path: "../public/fonts/AvenirLTStd-Book.otf",
      weight: "400",
    },

  ],
  variable: "--font-avenir",
});

export const metadata: Metadata = {
  title: "Turing Hiring Test",
  description: "This web app is created for the assement test. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${avenir.variable} antialiased font-avenir `}
      >
        <header className=" border-b   shadow-sm  px-8 py-6">

          <Header />
        </header>
        <main className=" py-16 min-h-screen px-16">
          {children}
        </main>
        <Toaster />

      </body>
    </html>
  );
}
