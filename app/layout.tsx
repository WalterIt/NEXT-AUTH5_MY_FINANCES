import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
// import { SessionProvider } from "next-auth/react";
import {
  ClerkProvider,
} from '@clerk/nextjs'
// import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";

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
  // const session = await auth()

  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <SheetProvider />
          <Toaster />
          
          {children}
        </QueryProvider>
      </body>
    </html>
    </ClerkProvider>
  
  );
}
