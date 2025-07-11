import dotenv from 'dotenv';
dotenv.config();
console.log('BUILD ENV:', process.env.VITE_GOOGLE_APPS_SCRIPT_URL);

import { spawn } from 'child_process';
import replace from '@rollup/plugin-replace';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
		globals: {
			'svelte-i18n': 'svelteI18n',
			'$app/stores': 'stores',
			'@beyonk/gdpr-cookie-consent-banner': 'gdprCookieConsentBanner'
		}
	},
	plugins: [
		replace({
			preventAssignment: true,
			'process.env.VITE_GOOGLE_APPS_SCRIPT_URL': JSON.stringify(process.env.VITE_GOOGLE_APPS_SCRIPT_URL || ''),
			'import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL': JSON.stringify(process.env.VITE_GOOGLE_APPS_SCRIPT_URL || ''),
			'process.env.VITE_BACKEND_API_URL': JSON.stringify(process.env.VITE_BACKEND_API_URL || 'https://zima-auto-backend.fly.dev/api'),
			'import.meta.env.VITE_BACKEND_API_URL': JSON.stringify(process.env.VITE_BACKEND_API_URL || 'https://zima-auto-backend.fly.dev/api')
		}),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
				customElement: false
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	},
	external: ['$app/stores', 'svelte-i18n', '@beyonk/gdpr-cookie-consent-banner']
};
