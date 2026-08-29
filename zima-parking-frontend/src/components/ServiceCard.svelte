

<script>
  export let svgIcon;
  export let title;
  export let description;
  export let image = '';
  export let index = 0;
  export let shouldAnimate = false;
  export let ctaText = 'Learn more';
  export let ctaAction = () => {};
  export let color = '#2b0f4d';
  export let hoverColor = '#1f0839';
  
  import { onMount } from 'svelte';

  let isVisible = false;
  let isHovered = false;
  
  $: if (shouldAnimate) {
    // Add a staggered delay based on the index
    setTimeout(() => {
      isVisible = true;
    }, 100 * index);
  }

  onMount(() => {
    // Safety fallback: ensure card is visible even if ScrollTrigger fails
    const timer = setTimeout(() => {
      isVisible = true;
    }, 250 + (100 * index));
    return () => clearTimeout(timer);
  });

  function handleMouseEnter() {
    isHovered = true;
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<button 
  class="service-card {isVisible ? 'visible' : ''} {isHovered ? 'hovered' : ''}" 
  style={`--card-color: ${color}; --card-hover: ${hoverColor}; transition-delay: ${100 * index}ms`}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={ctaAction}
>
  <div class="bg-image" style={`background-image: url('${image}')`}></div>
  <div class="color-overlay"></div>

  <div class="service-icon">
    {@html svgIcon}
  </div>
  
  <h3>{title}</h3>
  <p>{description}</p>
  
  <div class="card-action">
    <span>{ctaText}</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</button>

<style>
  .service-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    padding: 30px 25px;
    height: 100%;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(20px);
    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }
  
  .service-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .service-card.hovered {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
  }

  .bg-image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 0;
    transform: scale(1.02);
  }

  .color-overlay {
    position: absolute;
    inset: 0;
    background-color: var(--card-color);
    opacity: 0.75;
    z-index: 1;
    transition: opacity 0.3s ease, background-color 0.3s ease;
  }

  .service-card.hovered .color-overlay {
    background-color: var(--card-hover);
    opacity: 0.9;
  }
  
  .service-icon {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }
  
  .service-card.hovered .service-icon {
    transform: scale(1.05);
  }
  
  .service-icon :global(svg) {
    width: 35px;
    height: 35px;
    color: white;
  }
  
  h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: #fff;
    font-weight: 600;
    position: relative;
    z-index: 2;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 20px;
    flex-grow: 1;
    position: relative;
    z-index: 2;
  }
  
  .card-action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    color: #f4f7ff;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
    cursor: pointer;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.22);
    margin-top: auto;
    align-self: center;
  }
  
  .card-action:focus {
    outline: 2px solid #f4f7ff;
    outline-offset: 2px;
    border-radius: 4px;
  }
  
  .service-card.hovered .card-action {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.2);
  }
  
  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .service-card {
      min-height: 250px;
      padding: 25px 20px;
    }
    
    h3 {
      font-size: 1.2rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
</style>