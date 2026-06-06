import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnonGroups",
  description: "Privacy-focused public group chat.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased transition-colors">
        <script
          dangerouslySetInnerHTML={{
            __html: `;(function(){try{var theme=localStorage.getItem('anon-theme');if(theme==='dark'||(!theme&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){} })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
