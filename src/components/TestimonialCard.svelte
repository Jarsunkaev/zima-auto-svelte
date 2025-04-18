<script>
    export let name;
    export let location;
    export let text;
    export let image;
  </script>
  
  <div class="testimonial-card">
    <div class="testimonial-content">
      <div class="quote-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 7H7.5C6.12 7 5 8.12 5 9.5V11C5 12.38 6.12 13.5 7.5 13.5H9V15.5C9 16.33 8.33 17 7.5 17H7C6.45 17 6 17.45 6 18C6 18.55 6.45 19 7 19H7.5C9.43 19 11 17.43 11 15.5V9C11 7.9 10.1 7 9 7ZM7.5 11.5C7.22 11.5 7 11.28 7 11V9.5C7 9.22 7.22 9 7.5 9H9V11.5H7.5Z" fill="currentColor"/>
          <path d="M19.5 7H16C14.9 7 14 7.9 14 9V15.5C14 17.43 15.57 19 17.5 19H18C18.55 19 19 18.55 19 18C19 17.45 18.55 17 18 17H17.5C16.67 17 16 16.33 16 15.5V13.5H17.5C18.88 13.5 20 12.38 20 11V9.5C20 8.12 18.88 7 17.5 7ZM18 11.5H16V9H17.5C17.78 9 18 9.22 18 9.5V11C18 11.28 17.78 11.5 17.5 11.5H18Z" fill="currentColor"/>
        </svg>
      </div>
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
  </div>
  
  <style>
    .testimonial-card {
      background-color: white;
      border-radius: 12px;
      padding: 30px;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
      height: 100%;
    }
    
    .testimonial-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    }
    
    .testimonial-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 0;
      background-color: rgba(0, 186, 229, 1);
      transition: all 0.5s ease;
    }
    
    .testimonial-card:hover::before {
      height: 100%;
    }
    
    .testimonial-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .quote-icon {
      margin-bottom: 15px;
      color: rgba(0, 186, 229, 0.2);
      transition: all 0.3s ease;
    }
    
    .testimonial-card:hover .quote-icon {
      color: rgba(0, 186, 229, 0.6);
    }
    
    .testimonial-text {
      font-size: 1rem;
      line-height: 1.7;
      color: #666;
      margin-bottom: 20px;
      flex-grow: 1;
      font-style: italic;
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      margin-top: auto;
    }
    
    .author-image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 15px;
      overflow: hidden;
      background-color: rgba(0, 186, 229, 1);
      display: flex;
      align-items: center;
      justify-content: center;
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
    }
    
    .author-info span {
      font-size: 0.85rem;
      color: #888;
    }
  </style>