<script>
  import { onMount } from 'svelte';

  // API URLs from environment variables with fallbacks
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://zima-auto-backend.fly.dev';
  const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
  
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('GOOGLE_APPS_SCRIPT_URL:', GOOGLE_APPS_SCRIPT_URL);

  // Component props
  export const lang = 'hu';

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    'ahmedhasimov@zima-auto.com': 'Hurma123',
    'alihancoskun@zima-auto.com': 'Hurma123'
  };
// ADMIN_EMAILS is not needed; rely only on ADMIN_CREDENTIALS for admin checks.

  let userEmail = '';
  let password = '';
  let loginError = '';
  let isAuthenticated = false;
  let isLoading = true;
  let bookings = [];
  let showPassword = false;
  let statusSelect;

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    // Format as YYYY-MM-DD HH:mm (local time)
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Check authentication on component mount
  onMount(async () => {
    // Check if user is already logged in
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail && Object.keys(ADMIN_CREDENTIALS).includes(savedEmail)) {
      userEmail = savedEmail;
      isAuthenticated = true;
      await loadBookings();
    }
    isLoading = false;
  });

  // Handle login
  function handleLogin() {
    loginError = '';

    if (!userEmail || !password) {
      loginError = 'Please enter both email and password';
      return;
    }

    if (ADMIN_CREDENTIALS[userEmail] && ADMIN_CREDENTIALS[userEmail] === password) {
      isAuthenticated = true;
      localStorage.setItem('adminEmail', userEmail);
      loadBookings();
    } else {
      loginError = 'Invalid email or password';
    }
  }

  // Handle logout
  function handleLogout() {
    isAuthenticated = false;
    userEmail = '';
    localStorage.removeItem('adminEmail');
  }

  // Load bookings from backend
  async function loadBookings() {
    try {
      const url = `${API_BASE_URL}/bookings`;
      console.log('Fetching bookings from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Bookings data received:', data);
      bookings = data.bookings || [];
    } catch (error) {
      console.error('Error loading bookings:', error);
      alert('Error loading bookings. ' + (error.message || 'Please check console for details.'));
    }
  }

  // Update booking status
  async function updateStatus(bookingId, newStatus) {
    try {
      const url = `${API_BASE_URL}/update-status`;
      console.log('Updating status at:', url, { id: bookingId, status: newStatus });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ id: bookingId, status: newStatus })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the bookings
      await loadBookings();
      console.log(`Status updated successfully for booking ${bookingId} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + (error.message || 'Please check console for details.'));
    }
  }
</script>

<svelte:head>
  <title>Admin Panel - Zima Auto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="admin-page">
  {#if isLoading}
    <div class="content-container">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  {:else if !isAuthenticated}
    <div class="login-wrapper">
      <div class="login-container">
        <div class="login-header">
          <img src="images/zima-logo.avif" alt="Zima Auto Logo" class="login-logo" />
          <h1>Admin Panel</h1>
          <p>Please sign in to continue</p>
        </div>

        {#if loginError}
          <div class="error-message">
            {loginError}
          </div>
        {/if}

        <form on:submit|preventDefault={handleLogin} class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              bind:value={userEmail}
              placeholder="Enter your email"
              class="form-input"
              autocomplete="username"
              required
            />
          </div>

          <div class="form-group">
            <div class="password-header">
              <label for="password">Password</label>
              <button 
                type="button" 
                class="toggle-password"
                on:click={() => showPassword = !showPassword}
              >
                {#if showPassword}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                {/if}
              </button>
            </div>
            <div class="password-input-container">
              {#if showPassword}
                <input
                  id="password"
                  bind:value={password}
                  type="text"
                  placeholder="Enter your password"
                  class="form-input"
                  autocomplete="current-password"
                  required
                />
              {:else}
                <input
                  id="password"
                  bind:value={password}
                  type="password"
                  placeholder="Enter your password"
                  class="form-input"
                  autocomplete="current-password"
                  required
                />
              {/if}
            </div>
          </div>

          <button type="submit" class="login-button">
            Sign In
          </button>
        </form>

        <div class="login-footer">
          <p>Contact support if you forgot your password</p>
        </div>
      </div>
    </div>
  {:else}
    <div class="content-container">
      <div class="admin-panel">
        <header class="admin-header">
        <div class="header-content">
          <div class="logo-container">
            <h1>Zima Auto Admin</h1>
          </div>
          <div class="user-info">
            <div class="user-email">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{userEmail}</span>
            </div>
            <button on:click={handleLogout} class="logout-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <div class="content-header">
          <h2>Airport Parking Bookings</h2>
          <div class="header-actions">
            <a 
              href="https://docs.google.com/spreadsheets/d/1WfGOZdb2mSo9AZYIKjdpkQcESzGHk2zzeSuKkv3XadU/edit?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              class="sheet-link"
            >
              View Sheet
            </a>
            <button on:click={loadBookings} class="refresh-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="bookings-table">
            <thead>
              <tr>
                <th class="name-header">NÉV</th>
                <th>RENDSZÁM</th>
                <th>ÉRKEZÉS</th>
                <th>TÁVOZÁS</th>
                <th>NAP</th>
                <th>FŐ</th>
                <th>ÖSSZEG</th>
                <th>EMAIL</th>
                <th>TELEFON</th>
                <th>ÁLLAPOT</th>
              </tr>
            </thead>
            <tbody>
              {#each bookings as booking}
                <tr>
                  <td class="name-cell">{booking["NÉV"]}</td>
                  <td>{booking["RENDSZÁM"]}</td>
                  <td>{formatDate(booking["ÉRKEZÉS"])}</td>
                  <td>{formatDate(booking["TÁVOZÁS"])}</td>
                  <td class="number-cell">{booking["HÁNY NAP"]}</td>
                  <td class="number-cell">{booking["HÁNY FŐ"]}</td>
                  <td class="number-cell">{booking["ÖSSZEG"]}</td>
                  <td class="email-cell">{booking["EMAIL"]}</td>
                  <td>{booking["TELEFON"]}</td>
                  <td>
                    <div class="status-select-container" class:paid={booking["ÁLLAPOT"] === "FIZETETT"} class:unpaid={!booking["ÁLLAPOT"] || booking["ÁLLAPOT"] === "NEM FIZETETT"}>
                      <select 
                        class="status-select"
                        value={booking["ÁLLAPOT"] || "NEM FIZETETT"}
                        on:change={(e) => {
                          const newStatus = e.target.value;
                          booking["ÁLLAPOT"] = newStatus;
                          updateStatus(booking["ID"], newStatus);
                          // Force update
                          bookings = [...bookings];
                        }}
                      >
                        <option value="FIZETETT">FIZETETT</option>
                        <option value="NEM FIZETETT">NEM FIZETETT</option>
                      </select>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </main>
    </div>
</div>
{/if}
</div>

<style>
  /* Base Styles */
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  :global(html, body) {
    height: 100%;
    font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #13151a;
    margin: 0;
    padding: 0;
  }

:global(html, body) {
        height: 100%;
        font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
      }
      
      .admin-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #13151a;
        padding: 2rem;
      }
      
      .content-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-top: 6rem;
        /* Increased to push the white container further below the sticky header */
      }
      
      /* Loading State */
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 2rem;
      }
      
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #2c3e50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Login Page */
      .login-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
        background-color: #f5f7fa;
      }
      
      .login-container {
        width: 100%;
        max-width: 420px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        padding: 2.5rem;
      }
      
      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .login-logo {
        max-width: 120px;
        margin-bottom: 1.5rem;
      }
      
      .login-header h1 {
        font-size: 1.75rem;
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }
      
      .login-header p {
        color: #7f8c8d;
        font-size: 0.95rem;
      }
      
      .login-form {
        margin-top: 2rem;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2c3e50;
        font-size: 0.9rem;
      }
      
      .form-input {
        width: 100%;
        padding: 0.85rem 1rem;
        border: 1px solid #e1e5ee;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;
        background-color: #f8fafc;
      }
      
      .form-input:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
      }
      
      .password-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .password-input-container {
        position: relative;
      }
      
      .toggle-password {
        background: none;
        border: none;
        color: #7f8c8d;
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;
      }
      
      .toggle-password:hover {
        background-color: #f1f3f5;
      }
      
      .login-button {
        width: 100%;
        padding: 1rem;
        background-color: #2c3e50;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-top: 0.5rem;
      }
      
      .login-button:hover {
        background-color: #1a252f;
      }
      
      .login-footer {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 0.85rem;
        color: #7f8c8d;
      }
      
      .error-message {
        background-color: #fee2e2;
        color: #b91c1c;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        text-align: center;
      }
  .admin-page {
    background: #13151a;
    border-radius: 0;
    box-shadow: none;
    height: 100vh;
    padding: 2rem;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #2c3e50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Login Page */
  .login-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
    background-color: #13151a;
  }
  
  .login-container {
    width: 100%;
    max-width: 420px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 2.5rem;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .login-logo {
    max-width: 120px;
    margin-bottom: 1.5rem;
  }
  
  .login-header h1 {
    font-size: 1.75rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .login-header p {
    color: #7f8c8d;
    font-size: 0.95rem;
  }
  
  .login-form {
    margin-top: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: 0.9rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid #e1e5ee;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
    background-color: #f8fafc;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }
  
  .password-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .password-input-container {
    position: relative;
  }
  
  .toggle-password {
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .toggle-password:hover {
    background-color: #f1f3f5;
  }
  
  .login-button {
    width: 100%;
    padding: 1rem;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 0.5rem;
  }
  
  .login-button:hover {
    background-color: #1a252f;
  }
  
  .login-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.85rem;
    color: #7f8c8d;
  }
  
  .error-message {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    text-align: center;
  }
  
  /* Admin Panel */
  .admin-panel {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .admin-header {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .header-logo {
    height: 40px;
    width: auto;
  }
  
  .admin-header h1 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .user-email {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4a5568;
    font-size: 0.95rem;
  }
  
  .logout-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 1px solid #e2e8f0;
    color: #4a5568;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s;
  }
  
  .logout-button:hover {
    background-color: #f8fafc;
    border-color: #cbd5e0;
  }
  
  .admin-content {
    flex: 1;
    padding: 2rem;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }
  
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .sheet-link {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #13151a;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }
  
  .sheet-link:hover {
    background-color: #1f2229;
  }
  
  .content-header h2 {
    font-size: 1.5rem;
    color: #2c3e50;
  }
  
  .refresh-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 1px solid #e2e8f0;
    color: #4a5568;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s;
  }
  
  .refresh-button:hover {
    background-color: #f8fafc;
    border-color: #cbd5e0;
  }
  
  /* Table Styles */
  .table-responsive {
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    margin-top: 1rem;
  }
  
  .bookings-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    table-layout: fixed;
  }
  
  .name-header {
    width: 200px;
    min-width: 200px;
  }
  
  .name-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  
  .email-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .number-cell {
    text-align: center;
  }
  
  .bookings-table th,
  .bookings-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #edf2f7;
  }
  
  /* Make status column wider */
  .bookings-table th:nth-child(11),
  .bookings-table td:nth-child(11) {
    min-width: 200px;
  }
  
  .bookings-table th {
    background-color: #f8fafc;
    color: #4a5568;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  
  .bookings-table tr:last-child td {
    border-bottom: none;
  }
  
  .bookings-table tr:hover {
    background-color: #f8fafc;
  }
  
  .status-select-container {
    position: relative;
    display: inline-block;
    min-width: 180px; /* Increased from 140px to 180px */
  }
  
  .status-select {
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    background: white;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    width: 100%;
    transition: all 0.2s ease;
    text-align: center;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.7em top 50%;
    background-size: 1em auto;
    padding-right: 2.5em;
  }
  
  .status-select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }
  
  /* Paid state */
  .status-select-container.paid select.status-select {
    background-color: #10b981;
    color: white;
    border-color: #10b981;
  }
  
  .status-select-container.paid select.status-select:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }
  
  /* Unpaid state */
  .status-select-container.unpaid select.status-select {
    background-color: #ef4444;
    color: white;
    border-color: #ef4444;
  }
  
  .status-select-container.unpaid select.status-select:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }
  
  /* Status specific styles */
  select.status-select option[value="Fizetve"] {
    background-color: white;
    color: #333;
  }
  
  select.status-select:has(option[value="Fizetve"]:checked) {
    background-color: #10b981;
    color: white;
    border-color: #10b981;
  }
  
  select.status-select:has(option[value="Fizetve"]:checked):focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }
  
  select.status-select:has(option[value="Nem fizetve"]:checked),
  select.status-select:not(:has(option[selected])) {
    background-color: #ef4444;
    color: white;
    border-color: #ef4444;
  }
  
  select.status-select:has(option[value="Nem fizetve"]:checked):focus,
  select.status-select:not(:has(option[selected])):focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }
  
  /* Responsive Styles */
  @media (max-width: 1200px) {
    .admin-content {
      padding: 1.5rem;
    }
    
    .bookings-table {
      font-size: 0.85rem;
    }
    
    .bookings-table th,
    .bookings-table td {
      padding: 0.75rem;
    }
  }
  
  @media (max-width: 992px) {
    .content-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .content-header h2 {
      margin-bottom: 0.5rem;
    }
    
    .refresh-button {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 768px) {
    .admin-header {
      padding: 1rem;
    }
    
    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .logo-container {
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 1px solid #edf2f7;
    }
    
    .user-info {
      justify-content: space-between;
    }
    
    .admin-content {
      padding: 1rem;
    }
    
    .bookings-table {
      display: block;
    }
    
    .bookings-table thead {
      display: none;
    }
    
    .bookings-table tbody {
      display: block;
      width: 100%;
    }
    
    .bookings-table tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .bookings-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      text-align: right;
      border-bottom: 1px solid #edf2f7;
    }
    
    .bookings-table td:before {
      content: attr(data-label);
      font-weight: 600;
      color: #4a5568;
      margin-right: 1rem;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
    
    .bookings-table td:last-child {
      border-bottom: none;
    }
    
    .status-select {
      width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    .login-container {
      padding: 1.5rem;
    }
    
    .login-header h1 {
      font-size: 1.5rem;
    }
    
    .login-logo {
      max-width: 100px;
    }
    
    .form-input,
    .login-button {
      padding: 0.75rem;
    }
  }
</style>
