import React from "react";
import ResizablePane from "./components/resizableWindows/ResizableWindow";
import QueryInput from "./components/QueryInput";
import EditableSQLContainer from "./components/EditableSQLContainer";
import SheetWrapper from "./components/SheetWrapper";

export default function Home() {
	const dev = process.env.NODE_ENV === "development";
	return (
		<div className={`h-screen w-screen flex-grow flex flex-row z-0`}>
			<div className={`h-screen w-screen flex-grow flex flex-col z-1`}>
				<ResizablePane minSize={150} initialSize={300} maxSize={1000} vertical bgColor={"bg-[#282a36]"}>
					<QueryInput />
				</ResizablePane>
				<ResizablePane minSize={150} initialSize={100} grow vertical bgColor={"bg-[#282a36]"} additionalStyles="z-2 border-t-2 border-opacity-50 border-[#abb2bf]">
					<EditableSQLContainer />
				</ResizablePane>
			</div>
			<ResizablePane minSize={150} initialSize={800} maxSize={800} growDirection="left" bgColor={"bg-[#282a36]"}  additionalStyles="border-l-2 border-opacity-50 border-[#abb2bf]" >
				<SheetWrapper />
			</ResizablePane>
		</div>
	);
}
