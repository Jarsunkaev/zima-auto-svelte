<script>
  import { onMount } from 'svelte';

  // API URLs from environment variables with fallbacks
  const API_BASE_URL = import.meta.env?.VITE_BACKEND_API_URL || 'https://zima-auto-backend.fly.dev';
  const GOOGLE_APPS_SCRIPT_URL = import.meta.env?.VITE_GOOGLE_DOCS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyM18UKk9ry8mg4eELgCAG_2xiJ7qeTwwGsBSs0zVuj0tXdeSSxCU-JG8txfRn3yq82Cw/exec';
  
  // Safety check for environment variables
  if (!import.meta.env) {
    console.warn('Environment variables not loaded - this may be a build issue');
  }
  
  console.log('Environment variables check:');
  console.log('import.meta.env exists:', !!import.meta.env);
  console.log('VITE_GOOGLE_DOCS_SCRIPT_URL exists:', !!import.meta.env?.VITE_GOOGLE_DOCS_SCRIPT_URL);
  console.log('VITE_GOOGLE_DOCS_SCRIPT_URL value:', import.meta.env?.VITE_GOOGLE_DOCS_SCRIPT_URL);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('GOOGLE_DOCS_SCRIPT_URL:', GOOGLE_APPS_SCRIPT_URL);
  
  // Use local backend for development, production backend for production
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const BACKEND_URL = isDevelopment ? 'http://localhost:3001' : (API_BASE_URL.includes('zima-auto-backend') ? API_BASE_URL : 'https://zima-auto-backend.fly.dev');
  
  console.log('Environment detection:', { isDevelopment, hostname: window.location.hostname, BACKEND_URL });

  // Component props
  export const lang = 'hu';

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    'ahmedhasimov@zima-auto.com': 'Hurma123',
    'alihancoskun@zima-auto.com': 'Hurma123'
  };

  let userEmail = '';
  let password = '';
  let loginError = '';
  let isAuthenticated = false;
  let isLoading = true;
  let bookings = [];
  let showPassword = false;
  let statusSelect;
  
  // Pagination state
  let currentPage = 1;
  let rowsPerPage = 50;
  let totalPages = 1;
  
  // Sorting and filtering state
  let sortField = 'TÁVOZÁS';
  let sortDirection = 'asc';
  let selectedMonth = '';
  let searchQuery = '';
  let filteredBookings = [];
  
  // Modal state for order form
  let showOrderModal = false;
  let selectedBooking = null;
  let modalScrollTop = 0;
  let isGenerating = false;
  let generationSuccess = false;
  
  // Tab management
  let activeTab = 'airport-parking';
  let sliderWidth = 0;
  let sliderLeft = 0;
  let tabRefs = {};

  const tabs = [
    { id: 'airport-parking', label: 'Airport Parking' },
    { id: 'car-wash', label: 'Car Wash' },
    { id: 'tire-service', label: 'Tire Service' },
    { id: 'car-maintenance', label: 'Car Maintenance' }
  ];

  // Maintenance tickets state
  let maintenanceTickets = [];
  let showTicketModal = false;
  let showCreateTicketModal = false;
  let selectedTicket = null;
  let isGeneratingWorkOrder = false;
  let workOrderGenerationSuccess = false;
  let draggedTicket = null;

  // Computed properties for pagination (will be updated after filtering/sorting)

  // Month filter options - will be populated dynamically
  let monthOptions = [{ value: '', label: 'Minden hónap' }];

  // Filter and sort bookings
  $: {
    if (bookings.length > 0) {
      // Start with all bookings
      let tempFiltered = [...bookings];

      // Apply search filter (searches from complete dataset)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        console.log('Searching for:', query);
        
        tempFiltered = tempFiltered.filter(booking => {
          // Only search in fields that actually have data
          const customerName = (booking["NÉV"] || '').toString().toLowerCase();
          const licensePlate = (booking["RENDSZÁM"] || '').toString().toLowerCase();
          const email = (booking["EMAIL"] || '').toString().toLowerCase();
          const phone = (booking["TELEFON"] || '').toString().toLowerCase();
          
          // Check if any field contains the search query
          const nameMatch = customerName && customerName.includes(query);
          const plateMatch = licensePlate && licensePlate.includes(query);
          const emailMatch = email && email.includes(query);
          const phoneMatch = phone && phone.includes(query);
          
          const isMatch = nameMatch || plateMatch || emailMatch || phoneMatch;
          
          if (isMatch) {
            console.log('Match found:', {
              name: customerName,
              plate: licensePlate,
              email: email,
              phone: phone,
              query: query
            });
          }
          
          return isMatch;
        });
        
        console.log('Search results:', tempFiltered.length, 'bookings found');
      }

      // Apply month filter
      if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        tempFiltered = tempFiltered.filter(booking => {
          if (!booking["TÁVOZÁS"]) return false;
          const departureDate = new Date(booking["TÁVOZÁS"]);
          if (isNaN(departureDate.getTime())) return false;
          return departureDate.getFullYear() === parseInt(year) && 
                 departureDate.getMonth() === parseInt(month) - 1;
        });
      }

      // Apply sorting
      tempFiltered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle date sorting
        if (sortField === 'TÁVOZÁS' || sortField === 'ÉRKEZÉS') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }
        // Handle numeric sorting
        else if (sortField === 'HÁNY NAP' || sortField === 'ÖSSZEG') {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }
        // Handle string sorting
        else {
          aValue = (aValue || '').toString().toLowerCase();
          bValue = (bValue || '').toString().toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });

      filteredBookings = tempFiltered;

      // Reset to first page when filtering/sorting changes
      currentPage = 1;
    }
  }

  // Update pagination for filtered data
  $: startIndex = (currentPage - 1) * rowsPerPage;
  $: endIndex = startIndex + rowsPerPage;
  $: paginatedBookings = filteredBookings.slice(startIndex, endIndex);
  $: totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  $: hasNextPage = currentPage < totalPages;
  $: hasPrevPage = currentPage > 1;

  // Drag and drop handlers
  function handleDragStart(event, ticket) {
    draggedTicket = ticket;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', ticket.id.toString());
    event.target.style.opacity = '0.5';
  }

  function handleDragEnd(event) {
    event.target.style.opacity = '1';
  }

  function handleDrop(event, newStatus) {
    event.preventDefault();
    const ticketId = event.dataTransfer.getData('text/plain');
    const ticket = maintenanceTickets.find(t => t.id.toString() === ticketId);
    
    if (ticket && ticket.status !== newStatus) {
      // Update the ticket status
      maintenanceTickets = maintenanceTickets.map(t => 
        t.id.toString() === ticketId 
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      );
    }
    draggedTicket = null;
  }

  // Pagination functions
  function scrollToTop() {
    // Scroll to the top of the table container
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      scrollToTop();
    }
  }

  function goToNextPage() {
    if (hasNextPage) {
      currentPage++;
      scrollToTop();
    }
  }

  function goToPrevPage() {
    if (hasPrevPage) {
      currentPage--;
      scrollToTop();
    }
  }

  function goToFirstPage() {
    currentPage = 1;
    scrollToTop();
  }

  function goToLastPage() {
    currentPage = totalPages;
    scrollToTop();
  }

  // Generate page numbers for pagination display
  function getPageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  function updateSlider(tabId) {
    activeTab = tabId;
    if (tabRefs[tabId]) {
      const tabElement = tabRefs[tabId];
      const container = tabElement.closest('.tab-buttons');
      const containerRect = container.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
      
      // Account for container padding and gap
      const containerPadding = 4; // 0.25rem = 4px
      const gap = 8; // 0.5rem = 8px
      
      sliderWidth = tabRect.width;
      sliderLeft = tabRect.left - containerRect.left - containerPadding;
    }
  }

  function setTabRef(tabId, element) {
    tabRefs[tabId] = element;
  }

  // Initialize slider on mount
  $: if (Object.keys(tabRefs).length > 0 && activeTab) {
    updateSlider(activeTab);
  }

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
      await loadMaintenanceTickets();
    }
    isLoading = false;
  });

  // Initialize month options and filteredBookings when bookings are loaded
  $: if (bookings.length > 0) {
    if (filteredBookings.length === 0) {
      filteredBookings = [...bookings];
    }
    generateMonthOptions();
  }

  // Generate month options from actual booking data
  function generateMonthOptions() {
    console.log('Generating month options from', bookings.length, 'bookings');
    
    const months = new Set();
    const monthNames = [
      'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
      'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
    ];

    bookings.forEach(booking => {
      if (booking["TÁVOZÁS"]) {
        const date = new Date(booking["TÁVOZÁS"]);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = date.getMonth();
          const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
          months.add(monthKey);
          console.log('Added month:', monthKey, 'from date:', booking["TÁVOZÁS"]);
        }
      }
    });

    // Convert to array and sort by date (chronological order)
    const monthArray = Array.from(months).sort((a, b) => a.localeCompare(b));
    console.log('Available months:', monthArray);
    
    monthOptions = [
      { value: '', label: 'Minden hónap' },
      ...monthArray.map(month => {
        const [year, monthNum] = month.split('-');
        return {
          value: month,
          label: `${monthNames[parseInt(monthNum) - 1]} ${year}`
        };
      })
    ];
    
    console.log('Generated month options:', monthOptions);
  }

  // Handle login
  function handleLogin() {
    loginError = '';

    if (!userEmail || !password) {
      loginError = 'Kérem, adja meg az e-mail címét és jelszót';
      return;
    }

    if (ADMIN_CREDENTIALS[userEmail] && ADMIN_CREDENTIALS[userEmail] === password) {
      isAuthenticated = true;
      localStorage.setItem('adminEmail', userEmail);
      loadBookings();
    } else {
      loginError = 'Érvénytelen e-mail cím vagy jelszó';
    }
  }

  // Handle logout
  function handleLogout() {
    isAuthenticated = false;
    userEmail = '';
    localStorage.removeItem('adminEmail');
  }

  // Modal functions for order form
  function openOrderModal(booking) {
    console.log('openOrderModal called with:', booking);
    console.log('Current modal state before opening:', { showOrderModal, selectedBooking });
    
    selectedBooking = booking;
    showOrderModal = true;
    
    // Scroll to top and prevent body scrolling when modal is open
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    
    console.log('Modal state after opening:', { showOrderModal, selectedBooking });
    console.log('Modal should now be visible:', showOrderModal && selectedBooking);
    
    // Force a re-render
    setTimeout(() => {
      console.log('Modal state after timeout:', { showOrderModal, selectedBooking });
      const modalElement = document.querySelector('.modal-overlay');
      console.log('Modal element found:', !!modalElement);
      if (modalElement) {
        console.log('Modal element styles:', window.getComputedStyle(modalElement));
      }
    }, 100);
  }

  function closeOrderModal() {
    console.log('closeOrderModal called');
    showOrderModal = false;
    selectedBooking = null;
    isGenerating = false;
    generationSuccess = false;
    
    // Re-enable body scrolling when modal is closed
    document.body.style.overflow = '';
    
    console.log('Modal state after closing:', { showOrderModal, selectedBooking });
  }

  function formatDateForDocument(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function getCurrentDate() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  }

  async function generateOrderForm() {
    try {
      console.log('Starting order form generation...');
      console.log('GOOGLE_APPS_SCRIPT_URL:', GOOGLE_APPS_SCRIPT_URL);
      console.log('Selected booking:', selectedBooking);
      
      if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === '') {
        console.error('Google Apps Script URL not configured');
        alert('Google Apps Script URL nem konfigurálva. Kérjük, lépjen kapcsolatba az adminisztrátorral. Ellenőrizze a konzolt részletekért.');
        return;
      }
      
      if (!selectedBooking) {
        console.error('No booking selected');
        alert('Nincs kiválasztott foglalás.');
        return;
      }
      
      isGenerating = true;
      generationSuccess = false;
      
      const requestData = {
        action: 'createOrderForm',
        booking: {
          name: selectedBooking["NÉV"] || '',
          licensePlate: selectedBooking["RENDSZÁM"] || '',
          arrival: formatDateForDocument(selectedBooking["ÉRKEZÉS"]) || '',
          departure: formatDateForDocument(selectedBooking["TÁVOZÁS"]) || '',
          days: selectedBooking["HÁNY NAP"] || '',
          total: selectedBooking["ÖSSZEG"] || '',
          email: selectedBooking["EMAIL"] || '',
          phone: selectedBooking["TELEFON"] || '',
          currentDate: getCurrentDate()
        }
      };
      
      console.log('Selected booking data:', selectedBooking);
      console.log('Sending request data:', requestData);
      console.log('Sending to URL:', GOOGLE_APPS_SCRIPT_URL);
      
      // Use backend proxy to avoid CORS issues
      const proxyUrl = `${BACKEND_URL}/api/generate-order-form`;
      console.log('Using proxy URL:', proxyUrl);
      
      fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Open the Google Doc in a new tab
          if (data.documentUrl) {
            window.open(data.documentUrl, '_blank');
          }
          // Download the PDF if available
          if (data.pdfUrl) {
            const a = document.createElement('a');
            a.href = data.pdfUrl;
            a.download = `megrendelolap-${selectedBooking["NÉV"].replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          generationSuccess = true;
          setTimeout(() => {
            closeOrderModal();
          }, 2000); // Show success state for 2 seconds
        } else {
          alert('Dokumentum generálása hiba: ' + (data.error || 'Ismeretlen hiba'));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Dokumentum generálása sikertelen. Kérjük, próbálja újra.');
      })
      .finally(() => {
        isGenerating = false;
      });
    } catch (error) {
      console.error('Error generating order form:', error);
      alert('Dokumentum generálása sikertelen. Kérjük, próbálja újra.');
    }
  }

  function createOrderFormContent(booking) {
    const currentDate = getCurrentDate();
    
    return `<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Megrendelőlap - ${booking["NÉV"]}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 20px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
        }
        .logo {
            font-size: 24pt;
            font-weight: bold;
            color: #00bae5;
        }
        .logo-subtitle {
            font-size: 14pt;
            font-weight: normal;
            color: #00bae5;
        }
        .title-section {
            text-align: right;
        }
        .main-title {
            font-size: 18pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        .subtitle {
            font-size: 14pt;
            margin: 5px 0 0 0;
        }
        .form-content {
            margin-top: 30px;
        }
        .form-row {
            margin-bottom: 15px;
            display: flex;
            align-items: baseline;
        }
        .form-label {
            font-weight: bold;
            min-width: 150px;
            display: inline-block;
        }
        .form-value {
            border-bottom: 1px solid #000;
            flex: 1;
            margin-left: 10px;
            padding-bottom: 2px;
        }
        .contact-info {
            margin: 30px 0;
            line-height: 1.6;
        }
        .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .date-section {
            font-weight: bold;
        }
        .signature-section {
            text-align: right;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            width: 200px;
            display: inline-block;
            margin-left: 10px;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            ZIMA<br>
            <span class="logo-subtitle">AUTO</span>
        </div>
        <div class="title-section">
            <h1 class="main-title">MEGRENDELŐLAP</h1>
            <p class="subtitle">Repülőtér Parkolás</p>
        </div>
    </div>

    <div class="form-content">
        <div class="form-row">
            <span class="form-label">Név:</span>
            <span class="form-value">${booking["NÉV"]}</span>
        </div>
        <div class="form-row">
            <span class="form-label">Rendszám:</span>
            <span class="form-value">${booking["RENDSZÁM"]}</span>
        </div>
        <div class="form-row">
            <span class="form-label">Átadás időpontja:</span>
            <span class="form-value">${formatDateForDocument(booking["ÉRKEZÉS"])}</span>
        </div>
        <div class="form-row">
            <span class="form-label">Felvétel időpontja:</span>
            <span class="form-value">${formatDateForDocument(booking["TÁVOZÁS"])}</span>
        </div>
        <div class="form-row">
            <span class="form-label">Nap:</span>
            <span class="form-value">${booking["HÁNY NAP"]}</span>
        </div>
        <div class="form-row">
            <span class="form-label">Elérhetőség:</span>
            <span class="form-value">${booking["EMAIL"]} / ${booking["TELEFON"]}</span>
        </div>
    </div>

    <div class="contact-info">
        <p><strong>Érkezéskor hívja:</strong> +36 70 555 0588</p>
        <p><strong>Email:</strong> info@zima-auto.com</p>
    </div>

    <div class="footer">
        <div class="date-section">
            Dátum: Vecsés, ${currentDate}
        </div>
        <div class="signature-section">
            <span>Megrendelő aláírása:</span>
            <span class="signature-line"></span>
        </div>
    </div>
</body>
</html>`;
  }

  function downloadOrderForm(content, customerName) {
    // Create HTML blob
    const htmlBlob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    
    // Open in new tab for printing/saving as PDF
    const newWindow = window.open(htmlUrl, '_blank');
    
    // Also create a text version as backup
    const textContent = createTextVersion(selectedBooking);
    const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const textUrl = URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = textUrl;
    a.download = `megrendelolap-${customerName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up URLs
    setTimeout(() => {
      URL.revokeObjectURL(htmlUrl);
      URL.revokeObjectURL(textUrl);
    }, 1000);
  }

  function createTextVersion(booking) {
    const currentDate = getCurrentDate();
    
    return `ZIMA AUTO

MEGRENDELŐLAP
Repülőtér Parkolás

Név: ${booking["NÉV"]}
Rendszám: ${booking["RENDSZÁM"]}
Átadás időpontja: ${formatDateForDocument(booking["ÉRKEZÉS"])}
Felvétel időpontja: ${formatDateForDocument(booking["TÁVOZÁS"])}
Nap: ${booking["HÁNY NAP"]}
Elérhetőség: ${booking["EMAIL"]} / ${booking["TELEFON"]}

Érkezéskor hívja: +36 70 555 0588
info@zima-auto.com

Dátum: Vecsés, ${currentDate}

Megrendelő aláírása: _________________________________`;
  }

  // Load bookings from backend
  async function loadBookings() {
    try {
      const url = `${BACKEND_URL}/api/bookings`;
      console.log('Fetching bookings from:', url);
      console.log('BACKEND_URL:', BACKEND_URL);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit' // Changed from 'include' to 'omit' to avoid CORS issues
      });
      
      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        console.error('Response status:', response.status);
        console.error('Response URL:', response.url);
        
        // If we're on localhost and API fails, use mock data
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.log('Using mock data for localhost testing');
          bookings = getMockBookings();
          return;
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText.substring(0, 200)}`);
      }
      
      const data = await response.json();
      console.log('Bookings data received:', data);
      bookings = data.bookings || [];
      
      // Reset to first page when new data is loaded
      currentPage = 1;
      
      // Force month options generation after data is loaded
      console.log('Bookings loaded, generating month options...');
      generateMonthOptions();
    } catch (error) {
      console.error('Error loading bookings:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        BACKEND_URL: BACKEND_URL
      });
      
      // If we're on localhost and there's an error, use mock data
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Using mock data for localhost testing due to error');
        bookings = getMockBookings();
        // Force month options generation for mock data too
        generateMonthOptions();
        return;
      }
      
      alert('Hiba a foglalások betöltésekor. ' + (error.message || 'Kérjük, ellenőrizze a konzolt részletekért.'));
    }
  }

  // Mock data for localhost testing
  function getMockBookings() {
    return [
      {
        "ID": "1",
        "NÉV": "Kovács János",
        "RENDSZÁM": "ABC-123",
        "ÉRKEZÉS": "2024-01-15T10:00:00",
        "TÁVOZÁS": "2024-01-17T14:00:00",
        "HÁNY NAP": "3",
        "ÖSSZEG": "15000 Ft",
        "EMAIL": "kovacs.janos@email.com",
        "TELEFON": "+36 30 123 4567",
        "ÁLLAPOT": "FIZETETT"
      },
      {
        "ID": "2",
        "NÉV": "Nagy Mária",
        "RENDSZÁM": "XYZ-789",
        "ÉRKEZÉS": "2024-01-16T08:00:00",
        "TÁVOZÁS": "2024-01-18T16:00:00",
        "HÁNY NAP": "2",
        "ÖSSZEG": "12000 Ft",
        "EMAIL": "nagy.maria@email.com",
        "TELEFON": "+36 20 987 6543",
        "ÁLLAPOT": "NEM FIZETETT"
      },
      {
        "ID": "3",
        "NÉV": "Szabó Péter",
        "RENDSZÁM": "DEF-456",
        "ÉRKEZÉS": "2024-01-17T12:00:00",
        "TÁVOZÁS": "2024-01-19T10:00:00",
        "HÁNY NAP": "2",
        "ÖSSZEG": "10000 Ft",
        "EMAIL": "szabo.peter@email.com",
        "TELEFON": "+36 70 555 1234",
        "ÁLLAPOT": "FIZETETT"
      }
    ];
  }

  // Update booking status
  async function updateStatus(bookingId, newStatus) {
    try {
      const url = `${BACKEND_URL}/api/update-status`;
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
      alert('Hiba a státusz frissítésekor: ' + (error.message || 'Kérjük, ellenőrizze a konzolt részletekért.'));
    }
  }

  // Sorting functions
  function handleSort(field) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
  }

  function getSortIcon(field) {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  // Filter functions
  function handleMonthFilter() {
    // Reset to first page when filter changes
    currentPage = 1;
  }

  function clearFilters() {
    selectedMonth = '';
    searchQuery = '';
    sortField = 'TÁVOZÁS';
    sortDirection = 'asc';
    currentPage = 1;
    // Regenerate month options to ensure they're up to date
    generateMonthOptions();
  }

  // Maintenance tickets functions
  async function loadMaintenanceTickets() {
    try {
      // For now, use mock data
      maintenanceTickets = getMockMaintenanceTickets();
      console.log('Maintenance tickets loaded:', maintenanceTickets.length);
    } catch (error) {
      console.error('Error loading maintenance tickets:', error);
      maintenanceTickets = getMockMaintenanceTickets(); // Fallback to mock data
    }
  }

  function getMockMaintenanceTickets() {
    return [
      {
        id: 'WO-2024-001',
        title: 'Fékrendszer javítás',
        status: 'todo',
        priority: 'high',
        customer: {
          name: 'Kovács János',
          email: 'kovacs.janos@email.com',
          phone: '+36 30 123 4567'
        },
        vehicle: {
          vin: 'WDB12345678901234',
          make: 'Mercedes-Benz',
          model: 'C-Class',
          year: 2018,
          licensePlate: 'ABC-123',
          mileage: 125000
        },
        service: {
          type: 'repair',
          description: 'Fékbetét csere, fékfolyadék cseréje',
          estimatedHours: 2.5
        },
        parts: [
          {
            partNumber: 'MB-FB-001',
            name: 'Fékbetét elöl',
            quantity: 2,
            unitPrice: 15000,
            totalPrice: 30000,
            supplier: 'Mercedes-Benz',
            status: 'ordered'
          },
          {
            partNumber: 'MB-FF-001',
            name: 'Fékfolyadék',
            quantity: 1,
            unitPrice: 5000,
            totalPrice: 5000,
            supplier: 'Mercedes-Benz',
            status: 'received'
          }
        ],
        labor: [
          {
            technician: 'Nagy Péter',
            hours: 2.5,
            rate: 8000,
            description: 'Fékrendszer javítás',
            date: new Date().toISOString()
          }
        ],
        costs: {
          partsTotal: 35000,
          laborTotal: 20000,
          tax: 11000,
          discount: 0,
          total: 66000
        },
        notes: 'Ügyfél panasza: fékek csikorognak',
        createdAt: new Date('2024-01-15T10:00:00').toISOString(),
        updatedAt: new Date('2024-01-15T10:00:00').toISOString()
      },
      {
        id: 'WO-2024-002',
        title: 'Olajcsere és szűrők',
        status: 'in-progress',
        priority: 'medium',
        customer: {
          name: 'Nagy Mária',
          email: 'nagy.maria@email.com',
          phone: '+36 20 987 6543'
        },
        vehicle: {
          vin: 'VW12345678901234',
          make: 'Volkswagen',
          model: 'Golf',
          year: 2020,
          licensePlate: 'XYZ-789',
          mileage: 45000
        },
        service: {
          type: 'maintenance',
          description: 'Motorolaj csere, olajszűrő csere, levegőszűrő csere',
          estimatedHours: 1.5
        },
        parts: [
          {
            partNumber: 'VW-OL-001',
            name: 'Motorolaj 5W-30',
            quantity: 4,
            unitPrice: 3000,
            totalPrice: 12000,
            supplier: 'Volkswagen',
            status: 'received'
          },
          {
            partNumber: 'VW-OS-001',
            name: 'Olajszűrő',
            quantity: 1,
            unitPrice: 4000,
            totalPrice: 4000,
            supplier: 'Volkswagen',
            status: 'received'
          }
        ],
        labor: [
          {
            technician: 'Szabó Gábor',
            hours: 1.5,
            rate: 8000,
            description: 'Olajcsere és szűrők',
            date: new Date().toISOString()
          }
        ],
        costs: {
          partsTotal: 16000,
          laborTotal: 12000,
          tax: 5600,
          discount: 0,
          total: 33600
        },
        notes: 'Rendszeres karbantartás',
        createdAt: new Date('2024-01-16T08:00:00').toISOString(),
        updatedAt: new Date('2024-01-16T14:30:00').toISOString()
      },
      {
        id: 'WO-2024-003',
        title: 'Vezérműszíj csere',
        status: 'done',
        priority: 'high',
        customer: {
          name: 'Szabó Péter',
          email: 'szabo.peter@email.com',
          phone: '+36 70 555 1234'
        },
        vehicle: {
          vin: 'BMW12345678901234',
          make: 'BMW',
          model: '3 Series',
          year: 2016,
          licensePlate: 'DEF-456',
          mileage: 180000
        },
        service: {
          type: 'repair',
          description: 'Vezérműszíj csere, vízpumpa csere, feszítő csere',
          estimatedHours: 4.0
        },
        parts: [
          {
            partNumber: 'BMW-VS-001',
            name: 'Vezérműszíj',
            quantity: 1,
            unitPrice: 25000,
            totalPrice: 25000,
            supplier: 'BMW',
            status: 'installed'
          },
          {
            partNumber: 'BMW-VP-001',
            name: 'Vízpumpa',
            quantity: 1,
            unitPrice: 35000,
            totalPrice: 35000,
            supplier: 'BMW',
            status: 'installed'
          }
        ],
        labor: [
          {
            technician: 'Kovács András',
            hours: 4.0,
            rate: 8000,
            description: 'Vezérműszíj csere',
            date: new Date('2024-01-14T09:00:00').toISOString()
          }
        ],
        costs: {
          partsTotal: 60000,
          laborTotal: 32000,
          tax: 18400,
          discount: 0,
          total: 110400
        },
        notes: 'Előrejelzett karbantartás - 180.000 km',
        createdAt: new Date('2024-01-14T09:00:00').toISOString(),
        updatedAt: new Date('2024-01-14T17:00:00').toISOString()
      },
      {
        id: 'WO-2024-004',
        title: 'Diagnosztika',
        status: 'todo',
        priority: 'low',
        customer: {
          name: 'Tóth Anna',
          email: 'toth.anna@email.com',
          phone: '+36 30 555 9876'
        },
        vehicle: {
          vin: 'AUDI12345678901234',
          make: 'Audi',
          model: 'A4',
          year: 2019,
          licensePlate: 'GHI-789',
          mileage: 75000
        },
        service: {
          type: 'diagnostic',
          description: 'Motorhiba diagnosztika',
          estimatedHours: 1.0
        },
        parts: [],
        labor: [
          {
            technician: 'Nagy Péter',
            hours: 1.0,
            rate: 8000,
            description: 'Diagnosztika',
            date: new Date().toISOString()
          }
        ],
        costs: {
          partsTotal: 0,
          laborTotal: 8000,
          tax: 1600,
          discount: 0,
          total: 9600
        },
        notes: 'Motor ellenőrző lámpa világít',
        createdAt: new Date('2024-01-17T11:00:00').toISOString(),
        updatedAt: new Date('2024-01-17T11:00:00').toISOString()
      }
    ];
  }

  // Reactive statements for ticket filtering
  $: todoTickets = maintenanceTickets.filter(ticket => ticket.status === 'todo');
  $: inProgressTickets = maintenanceTickets.filter(ticket => ticket.status === 'in-progress');
  $: doneTickets = maintenanceTickets.filter(ticket => ticket.status === 'done');

  function getTicketsByStatus(status) {
    return maintenanceTickets.filter(ticket => ticket.status === status);
  }

  function getStatusLabel(status) {
    const labels = {
      'todo': 'Teendő',
      'in-progress': 'Folyamatban',
      'done': 'Kész'
    };
    return labels[status] || status;
  }

  function getPriorityLabel(priority) {
    const labels = {
      'low': 'Alacsony',
      'medium': 'Közepes',
      'high': 'Magas',
      'urgent': 'Sürgős'
    };
    return labels[priority] || priority;
  }

  function openTicketModal(ticket) {
    selectedTicket = ticket;
    showTicketModal = true;
    // Prevent body scrolling and ensure modal appears in viewport
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
  }

  function closeTicketModal() {
    showTicketModal = false;
    selectedTicket = null;
    isGeneratingWorkOrder = false;
    workOrderGenerationSuccess = false;
    // Restore body styles and scroll position
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  function updateTicketStatus(ticketId) {
    const ticket = maintenanceTickets.find(t => t.id === ticketId);
    if (ticket) {
      const statusOrder = ['todo', 'in-progress', 'done'];
      const currentIndex = statusOrder.indexOf(ticket.status);
      if (currentIndex < statusOrder.length - 1) {
        ticket.status = statusOrder[currentIndex + 1];
        ticket.updatedAt = new Date().toISOString();
        maintenanceTickets = [...maintenanceTickets]; // Trigger reactivity
      }
    }
  }

  async function generateWorkOrder() {
    if (!selectedTicket) return;
    
    try {
      isGeneratingWorkOrder = true;
      workOrderGenerationSuccess = false;
      
      // Simulate work order generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call the backend
      console.log('Generating work order for ticket:', selectedTicket.id);
      
      workOrderGenerationSuccess = true;
      
      // Auto-close modal after success
      setTimeout(() => {
        closeTicketModal();
      }, 2000);
      
    } catch (error) {
      console.error('Error generating work order:', error);
      alert('Hiba a munkalap generálásakor. Kérjük, próbálja újra.');
    } finally {
      isGeneratingWorkOrder = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Panel - Zima Auto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="admin-page">
  {#if isLoading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Betöltés...</p>
    </div>
  {:else if !isAuthenticated}
    <div class="login-wrapper">
      <div class="login-container">
        <div class="login-header">
          <img src="images/zima-logo.avif" alt="Zima Auto Logo" class="login-logo" />
          <h1>Admin Panel</h1>
          <p>Kérem, jelentkezzen be a folytatáshoz</p>
        </div>

        {#if loginError}
          <div class="error-message">
            {loginError}
          </div>
        {/if}

        <form on:submit|preventDefault={handleLogin} class="login-form">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              type="email"
              bind:value={userEmail}
              placeholder="Adja meg az e-mail címét"
              class="form-input"
              autocomplete="username"
              required
            />
          </div>

          <div class="form-group">
            <div class="password-header">
              <label for="password">Jelszó</label>
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
                  placeholder="Adja meg a jelszót"
                  class="form-input"
                  autocomplete="current-password"
                  required
                />
              {:else}
                <input
                  id="password"
                  bind:value={password}
                  type="password"
                  placeholder="Adja meg a jelszót"
                  class="form-input"
                  autocomplete="current-password"
                  required
                />
              {/if}
            </div>
          </div>

          <button type="submit" class="login-button">
            Bejelentkezés
          </button>
        </form>

        <div class="login-footer">
          <p>Kapcsolatfelvétel, ha elfelejti a jelszót</p>
        </div>
      </div>
    </div>
  {:else}
    <div class="admin-layout">
      <!-- Main Content -->
      <main class="admin-main">
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <div class="tab-buttons">
            {#each tabs as tab, index}
              <button 
                class="tab-button" 
                class:active={activeTab === tab.id}
                on:click={() => updateSlider(tab.id)}
                bind:this={tabRefs[tab.id]}
              >
                <span class="tab-label">{tab.label}</span>
              </button>
            {/each}
            <div class="tab-slider" style="transform: translateX({sliderLeft}px); width: {sliderWidth}px;"></div>
          </div>
          <div class="user-info">
            <div class="user-email">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{userEmail}</span>
            </div>
            <button on:click={handleLogout} class="logout-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Kijelentkezés</span>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          {#if activeTab === 'airport-parking'}
            <div class="airport-parking-content">
              <div class="content-header">
                <div class="header-left">
                  <h2>Parkolási Foglalások</h2>
                  <p class="subtitle">Repülőtéri parkolás foglalások kezelése és nyomon követése</p>
                </div>
                <div class="header-actions">
                  <a 
                    href="https://docs.google.com/spreadsheets/d/1WfGOZdb2mSo9AZYIKjdpkQcESzGHk2zzeSuKkv3XadU/edit?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="sheet-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Táblázat megtekintése
                  </a>
                  <button on:click={loadBookings} class="refresh-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 4v6h-6"></path>
                      <path d="M1 20v-6h6"></path>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    Frissítés
                  </button>
                </div>
              </div>

              <div class="table-container">
                <!-- Filter and Sort Controls -->
                <div class="filter-controls">
                  <div class="filter-left">
                    <div class="filter-group">
                      <label for="search-input">Keresés:</label>
                      <input
                        id="search-input"
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Név, rendszám, email, telefon..."
                        class="search-input"
                      />
                    </div>
                    <div class="filter-group">
                      <label for="month-filter">Hónap szűrő:</label>
                      <div class="filter-input-group">
                        <select 
                          id="month-filter"
                          bind:value={selectedMonth}
                          on:change={handleMonthFilter}
                          class="month-select"
                        >
                          {#each monthOptions as option}
                            <option value={option.value}>{option.label}</option>
                          {/each}
                        </select>

                        <button on:click={clearFilters} class="clear-filters-btn" title="Szűrők törlése">
                          <svg fill="#fcfcfc" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z"></path>
                              <path d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z"></path>
                            </g>
                          </svg>
                          <span>Szűrők törlése</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="filter-right">
                    <span class="filter-stats">
                      {#if searchQuery.trim() || selectedMonth}
                        {filteredBookings.length} foglalás találva
                      {:else}
                        {filteredBookings.length} foglalás összesen
                      {/if}
                    </span>
                  </div>
                </div>

                <!-- Pagination Info -->
                <div class="pagination-info">
                  <div class="pagination-stats">
                    <span>Összesen {filteredBookings.length} foglalás</span>
                    <span>•</span>
                    <span>Oldal {currentPage} / {totalPages}</span>
                    <span>•</span>
                    <span>Megjelenítve {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} / {filteredBookings.length}</span>
                  </div>
                </div>
                
                <div class="table-responsive">
                  <table class="bookings-table">
                    <thead>
                      <tr>
                        <th class="sortable-header" on:click={() => handleSort('NÉV')}>
                          <span>Ügyfél neve</span>
                          <span class="sort-icon">{getSortIcon('NÉV')}</span>
                        </th>
                        <th class="sortable-header" on:click={() => handleSort('RENDSZÁM')}>
                          <span>Rendszám</span>
                          <span class="sort-icon">{getSortIcon('RENDSZÁM')}</span>
                        </th>
                        <th class="sortable-header" on:click={() => handleSort('ÉRKEZÉS')}>
                          <span>Érkezés</span>
                          <span class="sort-icon">{getSortIcon('ÉRKEZÉS')}</span>
                        </th>
                        <th class="sortable-header" on:click={() => handleSort('TÁVOZÁS')}>
                          <span>Távozás</span>
                          <span class="sort-icon">{getSortIcon('TÁVOZÁS')}</span>
                        </th>
                        <th class="sortable-header" on:click={() => handleSort('HÁNY NAP')}>
                          <span>Nap</span>
                          <span class="sort-icon">{getSortIcon('HÁNY NAP')}</span>
                        </th>
                        <th class="sortable-header" on:click={() => handleSort('ÖSSZEG')}>
                          <span>Összeg</span>
                          <span class="sort-icon">{getSortIcon('ÖSSZEG')}</span>
                        </th>
                        <th>Státusz</th>
                        <th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each paginatedBookings as booking}
                        <tr>
                          <td class="name-cell">{booking["NÉV"]}</td>
                          <td class="license-cell">{booking["RENDSZÁM"]}</td>
                          <td class="date-cell">{formatDate(booking["ÉRKEZÉS"])}</td>
                          <td class="date-cell">{formatDate(booking["TÁVOZÁS"])}</td>
                          <td class="number-cell">{booking["HÁNY NAP"]}</td>
                          <td class="total-cell">{booking["ÖSSZEG"]}</td>
                          <td>
                            <div class="status-select-container" class:paid={booking["ÁLLAPOT"] === "FIZETETT"} class:unpaid={!booking["ÁLLAPOT"] || booking["ÁLLAPOT"] === "NEM FIZETETT"}>
                              <select 
                                class="status-select"
                                value={booking["ÁLLAPOT"] || "NEM FIZETETT"}
                                on:change={(e) => {
                                  const newStatus = e.target.value;
                                  booking["ÁLLAPOT"] = newStatus;
                                  updateStatus(booking["ID"], newStatus);
                                  bookings = [...bookings];
                                }}
                              >
                                <option value="FIZETETT">FIZETETT</option>
                                <option value="NEM FIZETETT">NEM FIZETETT</option>
                              </select>
                            </div>
                          </td>
                          <td class="actions-cell">
                            <button 
                              class="document-button"
                              on:click={() => {
                                console.log('Document button clicked for booking:', booking);
                                openOrderModal(booking);
                              }}
                              title="Megrendelőlap generálása"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10,9 9,9 8,9"></polyline>
                              </svg>
                              Letöltés
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
                
                <!-- Pagination Controls -->
                {#if totalPages > 1}
                  <div class="pagination-controls">
                    <button on:click={goToFirstPage} class="pagination-button" disabled={!hasPrevPage} title="Első oldal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button on:click={goToPrevPage} class="pagination-button" disabled={!hasPrevPage} title="Előző oldal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 6l-6 6 6 6"></path>
                      </svg>
                    </button>
                    {#each getPageNumbers() as page}
                      {#if page === '...'}
                        <span class="pagination-ellipsis">...</span>
                      {:else}
                        <button 
                          on:click={() => goToPage(page)}
                          class="pagination-button"
                          class:active={currentPage === page}
                        >
                          {page}
                        </button>
                      {/if}
                    {/each}
                    <button on:click={goToNextPage} class="pagination-button" disabled={!hasNextPage} title="Következő oldal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 6l6 6-6 6"></path>
                      </svg>
                    </button>
                    <button on:click={goToLastPage} class="pagination-button" disabled={!hasNextPage} title="Utolsó oldal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          {:else if activeTab === 'car-wash'}
            <div class="coming-soon">
              <div class="coming-soon-content">
                <h2>Autómosási Foglalások</h2>
                <p>Mit siettek ti buzik? majd megcsinálom</p>
                <div class="coming-soon-features">
                  <div class="feature">
                    <span class="feature-icon">✨</span>
                    <span>Valós idejű foglalás nyomon követés</span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">📊</span>
                    <span>Részletes elemzések és jelentések</span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">🔔</span>
                    <span>Automatizált értesítések</span>
                  </div>
                </div>
              </div>
            </div>
          {:else if activeTab === 'tire-service'}
            <div class="coming-soon">
              <div class="coming-soon-content">
                <h2>Gumiabroncs Szolgáltatások</h2>
                <p>Mit siettek ti buzik? majd megcsinálom</p>
                <div class="coming-soon-features">
                  <div class="feature">
                    <span class="feature-icon">🔧</span>
                    <span>Gumiabroncs csere és javítás</span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">⚖️</span>
                    <span>Kiegyensúlyozás és igazítás</span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">📱</span>
                    <span>Mobilbarát felület</span>
                  </div>
                </div>
              </div>
            </div>
          {:else if activeTab === 'car-maintenance'}
            <div class="maintenance-dashboard">
              <div class="content-header">
                <div class="header-left">
                  <h2>Autókarbantartási Jegyek</h2>
                  <p class="subtitle">Munkalapok kezelése és nyomon követése</p>
                </div>
                <div class="header-actions">
                  <button on:click={loadMaintenanceTickets} class="refresh-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 4v6h-6"></path>
                      <path d="M1 20v-6h6"></path>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    Frissítés
                  </button>
                  <button on:click={() => showCreateTicketModal = true} class="create-ticket-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Új Jegy
                  </button>
                </div>
              </div>

              <!-- Kanban Board -->
              <div class="kanban-board">
                <!-- Todo Column -->
                <div class="kanban-column" data-status="todo">
                  <div class="column-header">
                    <h3>Teendő</h3>
                    <span class="ticket-count">{todoTickets.length}</span>
                  </div>
                  <div class="column-content" on:drop={(e) => handleDrop(e, 'todo')} on:dragover|preventDefault on:dragenter|preventDefault>
                    {#each todoTickets as ticket}
                      <div 
                        class="ticket-card" 
                        draggable="true"
                on:dragstart={(e) => handleDragStart(e, ticket)}
                on:dragend={(e) => handleDragEnd(e)}
                on:click={() => openTicketModal(ticket)}
                        on:keydown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openTicketModal(ticket);
                          }
                        }}
                        tabindex="0"
                        role="button"
                        aria-label="View ticket details for {ticket.title}"
                      >
                        <div class="ticket-header">
                          <span class="ticket-id">#{ticket.id}</span>
                          <span class="ticket-priority" class:priority-low={ticket.priority === 'low'} class:priority-medium={ticket.priority === 'medium'} class:priority-high={ticket.priority === 'high'} class:priority-urgent={ticket.priority === 'urgent'}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                        </div>
                        <div class="ticket-content">
                          <h4 class="ticket-title">{ticket.title}</h4>
                          <div class="ticket-meta">
                            <div class="customer-name">{ticket.customer.name}</div>
                            <div class="vehicle-info">
                              <span class="license-plate">{ticket.vehicle.licensePlate}</span>
                              <span class="vehicle-model">{ticket.vehicle.make} {ticket.vehicle.model}</span>
                            </div>
                          </div>
                        </div>
                        <div class="ticket-footer">
                          <span class="ticket-date">{formatDate(ticket.createdAt)}</span>
                          <button 
                            class="view-button"
                            on:click|stopPropagation={() => openTicketModal(ticket)}
                            title="Részletek megtekintése"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>

                <!-- In Progress Column -->
                <div class="kanban-column" data-status="in-progress">
                  <div class="column-header">
                    <h3>Folyamatban</h3>
                    <span class="ticket-count">{inProgressTickets.length}</span>
                  </div>
                  <div class="column-content" on:drop={(e) => handleDrop(e, 'in-progress')} on:dragover|preventDefault on:dragenter|preventDefault>
                    {#each inProgressTickets as ticket}
                      <div 
                        class="ticket-card" 
                        draggable="true"
                on:dragstart={(e) => handleDragStart(e, ticket)}
                on:dragend={(e) => handleDragEnd(e)}
                on:click={() => openTicketModal(ticket)}
                        on:keydown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openTicketModal(ticket);
                          }
                        }}
                        tabindex="0"
                        role="button"
                        aria-label="View ticket details for {ticket.title}"
                      >
                        <div class="ticket-header">
                          <span class="ticket-id">#{ticket.id}</span>
                          <span class="ticket-priority" class:priority-low={ticket.priority === 'low'} class:priority-medium={ticket.priority === 'medium'} class:priority-high={ticket.priority === 'high'} class:priority-urgent={ticket.priority === 'urgent'}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                        </div>
                        <div class="ticket-content">
                          <h4 class="ticket-title">{ticket.title}</h4>
                          <div class="ticket-meta">
                            <div class="customer-name">{ticket.customer.name}</div>
                            <div class="vehicle-info">
                              <span class="license-plate">{ticket.vehicle.licensePlate}</span>
                              <span class="vehicle-model">{ticket.vehicle.make} {ticket.vehicle.model}</span>
                            </div>
                          </div>
                        </div>
                        <div class="ticket-footer">
                          <span class="ticket-date">{formatDate(ticket.createdAt)}</span>
                          <button 
                            class="view-button"
                            on:click|stopPropagation={() => openTicketModal(ticket)}
                            title="Részletek megtekintése"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>

                <!-- Done Column -->
                <div class="kanban-column" data-status="done">
                  <div class="column-header">
                    <h3>Kész</h3>
                    <span class="ticket-count">{doneTickets.length}</span>
                  </div>
                  <div class="column-content" on:drop={(e) => handleDrop(e, 'done')} on:dragover|preventDefault on:dragenter|preventDefault>
                    {#each doneTickets as ticket}
                      <div 
                        class="ticket-card" 
                        draggable="true"
                on:dragstart={(e) => handleDragStart(e, ticket)}
                on:dragend={(e) => handleDragEnd(e)}
                on:click={() => openTicketModal(ticket)}
                        on:keydown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openTicketModal(ticket);
                          }
                        }}
                        tabindex="0"
                        role="button"
                        aria-label="View ticket details for {ticket.title}"
                      >
                        <div class="ticket-header">
                          <span class="ticket-id">#{ticket.id}</span>
                          <span class="ticket-priority" class:priority-low={ticket.priority === 'low'} class:priority-medium={ticket.priority === 'medium'} class:priority-high={ticket.priority === 'high'} class:priority-urgent={ticket.priority === 'urgent'}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                        </div>
                        <div class="ticket-content">
                          <h4 class="ticket-title">{ticket.title}</h4>
                          <div class="ticket-meta">
                            <div class="customer-name">{ticket.customer.name}</div>
                            <div class="vehicle-info">
                              <span class="license-plate">{ticket.vehicle.licensePlate}</span>
                              <span class="vehicle-model">{ticket.vehicle.make} {ticket.vehicle.model}</span>
                            </div>
                          </div>
                        </div>
                        <div class="ticket-footer">
                          <span class="ticket-date">{formatDate(ticket.createdAt)}</span>
                          <button 
                            class="view-button"
                            on:click|stopPropagation={() => openTicketModal(ticket)}
                            title="Részletek megtekintése"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </main>
    </div>
  {/if}
</div>

<!-- Order Form Modal -->
{#if showOrderModal && selectedBooking}
  <div 
    class="modal-overlay"
    style="padding-top: 150px !important;"
    on:click={closeOrderModal}
    on:keydown={(e) => {
      if (e.key === 'Escape') {
        closeOrderModal();
      }
    }}
    tabindex="-1">
    <div 
      class="modal-content"
      on:click|stopPropagation
      on:keydown={(e) => {
        if (e.key === 'Escape') {
          closeOrderModal();
        }
      }}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">
      <div class="modal-header">
        <h3 id="modal-title">Megrendelőlap Generálása</h3>
        <button 
          class="close-button"
          on:click={closeOrderModal}
          aria-label="Close modal">
          ×
        </button>
      </div>
      <div class="modal-body">
        <div class="booking-details">
          <h4>Foglalás adatai:</h4>
          <p><strong>Név:</strong> {selectedBooking["NÉV"]}</p>
          <p><strong>Rendszám:</strong> {selectedBooking["RENDSZÁM"]}</p>
          <p><strong>Érkezés:</strong> {formatDate(selectedBooking["ÉRKEZÉS"])}</p>
          <p><strong>Távozás:</strong> {formatDate(selectedBooking["TÁVOZÁS"])}</p>
          <p><strong>Nap:</strong> {selectedBooking["HÁNY NAP"]}</p>
          <p><strong>Összeg:</strong> {selectedBooking["ÖSSZEG"]}</p>
        </div>
        <button 
          class="generate-button"
          class:generating={isGenerating}
          class:success={generationSuccess}
          on:click={generateOrderForm}
          disabled={isGenerating}>
          {#if isGenerating}
            <div class="button-spinner"></div>
            <span>Generálás</span>
          {:else if generationSuccess}
            <svg class="success-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 4 12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Sikeres!</span>
          {:else}
            <span>Megrendelőlap Generálása</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Ticket Detail Modal -->
{#if showTicketModal && selectedTicket}
  <div 
    class="modal-overlay ticket-modal-overlay"
    on:click={closeTicketModal}
    on:keydown={(e) => {
      if (e.key === 'Escape') {
        closeTicketModal();
      }
    }}
    tabindex="-1">
    <div 
      class="modal-content ticket-modal-content"
      on:click|stopPropagation
      on:keydown={(e) => {
        if (e.key === 'Escape') {
          closeTicketModal();
        }
      }}
      role="dialog"
      aria-labelledby="ticket-modal-title"
      aria-modal="true">
      <div class="modal-header">
        <h3 id="ticket-modal-title">Munkalap Részletek - {selectedTicket.id}</h3>
        <button 
          class="close-button"
          on:click={closeTicketModal}
          aria-label="Close modal">
          ×
        </button>
      </div>
      <div class="modal-body ticket-modal-body">
        <!-- Ticket Header -->
        <div class="ticket-detail-header">
          <div class="ticket-title-section">
            <h2>{selectedTicket.title}</h2>
            <div class="ticket-meta-info">
              <span class="ticket-status-badge" class:status-todo={selectedTicket.status === 'todo'} class:status-in-progress={selectedTicket.status === 'in-progress'} class:status-done={selectedTicket.status === 'done'}>
                {getStatusLabel(selectedTicket.status)}
              </span>
              <span class="ticket-priority-badge" class:priority-low={selectedTicket.priority === 'low'} class:priority-medium={selectedTicket.priority === 'medium'} class:priority-high={selectedTicket.priority === 'high'} class:priority-urgent={selectedTicket.priority === 'urgent'}>
                {getPriorityLabel(selectedTicket.priority)}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer and Vehicle Info -->
        <div class="ticket-detail-section">
          <h4>Ügyfél és Jármű Adatok</h4>
          <div class="detail-grid">
            <div class="detail-group">
              <div class="detail-label">Ügyfél neve:</div>
              <div class="detail-value">{selectedTicket.customer.name}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">Email:</div>
              <div class="detail-value">{selectedTicket.customer.email}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">Telefon:</div>
              <div class="detail-value">{selectedTicket.customer.phone}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">Rendszám:</div>
              <div class="detail-value license-plate">{selectedTicket.vehicle.licensePlate}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">Jármű:</div>
              <div class="detail-value">{selectedTicket.vehicle.year} {selectedTicket.vehicle.make} {selectedTicket.vehicle.model}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">VIN:</div>
              <div class="detail-value vin-number">{selectedTicket.vehicle.vin}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">Kilométeróra:</div>
              <div class="detail-value">{selectedTicket.vehicle.mileage.toLocaleString()} km</div>
            </div>
          </div>
        </div>

        <!-- Service Details -->
        <div class="ticket-detail-section">
          <h4>Szolgáltatás Részletek</h4>
          <div class="service-details">
            <div class="detail-group">
              <div class="detail-label">Szolgáltatás típusa:</div>
              <div class="detail-value">{selectedTicket.service.type}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">Leírás:</div>
              <div class="detail-value">{selectedTicket.service.description}</div>
            </div>
            <div class="detail-group">
              <div class="detail-label">Becsült munkaóra:</div>
              <div class="detail-value">{selectedTicket.service.estimatedHours} óra</div>
            </div>
          </div>
        </div>

        <!-- Parts List -->
        {#if selectedTicket.parts && selectedTicket.parts.length > 0}
          <div class="ticket-detail-section">
            <h4>Alkatrészek</h4>
            <div class="parts-table">
              <table>
                <thead>
                  <tr>
                    <th>Cikkszám</th>
                    <th>Név</th>
                    <th>Mennyiség</th>
                    <th>Egységár</th>
                    <th>Összesen</th>
                    <th>Státusz</th>
                  </tr>
                </thead>
                <tbody>
                  {#each selectedTicket.parts as part}
                    <tr>
                      <td>{part.partNumber}</td>
                      <td>{part.name}</td>
                      <td>{part.quantity}</td>
                      <td>{part.unitPrice.toLocaleString()} Ft</td>
                      <td>{part.totalPrice.toLocaleString()} Ft</td>
                      <td>
                        <span class="part-status" class:status-ordered={part.status === 'ordered'} class:status-received={part.status === 'received'} class:status-installed={part.status === 'installed'}>
                          {part.status === 'ordered' ? 'Rendelve' : 
                           part.status === 'received' ? 'Megérkezett' : 
                           part.status === 'installed' ? 'Beszerelve' : part.status}
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}

        <!-- Labor Details -->
        {#if selectedTicket.labor && selectedTicket.labor.length > 0}
          <div class="ticket-detail-section">
            <h4>Munkaerő</h4>
            <div class="labor-table">
              <table>
                <thead>
                  <tr>
                    <th>Technikus</th>
                    <th>Leírás</th>
                    <th>Óra</th>
                    <th>Óradíj</th>
                    <th>Összesen</th>
                  </tr>
                </thead>
                <tbody>
                  {#each selectedTicket.labor as labor}
                    <tr>
                      <td>{labor.technician}</td>
                      <td>{labor.description}</td>
                      <td>{labor.hours}</td>
                      <td>{labor.rate.toLocaleString()} Ft</td>
                      <td>{(labor.hours * labor.rate).toLocaleString()} Ft</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}

        <!-- Cost Breakdown -->
        <div class="ticket-detail-section">
          <h4>Költség Bontás</h4>
          <div class="cost-breakdown">
            <div class="cost-item">
              <span>Alkatrészek:</span>
              <span>{selectedTicket.costs.partsTotal.toLocaleString()} Ft</span>
            </div>
            <div class="cost-item">
              <span>Munkaerő:</span>
              <span>{selectedTicket.costs.laborTotal.toLocaleString()} Ft</span>
            </div>
            <div class="cost-item">
              <span>ÁFA:</span>
              <span>{selectedTicket.costs.tax.toLocaleString()} Ft</span>
            </div>
            {#if selectedTicket.costs.discount > 0}
              <div class="cost-item discount">
                <span>Kedvezmény:</span>
                <span>-{selectedTicket.costs.discount.toLocaleString()} Ft</span>
              </div>
            {/if}
            <div class="cost-item total">
              <span><strong>Összesen:</strong></span>
              <span><strong>{selectedTicket.costs.total.toLocaleString()} Ft</strong></span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        {#if selectedTicket.notes}
          <div class="ticket-detail-section">
            <h4>Megjegyzések</h4>
            <div class="notes-content">
              {selectedTicket.notes}
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="ticket-actions">
          <button 
            class="generate-work-order-button"
            class:generating={isGeneratingWorkOrder}
            class:success={workOrderGenerationSuccess}
            on:click={generateWorkOrder}
            disabled={isGeneratingWorkOrder}>
            {#if isGeneratingWorkOrder}
              <div class="button-spinner"></div>
              <span>Generálás</span>
            {:else if workOrderGenerationSuccess}
              <svg class="success-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4 12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Sikeres!</span>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <span>Munkalap Generálása</span>
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

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
    background-color: #f8fafc;
    margin: 0;
    padding: 0;
  }

  /* Admin Page Layout */
  .admin-page {
    min-height: 100vh;
    background: #13151a;
    display: flex;
    flex-direction: column;
  }

  /* Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: white;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
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
    padding: 2rem;
    background: #13151a;
    margin-top: 80px; /* Add space for the main site header */
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
    max-width: 80px; /* Reduced from 120px to 80px */
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

  /* Admin Layout */
  .admin-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Main Content */
  .admin-main {
    flex: 1;
    padding: 2rem;
    margin-top: 80px; /* Add space for the main site header */
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Tab Navigation */
  .tab-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    margin-bottom: 0.5rem; /* Reduced from 1rem to 0.5rem */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    gap: 1rem;
  }

  .tab-buttons {
    display: flex;
    gap: 0.5rem;
    position: relative;
    background: #f1f5f9;
    border-radius: 8px;
    padding: 0.25rem;
    align-items: center;
  }

  .tab-slider {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    height: calc(100% - 0.5rem);
    background: white;
    border-radius: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 1;
    min-width: 80px; /* Minimum width to prevent too small slider */
    transform-origin: left center;
  }

  .tab-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #64748b;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s;
    white-space: nowrap;
    position: relative;
    z-index: 2;
    min-width: fit-content;
  }

  .tab-button:hover {
    color: #334155;
  }

  .tab-button.active {
    color: #1a202c;
  }

  .tab-label {
    font-weight: 600;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-email {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .user-email svg {
    color: #00bae5;
  }

  .logout-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: background-color 0.3s;
  }

  .logout-button:hover {
    background-color: #dc2626;
  }

  /* Tab Content */
  .tab-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* Airport Parking Content */
  .airport-parking-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: 2rem;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    flex-shrink: 0;
  }

  .header-left h2 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #7f8c8d;
    font-size: 0.95rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .sheet-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
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

  /* Filter Controls */
  .filter-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 8px 8px 0 0;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .search-input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    font-size: 0.9rem;
    color: #4a5568;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-width: 200px;
  }

  .search-input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  .search-input::placeholder {
    color: #a0aec0;
    font-style: italic;
  }

  .filter-input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .month-select {
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    font-size: 0.9rem;
    color: #4a5568;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-width: 150px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px;
  }

  .month-select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  .clear-filters-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .clear-filters-btn:hover {
    background-color: #dc2626;
  }

  .filter-right {
    display: flex;
    align-items: center;
  }

  .filter-stats {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
  }

  /* Table Container */
  .table-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .table-responsive {
    width: 100%;
    overflow: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* Table Styles */
  .bookings-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    flex: 1;
  }

  .bookings-table th {
    background-color: #f8fafc;
    color: #4a5568;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    white-space: nowrap;
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #edf2f7;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .sortable-header {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .sortable-header:hover {
    background-color: #e2e8f0;
  }

  .sortable-header span:first-child {
    margin-right: 0.5rem;
  }

  .sort-icon {
    font-size: 0.8rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .sortable-header:hover .sort-icon {
    opacity: 1;
  }

  .bookings-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #edf2f7;
    vertical-align: middle;
  }

  .bookings-table tr:hover {
    background-color: #f8fafc;
  }

  .bookings-table tr:last-child td {
    border-bottom: none;
  }

  /* Table Cell Types */
  .name-cell {
    font-weight: 600;
    color: #374151;
  }

  .license-cell {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #00bae5;
  }

  .date-cell {
    color: #6b7280;
    font-size: 0.85rem;
  }

  .number-cell {
    text-align: center;
    font-weight: 600;
    color: #374151;
  }

  .total-cell {
    font-weight: 700;
    color: #059669;
  }

  .actions-cell {
    text-align: center;
  }

  /* Document Button */
  .document-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #00bae5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .document-button:hover {
    background-color: #0088cc;
  }

  /* Status Select */
  .status-select-container {
    position: relative;
    display: inline-block;
    min-width: 140px;
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
  .status-select-container.paid .status-select {
    background-color: #10b981;
    color: white;
    border-color: #10b981;
  }

  .status-select-container.paid .status-select:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }

  /* Unpaid state */
  .status-select-container.unpaid .status-select {
    background-color: #ef4444;
    color: white;
    border-color: #ef4444;
  }

  .status-select-container.unpaid .status-select:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }

  /* Coming Soon Section */
  .coming-soon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: 3rem 2rem;
    flex: 1;
    overflow-y: auto;
  }
  
  .coming-soon-content {
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .coming-soon h2 {
    font-size: 1.75rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  .coming-soon p {
    color: #6b7280;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .coming-soon-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  
  .feature-icon {
    font-size: 1.2rem;
  }
  
  .feature span:last-child {
    color: #4a5568;
    font-weight: 500;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background-color: rgba(0, 0, 0, 0.8) !important;
    z-index: 10000000 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  .modal-content {
    background: white !important;
    border-radius: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow-y: auto !important;
    box-shadow: none !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 10000001 !important;
  }

  .modal-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 0 !important;
    padding: 1.5rem 1.5rem 1rem 1.5rem !important;
    max-width: 100% !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .modal-header h3 {
    margin: 0 !important;
    font-size: 1.5rem !important;
    color: #333 !important;
  }

  .close-button {
    background: none !important;
    border: none !important;
    font-size: 2rem !important;
    cursor: pointer !important;
    color: #666 !important;
    padding: 0 !important;
    width: 30px !important;
    height: 30px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: color 0.2s ease !important;
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 10000002 !important;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(10px) !important;
  }

  /* Override for ticket modal - ensure it stays within modal */
  .ticket-modal-overlay .close-button {
    position: relative !important;
    top: auto !important;
    right: auto !important;
    z-index: 9999999999 !important;
    background: none !important;
    backdrop-filter: none !important;
  }

  .close-button:hover {
    color: #333 !important;
  }

  .modal-body {
    color: #374151 !important;
  }

  .booking-details {
    margin-bottom: 1.5rem !important;
  }

  .booking-details h4 {
    margin: 0 0 1rem 0 !important;
    color: #333 !important;
  }

  .booking-details p {
    margin: 0.5rem 0 !important;
  }

  .generate-button {
    background-color: #2c3e50 !important;
    color: white !important;
    border: none !important;
    padding: 1rem !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    font-weight: 600 !important;
    width: 100% !important;
    font-size: 1rem !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.5rem !important;
  }

  .generate-button:hover {
    background-color: #1a252f !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3) !important;
  }

  .generate-button:active {
    transform: translateY(0) !important;
    box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2) !important;
  }

  .generate-button:disabled {
    background-color: #95a5a6 !important;
    cursor: not-allowed !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .generate-button.generating {
    background-color: #00bae5 !important;
    cursor: not-allowed !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .generate-button.success {
    background-color: #10b981 !important;
    cursor: default !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .button-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    flex-shrink: 0;
  }

  .success-icon {
    color: white;
    flex-shrink: 0;
  }

  .generate-button.generating span,
  .generate-button.success span {
    color: white;
  }

  /* Maintenance Dashboard Styles */
  .maintenance-dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: 2rem;
  }

  .create-ticket-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #10b981;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .create-ticket-button:hover {
    background-color: #059669;
  }

  /* Kanban Board */
  .kanban-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    flex: 1;
    overflow: hidden;
    padding: 1rem 0;
  }

  .kanban-column {
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: white;
    border-bottom: 1px solid #e2e8f0;
  }

  .column-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  .ticket-count {
    background: #e2e8f0;
    color: #64748b;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .column-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ticket-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.75rem;
  }

  .ticket-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #cbd5e0;
  }

  .ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .ticket-id {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #64748b;
    font-size: 0.75rem;
  }

  .ticket-priority {
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .ticket-priority.priority-low {
    background-color: #f3f4f6;
    color: #6b7280;
  }

  .ticket-priority.priority-medium {
    background-color: #fef3c7;
    color: #92400e;
  }

  .ticket-priority.priority-high {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .ticket-priority.priority-urgent {
    background-color: #fecaca;
    color: #7f1d1d;
  }

  .ticket-content {
    margin-bottom: 0.75rem;
  }

  .ticket-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .ticket-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .customer-name {
    color: #374151;
    font-weight: 500;
    font-size: 0.8rem;
  }

  .vehicle-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .license-plate {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #00bae5;
    background: #f0f9ff;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-size: 0.7rem;
    display: inline-block;
    width: fit-content;
  }

  .vehicle-model {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .ticket-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.5rem;
    border-top: 1px solid #f1f5f9;
  }

  .ticket-date {
    color: #6b7280;
    font-size: 0.7rem;
  }

  .view-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .view-button:hover {
    background-color: #2563eb;
  }


  /* Ticket Modal Styles */
  .ticket-modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background-color: rgba(0, 0, 0, 0.8) !important;
    z-index: 99999999 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 20px !important;
  }

  .ticket-modal-content {
    background: white !important;
    border-radius: 12px !important;
    padding: 0 !important;
    width: 70% !important;
    max-width: 800px !important;
    max-height: 70vh !important;
    overflow-y: auto !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
    position: relative !important;
    z-index: 999999999 !important;
  }

  .ticket-modal-body {
    padding: 1.5rem !important;
    color: #374151 !important;
    max-width: 100% !important;
    margin: 0 auto !important;
  }

  /* Ticket Modal specific close button */
  .ticket-modal-content .close-button {
    position: relative !important;
    top: auto !important;
    right: auto !important;
    background: none !important;
    border: none !important;
    font-size: 2rem !important;
    cursor: pointer !important;
    color: #666 !important;
    padding: 0 !important;
    width: 30px !important;
    height: 30px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: color 0.2s ease !important;
    z-index: 9999999999 !important;
    backdrop-filter: none !important;
    pointer-events: auto !important;
  }

  .ticket-modal-content .close-button:hover {
    color: #333 !important;
  }

  /* Ticket Modal specific header */
  .ticket-modal-content .modal-header {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    width: 100% !important;
    background: white !important;
    border-bottom: 1px solid #e2e8f0 !important;
    margin-bottom: 0 !important;
    z-index: 9999999998 !important;
    pointer-events: auto !important;
  }

  .ticket-detail-header {
    margin-bottom: 1.5rem;
    padding: 1.5rem 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .ticket-title-section h2 {
    font-size: 1.25rem;
    color: #1a202c;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .ticket-meta-info {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .ticket-status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .ticket-status-badge.status-todo {
    background-color: #fef3c7;
    color: #92400e;
  }

  .ticket-status-badge.status-in-progress {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .ticket-status-badge.status-done {
    background-color: #d1fae5;
    color: #065f46;
  }

  .ticket-priority-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .ticket-priority-badge.priority-low {
    background-color: #f3f4f6;
    color: #6b7280;
  }

  .ticket-priority-badge.priority-medium {
    background-color: #fef3c7;
    color: #92400e;
  }

  .ticket-priority-badge.priority-high {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .ticket-priority-badge.priority-urgent {
    background-color: #fecaca;
    color: #7f1d1d;
  }

  .ticket-detail-section {
    margin-bottom: 1rem;
  }

  .ticket-detail-section h4 {
    font-size: 0.9rem;
    color: #1a202c;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .detail-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .detail-value {
    color: #374151;
    font-weight: 500;
  }

  .vin-number {
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
  }

  .service-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .parts-table,
  .labor-table {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .parts-table table,
  .labor-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .parts-table th,
  .parts-table td,
  .labor-table th,
  .labor-table td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.8rem;
  }

  .parts-table th,
  .labor-table th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #4a5568;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .part-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .part-status.status-ordered {
    background-color: #fef3c7;
    color: #92400e;
  }

  .part-status.status-received {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .part-status.status-installed {
    background-color: #d1fae5;
    color: #065f46;
  }

  .cost-breakdown {
    background: #f8fafc;
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  .cost-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .cost-item:last-child {
    border-bottom: none;
  }

  .cost-item.discount {
    color: #059669;
  }

  .cost-item.total {
    border-top: 2px solid #e2e8f0;
    margin-top: 0.5rem;
    padding-top: 1rem;
    font-size: 1.1rem;
  }

  .notes-content {
    background: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    color: #374151;
    line-height: 1.6;
  }

  .ticket-actions {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
  }

  .generate-work-order-button {
    background-color: #2c3e50 !important;
    color: white !important;
    border: none !important;
    padding: 1rem 2rem !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.5rem !important;
  }

  .generate-work-order-button:hover {
    background-color: #1a252f !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3) !important;
  }

  .generate-work-order-button:active {
    transform: translateY(0) !important;
    box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2) !important;
  }

  .generate-work-order-button:disabled {
    background-color: #95a5a6 !important;
    cursor: not-allowed !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .generate-work-order-button.generating {
    background-color: #00bae5 !important;
    cursor: not-allowed !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .generate-work-order-button.success {
    background-color: #10b981 !important;
    cursor: default !important;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Pagination Info */
  .pagination-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 8px 8px 0 0;
  }

  .pagination-stats {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .pagination-stats span:nth-child(even) {
    color: #cbd5e0;
  }

  /* Pagination Controls */
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f1f5f9;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .pagination-button {
    background: none;
    border: 1px solid #e2e8f0;
    color: #4a5568;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
  }

  .pagination-button:hover:not(:disabled) {
    background-color: #f8fafc;
    border-color: #cbd5e0;
  }

  .pagination-button:disabled {
    color: #95a5a6;
    cursor: not-allowed;
    background-color: #f1f3f5;
    border-color: #e2e8f0;
  }

  .pagination-button.active {
    background-color: #2c3e50;
    color: white;
    border-color: #2c3e50;
  }

  .pagination-ellipsis {
    color: #64748b;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
  }

  /* Responsive Styles */
  @media (max-width: 1200px) {
    .admin-main {
      padding: 1.5rem;
    }
    
    .bookings-table {
      font-size: 0.85rem;
    }
    
    .bookings-table th,
    .bookings-table td {
      padding: 0.75rem;
    }
    
    .pagination-controls {
      gap: 0.25rem;
      padding: 0.75rem;
    }
    
    .pagination-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      min-width: 28px;
      height: 28px;
    }
  }
  
  @media (max-width: 992px) {
    .content-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .header-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
  
  @media (max-width: 768px) {
    .admin-main {
      padding: 1rem;
    }
    
    .filter-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
      padding: 1rem;
    }

    .filter-left {
      justify-content: center;
      gap: 1rem;
    }

    .filter-right {
      justify-content: center;
      text-align: center;
    }

    .search-input {
      min-width: 100%;
    }
    
    .tab-navigation {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .tab-buttons {
      width: 100%;
      overflow-x: auto;
      gap: 0.25rem;
      padding: 0.2rem;
    }

    .tab-slider {
      min-width: 60px; /* Smaller minimum width for mobile */
    }

    .tab-button {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
      min-width: fit-content;
    }

    .user-info {
      width: 100%;
      justify-content: space-between;
    }

    .user-email {
      font-size: 0.85rem;
    }

    .logout-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }
    
    .airport-parking-content {
      padding: 1.5rem;
    }
    
    /* Tab Navigation Mobile */
    .tab-navigation {
      padding: 0.25rem;
      gap: 0.25rem;
    }
    
    .tab-button {
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      gap: 0.5rem;
    }

    
    /* Coming Soon Mobile */
    .coming-soon {
      padding: 2rem 1rem;
      min-height: 300px;
    }

    
    .coming-soon h2 {
      font-size: 1.5rem;
    }
    
    .coming-soon p {
      font-size: 1rem;
    }
    
    /* Table Mobile */
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
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .bookings-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
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

    .actions-cell {
      justify-content: center;
    }
    
    /* Pagination Mobile */
    .pagination-info {
      padding: 0.75rem 1rem;
    }
    
    .pagination-stats {
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
    }
    
    .pagination-stats span:nth-child(even) {
      display: none;
    }
    
    .pagination-controls {
      flex-wrap: wrap;
      gap: 0.25rem;
      padding: 0.75rem;
    }
    
    .pagination-button {
      padding: 0.35rem 0.6rem;
      font-size: 0.8rem;
      min-width: 26px;
      height: 26px;
    }
    
    .pagination-ellipsis {
      padding: 0.35rem 0.6rem;
      font-size: 0.8rem;
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

    .modal-content {
      padding: 1.5rem;
      margin: 1rem;
    }
  }
</style>
