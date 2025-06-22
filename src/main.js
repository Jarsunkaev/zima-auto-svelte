import App from './App.svelte';
import 'flag-icons/css/flag-icons.min.css';

// Ensure clean mounting and error handling
let app;

try {
  // Remove any existing content that might cause rendering issues
  document.body.innerHTML = '';

  // Create the app instance with error handling
  app = new App({
    target: document.body,
    props: {}
  });

  // Console logging to verify app loads
  console.log('Zima Auto website loaded successfully');
} catch (error) {
  console.error('Failed to mount Svelte app:', error);
  
  // Fallback error display
  document.body.innerHTML = `
    <div style='font-family: sans-serif; text-align: center; padding: 20px;'>
      <h1>Application Load Error</h1>
      <p>Sorry, there was a problem loading the website. Please try refreshing the page.</p>
      <small>${error.message}</small>
    </div>
  `;
}

export default app;