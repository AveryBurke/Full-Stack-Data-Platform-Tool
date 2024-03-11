"use client";
import React from "react";
interface ButtonProps {
	label: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	outline?: boolean;
	sm?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, outline, sm}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`relative 
            disabled: opacity-70 
            disabled:cursor-not-allowed 
            rounded-lg 
            transition 
            w-full 
            tracking-wider
            ${outline ? "bg-white border-black text-black " : "bg-rose-600 border-rose-600 text-white"} 
            ${sm ? "py-1 text-sm font-light border-[1px]" : "py-3 text-md font-semibold border-[2px]"}`}>
			{label}
		</button>
	);
};

export default Button;
