import {useRef, useEffect} from "react";
export const useOutsideClick = (callback: () => void) => {
	const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
		const handleClick = (event: Event) => {
			if (ref.current && event.target && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener("click", handleClick, true);

		return () => {
			document.removeEventListener("click", handleClick, true);
		};
	}, [ref]);

	return ref;
};
