import React from "react";

interface CheckBoxControlePanelProps {
	set: { value: string; filtered: boolean }[];
	onChange: (value: { value: string; filtered: boolean }[]) => void;
}

const CheckBoxControlePanel: React.FC<CheckBoxControlePanelProps> = ({ set, onChange }) => {
	return (
		<ul className="w-full rounded bg-[#abb2bf] bg-opacity-50 p-1 flex flex-col gap-[2px]">
			{set.map((member, index) => {
				return (
					<li
						className="w-full flex flex-row justify-between p-1 bg-[#282a36] rounded text-sm text-slate-50 transition duration-200 hover:bg-opacity-75 active:bg-opacity-75 active:z-10"
						key={index}>
						{member.value}
						<input
							type="checkbox"
							checked={member.filtered}
							onChange={() => {
								const setCopy = [...set];
								setCopy[index] = { value: member.value, filtered: !member.filtered };
								onChange(setCopy);
							}}
						/>
					</li>
				);
			})}
		</ul>
	);
};

export default CheckBoxControlePanel;
