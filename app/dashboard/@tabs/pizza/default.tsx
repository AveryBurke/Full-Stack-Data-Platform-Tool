"use client";
import React, { useRef, useEffect } from "react";

const DefaultPizza = () => {
	const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, ref.current.width, ref.current.height);
      }
    }
  }, []);

	return <canvas ref={ref} className="w-full h-full aspect-video"/>;
};

export default DefaultPizza;
