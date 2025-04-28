<script>
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    
    let isModalOpen = false;
    let videoRef;
    let modalContentRef;
    let isMobile = false;
    
    // Check if device is mobile
    function checkMobile() {
      isMobile = window.innerWidth <= 768;
    }
    
    function openModal() {
      isModalOpen = true;
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Use setTimeout with a slight delay to ensure the DOM is fully updated before attempting to play
      setTimeout(() => {
        if (videoRef && document.body.contains(videoRef)) {
          videoRef.currentTime = 0; // Start video from the beginning every time
          const playPromise = videoRef.play();
          
          // Only handle the promise if it exists (newer browsers)
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Video playback failed:', error);
              // Don't try to restart automatically on mobile as it might cause issues
              // User can tap the video to start playback manually
            });
          }
        }
      }, 300); // 300ms delay to ensure modal transition has completed
    }
    
    function closeModal() {
      isModalOpen = false;
      if (videoRef) {
        videoRef.pause();
        videoRef.currentTime = 0; // Reset video to start
      }
      // Re-enable body scroll
      document.body.style.overflow = 'auto';
    }
    
    function handleClickOutside(event) {
      // Check if the click is outside the modal content
      if (modalContentRef && !modalContentRef.contains(event.target)) {
        closeModal();
      }
    }
    
    function handleEscKey(e) {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    }
    
    function handleResize() {
      checkMobile();
    }
    
    onMount(() => {
      // Check if mobile on initial load
      checkMobile();
      
      // Add event listeners for clicking outside and Escape key
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      window.addEventListener('resize', handleResize);
    
      // Clean up event listeners on component destroy
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
        window.removeEventListener('resize', handleResize);
        // Ensure body scroll is re-enabled if component is destroyed while modal is open
        document.body.style.overflow = 'auto';
      };
    });
    
    // Clean up body overflow style when modal closes via isModalOpen change
    $: {
      if (!isModalOpen) {
        document.body.style.overflow = 'auto';
      } else {
        // Ensure it's hidden if modal opens
        document.body.style.overflow = 'hidden';
      }
    }
  </script>
  
  <div class="video-container">
    <div
      class="thumbnail-wrapper"
      on:click={openModal}
      on:keydown={(e) => e.key === 'Enter' && openModal()}
      role="button"
      tabindex="0"
      aria-label="Play video"
    >
      <div class="thumbnail">
        <img
          src="/images/zima-gate.jpg"
          alt="Zima Auto video thumbnail"
          class="thumbnail-image"
        />
        <div class="play-overlay">
          <div class="play-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  
    {#if isModalOpen}
      <div class="modal-overlay" transition:fade={{ duration: 300 }}>
        <div
          bind:this={modalContentRef}
          class="modal-content {isMobile ? 'mobile' : ''}"
        >
          <button
            class="close-button"
            on:click={closeModal}
            aria-label="Close video"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
  
          <video
            bind:this={videoRef}
            class="video-player"
            controls
            autoplay
            loop
            playsinline
            muted 
            preload="auto"
          >
            <source src="/zima_video.mp4" type="video/mp4" />
            <track kind="captions" src="/captions.vtt" srclang="en" label="English" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    {/if}
  </div>
  
  <style>
    .video-container {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      overflow: hidden;
    }
  
    .thumbnail-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease;
    }
  
    .thumbnail-wrapper:hover {
      transform: translateY(-5px) scale(1.01);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
  
    .thumbnail {
      position: relative;
      width: 100%;
      height: 100%;
    }
  
    .thumbnail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      transition: transform 0.7s ease;
    }
    
    .thumbnail-wrapper:hover .thumbnail-image {
      transform: scale(1.05);
    }
  
    .play-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.4s ease;
    }
  
    .thumbnail-wrapper:hover .play-overlay {
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
    }
  
    .play-button {
      width: 90px;
      height: 90px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
  
    .play-button svg {
      width: 45px;
      height: 45px;
      color: var(--primary, #00bae5);
      margin-left: 5px;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }
  
    .thumbnail-wrapper:hover .play-button {
      transform: scale(1.1);
      background: white;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }
  
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
  
    .modal-content {
      position: relative;
      width: 85%;
      max-width: 1200px;
      height: auto;
      max-height: 85vh;
      border-radius: 12px;
      overflow: hidden;
      background: #000;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      /* Ensure the modal is centered both horizontally and vertically */
      margin: 0 auto;
    }
  
    /* Special class for mobile view */
    .modal-content.mobile {
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  
    .close-button {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 48px;
      height: 48px;
      background: rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s ease;
      opacity: 0.8;
    }
  
    .close-button:hover {
      background: rgba(0, 0, 0, 0.8);
      border-color: rgba(255, 255, 255, 0.5);
      opacity: 1;
      transform: scale(1.05);
    }
  
    .close-button svg {
      width: 24px;
      height: 24px;
      stroke-width: 2.5px;
    }
  
    .video-player {
      display: block;
      width: 100%;
      height: auto;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 8px;
    }
  
    /* Mobile styles applied to .modal-content.mobile */
    .modal-content.mobile .video-player {
      height: 100%;
      max-height: 100%;
      width: 100%;
      border-radius: 0;
      object-position: center;
    }
  
    /* Responsive adjustments */
    @media screen and (max-width: 1200px) {
      .play-button {
        width: 80px;
        height: 80px;
      }
      
      .play-button svg {
        width: 38px;
        height: 38px;
      }
    }
  
    @media screen and (max-width: 768px) {
      .video-container {
        padding-bottom: 65%; /* Slightly taller aspect ratio on tablets */
      }
      
      .modal-content {
        width: 95%;
      }
      
      .play-button {
        width: 70px;
        height: 70px;
      }
      
      .play-button svg {
        width: 32px;
        height: 32px;
      }
      
      .close-button {
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
      }
    }
  
    @media screen and (max-width: 480px) {
      .video-container {
        padding-bottom: 75%; /* Even taller aspect ratio on phones */
      }
      
      .play-button {
        width: 60px;
        height: 60px;
      }
      
      .play-button svg {
        width: 28px;
        height: 28px;
        margin-left: 3px;
      }
      
      .close-button {
        top: 1rem;
        right: 1rem;
        width: 36px;
        height: 36px;
        opacity: 0.9;
        z-index: 2000;
      }
      
      .close-button svg {
        width: 20px;
        height: 20px;
      }
    }
  </style>