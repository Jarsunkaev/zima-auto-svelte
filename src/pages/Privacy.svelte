<script>
  import { currentLang, t } from '../lib/i18n';
</script>

<div class="privacy-page">
  <div class="container">
    <h1>{$currentLang === 'hu' ? 'Adatvédelmi irányelvek' : 'Privacy Policy'}</h1>
    
    <section class="privacy-section">
      <h2>{$currentLang === 'hu' ? 'Bevezetés' : 'Introduction'}</h2>
      <p>
        {$currentLang === 'hu'
          ? 'A Zima Auto elkötelezett az Ön adatainak védelme mellett. Ez az adatvédelmi irányelvek bemutatja, hogyan gyűjtjük, használjuk és védjük személyes adatait.'
          : 'Zima Auto is committed to protecting your data. This privacy policy explains how we collect, use, and protect your personal information.'}
      </p>
    </section>

    <section class="privacy-section">
      <h2>{$currentLang === 'hu' ? 'Adatgyűjtés' : 'Data Collection'}</h2>
      <p>
        {$currentLang === 'hu'
          ? 'A következő adatokat gyűjtjük:'
          : 'We collect the following data:'}
      </p>
      <ul>
        <li>{$currentLang === 'hu' ? 'Név és elérhetőségi adatok' : 'Name and contact information'}</li>
        <li>{$currentLang === 'hu' ? 'Autó adatai' : 'Vehicle information'}</li>
        <li>{$currentLang === 'hu' ? 'Foglalási adatok' : 'Booking information'}</li>
        <li>{$currentLang === 'hu' ? 'Fizetési adatok' : 'Payment information'}</li>
      </ul>
    </section>

    <section class="privacy-section">
      <h2>{$currentLang === 'hu' ? 'Cookie-k használata' : 'Cookie Usage'}</h2>
      <p>
        {$currentLang === 'hu'
          ? 'Weboldalunk cookie-kat használ a felhasználói élmény javításához. A cookie-k kis szöveges fájlok, amelyek a böngészőjében tárolódnak.'
          : 'Our website uses cookies to improve user experience. Cookies are small text files stored in your browser.'}
      </p>
      <h3>{$currentLang === 'hu' ? 'Cookie típusok' : 'Types of Cookies'}</h3>
      <ul>
        <li>
          <strong>{$currentLang === 'hu' ? 'Szükséges cookie-k:' : 'Necessary cookies:'}</strong>
          {$currentLang === 'hu'
            ? 'A weboldal működéséhez elengedhetetlenek.'
            : 'Essential for website functionality.'}
        </li>
        <li>
          <strong>{$currentLang === 'hu' ? 'Analitikai cookie-k:' : 'Analytics cookies:'}</strong>
          {$currentLang === 'hu'
            ? 'Segítenek megérteni, hogyan használják a látogatók a weboldalt.'
            : 'Help us understand how visitors use our website.'}
        </li>
        <li>
          <strong>{$currentLang === 'hu' ? 'Marketing cookie-k:' : 'Marketing cookies:'}</strong>
          {$currentLang === 'hu'
            ? 'Segítenek a releváns reklámok megjelenítésében.'
            : 'Help display relevant advertisements.'}
        </li>
      </ul>
    </section>

    <section class="privacy-section">
      <h2>{$currentLang === 'hu' ? 'Adatvédelmi jogok' : 'Data Protection Rights'}</h2>
      <p>
        {$currentLang === 'hu'
          ? 'Önnek joga van:'
          : 'You have the right to:'}
      </p>
      <ul>
        <li>{$currentLang === 'hu' ? 'Adataihoz való hozzáféréshez' : 'Access your data'}</li>
        <li>{$currentLang === 'hu' ? 'Adatai helyesbítéséhez' : 'Correct your data'}</li>
        <li>{$currentLang === 'hu' ? 'Adatai törléséhez' : 'Delete your data'}</li>
        <li>{$currentLang === 'hu' ? 'Adatkezelés korlátozásához' : 'Restrict data processing'}</li>
        <li>{$currentLang === 'hu' ? 'Adatátvitelhez' : 'Data portability'}</li>
        <li>{$currentLang === 'hu' ? 'Kifogás emeléséhez' : 'Object to processing'}</li>
      </ul>
    </section>

    <section class="privacy-section">
      <h2>{$currentLang === 'hu' ? 'Kapcsolat' : 'Contact'}</h2>
      <p>
        {$currentLang === 'hu'
          ? 'Adatvédelmi kérdéseivel kapcsolatban keressen minket az alábbi elérhetőségeken:'
          : 'For privacy-related questions, please contact us at:'}
      </p>
      <p>
        <strong>Email:</strong> jarsunkaev@gmail.com<br>
        <strong>{$currentLang === 'hu' ? 'Telefon:' : 'Phone:'}</strong> +36 30 123 4567
      </p>
    </section>
  </div>
</div>

<style>
  .privacy-page {
    padding: 4rem 0;
    background-color: #f5f5f5;
    min-height: 100vh;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h1 {
    font-size: 2.5rem;
    color: var(--primary);
    margin-bottom: 2rem;
    text-align: center;
  }

  .privacy-section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.4rem;
    color: #444;
    margin: 1.5rem 0 1rem;
  }

  p {
    line-height: 1.6;
    color: #666;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    line-height: 1.6;
    color: #666;
    margin-bottom: 0.5rem;
  }

  strong {
    color: #333;
  }

  @media screen and (max-width: 768px) {
    .privacy-page {
      padding: 2rem 0;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.2rem;
    }

    .privacy-section {
      padding: 1.5rem;
    }
  }
</style> 