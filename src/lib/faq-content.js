// src/lib/faq-content.js
export const faqContent = {
  general: [
    {
      category: 'General',
      categoryHu: 'Általános',
      question: 'What are your opening hours?',
      questionHu: 'Mik a nyitvatartási idők?',
      answer: 'Parking: 24/7 | Hand Car Wash: Mon–Sat (08:00–18:00) | Auto Service: Mon–Sat (08:00–18:00) | Tire Service: Mon–Sat (08:00–18:00)',
      answerHu: 'Parkoló: 24/7 | Kézi Autómosó: H–Szo (08:00–18:00) | Autószerviz: H–Szo (08:00–18:00) | Gumiszerviz: H–Szo (08:00–18:00)'
    },
    {
      category: 'General',
      categoryHu: 'Általános',
      question: 'Do I need to book in advance?',
      questionHu: 'Előre kell foglalnom?',
      answer: 'Walk-ins are welcome, but booking ahead guarantees a fast check-in and a pre-reserved bay during busy travel periods.',
      answerHu: 'Bejelentkezés nélkül is fogadunk, de az előzetes foglalás gyors bejelentkezést és lefoglalt helyet biztosít a forgalmas időszakokban.'
    },
    {
      category: 'General',
      categoryHu: 'Általános',
      question: 'What payment methods do you accept?',
      questionHu: 'Milyen fizetési módokat fogadtok el?',
      answer: 'We accept cash, major debit/credit cards and bank transfers. Contactless payment is available across the site.',
      answerHu: 'Elfogadunk készpénzt, bank- és hitelkártyákat, valamint átutalást. A telephelyen mindenhol elérhető az érintésmentes fizetés.'
    }
  ],
  parking: [
    {
      category: 'Parking',
      categoryHu: 'Parkolás',
      question: 'Is the parking area secure?',
      questionHu: 'Biztonságos a parkoló?',
      answer: 'Yes. The area is fully fenced, well lit, and secured 24/7 with on-site staff.',
      answerHu: 'Igen. A parkoló teljesen bekerített, jól megvilágított, és 0–24-es helyszíni személyzet felügyeli.'
    },
    {
      category: 'Parking',
      categoryHu: 'Parkolás',
      question: 'How does airport drop-off work?',
      questionHu: 'Hogyan működik a reptéri transzfer?',
      answer: 'After check-in we drive you to the terminal in our shuttle. On return, call us after landing and we pick you up at the agreed point within minutes.',
      answerHu: 'Bejelentkezés után saját transzferrel visszük a terminálhoz. Visszaérkezéskor hívjon bennünket, és perceken belül felvesszük az egyeztetett ponton.'
    },
    {
      category: 'Parking',
      categoryHu: 'Parkolás',
      question: 'Can I leave my keys with you?',
      questionHu: 'Nálatok hagyhatom a kulcsot?',
      answer: 'Of course. Keys are sealed, coded and stored in a secure locker until you return.',
      answerHu: 'Természetesen. A kulcsokat lezárva, kódolva és biztonságos szekrényben tároljuk a visszaérkezéséig.'
    }
  ],
  services: [
    {
      category: 'Service',
      categoryHu: 'Szerviz',
      question: 'Can you service the car while I travel?',
      questionHu: 'Meg tudjátok szervizelni, amíg utazom?',
      answer: 'Yes. You can add detailing, tire change or maintenance to your booking so the car is ready the moment you land.',
      answerHu: 'Igen. Kérhet belső-külső tisztítást, gumicserét vagy szervizt, hogy az autó indulásra készen várja, mire visszaér.'
    }
  ],
  booking: [
    {
      category: 'Booking',
      categoryHu: 'Foglalás',
      question: 'Can I change my booking after confirmation?',
      questionHu: 'Módosíthatom a foglalást a visszaigazolás után?',
      answer: 'Yes. Dates, license plate or services can be updated at no charge up to 12 hours before arrival.',
      answerHu: 'Igen. Az időpontot, rendszámot vagy kért szolgáltatásokat díjmentesen módosíthatja az érkezés előtt 12 óráig.'
    },
    {
      category: 'Booking',
      categoryHu: 'Foglalás',
      question: 'What details should I prepare before booking?',
      questionHu: 'Mire lesz szükség a foglaláshoz?',
      answer: 'Have your travel dates, flight number, license plate and a contact phone number ready. This keeps handover quick on the day.',
      answerHu: 'Készítse elő az utazási dátumokat, járatszámot, rendszámot és egy elérhető telefonszámot. Így a helyszíni átadás gyorsan megy.'
    }
  ]
};

export const allFaqs = Object.values(faqContent).flat();