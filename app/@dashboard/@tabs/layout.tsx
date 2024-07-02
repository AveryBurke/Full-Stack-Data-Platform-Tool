"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({params, children }: { params:any, children: React.ReactNode }) {
	const pathname = usePathname();
	console.log("pathname", pathname);
	console.log("tabs")
	return (
		<>
			<nav className="w-full p-2 mt-1 h-8 flex flex-row gap-2 items-center content-center">
				<Link
					className=" text-slate-100 hover:bg-slate-600 rounded-t p-1 text-sm border-opacity-50 border-x-2 border-t-2 border-t-[#abb2bf] border-x-[#abb2bf] -mb-[3px]"
					href="/spreadsheet">
					spreadsheet
				</Link>
				<Link
					id="pizza_tab"
					className=" text-slate-100 hover:bg-slate-600 rounded-t p-1 text-sm border-opacity-50 border-x-2 border-t-2 border-t-[#abb2bf] border-x-[#abb2bf] -mb-[3px]"
					href="/pizza">
					pizza	
				</Link>
			</nav>
			<div className="h-full flex flex-col justify-center">{children}</div>
		</>
	);
}
