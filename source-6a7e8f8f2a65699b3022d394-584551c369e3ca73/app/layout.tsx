import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BlzzyVibe — the vibe lives here",
  description:
    "A late-night community forum for dropping clips, sparking debates, and vibing over shared links.",
};

export const viewport: Viewport = {
  themeColor: "#08070c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#b57bff",
          colorBackground: "#100e18",
          colorForeground: "#eeeaf5",
          colorInput: "#17141f",
          colorInputForeground: "#eeeaf5",
          borderRadius: "0.9rem",
        },
      }}
    >
      <html
        lang="en"
        className={`${spaceGrotesk.variable} ${jakarta.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <div className="noise-overlay" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
