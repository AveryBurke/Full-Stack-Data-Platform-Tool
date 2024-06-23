"use client";
import { IconType } from "react-icons/lib";

interface MenuItemProps {
	callback: () => void;
	label: string;
	Icon?: IconType
}

const menuItem: React.FC<MenuItemProps> = ({ callback, label, Icon }) => {
	return (
		<div data-testid="menu_item" onClick={callback} className="py-1 px-2 hover:bg-neutral-200 transition flex flex-row justify-between flex-grow text-xs rounded">
			{label}
			{Icon && <Icon color="rgb(163 163 163)"/>}
		</div>
	);
};

export default menuItem;