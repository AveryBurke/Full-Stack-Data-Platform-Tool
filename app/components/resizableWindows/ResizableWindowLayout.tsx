"use client";
import React from "react";
import ResizablePane from "./ResizableWindow";

interface ResizableWindowLayoutProps {
	direction: "vertical" | "horizontal";
}
const ResizableWindowLayout: React.FC<ResizableWindowLayoutProps> = () => {

	return (
		<div className={`h-screen w-screen flex-grow flex flex-row`}>
			<div className={`h-screen w-screen flex-grow flex flex-col`}>
				<ResizablePane minSize={0} initialSize={200} maxSize={600} vertical bgColor={"bg-red-400"}>
					<div className="@lg:underline">Red Child</div>
				</ResizablePane>
				<ResizablePane minSize={0} initialSize={200} grow vertical bgColor={"bg-yellow-400"}>
					<div className="@lg:underline">Yellow Child</div>
				</ResizablePane>
			</div>
			<ResizablePane minSize={150} initialSize={1600} maxSize={800} growDirection="left" bgColor={"bg-green-400"}>
				<div className="@lg:underline">Green Child</div>
			</ResizablePane>
		</div>
	);
};

export default ResizableWindowLayout;
