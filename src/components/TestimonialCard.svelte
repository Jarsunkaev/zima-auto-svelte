<script>
  export let name;
  export let location;
  export let text;
  export let image;
  export let index = 0;
  export let isVisible = false;
  
  import { onMount } from 'svelte';
  
  let isHovered = false;
  
  function handleMouseEnter() {
    isHovered = true;
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div 
  class="testimonial-card {isVisible ? 'visible' : ''} {isHovered ? 'hovered' : ''}" 
  style="transition-delay: {150 * index}ms"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <div class="card-border"></div>
  <div class="quote-icon">
    <svg width="42" height="36" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.928 36C8.208 36 5.184 34.704 2.856 32.112C0.952 29.52 0 26.352 0 22.608C0 16.8 2.38 11.664 7.14 7.2C11.9 2.4 17.612 0 24.276 0L26.18 6.768C21.42 7.104 17.374 8.4 14.042 10.656C10.71 12.576 8.856 15.12 8.58 18.288C9.964 17.28 11.69 16.776 13.766 16.776C16.65 16.776 19.058 17.76 20.994 19.728C22.93 21.648 23.898 24.144 23.898 27.216C23.898 30.288 22.93 32.784 20.994 34.704C19.058 35.568 15.904 36 11.928 36ZM30.03 36C26.31 36 23.286 34.704 20.958 32.112C19.054 29.52 18.102 26.352 18.102 22.608C18.102 16.8 20.482 11.664 25.242 7.2C30.002 2.4 35.714 0 42.378 0L44.282 6.768C39.522 7.104 35.476 8.4 32.144 10.656C28.812 12.576 26.958 15.12 26.682 18.288C28.066 17.28 29.792 16.776 31.868 16.776C34.752 16.776 37.16 17.76 39.096 19.728C41.032 21.648 42 24.144 42 27.216C42 30.288 41.032 32.784 39.096 34.704C37.16 35.568 34.006 36 30.03 36Z" fill="currentColor"/>
    </svg>
  </div>
  
  <div class="card-content">
    <p class="testimonial-text">{text}</p>
    
    <div class="testimonial-author">
      <div class="author-image">
        {#if image}
          <img src={image} alt={name} />
        {:else}
          <div class="author-initials">{name.charAt(0)}</div>
        {/if}
      </div>
      <div class="author-info">
        <h4>{name}</h4>
        {#if location}
          <span>{location}</span>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Floating elements for visual appeal -->
  <div class="floating-elements">
    <div class="circle c1"></div>
    <div class="circle c2"></div>
    <div class="dot d1"></div>
    <div class="dot d2"></div>
    <div class="dot d3"></div>
  </div>
</div>

<style>
  .testimonial-card {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border-radius: 16px;
    padding: 40px 30px;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    position: relative;
    overflow: hidden;
    height: 100%;
    opacity: 0;
    transform: translateY(30px) scale(0.97);
    will-change: transform, opacity;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  
  .testimonial-card.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  
  .testimonial-card.hovered {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  }
  
  /* Card border */
  .card-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: -1;
    overflow: hidden;
  }
  
  .card-border::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: #00bae5;
    transition: height 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }
  
  .testimonial-card.hovered .card-border::before {
    height: 100%;
  }
  
  .quote-icon {
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
  }
  
  .testimonial-card.hovered .quote-icon {
    color: rgba(0, 186, 229, 0.3);
    transform: translateY(-5px);
  }
  
  .card-content {
    position: relative;
    z-index: 2;
  }
  
  .testimonial-text {
    font-size: 1.05rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 24px;
    font-style: italic;
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
    margin-top: auto;
    position: relative;
    padding-top: 16px;
  }
  
  .testimonial-author::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: rgba(0, 186, 229, 0.5);
  }
  
  .author-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
    overflow: hidden;
    background-color: #00bae5;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .author-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .author-initials {
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  .author-info {
    display: flex;
    flex-direction: column;
  }
  
  .author-info h4 {
    font-size: 1.1rem;
    margin: 0 0 5px 0;
    font-weight: 700;
    color: white;
  }
  
  .author-info span {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  /* Floating elements */
  .floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }
  
  .circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 186, 229, 0.2) 0%, rgba(0, 186, 229, 0) 70%);
  }
  
  .c1 {
    top: -100px;
    right: -100px;
    width: 200px;
    height: 200px;
    opacity: 0.4;
  }
  
  .c2 {
    bottom: -80px;
    left: -80px;
    width: 180px;
    height: 180px;
    opacity: 0.3;
  }
  
  .dot {
    position: absolute;
    border-radius: 50%;
    background-color: #00bae5;
  }
  
  .d1 {
    top: 20%;
    right: 10%;
    width: 8px;
    height: 8px;
    opacity: 0.2;
  }
  
  .d2 {
    bottom: 30%;
    right: 20%;
    width: 5px;
    height: 5px;
    opacity: 0.15;
  }
  
  .d3 {
    top: 40%;
    left: 15%;
    width: 6px;
    height: 6px;
    opacity: 0.1;
  }
  
  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .testimonial-card {
      padding: 30px 20px;
    }
    
    .testimonial-text {
      font-size: 0.95rem;
    }
  }
</style>