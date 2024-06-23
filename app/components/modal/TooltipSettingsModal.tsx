"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import useTooltipSettingsModal from "@/app/hooks/useTooltipSettingsModal";
import { usePizzaState } from "@/app/hooks/usePizzaState";
import Checkbox from "./Checkbox";
import { toast } from "react-hot-toast";
import { to } from "react-spring";

const TooltipSettingsModal = () => {
	const tooltipSettingsModal = useTooltipSettingsModal();
	const { options, tooltip, setTooltip } = usePizzaState();
	const [isLoading, setLoading] = useState(false);

	const body = (
		<div className="flex flex-col gap-2">
			{options.map((option) => {
                if (option.value === "internalId") return null;
				const selected = tooltip.includes(option.value);
				return (
					<Checkbox
						key={option.value}
						label={option.label}
						checked={selected}
						color="#e6c07b"
						onChange={() => {
							if (selected) {
								setTooltip(tooltip.filter((t) => t !== option.value));
							} else {
								setTooltip([...tooltip, option.value]);
							}
						}}
					/>
				);
			})}
		</div>
	);

    const hanldeSubmit = () => {
        setLoading(true);
        setTooltip(tooltip);
        setLoading(false);
        toast.success("Tooltip settings updated");
    };

	return (
		<Modal
			disabled={isLoading}
			isOpen={tooltipSettingsModal.isOpen}
			title="Tooltip Settings"
			actionLabel="Set Tooltip"
			onClose={tooltipSettingsModal.onClose}
			onSubmit={hanldeSubmit}
			body={body}
		/>
	);
};

export default TooltipSettingsModal;
