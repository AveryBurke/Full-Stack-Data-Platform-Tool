"use client";
import React, { ReactNode, useState } from "react";
import { useOutsideClick } from "@/app/hooks/useClickOutside";
import { set } from "date-fns";

interface MenuProps {
	children: ReactNode;
	title: string;
	close?: boolean;
}

const Menu: React.FC<MenuProps> = ({ children, title, close }) => {
	const [open, setOpen] = useState(false);
	const [opacity, setOpacity] = useState<"0" | "100">("0");

	const openMenu = () => {
		// start with the menu hidden
		setOpacity("0");
		// render the menu
		setOpen(true);
		// fade in the menu
		setOpacity("100");
	};

	const closeMenu = () => {
		// fade out the menu
		setOpacity("0");
		// close the menu
		setTimeout(() => {
			setOpen(false);
		}, 200);
	}

    const handleClick = () => {
		if (open) closeMenu();
		else openMenu();
    }

	const ref = useOutsideClick(() => {
		closeMenu();
	});

	return (
		<>
			<div onClick={handleClick} className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">{title}</div>
			{open && !close && <div ref={ref}
					className={`
							z-50
                            absolute 
                            rounded 
                            shadow-md
                            md:w-3/4 
							lg:w-auto
                            bg-white 
                            overflow-hidden
                            text-sm
							transition-opacity
							opacity-${opacity}`
							}>
					<div onClick={closeMenu} className="flex flex-col flex-grow cursor-pointer text-sm">{children}</div></div>}
		</>
	);
};

export default Menu;
