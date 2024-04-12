"use client";

import React, { useState, useEffect } from "react";

interface hydrationBoundaryProps {
	children: React.ReactNode;
}

const HydrationBoundary: React.FC<hydrationBoundaryProps> = ({ children }) => {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) return null;

	return <>{children}</>;
};

export default HydrationBoundary;
