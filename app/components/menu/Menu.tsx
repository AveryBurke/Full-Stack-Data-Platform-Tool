"use client";
import React, { ReactNode, useState } from "react";
import { useOutsideClick } from "@/app/hooks/useClickOutside";

interface MenuProps {
	children: ReactNode;
	title: string;
}

const Menu: React.FC<MenuProps> = ({ children }) => {
	const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    }

	const ref = useOutsideClick(() => {
		setOpen(false);
	});

	return (
		<>
			<div onClick={handleClick} className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">Settings</div>
			{open && <div ref={ref}
					className="
							z-50
                            absolute 
                            rounded 
                            shadow-md
                            md:w-3/4 
							lg:w-auto
                            bg-white 
                            overflow-hidden
                            text-sm
							">
					<div className="flex flex-col flex-grow cursor-pointer text-sm">{children}</div></div>}
		</>
	);
};

export default Menu;
