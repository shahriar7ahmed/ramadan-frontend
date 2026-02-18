import { Inter, Noto_Sans_Bengali, Amiri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata = {
  title: "Ramadan Companion — Prayer Times, Iftar, Suhur & Quran",
  description:
    "Your complete Ramadan companion. Accurate prayer times, Iftar & Suhur schedules for any location, Quran surahs with Arabic text, Bangla & English translations, and audio recitation.",
  keywords: [
    "Ramadan",
    "Prayer Times",
    "Namaz",
    "Iftar",
    "Suhur",
    "Quran",
    "Surah",
    "Islamic",
    "রমজান",
    "ইফতার",
    "সেহরি",
    "নামাজ",
  ],
  openGraph: {
    title: "Ramadan Companion — Prayer Times, Iftar, Suhur & Quran",
    description:
      "Accurate prayer times, Iftar & Suhur schedules, and Quran with translations & audio.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoBengali.variable} ${amiri.variable}`}
        style={{ fontFamily: "var(--font-primary)" }}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
