"use client";
import React, { useState } from "react";
import useAccordion from "../hooks/useAccordion";

interface AccordionProps {
	title: string;
	children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
	const accordion = useAccordion();
	return (
		<div className="py-2 transition-all duration-300 ease-in-out text-slate-500 text-sm">
			<button onClick={() => (accordion.isOpen ? accordion.onClose() : accordion.onOpen())} className="flex w-full">
				<span>{title}</span>
				<svg className="fill-slate-500 shrink-0 ml-8" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
					<rect y="7" width="16" height="2" rx="1" className={`transform origin-center transition duration-200 ease-out ${accordion.isOpen && "!rotate-180"}`} />
					<rect y="7" width="16" height="2" rx="1" className={`transform origin-center rotate-90 transition duration-200 ease-out ${accordion.isOpen && "!rotate-180"}`} />
				</svg>
			</button>
			{/* <div className={`overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm ${accordion.isOpen ? "h-full" : "h-0"}`}> */}
				{/* <div className="text">{children}</div> */}
			{/* </div> */}
            {children}
		</div>
	);
};

export default Accordion;
