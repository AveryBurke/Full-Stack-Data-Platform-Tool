"use client";

interface MenuItemProps {
	callback: () => void;
	label: string;
}

const menuItem: React.FC<MenuItemProps> = ({ callback, label }) => {
	return (
		<div data-testid="menu_item" onClick={callback} className="p-3 hover:bg-neutral-100 transition flex-grow text-sm">
			{label}
		</div>
	);
};

export default menuItem;