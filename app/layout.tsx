import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "tabulator-tables/dist/css/tabulator.min.css";
import Script from "next/script";
import HydrationBoundary from "./components/HydrationBoundry";
import ToasterProvider from "./providers/ToastProivder";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AACT Data Viz",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<Script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js" strategy="lazyOnload"></Script>
			</head>
			<body className={inter.className}>
				<HydrationBoundary>
					<ToasterProvider />
					{children}
				</HydrationBoundary>
			</body>
		</html>
	);
}
