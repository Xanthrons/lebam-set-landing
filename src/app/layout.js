import { Playfair_Display, Inter, Noto_Sans_Ethiopic } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-ethiopic",
  display: "swap",
});

export const metadata = {
  title: "Lebam Set | ልባም ሴት",
  description:
    "A ministry raising women in the image of the Proverbs 31 woman — rooted in faith, purpose, and virtue.",
};

// Runs before paint — prevents a flash of the wrong theme on load
const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('lebam-theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${notoEthiopic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skipLink">
          Skip to content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <LoadingScreen />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
