import React, { memo } from "react";

interface TooltipProps {
	children: React.ReactNode;
	text: string;
	backgroundColor?: string;
	textColor?: string;
}

const Tooltip: React.FC<TooltipProps> = memo(({ text, children, backgroundColor, textColor }) => {
	return (
		<span className="group relative">
			<span
				className={`text-sm rounded-sm pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounde bg-${backgroundColor || "neutral-800"} px-2 py-1 text-${
					textColor || "white"
				} opacity-0 before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:content-[''] transition-opacity duration-300 group-hover:opacity-100`}>
				{text}
			</span>
			{children}
		</span>
	);
});

export default Tooltip;
