<script>
  export let size = '1.5rem';
  export let color = 'var(--primary)';
</script>

<div class="spinner-container">
  <div class="spinner" style="width: {size}; height: {size}; border-color: {color};">
    <div class="spinner-inner"></div>
  </div>
</div>

<style>
  .spinner-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    position: relative;
    border: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner-inner {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid;
    border-color: inherit;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.5s linear infinite reverse;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style> 