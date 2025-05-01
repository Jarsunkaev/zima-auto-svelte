import App from './App.svelte';
import 'flag-icons/css/flag-icons.min.css';

// Create the app instance - this is standard Svelte 3/4 instantiation
// that should work during the build process
const app = new App({
  target: document.body
});

// Console logging to verify app loads
console.log('Zima Auto website loaded successfully');

export default app;