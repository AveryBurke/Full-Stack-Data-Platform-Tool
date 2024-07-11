import React from "react";
import { createPortal } from "react-dom";

interface SidebarLayoutProps {
	children: React.ReactNode;
}

const sidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
	return (
		<aside id="sidebar" className="p-2 pb-6 h-full w-full bg-[#282a36] overflow-y-scroll">
			<div className="p-2 pb-2 flex justify-center items-center">
                <span className="text-2xl text-white tracking-wide">sidebar</span>
				{/* <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} />
				<button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
					{expanded ? <ChevronFirst /> : <ChevronLast />}
				</button> */}
			</div>
			{children}
		</aside>
	);
};

export default sidebarLayout;
