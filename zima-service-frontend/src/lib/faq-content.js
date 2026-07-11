export const faqContent = {
  general: [
    {
      category: 'General',
      categoryHu: 'Általános',
      question: 'What are your opening hours?',
      questionHu: 'Mik a nyitvatartási idők?',
      answer: 'Auto Service: Mon–Sat (08:00–18:00) | Tire Service: Mon–Sat (08:00–18:00)',
      answerHu: 'Autó Szerviz: H–Szo (08:00–18:00) | Gumiszerviz: H–Szo (08:00–18:00)'
    },
    {
      category: 'General',
      categoryHu: 'Általános',
      question: 'Do I need to book in advance?',
      questionHu: 'Előre kell foglalnom?',
      answer: 'Walk-ins are welcome, but booking ahead guarantees faster service and a reserved time slot.',
      answerHu: 'Bejelentkezés nélkül is fogadunk, de az előzetes foglalás gyorsabb kiszolgálást és lefoglalt időpontot biztosít.'
    },
    {
      category: 'General',
      categoryHu: 'Általános',
      question: 'What payment methods do you accept?',
      questionHu: 'Milyen fizetési módokat fogadtok el?',
      answer: 'We accept cash, major debit/credit cards and bank transfers. Contactless payment is available.',
      answerHu: 'Elfogadunk készpénzt, bank- és hitelkártyákat, valamint átutalást. Elérhető az érintésmentes fizetés.'
    }
  ],
  services: [
    {
      category: 'Workshop',
      categoryHu: 'Szerviz',
      question: 'What types of services do you offer?',
      questionHu: 'Milyen típusú szerviz szolgáltatásokat kínáltok?',
      answer: 'We offer oil changes, brake service, engine diagnostics, maintenance checks, and general repairs. Visit our Services page for a complete list.',
      answerHu: 'Kínálunk olajcserét, fékjavítást, motordiagnosztikát, karbantartási ellenőrzéseket és általános javításokat. Tekintse meg teljes kínálatunkat a Szolgáltatások oldalon.'
    },
    {
      category: 'Workshop',
      categoryHu: 'Szerviz',
      question: 'Do you offer maintenance while I travel?',
      questionHu: 'Utazás közben is elvégzitek a szervizt?',
      answer: 'Yes. Add maintenance, oil change or safety check to your booking and we deliver the car road-ready on your return.',
      answerHu: 'Igen. A foglaláshoz kérhet karbantartást, olajcserét vagy átvizsgálást, az autót indulásra készen adjuk vissza.'
    },
    {
      category: 'Workshop',
      categoryHu: 'Szerviz',
      question: 'How long does a typical service take?',
      questionHu: 'Mennyi ideig tart egy átlagos szerviz?',
      answer: 'A standard inspection or oil change takes 1–2 hours. Larger jobs are scheduled with you and we keep you updated by phone.',
      answerHu: 'Egy általános átvizsgálás vagy olajcsere 1–2 órát vesz igénybe. A nagyobb munkákat egyeztetjük, és telefonon folyamatosan tájékoztatunk.'
    },
    {
      category: 'Workshop',
      categoryHu: 'Szerviz',
      question: 'Do you offer warranty on your services?',
      questionHu: 'Jár garancia a szolgáltatásaitokra?',
      answer: 'Yes, all our services come with a 12-month or 20,000 km warranty, whichever comes first.',
      answerHu: 'Igen, minden szolgáltatásunkra 12 hónapos vagy 20 000 km garanciát vállalunk, attól függően, hogy melyik következik hamarabb.'
    }
  ],
  tires: [
    {
      category: 'Tires',
      categoryHu: 'Gumik',
      question: 'Can you store my seasonal tires?',
      questionHu: 'Tároljátok az idény gumikat?',
      answer: 'Yes, we offer seasonal storage and a quick swap appointment so you avoid hauling wheels to the workshop.',
      answerHu: 'Igen, vállalunk szezonális tárolást és gyors átszerelést, így nem kell a kerekeket cipelnie a műhelybe.'
    },
    {
      category: 'Tires',
      categoryHu: 'Gumik',
      question: 'What tire brands do you work with?',
      questionHu: 'Milyen gumimárkákkal dolgoztok?',
      answer: 'We work with all major tire brands and can order specific models based on your preference and budget.',
      answerHu: 'Minden nagyobb gumimárkával dolgozunk, és rendelhetünk speciális modelleket az Ön igényei és költségvetése alapján.'
    },
    {
      category: 'Tires',
      categoryHu: 'Gumik',
      question: 'Do you offer tire repair services?',
      questionHu: 'Kínáltok gumijavítási szolgáltatást?',
      answer: 'Yes, we can repair punctures and minor tire damage. If repair isn\'t possible, we\'ll recommend suitable replacements.',
      answerHu: 'Igen, javítunk defekteket és kisebb gumihibákat. Ha a javítás nem lehetséges, megfelelő cseregumit ajánlunk.'
    }
  ],
  detailing: [
    {
      category: 'Detailing',
      categoryHu: 'Autóápolás',
      question: 'Can I book detailing with my service slot?',
      questionHu: 'Foglalhatok tisztítást a szerviz mellé?',
      answer: 'Yes. Interior refresh, ozone treatment or premium hand wash can be added so the car feels like new when collected.',
      answerHu: 'Igen. Belső tisztítás, ózonkezelés vagy prémium kézi mosás is kérhető, így az autó újszerű állapotban várja.'
    },
    {
      category: 'Detailing',
      categoryHu: 'Autóápolás',
      question: 'What detailing packages do you offer?',
      questionHu: 'Milyen tisztítási csomagokat kínáltok?',
      answer: 'We offer exterior wash, interior cleaning, full detailing, and ceramic coating. Each package can be customized to your needs.',
      answerHu: 'Kínálunk külső mosást, belső tisztítást, teljes körű tisztítást és kerámia bevonatot. Minden csomag testreszabható az igényei szerint.'
    },
    {
      category: 'Detailing',
      categoryHu: 'Autóápolás',
      question: 'What should I bring to my appointment?',
      questionHu: 'Mit hozzak a szervizidőpontra?',
      answer: 'Please bring your registration, service book (if available) and any warning messages you noticed. We handle the rest.',
      answerHu: 'Kérjük, hozza magával a forgalmit, a szervizfüzetet (ha van), és jelezze az esetleges hibajelzéseket. A többit intézzük.'
    }
  ]
};

export const allFaqs = Object.values(faqContent).flat();
