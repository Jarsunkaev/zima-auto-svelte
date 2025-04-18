<script>
    export let id;
    export let icon;
    export let image;
    export let title;
    export let description;
  </script>
  
  <div class="service-card">
    <div class="service-icon">
      <img src={icon} alt={title} />
    </div>
    <div class="service-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <div class="service-image" style="background-image: url('{image}')"></div>
  </div>
  
  <style>
    .service-card {
      position: relative;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.4s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      z-index: 1;
      height: 350px;
      display: flex;
      flex-direction: column;
    }
    
    .service-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
      padding: 0 25px 30px;
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
      opacity: 0;
      transition: all 0.5s ease;
      z-index: 2;
    }
    
    .service-card:hover .service-image {
      opacity: 0.07;
    }
  </style>