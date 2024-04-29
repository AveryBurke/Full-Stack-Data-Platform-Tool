// http://www.vis4.net/blog/mastering-multi-hued-color-scales/
import { bezier, blend, scale } from "chroma-js";

const brewerSequentialPalettes = [
	"Blues",
	"BuGn",
	"BuPu",
	"GnBu",
	"Greens",
	"Greys",
	"Oranges",
	"OrRd",
	"PuBu",
	"PuBuGn",
	"PuRd",
	"Purples",
	"RdPu",
	"Reds",
	"YlGn",
	"YlGnBu",
	"YlOrBr",
	"YlOrRd",
];

export const pallet = (palletLength: number) => {
	const colors = [];
	for (let i = 0; i < brewerSequentialPalettes.length; i++) {
		colors.push(
			// bezier(brewerSequentialPalettes[i])
			scale(brewerSequentialPalettes[i])
				.mode("lab")
				// .correctLightness()
				.colors(palletLength)
		);
	}
	return colors;
};
