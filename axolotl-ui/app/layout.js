import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YML Editor",
  description: "Ultimate Editor Which Helps you Edit your YML Files with ease!",
};

export default function RootLayout({ children }) {
  return (
		<html lang="en">
			<link
				rel="icon"
				href="./favicon.ico"s
				sizes="any"
			/>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
