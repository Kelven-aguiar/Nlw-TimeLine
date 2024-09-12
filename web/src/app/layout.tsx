import type { Metadata } from "next";
import {
	Roboto_Flex as Roboto,
	Bai_Jamjuree as BaiJamjuree,
} from "next/font/google";
import "./globals.css";
import Profile from "@/components/Profile";
import Signin from "@/components/Signin";
import Hero from "@/components/Hero";
import Copyright from "@/components/Copyright";

import { cookies } from "next/headers";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const baiJamjuree = BaiJamjuree({
	subsets: ["latin"],
	weight: "700",
	variable: "--font-bai-jamjuree",
});

export const metadata: Metadata = {
	title: "NLW Linha do tempo",
	description:
		"Uma cápsula do tempo construída com React, Next.js, TailwindCSS e TypeScript",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isAuthenticated = cookies().has("token");
	return (
		<html lang="en">
			<body
				className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-900 font-sans text-gray-100`}
			>
				<main className="grid grid-cols-2 min-h-screen">
					{/* Left */}
					<div className="relative flex flex-col items-start justify-between overflow-hidden px-28 py-16 border-white/10 border-r bg-[url(../assets/bg-stars.svg)] bg-cover">
						{/* Blur */}
						<div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 bg-purple-700 opacity-50 blur-full rounded-full" />
						{/* Strips */}
						<div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes  " />
						{isAuthenticated ? <Profile /> : <Signin />}
						<Hero />
						<Copyright />
					</div>

					{/* Right */}
					<div className="flex overflow-y-scroll m-h-screen flex-col bg-[url(../assets/bg-stars.svg)] bg-cover ">
						{children}
					</div>
				</main>
			</body>
		</html>
	);
}
