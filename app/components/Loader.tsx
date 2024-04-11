import React from "react";
import { GridLoader } from "react-spinners";

interface LoaderProps {
	color?: string;
}

/**
 * Centered loader component
 * 
 *  
 */
const Loader: React.FC<LoaderProps> = ({ color }) => {
	return (
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<GridLoader size={75} color={color || "blue"} />
		</div>
	);
};

export default Loader;
