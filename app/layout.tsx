import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });



// const poppin = Poppins({ subsets: ["latin"], weight: ["300","400", "700"] });

export const metadata: Metadata = {
  title: "My Finance App",
  description: "Created By Valto Silva",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body className={inter.className}>
          <Toaster />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
    </SessionProvider>
  
  );
}
