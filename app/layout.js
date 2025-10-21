import { Inter } from "next/font/google";
import "./css/card.scss";
import "./css/globals.scss";
import ClientProviders from "./ClientProviders"; // 👈 import client component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sakthisaran S - AI Engineer",
  description:
    "This is the portfolio of Sakthisaran S. I am a full stack developer and a self taught developer. I love to learn new things and I am always open to collaborating with others. I am a quick learner and I am always looking for new challenges.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          {children}
        </main>
        <ClientProviders />
      </body>
    </html>
  );
}
