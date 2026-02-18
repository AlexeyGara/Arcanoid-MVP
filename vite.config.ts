import { defineConfig } from "vite";
import swc              from 'vite-plugin-swc-transform';
import tsconfigPaths    from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(
	{
		plugins: [
			tsconfigPaths(),
			swc({
					// enable decorators and metadata
					swcOptions: {
						jsc: {
							parser: {
								syntax: 'typescript',
								decorators: true,
								dynamicImport: true,
							},
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true, // strongly required for DI
							},
						},
					},
				})
		],
		server: {
			port: 8080,
			open: true,
		},
	}
);
