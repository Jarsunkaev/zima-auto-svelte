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
  parking: [
    {
      category: 'Parking',
      categoryHu: 'Parkolás',
      question: 'How far are you from the airport?',
      questionHu: 'Milyen messze vagytok a repülőtértől?',
      answer: 'We are only a few minutes away. After check-in we shuttle you directly to the terminal and pick you up on return.',
      answerHu: 'Pár percre vagyunk. Bejelentkezés után saját transzferrel visszük a terminálhoz, érkezéskor pedig felveszünk.'
    },
    {
      category: 'Parking',
      categoryHu: 'Parkolás',
      question: 'Is the parking area secure?',
      questionHu: 'Biztonságos a parkoló?',
      answer: 'Yes. The lot is fenced, well lit, covered by 24/7 CCTV and guarded by our on-site team.',
      answerHu: 'Igen. A parkoló bekerített, jól megvilágított, 0–24-ben kamerázott és helyszíni személyzet felügyeli.'
    },
    {
      category: 'Parking',
      categoryHu: 'Parkolás',
      question: 'What happens if my flight is delayed?',
      questionHu: 'Mi történik, ha késik a járatom?',
      answer: 'No stress. Share your flight number and we monitor delays so your transfer and parking remain secured until you arrive.',
      answerHu: 'Nem gond. Adja meg a járatszámot, figyeljük a késéseket, a transzfer and a parkolás biztosítva marad, amíg megérkezik.'
    }
  ],
  services: [
    {
      category: 'Car care',
      categoryHu: 'Autóápolás',
      question: 'Can you wash my car while it is parked?',
      questionHu: 'Meg tudjátok mosni az autót, amíg parkol?',
      answer: 'Yes. Add an exterior or full detailing package to your booking and we deliver the car freshly cleaned.',
      answerHu: 'Igen. Foglalásához kérhet külső vagy teljes tisztítást, az autót frissen adjuk vissza.'
    },
    {
      category: 'Keys',
      categoryHu: 'Kulcskezelés',
      question: 'Do I leave my keys with you?',
      questionHu: 'Nálatok marad a kulcs?',
      answer: 'You can choose. Most guests leave the keys so we can reposition the car if needed; they are sealed and stored securely.',
      answerHu: 'Választhat. A legtöbben nálunk hagyják, hogy szükség esetén mozdíthassuk az autót; a kulcsokat lezárva, biztonságosan tároljuk.'
    },
    {
      category: 'Add-ons',
      categoryHu: 'Extra szolgáltatás',
      question: 'Can I request tire or workshop help?',
      questionHu: 'Kérhetek gumiszervizt vagy műhelymunkát?',
      answer: 'Yes, minor tire fixes and quick checks can be added to your parking so the car is ready when you return.',
      answerHu: 'Igen, kisebb gumis és gyors átvizsgálási munkákat vállalunk, hogy visszaérkezéskor minden rendben legyen.'
    }
  ],
  booking: [
    {
      category: 'Booking',
      categoryHu: 'Foglalás',
      question: 'Can I change dates after booking?',
      questionHu: 'Módosíthatom a dátumot foglalás után?',
      answer: 'Free changes up to 12 hours before arrival. Just update your travel times and flight number.',
      answerHu: 'Érkezés előtt 12 óráig ingyenesen módosíthatja az időpontokat és a járatszámot.'
    },
    {
      category: 'Arrival',
      categoryHu: 'Érkezés',
      question: 'What should I bring on arrival?',
      questionHu: 'Mit hozzak magammal érkezéskor?',
      answer: 'Have your booking reference, license plate and flight number ready. Our team guides you through a 2-minute check-in.',
      answerHu: 'Legyen kéznél a foglalási azonosító, a rendszám és a járatszám. A kollégák 2 perc alatt végigvezetnek a check-inen.'
    }
  ]
};

export const allFaqs = Object.values(faqContent).flat();
