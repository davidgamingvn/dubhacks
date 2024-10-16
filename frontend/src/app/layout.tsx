import "~/styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { type Metadata } from "next";
import { Afacad } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
export const metadata: Metadata = {
  title: "Scheduler",
  description:
    "AI assisted homework scheduler to help you better manage homeworks",
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
      <UserProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </UserProvider>
    </html>
  );
}
