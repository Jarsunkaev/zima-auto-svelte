<script>
  export let id;
  export let icon;
  export let image;
  export let title;
  export let description;
  export let index = 0;
  export let shouldAnimate = false;
  
  import { onMount } from 'svelte';
  
  let isVisible = false;
  let isHovered = false;
  
  $: if (shouldAnimate) {
    // Add a staggered delay based on the index
    setTimeout(() => {
      isVisible = true;
    }, 150 * index);
  }

  function handleMouseEnter() {
    isHovered = true;
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div 
  class="service-card {isVisible ? 'visible' : ''} {isHovered ? 'hovered' : ''}" 
  style="transition-delay: {100 * index}ms"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <div class="service-icon">
    <img src={icon} alt={title} />
  </div>
  
  <h3>{title}</h3>
  <p>{description}</p>
  
  <div class="service-overlay" style="background-image: url('{image}')"></div>
  <div class="gradient-overlay"></div>
  
  <div class="card-action">
    <span>Learn more</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</div>

<style>
  .service-card {
    position: relative;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    padding: 30px 25px;
    height: 100%;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    z-index: 1;
  }
  
  .service-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .service-card.hovered {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
  
  .service-icon {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #00bae5;
    border-radius: 8px;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }
  
  .service-card.hovered .service-icon {
    transform: scale(1.05);
  }
  
  .service-icon img {
    width: 35px;
    height: 35px;
    filter: brightness(0) invert(1);
  }
  
  h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: #333;
    font-weight: 600;
    position: relative;
    z-index: 2;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #666;
    margin-bottom: 20px;
    flex-grow: 1;
    position: relative;
    z-index: 2;
  }
  
  .service-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  }
  
  .service-card.hovered .service-overlay {
    opacity: 1;
  }
  
  .service-card.hovered .gradient-overlay {
    opacity: 1;
  }
  
  .service-card.hovered h3,
  .service-card.hovered p {
    color: white;
  }
  
  .card-action {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    color: #00bae5;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }
  
  .service-card.hovered .card-action {
    color: white;
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