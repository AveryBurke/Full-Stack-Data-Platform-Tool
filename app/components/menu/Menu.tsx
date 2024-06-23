"use client";
import React, { ReactNode, useState } from "react";
import { useOutsideClick } from "@/app/hooks/useClickOutside";
import { set } from "date-fns";

interface MenuProps {
	children: ReactNode;
	title: string;
}

const Menu: React.FC<MenuProps> = ({ children, title }) => {
	const [open, setOpen] = useState(false);
	const [visible, setVisible] = useState(false);

	const openMenu = () => {
		// start with the menu hidden
		setVisible(false);
		// render the menu
		setOpen(true);
		// fade in the menu after a short delay
		setTimeout(() => {
			setVisible(true);
		}, 10);
	};

	const closeMenu = () => {
		// fade out the menu
		setVisible(false)
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
			{open && <div ref={ref}
					className={`
						   min-w-[150px]
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
							${visible ? "opacity-100" : "opacity-0"}
							duration-250`
							}>
					<div onClick={closeMenu} className="flex flex-col flex-grow cursor-pointer text-sm">{children}</div></div>}
		</>
	);
};

export default Menu;
