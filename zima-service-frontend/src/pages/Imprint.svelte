<script>
  export let lang = 'hu';
</script>

<svelte:head>
  <title>{lang === 'hu' ? 'Impresszum' : 'Imprint'} - Zima Auto</title>
  <meta name="description" content={lang === 'hu' ? 'Zima Auto Kft. impresszum és cégadatok' : 'Zima Auto Kft. imprint and company information'}>
</svelte:head>

<div class="page-container">
  <div class="content-wrapper">
    <div class="page-header">
      <h1>{lang === 'hu' ? 'Impresszum' : 'Imprint'}</h1>
      <p>{lang === 'hu' ? 'Zima Auto Korlátolt Felelősségű Társaság hivatalos adatai' : 'Official company information of Zima Auto Limited Liability Company'}</p>
    </div>

    <div class="imprint-content">
      <div class="company-section">
        <h2>{lang === 'hu' ? '1. Általános adatok' : '1. General Data'}</h2>
        <div class="terms-text">
          <p><strong>Cégjegyzékszám:</strong> 13 09 232195</p>
          <p><strong>Cég állapota:</strong> Működik</p>
        </div>
      </div>

      <div class="company-section">
        <h2>{lang === 'hu' ? '2. A cég elnevezése' : '2. Company Name'}</h2>
        <div class="terms-text">
          <p><strong>Teljes név:</strong> Zima Autó Korlátolt Felelősségű Társaság</p>
          <p><strong>Bejegyzés kelte:</strong> 2024.02.06.</p>
          <p><strong>Hatályos:</strong> 2024.02.06. - ...</p>
          <p><strong>Közzétéve:</strong> 2024.02.07.</p>
        </div>
      </div>

      <div class="company-section">
        <h2>{lang === 'hu' ? '3. A cég rövidített elnevezése' : '3. Company Short Name'}</h2>
        <div class="terms-text">
          <p><strong>Rövidített név:</strong> Zima Autó Kft.</p>
          <p><strong>Bejegyzés kelte:</strong> 2024.02.06.</p>
          <p><strong>Hatályos:</strong> 2024.02.06. - ...</p>
          <p><strong>Közzétéve:</strong> 2024.02.07.</p>
        </div>
      </div>

      <div class="company-section">
        <h2>{lang === 'hu' ? '5. A cég székhelye' : '5. Company Registered Office'}</h2>
        <div class="terms-text">
          <p><strong>Cím:</strong> 2220 Vecsés, Ipari utca 1.</p>
          <p><strong>Változás időpontja:</strong> 2024.03.20.</p>
          <p><strong>Bejegyzés kelte:</strong> 2024.03.27.</p>
          <p><strong>Hatályos:</strong> 2024.03.20. - ...</p>
          <p><strong>Közzétéve:</strong> 2024.03.29.</p>
        </div>
      </div>

      <div class="company-section">
        <h2>{lang === 'hu' ? '9. A cég tevékenységi köre(i)' : '9. Company Business Activities'}</h2>
        <div class="activities-list">
          <div class="activity-item">
            <div class="activity-code">9531'25</div>
            <div class="activity-details">
              <div class="activity-name">Gépjármű javítása, karbantartása</div>
              <div class="activity-type">Főtevékenység</div>
              <div class="activity-dates">
                <span>Változás időpontja: 2025.01.01.</span>
                <span>Bejegyzés kelte: 2025.01.18.</span>
                <span>Hatályos: 2025.01.01. - ...</span>
                <span>Közzétéve: 2025.01.25.</span>
              </div>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-code">5221'25</div>
            <div class="activity-details">
              <div class="activity-name">Szárazföldi szállítást kiegészítő szolgáltatás</div>
              <div class="activity-dates">
                <span>Változás időpontja: 2025.01.01.</span>
                <span>Bejegyzés kelte: 2025.01.21.</span>
                <span>Hatályos: 2025.01.01. - ...</span>
                <span>Közzétéve: 2025.01.25.</span>
              </div>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-code">8123'25</div>
            <div class="activity-details">
              <div class="activity-name">Egyéb takarítás</div>
              <div class="activity-dates">
                <span>Változás időpontja: 2025.01.01.</span>
                <span>Bejegyzés kelte: 2025.01.21.</span>
                <span>Hatályos: 2025.01.01. - ...</span>
                <span>Közzétéve: 2025.01.25.</span>
              </div>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-code">5611'25</div>
            <div class="activity-details">
              <div class="activity-name">Éttermi vendéglátás</div>
              <div class="activity-dates">
                <span>Változás időpontja: 2025.02.25.</span>
                <span>Bejegyzés kelte: 2025.03.13.</span>
                <span>Hatályos: 2025.02.25. - ...</span>
                <span>Közzétéve: 2025.03.14.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="company-section">
        <h2>{lang === 'hu' ? '32. A cég pénzforgalmi jelzőszáma' : '32. Company Bank Account Numbers'}</h2>
        <div class="bank-accounts">
          <div class="bank-account">
            <div class="account-number">11713177-21462236-00000000</div>
            <div class="bank-details">
              <div class="bank-name">OTP Budapesti r., XIII. Váci út</div>
              <div class="bank-address">1138 Budapest, Váci út 135-139.</div>
              <div class="account-info">
                <span>A számla nyitási dátuma: 2024.02.06.</span>
                <span>Cégjegyzékszám: 01 10 041585</span>
                <span>Bejegyzés kelte: 2024.02.12.</span>
                <span>Hatályos: 2024.02.12. - ...</span>
                <span>Közzétéve: 2024.02.14.</span>
              </div>
            </div>
          </div>

          <div class="bank-account">
            <div class="account-number">11763134-45493881-00000000</div>
            <div class="bank-details">
              <div class="bank-name">OTP XIII.ker. Belföldiek Devizái</div>
              <div class="bank-address">1055 Budapest, Nyugati tér 9.</div>
              <div class="account-info">
                <span>A számla nyitási dátuma: 2024.02.06.</span>
                <span>Cégjegyzékszám: 01 10 041585</span>
                <span>Bejegyzés kelte: 2024.02.12.</span>
                <span>Hatályos: 2024.02.12. - ...</span>
                <span>Közzétéve: 2024.02.14.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .page-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #13151a 0%, #1a1d24 100%);
    padding-top: 80px;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
  }

  .page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #00bae5, #0088cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-header p {
    font-size: 1.1rem;
    color: #a0aec0;
    margin: 0;
  }

  .imprint-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .company-section {
    padding: 2rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .company-section:last-child {
    border-bottom: none;
  }

  .company-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #00bae5;
  }

  .info-grid {
    display: grid;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #00bae5;
  }

  .info-item .label {
    font-weight: 600;
    color: #4a5568;
    min-width: 200px;
  }

  .info-item .value {
    color: #2d3748;
    font-weight: 500;
  }

  .terms-text {
    color: #4a5568;
    line-height: 1.7;
  }

  .terms-text p {
    margin-bottom: 1rem;
  }

  .terms-text ul {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  .terms-text li {
    margin-bottom: 0.5rem;
  }

  .terms-text strong {
    color: #2d3748;
    font-weight: 600;
  }

  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .activity-item {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #00bae5;
  }

  .activity-code {
    font-size: 1.2rem;
    font-weight: 700;
    color: #00bae5;
    min-width: 100px;
    text-align: center;
    padding: 0.5rem;
    background: white;
    border-radius: 6px;
    border: 2px solid #e2e8f0;
  }

  .activity-details {
    flex: 1;
  }

  .activity-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .activity-type {
    font-size: 0.9rem;
    color: #00bae5;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .activity-dates {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: #718096;
  }

  .activity-dates span {
    background: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .bank-accounts {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .bank-account {
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #00bae5;
  }

  .account-number {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
    font-family: 'Courier New', monospace;
    background: white;
    padding: 0.75rem;
    border-radius: 6px;
    border: 2px solid #e2e8f0;
  }

  .bank-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .bank-name {
    font-weight: 600;
    color: #2d3748;
    font-size: 1rem;
  }

  .bank-address {
    color: #718096;
    font-size: 0.9rem;
  }

  .account-info {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .account-info span {
    background: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    font-size: 0.85rem;
    color: #718096;
  }

  @media (max-width: 768px) {
    .content-wrapper {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .company-section {
      padding: 1.5rem;
    }

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .info-item .label {
      min-width: auto;
    }

    .activity-item {
      flex-direction: column;
      gap: 1rem;
    }

    .activity-code {
      min-width: auto;
      align-self: flex-start;
    }

    .activity-dates {
      flex-direction: column;
      gap: 0.5rem;
    }

    .account-info {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
