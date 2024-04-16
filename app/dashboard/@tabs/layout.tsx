import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<nav className="w-full p-2 mt-1 h-8 flex flex-row gap-2 items-center content-center">
				<Link
					className=" text-slate-100 hover:bg-slate-600 rounded-t p-1 text-sm border-opacity-50 border-x-2 border-t-2 border-t-[#abb2bf] border-x-[#abb2bf]"
					href="/dashboard/spreadsheet">
					spreadsheet
				</Link>
				<Link
					className=" text-slate-100 hover:bg-slate-600 rounded-t p-1 text-sm border-opacity-50 border-x-2 border-t-2 border-t-[#abb2bf] border-x-[#abb2bf]"
					href="/dashboard/pizza">
					pizza
				</Link>
			</nav>
			<div>{children}</div>
		</>
	);
}
