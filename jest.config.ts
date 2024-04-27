import type { Config } from "jest";
import nextJest from "next/jest.js";

const esModules = ["d3", "d3-array", "d3-interpolate", "d3-scale", "d3-selection", "d3-shape", "d3-timer", "d3-transition", "cliui", "string-width"].join("|");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
	coverageProvider: "v8",
	testEnvironment: "jsdom",
	preset: "ts-jest",
	// Add more setup options before each test is run
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		// Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
		// "@auth/(.*)": require.resolve("uuid"),
		"^(\\.{1,2}/.*)\\.js$": "$1",
		// "^@/*": "$1",
	},
	transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})/`],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
