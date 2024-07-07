"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsProps {
	paths: string[];
}

const Tabs: React.FC<TabsProps> = ({ paths }) => {
	const pathname = usePathname();

	return (
		<nav className="w-full p-2 mt-1 h-8 flex flex-row gap-2 items-center content-center">
			{paths.map((path, index) => (
				<Link
					key={`${path}-${index}`}
					className={
						" text-slate-100 rounded-t p-1 text-sm border-x-2 border-t-2 border-t-[#abb2bf] border-x-[#abb2bf] -mb-[3px]" +
						(pathname === "/" + path ? " border-b-4 border-b-[#282a36]" : " border-opacity-50  hover:bg-slate-600")
					}
					href={`/${path}`}>
					{path}
				</Link>
			))}
		</nav>
	);
};

export default Tabs;
