<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let isModalOpen = false;
  let videoRef;
  let modalRef;
  let isMobile = window.innerWidth <= 768;
  
  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    if (videoRef) videoRef.pause();
  }

  function handleClickOutside(event) {
    if (modalRef && !modalRef.contains(event.target)) {
      closeModal();
    }
  }

  function handleEscKey(e) {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }
  }

  onMount(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscKey);
    };
  });
</script>

<div class="video-container">
  <div 
    class="thumbnail-wrapper"
    on:click={openModal}
    on:keydown={(e) => e.key === 'Enter' && openModal()}
    role="button"
    tabindex="0"
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
    <div class="modal-overlay" transition:fade>
      <div 
        bind:this={modalRef}
        class="modal-content"
        class:mobile={isMobile}
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
          playsinline
        >
          <source src="/zima_video.mov" type="video/quicktime" />
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
    height: 100%;
  }

  .thumbnail-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .thumbnail-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }

  .thumbnail {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 9/16;
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .thumbnail-wrapper:hover .play-overlay {
    background: rgba(0, 0, 0, 0.4);
  }

  .play-button {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }

  .play-button svg {
    width: 40px;
    height: 40px;
    color: var(--primary);
    margin-left: 4px;
  }

  .thumbnail-wrapper:hover .play-button {
    transform: scale(1.1);
    background: white;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    position: relative;
    width: 100%;
    max-width: 400px;
    max-height: 90vh;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
  }

  .modal-content.mobile {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.3s ease;
  }

  .close-button:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .close-button svg {
    width: 24px;
    height: 24px;
  }

  .video-player {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>