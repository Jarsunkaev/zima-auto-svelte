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
  
  $: if (shouldAnimate) {
    // Add a staggered delay based on the index
    setTimeout(() => {
      isVisible = true;
    }, 150 * index);
  }
</script>

<div class="service-card {isVisible ? 'visible' : ''}" style="transition-delay: {100 * index}ms">
  <div class="service-icon">
    <img src={icon} alt={title} />
  </div>
  <div class="service-content">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
  <div class="service-image" style="background-image: url('{image}')"></div>
  <div class="service-overlay"></div>
</div>

<style>
  .service-card {
    position: relative;
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    z-index: 1;
    height: 320px;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(30px);
    width: 100%;
    will-change: transform, opacity;
  }
  
  .service-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 136, 204, 0.15);
  }
  
  .service-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0088cc; /* Primary blue instead of purple */
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 2;
  }
  
  .service-card:hover .service-overlay {
    opacity: 0.08;
  }
  
  .service-icon {
    width: 70px;
    height: 70px;
    margin: 30px auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 186, 229, 0.1);
    border-radius: 50%;
    position: relative;
    z-index: 3;
    transition: all 0.3s ease;
  }
  
  .service-card:hover .service-icon {
    background-color: rgba(0, 186, 229, 1);
    transform: scale(1.1);
  }
  
  .service-icon img {
    width: 35px;
    height: 35px;
    transition: all 0.3s ease;
  }
  
  .service-card:hover .service-icon img {
    filter: brightness(0) invert(1);
  }
  
  .service-content {
    padding: 0 20px 25px;
    text-align: center;
    position: relative;
    z-index: 3;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .service-content h3 {
    font-size: 1.25rem;
    margin-bottom: 15px;
    font-weight: 700;
    transition: all 0.3s ease;
  }
  
  .service-card:hover .service-content h3 {
    color: #0088cc;
  }
  
  .service-content p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #666;
    margin-bottom: 0;
    transition: all 0.3s ease;
  }
  
  .service-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.05;
    transition: all 0.5s ease;
    z-index: 2;
  }
  
  .service-card:hover .service-image {
    opacity: 0.1;
    transform: scale(1.05);
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .service-card {
      height: 320px;
    }
    
    .service-content h3 {
      font-size: 1.1rem;
    }
    
    .service-content p {
      font-size: 0.9rem;
    }
  }
</style>