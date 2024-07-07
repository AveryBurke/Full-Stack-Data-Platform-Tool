import React from "react";
import ResizablePane from "@/app/components/resizableWindows/ResizableWindow";
import Navbar from "../components/Navbar";

interface LayoutProps {
	children: React.ReactNode;
	codeEditor: React.ReactNode;
	sidebar: React.ReactNode;
	tabs: React.ReactNode;
	input: React.ReactNode;
}


const layout: React.FC<LayoutProps> = ({ children, codeEditor, sidebar, tabs, input }) => {
	return (
		<div id="parent" className="max-h-screen min-h-screen h-full flex flex-col overflow-auto">
			<Navbar title="Data Viz" backgroundColor="bg-[#282a36]" />
			<div id="resizable_container" className={`realtive flex flex-row flex-grow bg-[#282a36] overflow-clip border-t-2 border-opacity-50 border-[#abb2bf]`}>
				<ResizablePane
					minSize={0}
					initialSize={200}
					maxSize={200}
					collapseWidth={150}
					growDirection="right"
					bgColor={"bg-[#282a36]"}
					additionalStyles="border-r-2 border-opacity-50 border-[#abb2bf]">
					{sidebar}
				</ResizablePane>
				<div className={`flex flex-col flex-grow`}>
					<ResizablePane minSize={0} initialSize={200} maxSize={1000} vertical bgColor={"bg-[#282a36]"} collapseHeight={150} collapseWidth={200}>
						{input}
					</ResizablePane>
					<ResizablePane
						collapseWidth={200}
						minSize={0}
						initialSize={200}
						grow
						vertical
						bgColor={"bg-[#282a36]"}
						additionalStyles="z-10 border-t-2 border-opacity-50 border-[#abb2bf]">
						{codeEditor}
					</ResizablePane>
				</div>
				<ResizablePane
					minSize={150}
					initialSize={800}
					maxSize={1280}
					growDirection="left"
					bgColor={"bg-[#282a36]"}
					additionalStyles="z-0 border-l-2 border-opacity-50 border-[#abb2bf]">
					{tabs}
				</ResizablePane>
			</div>
		</div>
	);
};

export default layout;
