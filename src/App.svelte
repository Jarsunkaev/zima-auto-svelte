<script>
	import { onMount } from 'svelte';
	import { currentLang } from './lib/i18n';
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Home from './pages/Home.svelte';
	import About from './pages/About.svelte';
	import Services from './pages/Services.svelte';
	import Contact from './pages/Contact.svelte';
	import Booking from './pages/Booking.svelte';
  
	// Page routing
	let currentPage = 'home';
	let pageLoading = true;
	let pageTransition = false;
	
	function navigate(page) {
	  if (page === currentPage) return;
	  
	  pageTransition = true;
	  
	  // After a brief transition delay, update the page
	  setTimeout(() => {
	    currentPage = page;
	    window.scrollTo(0, 0);
	    
	    // Update URL hash
	    window.history.pushState(null, null, `#${page}`);
	    
	    // After page loads, remove transition class
	    setTimeout(() => {
	      pageTransition = false;
	    }, 100);
	  }, 300);
	}
	
	// Check for URL hash and navigate accordingly
	onMount(() => {
	  // Small delay to ensure smooth initial page load
	  setTimeout(() => {
	    pageLoading = false;
	  }, 300);
	  
	  const hash = window.location.hash.slice(1);
	  if (hash && ['home', 'about', 'services', 'contact', 'booking'].includes(hash)) {
		currentPage = hash;
	  } else {
	    // Default to home if no valid hash
	    currentPage = 'home';
	    window.history.replaceState(null, null, '#home');
	  }
	  
	  // ALWAYS default to Hungarian language regardless of browser settings
	  currentLang.set('hu');
	  localStorage.setItem('zimaAutoLang', 'hu');
	  
	  // Listen for hash changes
	  window.addEventListener('hashchange', () => {
		const newHash = window.location.hash.slice(1);
		if (newHash && ['home', 'about', 'services', 'contact', 'booking'].includes(newHash) && newHash !== currentPage) {
		  navigate(newHash);
		}
	  });

      // Debug log the current page to verify routing is working
      console.log("Initial page:", currentPage);
	});
	
	// Save language preference when it changes
	currentLang.subscribe(value => {
	  if (typeof localStorage !== 'undefined' && value) {
		localStorage.setItem('zimaAutoLang', value);
	  }
	});
</script>

<div class="app-container {pageLoading ? 'loading' : ''} {pageTransition ? 'page-transition' : ''}">
  <div class="loader" class:hidden={!pageLoading}>
    <div class="logo-container">
      <img src="images/logo.svg" alt="Zima Auto" />
    </div>
    <div class="spinner"></div>
  </div>

  <Header {navigate} {currentPage} />

  <main>
    {#if currentPage === 'home'}
      <Home {navigate} />
    {:else if currentPage === 'about'}
      <About />
    {:else if currentPage === 'services'}
      <Services />
    {:else if currentPage === 'contact'}
      <Contact />
    {:else if currentPage === 'booking'}
      <Booking />
    {:else}
      <!-- Fallback if no page matches -->
      <div class="error-container">
        <h1>Page not found</h1>
        <button on:click={() => navigate('home')}>Go to Home</button>
      </div>
    {/if}
  </main>

  <Footer {navigate} />
</div>

<style>
  :global(:root) {
    --primary: rgba(0, 186, 229, 1);
    --primary-dark: rgba(0, 150, 190, 1);
    --secondary: #13151a;
    --text: #333333;
    --text-light: #666666;
    --light: #f8f9fa;
    --white: #ffffff;
    --gray: #cccccc;
    --dark-gray: #888888;
    --transition: all 0.3s ease;
    --font-family: 'Inter', sans-serif;
  }
  
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    font-family: var(--font-family);
    color: var(--text);
    line-height: 1.6;
    font-size: 16px;
    overflow-x: hidden;
    background-color: var(--white);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .app-container {
    position: relative;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
  
  .app-container.loading {
    opacity: 0;
  }
  
  .app-container.page-transition main {
    opacity: 0;
    transform: translateY(20px);
  }
  
  main {
    min-height: calc(100vh - 140px);
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
  }
  
  .loader.hidden {
    opacity: 0;
    visibility: hidden;
  }
  
  .logo-container {
    margin-bottom: 2rem;
  }
  
  .logo-container img {
    height: 70px;
    animation: pulse 2s infinite ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(0.95); }
    50% { transform: scale(1.05); }
    100% { transform: scale(0.95); }
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 186, 229, 0.2);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  :global(a) {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;
  }
  
  :global(a:hover, a:focus) {
    color: var(--primary);
  }
  
  :global(button) {
    cursor: pointer;
    font-family: inherit;
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    font-weight: 700;
    line-height: 1.2;
  }
  
  :global(img) {
    max-width: 100%;
    height: auto;
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
    cursor: pointer;
  }
  
  :global(.btn-primary) {
    background-color: var(--primary);
    color: white;
  }
  
  :global(.btn-primary:hover),
  :global(.btn-primary:focus) {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  
  :global(.btn-outline) {
    background-color: transparent;
    border: 2px solid white;
    color: white;
  }
  
  :global(.btn-outline:hover),
  :global(.btn-outline:focus) {
    background-color: white;
    color: var(--text);
    transform: translateY(-2px);
    outline: none;
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70vh;
    text-align: center;
    padding: 2rem;
  }

  .error-container h1 {
    margin-bottom: 1.5rem;
    color: var(--text);
    font-size: 2.5rem;
  }

  .error-container button {
    padding: 0.75rem 1.5rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .error-container button:hover,
  .error-container button:focus {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  
  /* Responsive styles */
  @media screen and (max-width: 768px) {
    :global(section) {
      padding: 3rem 1.5rem;
    }
    
    :global(.btn) {
      padding: 0.7rem 1.3rem;
      font-size: 0.85rem;
    }
  }
</style>