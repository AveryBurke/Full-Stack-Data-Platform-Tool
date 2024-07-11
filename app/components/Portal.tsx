"use client";
import { useEffect, useRef, memo, ReactNode } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: ReactNode }) => {
	const el = useRef<HTMLDivElement | null>(null);

	if (!el.current) el.current = document.createElement("div");

	useEffect(() => {
		const mount = document.getElementById("portal-root");
		if (!mount) return;
		if (!el.current) return;
		mount.appendChild(el.current);
		return () => {
			if (!el.current) return;
			mount.removeChild(el.current);
		};
	}, []);

	return createPortal(children, el.current);
};

export default memo(Portal);