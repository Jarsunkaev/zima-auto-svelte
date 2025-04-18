<script>
	import { onMount } from 'svelte';
	import { currentLang } from './lib/i18n';
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Home from './pages/Home.svelte';
	import About from './pages/About.svelte';
	import Services from './pages/Services.svelte';
	import Contact from './pages/Contact.svelte';
  
	// Page routing
	let currentPage = 'home';
	
	function navigate(page) {
	  currentPage = page;
	  window.scrollTo(0, 0);
	}
	
	// Check for URL hash and navigate accordingly
	onMount(() => {
	  const hash = window.location.hash.slice(1);
	  if (hash && ['home', 'about', 'services', 'contact'].includes(hash)) {
		navigate(hash);
	  } else {
	    // Default to home if no valid hash
	    navigate('home');
	  }
	  
	  // Check browser language or saved preference
	  const savedLang = localStorage.getItem('zimaAutoLang');
	  if (savedLang && (savedLang === 'hu' || savedLang === 'en')) {
		currentLang.set(savedLang);
	  } else {
	    // Default to Hungarian if no saved preference
	    currentLang.set('hu');
	  }
	  
	  // Listen for hash changes
	  window.addEventListener('hashchange', () => {
		const newHash = window.location.hash.slice(1);
		if (newHash && ['home', 'about', 'services', 'contact'].includes(newHash)) {
		  navigate(newHash);
		}
	  });
	  
	  console.log('App mounted successfully');
	});
	
	// Save language preference when it changes
	currentLang.subscribe(value => {
	  if (typeof localStorage !== 'undefined' && value) {
		localStorage.setItem('zimaAutoLang', value);
		console.log('Language set to:', value);
	  }
	});
</script>

<Header {navigate} {currentPage} />

<main>
	{#if currentPage === 'home'}
	  <Home />
	{:else if currentPage === 'about'}
	  <About />
	{:else if currentPage === 'services'}
	  <Services />
	{:else if currentPage === 'contact'}
	  <Contact />
	{:else}
	  <!-- Fallback if no page matches -->
	  <div class="error-container">
	    <h1>Page not found</h1>
	    <button on:click={() => navigate('home')}>Go to Home</button>
	  </div>
	{/if}
</main>

<Footer {navigate} />

<style>
	:global(*) {
	  margin: 0;
	  padding: 0;
	  box-sizing: border-box;
	}
	
	:global(body) {
	  font-family: 'Inter', sans-serif;
	  color: #333;
	  line-height: 1.6;
	  overflow-x: hidden;
	  background-color: #ffffff;
	}
	
	:global(a) {
	  text-decoration: none;
	  color: inherit;
	}
	
	:global(button) {
	  cursor: pointer;
	  font-family: inherit;
	}
	
	:global(h1, h2, h3, h4, h5, h6) {
	  font-weight: 700;
	  line-height: 1.2;
	}
	
	:global(section) {
	  padding: 4rem 2rem;
	}
	
	:global(.container) {
	  max-width: 1200px;
	  margin: 0 auto;
	  padding: 0 1rem;
	}
	
	:global(.btn) {
	  display: inline-block;
	  padding: 0.8rem 1.5rem;
	  font-weight: 600;
	  border-radius: 4px;
	  border: none;
	  transition: all 0.3s ease;
	  text-transform: uppercase;
	  font-size: 0.9rem;
	}
	
	:global(.btn-primary) {
	  background-color: rgba(0, 186, 229, 1);
	  color: white;
	}
	
	:global(.btn-primary:hover) {
	  background-color: rgba(0, 150, 190, 1);
	  transform: translateY(-2px);
	  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	
	:global(.btn-outline) {
	  background-color: transparent;
	  border: 2px solid white;
	  color: white;
	}
	
	:global(.btn-outline:hover) {
	  background-color: white;
	  color: #333;
	  transform: translateY(-2px);
	}
	
	main {
	  min-height: calc(100vh - 140px);
	}

	.error-container {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  height: 50vh;
	  text-align: center;
	  padding: 2rem;
	}

	.error-container h1 {
	  margin-bottom: 1.5rem;
	  color: #333;
	}

	.error-container button {
	  padding: 0.75rem 1.5rem;
	  background-color: rgba(0, 186, 229, 1);
	  color: white;
	  border: none;
	  border-radius: 4px;
	  font-weight: 600;
	  cursor: pointer;
	  transition: all 0.3s ease;
	}

	.error-container button:hover {
	  background-color: rgba(0, 150, 190, 1);
	  transform: translateY(-2px);
	}
</style>