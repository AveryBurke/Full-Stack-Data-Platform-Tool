import Tabs from "@/app/components/Tabs";

export default function Layout({params, children }: { params:any, children: React.ReactNode }) {
	return (
		<>
			<Tabs paths={["spreadsheet", "pizza"]} />
			<div className="h-full flex flex-col justify-center border-t-2 border-t-[#abb2bf]">{children}</div>
		</>
	);
}
