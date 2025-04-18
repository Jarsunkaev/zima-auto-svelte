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
	  }
	  
	  // Check browser language or saved preference
	  const savedLang = localStorage.getItem('zimaAutoLang');
	  if (savedLang && (savedLang === 'hu' || savedLang === 'en')) {
		currentLang.set(savedLang);
	  }
	  
	  // Listen for hash changes
	  window.addEventListener('hashchange', () => {
		const newHash = window.location.hash.slice(1);
		if (newHash && ['home', 'about', 'services', 'contact'].includes(newHash)) {
		  navigate(newHash);
		}
	  });
	});
	
	// Save language preference when it changes
	currentLang.subscribe(value => {
	  if (typeof localStorage !== 'undefined') {
		localStorage.setItem('zimaAutoLang', value);
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
	  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	  color: #333;
	  line-height: 1.6;
	  overflow-x: hidden;
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
  </style>