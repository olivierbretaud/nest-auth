import type { Config } from "jest";
import * as dotenv from "dotenv";

dotenv.config();

const config: Config = {
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: ".",
	setupFiles: ["dotenv/config"],
	testEnvironment: "node",
	preset: "ts-jest",
	testMatch: ["**/*.spec.ts", "**/*.e2e-spec.ts"],

	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},

	testPathIgnorePatterns: ["/node_modules/", "/dist/"],

	testTimeout: 30000,
	verbose: true,
};

export = config;
