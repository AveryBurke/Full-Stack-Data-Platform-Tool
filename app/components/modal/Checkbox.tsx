import React from "react";

interface CheckboxProps {
	label: string;
	color: string;
  onChange?: () => void;
	checked?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, color, onChange }) => {
	return (
		<div className="flex flex-row flex-grow">
			<label>
				<input type="checkbox" className={`accent-[#e6c07b]`} checked={checked} onChange={onChange} /> {label}
			</label>
		</div>
	);
};

export default Checkbox;
