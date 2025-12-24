export const faqContent = {
  general: [
    {
      category: 'General',
      categoryHu: 'Általános',
      question: 'What are your opening hours?',
      questionHu: 'Mik a nyitvatartási idők?',
      answer: 'Parking: 24/7 | Hand Car Wash: Mon–Sat (08:00–18:00) | Auto Service: Mon–Sat (08:00–17:00) | Tire Service: Mon–Sat (08:00–17:00)',
      answerHu: 'Parkoló: 24/7 | Kézi Autómosó: H–Szo (08:00–18:00) | Autó Szerviz: H–Szo (08:00–17:00) | Gumiszerviz: H–Szo (08:00–17:00)'
    }
  ],
  services: [
    {
      category: 'Workshop',
      categoryHu: 'Szerviz',
      question: 'Do you offer maintenance while I travel?',
      questionHu: 'Utazás közben is elvégzitek a szervizt?',
      answer: 'Yes. Add maintenance, oil change or safety check to your booking and we deliver the car road-ready on your return.',
      answerHu: 'Igen. A foglaláshoz kérhet karbantartást, olajcserét vagy átvizsgálást, az autót indulásra készen adjuk vissza.'
    },
    {
      category: 'Timing',
      categoryHu: 'Időzítés',
      question: 'How long does a typical service take?',
      questionHu: 'Mennyi ideig tart egy átlagos szerviz?',
      answer: 'A standard inspection or oil change takes 1–2 hours. Larger jobs are scheduled with you and we keep you updated by phone.',
      answerHu: 'Egy általános átvizsgálás vagy olajcsere 1–2 órát vesz igénybe. A nagyobb munkákat egyeztetjük, és telefonon folyamatosan tájékoztatunk.'
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
      question: 'Do you handle TPMS and wheel alignment?',
      questionHu: 'Kezelitek a TPMS-t és a futóművet?',
      answer: 'Absolutely. We program TPMS sensors and perform alignment checks so the car tracks straight and tires last longer.',
      answerHu: 'Igen. Programozzuk a TPMS szenzorokat és futómű-ellenőrzést végzünk, hogy az autó stabilan fusson és a gumik tovább tartanak.'
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
      category: 'Arrival',
      categoryHu: 'Érkezés',
      question: 'What should I bring to my appointment?',
      questionHu: 'Mit hozzak a szervizidőpontra?',
      answer: 'Please bring your registration, service book (if available) and any warning messages you noticed. We handle the rest.',
      answerHu: 'Kérjük, hozza magával a forgalmit, a szervizfüzetet (ha van), és jelezze az esetleges hibajelzéseket. A többit intézzük.'
    }
  ]
};

export const allFaqs = Object.values(faqContent).flat();
