import React from "react";
import jsdom from "jsdom";
import { Arc, pie } from "d3-shape";

interface RendProps {
	data: any[];
    sliceColumn: string;
    ringColumn: string;
}

const Rend: React.FC<RendProps> = ({ data, sliceColumn, ringColumn }) => {
    // const { JSDOM } = jsdom,
    // dom = new JSDOM(),
    // slices = [...new Set<string>(data.map((d) => d[sliceColumn])),]
    // rings = [...new Set<string>(data.map((d) => d[ringColumn])),
    // ringCount = Object.fromEntries(ringSet.map((ring) => [ring, data.filter((d) => ringValue(d) === ring).length])),
	// 			sliceCount = Object.fromEntries(sliceSet.map((slice) => [slice, data.filter((d) => sliceValue(d) === slice).length])),
	// 			ringHeights = ringSet.reduce<{ [key: string]: { innerRadius: number; outerRadius: number } }>((acc, ring, i) => {
	// 				const height = ringCount[ring]! * (pieRadius / data.length);
	// 				if (i === 0) {
	// 					acc[ring] = { innerRadius: 0, outerRadius: height };
	// 				} else {
	// 					const prev = ringSet[i - 1];
	// 					const { outerRadius: prevOuter } = acc[prev!] || { outerRadius: 0 };
	// 					const outerRadius = height + prevOuter;
	// 					acc[ring] = { innerRadius: prevOuter, outerRadius };
	// 				}
	// 				return acc;
	// 			}, {}),
	// 			pieGenerator = pie<string>()
	// 				.value((slice) => sliceCount[slice]!)
	// 				.sort((a: string, b: string) => sliceSet.indexOf(a) - sliceSet.indexOf(b)),
	// 			sliceAngles = Object.fromEntries(
	// 				pieGenerator(sliceSet).map((p) => {
	// 					const { startAngle, endAngle } = p;
	// 					return [p.data, { startAngle, endAngle }];
	// 				})
	// 			),
    // const svg = dom.window.document.querySelector("svg");


	return <svg className="w-full aspect-video"></svg>;
};

export default Rend;
