import { easeLinear, easeQuad, easeQuadIn, easeQuadInOut, easeQuadOut, easeCubic, easeCubicIn, easeCubicInOut, easeCubicOut } from "d3-ease";
/**
 * A collection of d3 easing functions indexed by their name.
 * @example d3EasingFunctions.linear
 */

export const d3EasingFunctions = {
    easeIdentitiy: (normalizedTime: number) => normalizedTime,
    easeLinear,
    easeQuad,
    easeQuadIn,
    easeQuadOut,
    easeQuadInOut,
    easeCubic,
    easeCubicIn,
    easeCubicOut,
    easeCubicInOut,
};
