

<script>
    import { onMount, tick } from 'svelte';
    import { gsap } from 'gsap';
    
    // Component props
    export let content = {};
    export let currentLang = 'hu';
    export let onSelectService; // Function to call when a service is selected
    
    // Define service data with images and colors matching landing page
    const services = [
      {
        id: 'tireService',
        color: '#b34700',
        hoverColor: '#8a3800',
        image: 'images/merc-tyre.webp',
        svgIcon: `<svg fill="#ffffff" height="238px" width="238px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M494.916,254.43C494.336,119.185,419.934,7.603,325.521,0.384l-0.008-0.008C322.278,0.128,319.019,0,315.742,0H196.275 C152.226,0,111.872,22.852,80.64,60.646l2.628-0.657l59.46-16.998c2.406-0.674,4.992-0.282,7.074,1.109l20.872,13.901 L191.539,44.1c2.543-1.707,5.811-1.903,8.55-0.538l29.739,14.865c-3.456,4.497-6.801,9.173-10.001,14.089l-22.946-11.469 l-21.478,14.319c-2.867,1.911-6.596,1.911-9.463,0l-22.315-14.882L87.689,76.467L64.87,82.176 c-3.072,4.736-6.007,9.643-8.823,14.703l9.097,7.441l20.19,13.423l20.873-13.909c2.867-1.92,6.596-1.92,9.463,0l20.873,13.901 l20.864-13.901c2.543-1.707,5.811-1.903,8.55-0.538l30.174,15.087c-2.116,5.231-4.105,10.615-5.982,16.094l-27.401-13.696 L141.269,135.1c-2.867,1.911-6.596,1.911-9.464,0l-20.864-13.909L90.069,135.1c-2.867,1.911-6.596,1.911-9.464,0l-25.6-17.067 l-6.972-5.7c-12.066,25.318-20.992,53.896-26.095,84.582l6.784-6.716l24.909-25.506c1.596-1.621,3.78-2.552,6.059-2.56 c2.185,0.068,4.471,0.887,6.084,2.5l19.567,19.558l19.567-19.558c3.328-3.337,8.73-3.337,12.066,0l19.567,19.558l19.567-19.558 c3.328-3.337,8.73-3.337,12.066,0l10.761,10.761c-1.365,6.494-2.594,13.073-3.635,19.78c-0.742-0.393-1.502-0.785-2.125-1.408 l-11.034-11.034L142.575,202.3c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567L91.375,202.3 c-3.337,3.328-8.738,3.328-12.066,0L59.81,182.801l-18.978,19.43l-22.34,22.127c-0.247,2.816-0.469,5.641-0.648,8.491 l12.151,7.296l28.058,14.003L79.309,232.9c3.328-3.337,8.73-3.337,12.066,0l19.567,19.558l19.567-19.558 c2.765-2.765,7.066-3.294,10.419-1.289l29.841,17.903c-0.034,2.159-0.094,4.309-0.094,6.485c0,4.531,0.085,9.028,0.23,13.5 l-33.05-19.831l-20.881,20.898c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567l-19.567,19.567 c-2.594,2.594-6.554,3.251-9.856,1.596l-34.133-17.067l-4.651-2.79c-0.009,1.237-0.06,2.458-0.06,3.695 c0,29.653,3.584,58.129,10.112,84.642l25.455-38.178c1.417-2.125,3.712-3.507,6.255-3.763c2.56-0.239,5.069,0.657,6.878,2.466 l19.567,19.558l19.567-19.558c3.328-3.337,8.73-3.337,12.066,0l19.567,19.558l19.567-19.558c3.328-3.337,8.73-3.337,12.066,0 l5.717,5.709c1.109,8.738,2.526,17.306,4.19,25.702c-1.792-0.239-3.533-0.905-4.907-2.278l-11.034-11.034l-19.567,19.567 c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567l-19.567,19.567c-3.337,3.328-8.738,3.328-12.066,0l-18.244-18.244 L33.297,362.24c3.499,10.906,7.518,21.402,12.015,31.42l8.875-7.603l16.589-16.623c3.328-3.336,8.73-3.336,12.066,0 l19.567,19.558l19.567-19.558c3.328-3.336,8.73-3.336,12.066,0l18.236,18.236l11.298-16.939 c2.381-3.575,7.066-4.821,10.914-2.901l14.797,7.398c2.705,8.124,5.709,15.966,8.934,23.552l-24.627-12.314l-12.885,19.328 c-1.417,2.125-3.721,3.507-6.263,3.763c-2.586,0.222-5.069-0.657-6.869-2.458l-19.567-19.567L108.442,407.1 c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567l-11.034,11.034l-12.8,10.974c9.779,18.577,21.308,35.157,34.193,49.34 l10.948-5.478l25.156-16.768c2.867-1.92,6.596-1.92,9.463,0l20.873,13.901l20.864-13.901c2.867-1.92,6.596-1.92,9.463,0 l20.873,13.901l15.386-10.249c3.174,4.847,6.502,9.464,9.924,13.892L209.536,467.9c-2.867,1.911-6.596,1.911-9.464,0 l-20.864-13.909L158.336,467.9c-2.867,1.911-6.596,1.911-9.464,0l-20.864-13.909L107.136,467.9 c-0.29,0.196-0.597,0.375-0.913,0.529l-6.366,3.183C127.718,497.126,160.794,512,196.275,512h119.467 c2.944,0,5.939-0.119,8.969-0.35h0.009c0.213,0,0.435,0,0.649-0.017c4.198-0.324,8.644-0.939,13.508-1.835 c75.699-13.892,137.464-95.036,152.576-203.315c2.159-16.521,3.328-33.485,3.473-50.483 C494.925,255.991,494.916,254.438,494.916,254.43z M474.547,304.188c-14.319,102.519-72.149,178.671-142.14,189.278 c-2.611,0.401-5.239,0.853-7.799,1.075c-0.179-0.017-0.35-0.051-0.529-0.068c-2.492-0.247-4.966-0.597-7.424-1.05 c-0.862-0.162-1.707-0.367-2.568-0.546c-1.801-0.384-3.593-0.802-5.367-1.289c-0.939-0.265-1.877-0.538-2.807-0.828 c-1.724-0.538-3.439-1.118-5.146-1.758c-0.87-0.316-1.749-0.631-2.611-0.981c-1.963-0.794-3.9-1.656-5.828-2.577 c-0.555-0.265-1.126-0.503-1.681-0.776c-2.517-1.254-5.018-2.62-7.475-4.088c-0.299-0.179-0.58-0.384-0.879-0.563 c-2.142-1.314-4.258-2.697-6.349-4.164c-0.623-0.435-1.246-0.905-1.86-1.357c-1.792-1.306-3.567-2.662-5.316-4.079 c-0.614-0.495-1.229-0.998-1.835-1.51c-1.852-1.553-3.678-3.174-5.478-4.855c-0.427-0.393-0.853-0.776-1.28-1.178 c-6.886-6.571-13.406-14.037-19.507-22.315c-0.205-0.282-0.41-0.572-0.623-0.853c-1.852-2.551-3.678-5.171-5.453-7.868 c-0.179-0.273-0.35-0.538-0.529-0.802c-7.859-12.049-14.908-25.506-20.992-40.132c-0.401-0.973-0.802-1.937-1.195-2.918 c-1.903-4.71-3.703-9.54-5.393-14.472c-0.017-0.034-0.026-0.068-0.034-0.102c-1.69-4.915-3.268-9.933-4.745-15.053 c-0.017-0.043-0.026-0.085-0.043-0.128c-1.434-4.984-2.756-10.078-3.985-15.249c-0.111-0.461-0.213-0.939-0.324-1.399 c-1.152-4.949-2.219-9.975-3.174-15.078c-0.034-0.196-0.077-0.384-0.111-0.58c-0.947-5.103-1.775-10.3-2.517-15.539 c-0.137-0.93-0.256-1.86-0.375-2.79c-0.666-4.966-1.254-9.975-1.732-15.053c-0.026-0.29-0.06-0.58-0.085-0.879 c-0.478-5.205-0.819-10.479-1.084-15.795c-0.06-1.229-0.111-2.466-0.162-3.703c-0.222-5.35-0.367-10.726-0.367-16.162 c0-3.968,0.06-7.919,0.171-11.836c0.043-1.254,0.119-2.483,0.171-3.729c0.102-2.662,0.196-5.325,0.35-7.97 c0.102-1.647,0.247-3.268,0.367-4.907c0.162-2.202,0.299-4.42,0.495-6.613c0.179-1.963,0.41-3.9,0.614-5.854 c0.188-1.835,0.358-3.686,0.572-5.504c0.23-1.92,0.512-3.806,0.776-5.717c0.247-1.818,0.469-3.652,0.734-5.461 c0.282-1.852,0.614-3.678,0.922-5.513c0.299-1.818,0.58-3.661,0.904-5.461c0.341-1.869,0.734-3.703,1.101-5.555 c0.341-1.732,0.666-3.482,1.033-5.197c0.41-1.937,0.87-3.823,1.314-5.734c0.375-1.596,0.717-3.217,1.109-4.796 c0.478-1.946,1.007-3.857,1.519-5.777c0.401-1.502,0.777-3.029,1.195-4.514c0.538-1.903,1.118-3.763,1.681-5.632 c0.444-1.468,0.862-2.953,1.323-4.403c0.58-1.843,1.212-3.635,1.818-5.453c0.486-1.434,0.947-2.901,1.451-4.318 c0.674-1.911,1.399-3.763,2.099-5.641c0.486-1.271,0.939-2.569,1.434-3.823c0.776-1.971,1.596-3.891,2.398-5.82 c0.469-1.118,0.913-2.261,1.391-3.362c0.828-1.903,1.698-3.746,2.552-5.606c0.503-1.084,0.981-2.202,1.502-3.277 c0.862-1.818,1.775-3.575,2.671-5.35c0.546-1.067,1.058-2.159,1.613-3.208c0.922-1.749,1.877-3.448,2.833-5.154 c0.563-1.015,1.109-2.057,1.69-3.063c0.956-1.655,1.946-3.26,2.935-4.872c0.606-0.998,1.195-2.022,1.809-2.995 c1.007-1.587,2.048-3.115,3.081-4.659c0.631-0.947,1.246-1.911,1.886-2.842c1.067-1.536,2.167-3.012,3.26-4.497 c0.64-0.87,1.263-1.766,1.911-2.62c1.118-1.468,2.27-2.876,3.422-4.292c0.648-0.811,1.289-1.647,1.946-2.432 c1.178-1.399,2.381-2.731,3.584-4.079c0.666-0.742,1.314-1.519,1.988-2.244c1.203-1.297,2.44-2.534,3.678-3.78 c0.691-0.7,1.374-1.442,2.082-2.125c1.229-1.195,2.492-2.321,3.746-3.465c0.734-0.666,1.451-1.357,2.185-2.005 c1.28-1.109,2.586-2.15,3.883-3.2c0.742-0.606,1.468-1.237,2.219-1.818c1.323-1.024,2.679-1.971,4.028-2.935 c0.742-0.538,1.485-1.109,2.236-1.621c1.331-0.913,2.697-1.741,4.053-2.586c0.794-0.495,1.579-1.033,2.372-1.502 c1.357-0.802,2.739-1.527,4.113-2.261c0.819-0.444,1.63-0.913,2.449-1.331c1.391-0.7,2.807-1.314,4.216-1.954 c0.828-0.375,1.655-0.785,2.492-1.135c1.408-0.589,2.842-1.101,4.267-1.621c0.853-0.316,1.707-0.666,2.569-0.956 c1.417-0.478,2.859-0.862,4.284-1.271c0.896-0.256,1.783-0.546,2.679-0.776c1.417-0.358,2.859-0.623,4.284-0.913 c0.93-0.196,1.86-0.418,2.79-0.58c1.425-0.247,2.867-0.401,4.301-0.58c0.905-0.111,1.792-0.256,2.697-0.333 c85.248,7.1,152.329,110.993,152.866,236.851l0.009,1.604C477.722,272.171,476.604,288.427,474.547,304.188z"></path> <path d="M252.855,151.971c-0.282-0.273-0.538-0.572-0.785-0.887l-3.081-4.019c-11.708,30.541-18.586,67.959-18.586,108.928 c0,40.747,6.801,77.995,18.389,108.442l3.763-4.105c17.493-17.263,29.047-59.076,29.047-104.337 C281.604,210.74,270.05,168.927,252.855,151.971z"></path> <path d="M332.806,68.262c-30.49,0-57.378,23.39-75.981,60.954l8.448,11.042c20.309,20.48,33.399,65.784,33.399,115.738 c0,50.313-13.278,95.906-33.835,116.173l-8.61,9.404c18.62,38.272,45.764,62.157,76.578,62.157 c57.421,0,102.4-82.458,102.4-187.733S390.227,68.262,332.806,68.262z"></path> </g> </g> </g> </g></svg>`
      },
      {
        id: 'autoService',
        color: '#1b5e20',
        hoverColor: '#124216',
        image: 'images/workshop.webp',
        svgIcon: `<svg fill="#ffffff" width="223px" height="223px" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" id="car-repair"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.6,8.7,11.5,6.5a1.05,1.05,0,0,0-.9-.5H4.4a1.05,1.05,0,0,0-.9.5L2.4,8.7,1.16,9.852a.5.5,0,0,0-.16.367V14.5a.5.5,0,0,0,.5.5h2c.2,0,.5-.2.5-.4V14h7v.5c0,.2.2.5.4.5h2.1a.5.5,0,0,0,.5-.5V10.219a.5.5,0,0,0-.16-.367ZM4.5,7h6l1,2h-8ZM5,11.6c0,.2-.3.4-.5.4H2.4c-.2,0-.4-.3-.4-.5V10.4c.1-.3.3-.5.6-.4l2,.4c.2,0,.4.3.4.5Zm8-.1c0,.2-.2.5-.4.5H10.5c-.2,0-.5-.2-.5-.4v-.7c0-.2.2-.5.4-.5l2-.4c.3-.1.5.1.6.4ZM14,2V3a1.009,1.009,0,0,1-1.017,1H5.348A2.549,2.549,0,0,1,1,3.5H3.5v-2H1A2.549,2.549,0,0,1,5.348,1h7.635A1.009,1.009,0,0,1,14,2Z"></path> </g></svg>`
      }
    ];
    
    // Track hover state for each card
    let isHovered = {};
    
    function handleMouseEnter(serviceId) {
      isHovered = { ...isHovered, [serviceId]: true };
    }
    
    function handleMouseLeave(serviceId) {
      isHovered = { ...isHovered, [serviceId]: false };
    }
    
    // Animation state
    let servicesLoaded = false;
    
    // Function to select a service
    function selectService(serviceId) {
      // Call the parent component's function with the selected service ID
      onSelectService(serviceId);
    }
    
    onMount(async () => {
      // Wait for DOM to be ready
      await tick();
      
      // Animate cards on mount
      const cards = document.querySelectorAll(".service-card");
      if (cards.length > 0) {
        // Set initial state for animation
        gsap.set(cards, { opacity: 0, y: 50 });
        
        // Animate to visible state
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          onComplete: () => {
            servicesLoaded = true;
          }
        });
      } else {
        // If cards aren't found, make them visible immediately
        servicesLoaded = true;
      }
    });

  </script>
  
  <section class="service-selection-section">
    <div class="container">
      <h2 class="section-title">{content[currentLang].serviceSelection.title}</h2>
      <p class="section-subtitle">{content[currentLang].serviceSelection.description}</p>
  
      <div class="services-grid">
        {#each services as service, i}
          <button 
            class="service-card" 
            class:hovered={isHovered[service.id]}
            style={`--card-color: ${service.color}; --card-hover: ${service.hoverColor}; transition-delay: ${100 * i}ms`}
            on:click={() => selectService(service.id)} 
            on:mouseenter={() => handleMouseEnter(service.id)}
            on:mouseleave={() => handleMouseLeave(service.id)}
            on:keydown={(e) => e.key === 'Enter' && selectService(service.id)} 
            tabindex="0" 
            role="button"
          >
            <div class="bg-image" style={`background-image: url('${service.image}')`}></div>
            <div class="color-overlay"></div>
            
            <div class="service-icon">
              {@html service.svgIcon}
            </div>
            <h3>{content[currentLang].services[service.id].title}</h3>
            <p>{content[currentLang].services[service.id].description}</p>
            <div class="card-action">
              <span>{currentLang === 'hu' ? 'Foglalás' : 'Book Now'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </section>
  
  <style>
    /* Service Selection Section */
    .service-selection-section {
      padding: 5rem 2rem;
      background-color: var(--light);
    }
  
    .section-title {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 2.2rem;
      position: relative;
    }
  
    .section-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background-color: rgba(27, 42, 75, 0.7);
    }
  
    .section-subtitle {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 3rem;
      color: var(--text-light);
      font-size: 1.1rem;
    }
  
    .services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin-top: 3rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }
  
    .service-card {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      padding: 30px 25px;
      height: 100%;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      opacity: 1;
      transform: translateY(0);
      transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 1;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      background: transparent;
    }
    
    .service-card.hovered {
      transform: translateY(-10px) scale(1.03);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
      outline: none;
    }
  
    .service-card:focus {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
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
      border-radius: 16px;
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
  
    .service-card h3 {
      font-size: 1.4rem;
      margin-bottom: 15px;
      color: #fff;
      font-weight: 600;
      position: relative;
      z-index: 2;
    }

    .service-card p {
      font-size: 0.9rem;
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
  
    /* Responsive Styles */
    @media screen and (max-width: 1200px) {
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  
    @media screen and (max-width: 768px) {
      .section-title {
        font-size: 1.8rem;
      }

      .section-subtitle {
        font-size: 1rem;
      }

      .services-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .service-card {
        min-height: 250px;
        padding: 25px 20px;
        text-align: center;
      }

      .service-icon {
        margin: 0 auto 1.2rem;
      }
      
      .service-card h3 {
        font-size: 1.3rem;
      }
      
      .service-card p {
        font-size: 0.9rem;
      }

      .card-action {
        font-size: 1.1rem;
        padding: 1rem 2.5rem;
        min-height: 52px;
        width: 100%;
        max-width: 220px;
        margin: 1rem auto 0;
      }
    }
  
    @media screen and (max-width: 480px) {
      .section-title {
        font-size: 1.5rem;
      }
      
      .section-subtitle {
        font-size: 0.9rem;
      }

      .service-card {
        min-height: 260px;
        padding: 1.2rem;
      }

      .card-action {
        font-size: 1rem;
        padding: 0.9rem 2rem;
        min-height: 48px;
        max-width: 200px;
      }
    }
    </style>