"use client";
import { useState, useCallback, useEffect, ReactNode, ReactPortal } from "react";
import ReactDOM from "react-dom";
const usePortal = (el: HTMLElement) => {
	const [portal, setPortal] = useState({
		render: ({children}:{children: ReactNode}) => null as unknown as ReactPortal,
		remove: () => null,
	});

	const createPortal = useCallback(
		(el: HTMLElement) => {
			const Portal = ({children}:{children: ReactNode}) => ReactDOM.createPortal(children, el)
			const remove = () => {
				el.replaceChildren();
				return null;
			};
			return { render: Portal, remove };
		},
		[el]
	);

	useEffect(() => {
		if (el) portal.remove();
		const newPortal = createPortal(el);
		setPortal(newPortal);
		return () => {
			if (newPortal) newPortal.remove();
		};
	}, [el]);

	return portal.render;
};
export default usePortal; 
