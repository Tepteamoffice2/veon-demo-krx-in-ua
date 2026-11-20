// Facts only from veon/client.json (B-F005, B-F007, B-F008, B-F012, B-F013, B-F019, B-F020) and the menu of the
// client's current site (veon/research/pages/home.html). Nothing here is invented: no prices, reviews or years.

export const contacts = {
  phoneHref: "tel:+380671068031",
  phoneText: "067 106 80 31",
  email: "info@krx.in.ua",
  viber: "viber://pa?chatURI=KRX",
  telegram: "https://t.me/krxinua",
  address: "Харківське шосе, 57А",
  city: "Київ, 02091",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B5%20%D1%88%D0%BE%D1%81%D0%B5%2C%2057%D0%90%2C%20%D0%9A%D0%B8%D1%97%D0%B2%2C%2002091",
  hours: [
    { days: "Пн–Пт", time: "9:00–18:00" },
    { days: "Сб–Нд", time: "10:00–17:00" },
  ],
} as const;

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/krx_parts/" },
  { name: "Facebook", href: "https://www.facebook.com/krx.ukraine/" },
  { name: "YouTube", href: "https://www.youtube.com/channel/UCVmIVws9NKZ13cAIppPQECg" },
  { name: "Telegram", href: "https://t.me/krxinua" },
] as const;

export const nav = [
  { href: "#pidbir", label: "Підбір" },
  { href: "#remont", label: "Ремонт" },
  { href: "#catalog", label: "Каталог" },
  { href: "#umovy", label: "Доставка й гарантія" },
  { href: "#kontakty", label: "Контакти" },
] as const;

/** Brands from the «Склопідіймачі» menu of the current site. */
export const brands = [
  "Audi", "BMW", "Chevrolet", "Citroen", "DAF", "Fiat", "Ford", "Hyundai / KIA", "Land Rover",
  "Mercedes", "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda", "Smart", "Volkswagen",
] as const;

/** Door nodes: id, chip label, words for the request line, and where the callout chip sits (≥80rem). */
export const nodes = [
  { id: "reg", label: "Склопідіймач", phrase: "склопідіймач / ремкомплект", pos: "t1" },
  { id: "cable", label: "Трос склопідіймача", phrase: "трос склопідіймача", pos: "t2" },
  { id: "roof", label: "Люк", phrase: "механізм люка", pos: "t3" },
  { id: "handle", label: "Ручка / кнопка", phrase: "ручка або кнопка", pos: "b1" },
  { id: "clips", label: "Кліпси обшивки", phrase: "кліпси обшивки", pos: "b2" },
  { id: "door", label: "Трос дверей / замок", phrase: "трос відкривання дверей / замок", pos: "b3" },
] as const;

export const extraNodes = [
  { id: "key", label: "Корпус ключа", phrase: "корпус ключа" },
  { id: "other", label: "Інше", phrase: "інша деталь" },
] as const;

/** 12 catalogue sections of the current site; subsections — from its menu, translated. */
export const catalog = [
  { name: "Ремкомплекти", subs: ["Троси склопідіймача", "Ремкомплекти люків", "Ремкомплекти замків"] },
  { name: "Склопідіймачі", subs: ["18 марок: Audi, Ford, Skoda, Volkswagen та інші"] },
  { name: "Автокріплення (кліпси)", subs: ["Кліпси за марками", "Набори кліпс", "Фіксатори й кріплення"] },
  { name: "Деталі кузова", subs: ["Дзеркала", "Зовнішні ручки дверей", "Троси відкривання дверей"] },
  { name: "Деталі салону", subs: ["Ручки дверей і салону", "Ручки КПП", "Підлокітники"] },
  { name: "Електрообладнання", subs: ["Кнопки склопідіймача", "Приводи й моторчики", "Регулятори дзеркал"] },
  { name: "Корпуси ключів", subs: [] as string[] },
  { name: "Замки й личинки", subs: [] as string[] },
  { name: "Деталі двигуна", subs: ["Впускний колектор, EGR", "Паливні трубки", "Щупи рівня оливи"] },
  { name: "Марки авто", subs: ["Renault, Volkswagen, Skoda, Mercedes", "усі запчастини за маркою"] },
  { name: "Аксесуари", subs: ["Ароматизатори", "Автохімія", "Сумки й органайзери"] },
] as const;

export const futureNote = "Розділ у розробці";
