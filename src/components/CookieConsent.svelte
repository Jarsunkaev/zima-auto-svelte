<script>
  import { onMount, onDestroy } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { page } from '$app/stores';
  import { Banner } from '@beyonk/gdpr-cookie-consent-banner';

  let banner;

  onMount(() => {
    // Initialize the banner
    banner = new Banner({
      heading: $_('cookieConsent.title'),
      description: $_('cookieConsent.message'),
      acceptButtonLabel: $_('cookieConsent.accept'),
      rejectButtonLabel: $_('cookieConsent.decline'),
      categories: [
        {
          name: 'necessary',
          label: $_('cookieConsent.categories.necessary'),
          description: $_('cookieConsent.categories.necessaryDesc'),
          checked: true,
          disabled: true
        },
        {
          name: 'analytics',
          label: $_('cookieConsent.categories.analytics'),
          description: $_('cookieConsent.categories.analyticsDesc'),
          checked: false
        },
        {
          name: 'marketing',
          label: $_('cookieConsent.categories.marketing'),
          description: $_('cookieConsent.categories.marketingDesc'),
          checked: false
        },
        {
          name: 'preferences',
          label: $_('cookieConsent.categories.preferences'),
          description: $_('cookieConsent.categories.preferencesDesc'),
          checked: false
        }
      ],
      onAccept: (categories) => {
        // Handle accepted categories
        console.log('Accepted categories:', categories);
      },
      onReject: (categories) => {
        // Handle rejected categories
        console.log('Rejected categories:', categories);
      }
    });
  });

  // Cleanup on component destroy
  onDestroy(() => {
    if (banner) {
      banner.destroy();
    }
  });
</script>

<div id="cookie-consent-container"></div>

<style>
  :global(#cookie-consent-container) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  :global(.cookie-consent-banner) {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  :global(.cookie-consent-banner button) {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0.5rem;
  }

  :global(.cookie-consent-banner .accept) {
    background: var(--primary);
    color: white;
  }

  :global(.cookie-consent-banner .reject) {
    background: #f5f5f5;
    color: var(--text);
  }
</style> 