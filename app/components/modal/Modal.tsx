"use client";
import React, { useState, useEffect, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";
// import useClickOutside from "@/app/hooks/useClickOutside";

interface ModalProps {
	isOpen?: boolean;
	title?: string;
	actionLabel: string;
	onSubmit: () => void;
	onClose: () => void;
	body?: React.ReactElement;
	footer?: React.ReactElement;
	disabled?: boolean;
	secondaryAction?: () => void;
	secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, actionLabel, onSubmit, onClose, body, footer, disabled, secondaryAction, secondaryActionLabel }) => {
	const [showModal, setShowModal] = useState(isOpen);
	// const ref = useClickOutside<HTMLDivElement>(() => onClose(), 301);
	useEffect(() => {
		setShowModal(isOpen);
	}, [isOpen]);

	const hanldeSubmit = useCallback(() => {
		if (disabled) return;
		onSubmit();
	}, [onSubmit, disabled]);

	const hanldeClose = useCallback(() => {
		if (disabled) return;
		setShowModal(false);
		setTimeout(() => {
			onClose();
		}, 300);
	}, [onClose, disabled]);

	const handleSecondaryAction = useCallback(() => {
		if (disabled || !secondaryAction) return;
		secondaryAction();
	}, [disabled, secondaryAction]);

	if (!isOpen) return;

	return (
		<div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
			<div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
				{/* content */}
				<div data-testid="modal_content" className={`translate duration-300 h-full ${showModal ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
					<div className=" translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
						{/* header */}
						<div className="flex items-center justify-center p-6 rounded-t relative border-[1px]">
							<button data-testid="close_button" onClick={hanldeClose} className="p-1 border-0 hover:opacity-70 transition absolute left-9">
								<IoMdClose size={18} />
							</button>
							<div className="text-lg font-semibold tracking-wide">{title}</div>
						</div>
						{/* body */}
						<div className="relative p-6 flex-auto">{body}</div>
						{/* footer */}
						<div className="flex flex-col p-6 gap-2">
							<div className="flex flex-row items-center w-full gap-4">
								{secondaryActionLabel && secondaryAction && (
									<Button data-testid="secondary_action_button" outline {...{ disabled, label: secondaryActionLabel, onClick: handleSecondaryAction }} />
								)}
								<Button data-testid="action_button" {...{ disabled, label: actionLabel, onClick: hanldeSubmit }} />
							</div>
							{footer}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
