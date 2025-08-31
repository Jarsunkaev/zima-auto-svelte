<script>
  export let lang = 'hu';
</script>

<svelte:head>
  <title>{lang === 'hu' ? 'Általános Szerződési Feltételek' : 'Terms & Conditions'} - Zima Auto</title>
  <meta name="description" content={lang === 'hu' ? 'Zima Auto Kft. általános szerződési feltételei és szolgáltatási feltételek' : 'Zima Auto Kft. terms and conditions and service terms'}>
</svelte:head>

<div class="page-container">
  <div class="content-wrapper">
    <div class="page-header">
      <h1>{lang === 'hu' ? 'Általános Szerződési Feltételek' : 'Terms & Conditions'}</h1>
      <p>{lang === 'hu' ? 'Zima Auto Korlátolt Felelősségű Társaság szolgáltatási feltételei' : 'Service terms of Zima Auto Limited Liability Company'}</p>
    </div>

    <div class="terms-content">
      <div class="terms-section">
        <h2>{lang === 'hu' ? '1. Általános rendelkezések' : '1. General Provisions'}</h2>
        <div class="terms-text">
          <p><strong>1.1.</strong> {lang === 'hu' ? 'Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) a Zima Auto Korlátolt Felelősségű Társaság (továbbiakban: Szolgáltató) által nyújtott szolgáltatások igénybevételének feltételeit szabályozza.' : 'These General Terms and Conditions (hereinafter: GTC) govern the terms of use of services provided by Zima Auto Limited Liability Company (hereinafter: Service Provider).'}</p>
          
          <p><strong>1.2.</strong> {lang === 'hu' ? 'A Szolgáltató adatai:' : 'Service Provider details:'}</p>
          <ul>
            <li>{lang === 'hu' ? 'Név: Zima Auto Korlátolt Felelősségű Társaság' : 'Name: Zima Auto Limited Liability Company'}</li>
            <li>{lang === 'hu' ? 'Rövidített név: Zima Autó Kft.' : 'Short name: Zima Auto Kft.'}</li>
            <li>{lang === 'hu' ? 'Székhely: 2220 Vecsés, Ipari utca 1.' : 'Registered address: 2220 Vecsés, Ipari utca 1.'}</li>
            <li>{lang === 'hu' ? 'Cégjegyzékszám: 13 09 232195' : 'Company registration number: 13 09 232195'}</li>
            <li>{lang === 'hu' ? 'Adószám: 11713177-21462236-00000000' : 'Tax number: 11713177-21462236-00000000'}</li>
          </ul>
          
          <p><strong>1.3.</strong> {lang === 'hu' ? 'A jelen ÁSZF hatályba lépésének napja: 2024.02.06.' : 'Effective date of these GTC: 2024.02.06.'}</p>
        </div>
      </div>

      <div class="terms-section">
        <h2>{lang === 'hu' ? '2. Szolgáltatások' : '2. Services'}</h2>
        <div class="terms-text">
          <p><strong>2.1.</strong> {lang === 'hu' ? 'A Szolgáltató a következő szolgáltatásokat nyújtja:' : 'The Service Provider offers the following services:'}</p>
          <ul>
            <li>{lang === 'hu' ? 'Repülőtéri parkolási szolgáltatás' : 'Airport parking service'}</li>
            <li>{lang === 'hu' ? 'Autómosási szolgáltatás' : 'Car wash service'}</li>
            <li>{lang === 'hu' ? 'Gumiabroncs szolgáltatás' : 'Tire service'}</li>
            <li>{lang === 'hu' ? 'Autókarbantartási szolgáltatás' : 'Car maintenance service'}</li>
            <li>{lang === 'hu' ? 'Éttermi vendéglátás' : 'Restaurant catering'}</li>
          </ul>
          
          <p><strong>2.2.</strong> {lang === 'hu' ? 'A szolgáltatások részletes feltételeit a Szolgáltató által kiadott szolgáltatási leírások tartalmazzák.' : 'The detailed terms of services are contained in the service descriptions issued by the Service Provider.'}</p>
        </div>
      </div>

      <div class="terms-section">
        <h2>{lang === 'hu' ? '3. Foglalás és fizetés' : '3. Booking and Payment'}</h2>
        <div class="terms-text">
          <p><strong>3.1.</strong> {lang === 'hu' ? 'A szolgáltatások igénybevétele előzetes foglalás alapján történik.' : 'Use of services is based on advance booking.'}</p>
          
          <p><strong>3.2.</strong> {lang === 'hu' ? 'A foglalás a következő módokon történhet:' : 'Booking can be made in the following ways:'}</p>
          <ul>
            <li>{lang === 'hu' ? 'Online foglalási rendszeren keresztül' : 'Through online booking system'}</li>
            <li>{lang === 'hu' ? 'Telefonon: +36 70 555 0588' : 'By phone: +36 70 555 0588'}</li>
            <li>{lang === 'hu' ? 'Emailben: info@zima-auto.com' : 'By email: info@zima-auto.com'}</li>
          </ul>
          
          <p><strong>3.3.</strong> {lang === 'hu' ? 'A fizetés a következő módokon történhet:' : 'Payment can be made in the following ways:'}</p>
          <ul>
            <li>{lang === 'hu' ? 'Készpénz' : 'Cash'}</li>
            <li>{lang === 'hu' ? 'Bankkártya' : 'Bank card'}</li>
            <li>{lang === 'hu' ? 'Banki átutalás' : 'Bank transfer'}</li>
          </ul>
          
          <p><strong>3.4.</strong> {lang === 'hu' ? 'Az árak forintban értendők, és tartalmazzák az ÁFÁ-t.' : 'Prices are in Hungarian Forint and include VAT.'}</p>
        </div>
      </div>

      <div class="terms-section">
        <h2>{lang === 'hu' ? '4. Felelősség' : '4. Liability'}</h2>
        <div class="terms-text">
          <p><strong>4.1.</strong> {lang === 'hu' ? 'A Szolgáltató felelőssége a szolgáltatás nyújtása során bekövetkezett károkért a vonatkozó jogszabályok szerint állapítható meg.' : 'The Service Provider\'s liability for damages occurring during service provision shall be determined according to applicable laws.'}</p>
          
          <p><strong>4.2.</strong> {lang === 'hu' ? 'A Szolgáltató nem vállal felelősséget:' : 'The Service Provider does not assume responsibility for:'}</p>
          <ul>
            <li>{lang === 'hu' ? 'Az ügyfél által okozott károkért' : 'Damages caused by the customer'}</li>
            <li>{lang === 'hu' ? 'Az ügyfél által nem megfelelően biztosított adatok alapján történt szolgáltatásnyújtásért' : 'Service provision based on inadequately provided data by the customer'}</li>
            <li>{lang === 'hu' ? 'A természeti katasztrófák vagy más erőszakos események következményeiért' : 'Consequences of natural disasters or other violent events'}</li>
          </ul>
          
          <p><strong>4.3.</strong> {lang === 'hu' ? 'Az ügyfél felelős a szolgáltatás igénybevétele során a Szolgáltató által biztosított eszközök és helyiségek megfelelő használatáért.' : 'The customer is responsible for the proper use of equipment and premises provided by the Service Provider during service use.'}</p>
        </div>
      </div>

      <div class="terms-section">
        <h2>{lang === 'hu' ? '5. Adatvédelem' : '5. Data Protection'}</h2>
        <div class="terms-text">
          <p><strong>5.1.</strong> {lang === 'hu' ? 'A Szolgáltató az ügyfelek személyes adatait a GDPR és a vonatkozó magyar adatvédelmi jogszabályok szerint kezeli.' : 'The Service Provider handles customers\' personal data in accordance with GDPR and relevant Hungarian data protection laws.'}</p>
          
          <p><strong>5.2.</strong> {lang === 'hu' ? 'Az adatkezelés céljai:' : 'Purposes of data processing:'}</p>
          <ul>
            <li>{lang === 'hu' ? 'Szolgáltatásnyújtás' : 'Service provision'}</li>
            <li>{lang === 'hu' ? 'Foglalások kezelése' : 'Booking management'}</li>
            <li>{lang === 'hu' ? 'Kommunikáció az ügyfelekkel' : 'Communication with customers'}</li>
            <li>{lang === 'hu' ? 'Számlázás' : 'Billing'}</li>
          </ul>
          
          <p><strong>5.3.</strong> {lang === 'hu' ? 'Az ügyfél jogosult az adatai törlésére, módosítására és az adatkezelés korlátozására.' : 'The customer is entitled to deletion, modification of their data and restriction of data processing.'}</p>
        </div>
      </div>

      <div class="terms-section">
        <h2>{lang === 'hu' ? '6. Panaszkezelés' : '6. Complaint Handling'}</h2>
        <div class="terms-text">
          <p><strong>6.1.</strong> {lang === 'hu' ? 'Az ügyfél panaszait a Szolgáltató írásban vagy elektronikus úton fogadja.' : 'The Service Provider receives customer complaints in writing or electronically.'}</p>
          
          <p><strong>6.2.</strong> {lang === 'hu' ? 'A panasz benyújtásának módjai:' : 'Ways to submit complaints:'}</p>
          <ul>
            <li>{lang === 'hu' ? 'Email: info@zima-auto.com' : 'Email: info@zima-auto.com'}</li>
            <li>{lang === 'hu' ? 'Postai cím: 2220 Vecsés, Ipari utca 1.' : 'Postal address: 2220 Vecsés, Ipari utca 1.'}</li>
            <li>{lang === 'hu' ? 'Személyesen: a Szolgáltató székhelyén' : 'In person: at the Service Provider\'s registered office'}</li>
          </ul>
          
          <p><strong>6.3.</strong> {lang === 'hu' ? 'A Szolgáltató a panaszt 30 napon belül megválaszolja.' : 'The Service Provider responds to complaints within 30 days.'}</p>
        </div>
      </div>

      <div class="terms-section">
        <h2>{lang === 'hu' ? '7. Záró rendelkezések' : '7. Final Provisions'}</h2>
        <div class="terms-text">
          <p><strong>7.1.</strong> {lang === 'hu' ? 'Jelen ÁSZF magyar nyelven készült, és a magyar jog szerint értelmezendő.' : 'These GTC are prepared in Hungarian and shall be interpreted according to Hungarian law.'}</p>
          
          <p><strong>7.2.</strong> {lang === 'hu' ? 'Az ÁSZF módosítása esetén a Szolgáltató előzetesen értesíti az ügyfeleket.' : 'In case of modification of the GTC, the Service Provider notifies customers in advance.'}</p>
          
          <p><strong>7.3.</strong> {lang === 'hu' ? 'A jelen ÁSZF hatályba lépésétől kezdve az összes korábbi feltétel érvényét veszti.' : 'From the effective date of these GTC, all previous terms lose their validity.'}</p>
          
          <p><strong>7.4.</strong> {lang === 'hu' ? 'A jelen ÁSZF-ben nem szabályozott kérdésekben a vonatkozó magyar jogszabályok rendelkezései az irányadóak.' : 'In matters not regulated in these GTC, the provisions of relevant Hungarian laws are authoritative.'}</p>
        </div>
      </div>

      <div class="contact-info">
        <h3>{lang === 'hu' ? 'Kapcsolat' : 'Contact'}</h3>
        <div class="contact-details">
          <div class="contact-item">
            <strong>{lang === 'hu' ? 'Cím:' : 'Address:'}</strong> 2220 Vecsés, Ipari utca 1.
          </div>
          <div class="contact-item">
            <strong>{lang === 'hu' ? 'Telefon:' : 'Phone:'}</strong> +36 70 555 0588
          </div>
          <div class="contact-item">
            <strong>{lang === 'hu' ? 'Email:' : 'Email:'}</strong> info@zima-auto.com
          </div>
          <div class="contact-item">
            <strong>{lang === 'hu' ? 'Nyitvatartás:' : 'Opening hours:'}</strong> {lang === 'hu' ? 'Hétfő - Vasárnap: 00:00 - 24:00' : 'Monday - Sunday: 00:00 - 24:00'}
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
    max-width: 1000px;
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

  .terms-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .terms-section {
    padding: 2rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .terms-section:last-child {
    border-bottom: none;
  }

  .terms-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #00bae5;
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

  .contact-info {
    padding: 2rem;
    background: #f7fafc;
    border-top: 1px solid #e2e8f0;
  }

  .contact-info h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .contact-details {
    display: grid;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #00bae5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .contact-item strong {
    color: #2d3748;
    font-weight: 600;
    min-width: 120px;
  }

  @media (max-width: 768px) {
    .content-wrapper {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .terms-section {
      padding: 1.5rem;
    }

    .terms-text ul {
      padding-left: 1.5rem;
    }

    .contact-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .contact-item strong {
      min-width: auto;
    }
  }
</style>
