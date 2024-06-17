"use client";

interface MenuItemProps {
	callback: () => void;
	label: string;
}
const menuItem: React.FC<MenuItemProps> = ({ callback, label }) => {
	return (
		<div data-testid="menu_item" onClick={callback} className="px-4 py-3 hover:bg-neutral-100 transition font-semibold flex-grow text-sm">
			{label}
		</div>
	);
};

export default menuItem;