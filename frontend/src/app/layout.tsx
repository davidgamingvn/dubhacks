import "~/styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { type Metadata } from "next";
import { Afacad } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${afacad.className}`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UserProvider>
          <ThemeProvider>
            <body>{children}</body>
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </ThemeProvider>
    </html>
  );
}
