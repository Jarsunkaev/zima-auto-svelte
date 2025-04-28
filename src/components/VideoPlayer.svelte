<script>
    import { onMount, onDestroy } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    
    // Props
    export let videoSrc = "/zima_video.mp4";
    export let thumbnailSrc = "/images/zima-gate.JPG";
    
    // State
    let isModalOpen = false;
    let videoRef;
    let modalContentRef;
    
    function openModal() {
      isModalOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Initialize video when modal opens
      setTimeout(() => {
        if (videoRef) {
          videoRef.currentTime = 0;
          
          try {
            const playPromise = videoRef.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.warn('Autoplay prevented, waiting for user interaction');
              });
            }
          } catch (error) {
            console.warn('Error attempting to play video:', error);
          }
        }
      }, 300);
    }
    
    function closeModal() {
      isModalOpen = false;
      
      if (videoRef) {
        videoRef.pause();
        videoRef.currentTime = 0;
      }
      
      document.body.style.overflow = '';
    }
    
    function handleClickOutside(event) {
      if (modalContentRef && !modalContentRef.contains(event.target)) {
        closeModal();
      }
    }
    
    function handleEscKey(e) {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    }
    
    onMount(() => {
      document.addEventListener('keydown', handleEscKey);
    });
    
    onDestroy(() => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    });
  </script>
  
  <div class="video-thumbnail">
    <div 
      class="thumbnail-wrapper"
      on:click={openModal}
      on:keydown={(e) => e.key === 'Enter' && openModal()}
      role="button"
      tabindex="0"
      aria-label="Play video"
    >
      <img 
        src={thumbnailSrc} 
        alt="Video thumbnail" 
        class="thumbnail-image"
        loading="lazy"
      />
      
      <div class="play-overlay">
        <div class="play-button">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
  
  {#if isModalOpen}
    <div 
      class="modal-overlay" 
      transition:fade={{ duration: 250 }}
      on:click={handleClickOutside}
    >
      <div 
        class="modal-content"
        bind:this={modalContentRef}
        transition:scale={{ duration: 300, start: 0.9 }}
        on:click|stopPropagation
      >
        <button
          class="close-button"
          on:click={closeModal}
          aria-label="Close video"
        >
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
        
        <video
          bind:this={videoRef}
          class="video-element"
          controls
          preload="metadata"
          poster={thumbnailSrc}
          playsinline
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  {/if}
  
  <style>
    .video-thumbnail {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #000;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      aspect-ratio: 16 / 9;
    }
    
    .thumbnail-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      cursor: pointer;
      overflow: hidden;
    }
    
    .thumbnail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;
    }
    
    .thumbnail-wrapper:hover .thumbnail-image {
      transform: scale(1.05);
    }
    
    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
      transition: background 0.3s ease;
    }
    
    .thumbnail-wrapper:hover .play-overlay {
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
    }
    
    .play-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      color: var(--primary, #00bae5);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .play-button svg {
      width: 40px;
      height: 40px;
      margin-left: 5px; /* Adjust for the play triangle */
    }
    
    .thumbnail-wrapper:hover .play-button {
      transform: scale(1.1);
      background: white;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
    
    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 30px;
      box-sizing: border-box;
    }
    
    .modal-content {
      position: relative;
      width: 90%;
      max-width: 1000px;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    
    .close-button {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s ease;
      padding: 0;
    }
    
    .close-button:hover,
    .close-button:focus {
      background: rgba(0, 0, 0, 0.8);
      border-color: rgba(255, 255, 255, 0.5);
      transform: scale(1.05);
      outline: none;
    }
    
    .close-button svg {
      width: 22px;
      height: 22px;
    }
    
    .video-element {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }
    
    /* Responsive styles */
    @media (max-width: 992px) {
      .play-button {
        width: 70px;
        height: 70px;
      }
      
      .play-button svg {
        width: 35px;
        height: 35px;
      }
    }
    
    @media (max-width: 768px) {
      .modal-overlay {
        padding: 15px;
      }
      
      .play-button {
        width: 60px;
        height: 60px;
      }
      
      .play-button svg {
        width: 30px;
        height: 30px;
      }
      
      .close-button {
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
      }
      
      .close-button svg {
        width: 18px;
        height: 18px;
      }
    }
    
    @media (max-width: 480px) {
      .video-thumbnail {
        border-radius: 8px;
      }
      
      .play-button {
        width: 50px;
        height: 50px;
      }
      
      .play-button svg {
        width: 25px;
        height: 25px;
        margin-left: 3px;
      }
      
      .modal-overlay {
        padding: 10px;
      }
    }
  </style>