import { localeContentKey, type Locale } from "@/types/locale";

export type AuthorTour = {
  id: string;
  days: number;
  priceEur: number;
  title: string;
  summary: string;
  highlights: string[];
  program: string[];
  included: string[];
  excluded: string[];
};

type AuthorTourUi = {
  sectionTitle: string;
  sectionSubtitle: string;
  backLabel: string;
  perPerson: string;
  includedLabel: string;
  excludedLabel: string;
  programLabel: string;
  placesNote: string;
  priceNote: string;
};

type Bundle = { ui: AuthorTourUi; tours: AuthorTour[] };

const RU_EIGHT: AuthorTour = {
  id: "tenerife-8-days",
  days: 8,
  priceEur: 700,
  title: "Авторский тур на Тенерифе — 8 дней",
  summary:
    "Готовый маршрут: океан, Маска, Siam Park, яхта, Loro Parque и закат на Тейде. Встречают в аэропорту, проживание и переезды уже включены.",
  highlights: [
    "Встреча в аэропорту и заселение в апартаменты",
    "Ущелье Маска и ужин с канарской кухней",
    "Siam Park и шоу фламенко",
    "Яхта: киты и дельфины",
    "Loro Parque, ботанический сад и Пуэрто-де-ла-Крус",
    "Тейде, канатная дорога и закат над облаками",
  ],
  program: [
    "День 1. Встреча в аэропорту, трансфер и заселение в апартаменты на 2–4 человека.",
    "День 2. Утро на пляже, ущелье Маска, ужин с блюдами канарской кухни.",
    "День 3. Siam Park, вечером прогулка по набережной.",
    "День 4. Пляж Playa de Fañabé, вечером шоу фламенко.",
    "День 5. Прогулка на яхте с обедом и напитками, Лас-Америкас.",
    "День 6. Loro Parque, ботанический сад и Пуэрто-де-ла-Крус.",
    "День 7. Пляж, вулкан Тейде и закат над облаками.",
    "День 8. Выселение и трансфер в аэропорт.",
  ],
  included: [
    "Проживание в апартаментах",
    "Трансферы по программе",
    "Сопровождение гида",
    "Экскурсионная программа",
  ],
  excluded: ["Авиаперелёт", "Питание"],
};

const RU_BEACHES: AuthorTour = {
  id: "seven-beaches",
  days: 7,
  priceEur: 500,
  title: "7 пляжей Тенерифе за 7 дней",
  summary:
    "Неделя у океана: семь пляжей, Маска, Тейде и прогулка на яхте. Проживание рядом с океаном и трансферы уже в цене.",
  highlights: [
    "7 дней — 7 разных пляжей",
    "Ущелье Маска",
    "Вулкан Тейде и закат",
    "Яхта: киты и дельфины",
  ],
  program: [
    "Семь разных пляжей Тенерифе за неделю.",
    "Экскурсия в ущелье Маска.",
    "Поездка к вулкану Тейде и закат.",
    "Прогулка на яхте с возможностью увидеть китов и дельфинов.",
  ],
  included: [
    "Трансфер из аэропорта и обратно",
    "Трансферы ко всем пляжам по программе",
    "Экскурсии: Маска и Тейде",
    "Прогулка на яхте",
    "Проживание в апартаментах рядом с океаном",
  ],
  excluded: ["Перелёт", "Питание"],
};

const UK_EIGHT: AuthorTour = {
  id: "tenerife-8-days",
  days: 8,
  priceEur: 700,
  title: "Авторський тур на Тенерифе — 8 днів",
  summary:
    "Готовий маршрут: океан, Маска, Siam Park, яхта, Loro Parque і захід сонця на Тейде. Зустрічають в аеропорту, проживання та переїзди вже включені.",
  highlights: [
    "Зустріч в аеропорту і заселення в апартаменти",
    "Ущелина Маска і вечеря з канарською кухнею",
    "Siam Park і шоу фламенко",
    "Яхта: кити і дельфіни",
    "Loro Parque, ботанічний сад і Пуерто-де-ла-Крус",
    "Тейде, канатна дорога і захід сонця над хмарами",
  ],
  program: [
    "День 1. Зустріч в аеропорту, трансфер і заселення в апартаменти на 2–4 особи.",
    "День 2. Ранок на пляжі, ущелина Маска, вечеря зі стравами канарської кухні.",
    "День 3. Siam Park, увечері прогулянка набережною.",
    "День 4. Пляж Playa de Fañabé, увечері шоу фламенко.",
    "День 5. Прогулянка на яхті з обідом і напоями, Лас-Америкас.",
    "День 6. Loro Parque, ботанічний сад і Пуерто-де-ла-Крус.",
    "День 7. Пляж, вулкан Тейде і захід сонця над хмарами.",
    "День 8. Виселення і трансфер в аеропорт.",
  ],
  included: [
    "Проживання в апартаментах",
    "Трансфери за програмою",
    "Супровід гіда",
    "Екскурсійна програма",
  ],
  excluded: ["Авіапереліт", "Харчування"],
};

const UK_BEACHES: AuthorTour = {
  id: "seven-beaches",
  days: 7,
  priceEur: 500,
  title: "7 пляжів Тенерифе за 7 днів",
  summary:
    "Тиждень біля океану: сім пляжів, Маска, Тейде і прогулянка на яхті. Проживання поруч з океаном і трансфери вже в ціні.",
  highlights: [
    "7 днів — 7 різних пляжів",
    "Ущелина Маска",
    "Вулкан Тейде і захід сонця",
    "Яхта: кити і дельфіни",
  ],
  program: [
    "Сім різних пляжів Тенерифе за тиждень.",
    "Екскурсія в ущелину Маска.",
    "Поїздка до вулкана Тейде і захід сонця.",
    "Прогулянка на яхті з можливістю побачити китів і дельфінів.",
  ],
  included: [
    "Трансфер з аеропорту і назад",
    "Трансфери до всіх пляжів за програмою",
    "Екскурсії: Маска і Тейде",
    "Прогулянка на яхті",
    "Проживання в апартаментах поруч з океаном",
  ],
  excluded: ["Переліт", "Харчування"],
};

const EN_EIGHT: AuthorTour = {
  id: "tenerife-8-days",
  days: 8,
  priceEur: 700,
  title: "Tenerife author tour — 8 days",
  summary:
    "A set route: the ocean, Masca, Siam Park, a yacht, Loro Parque and sunset on Teide. Airport pickup, stay and transfers are included.",
  highlights: [
    "Airport pickup and apartment check-in",
    "Masca gorge and a Canarian dinner",
    "Siam Park and a flamenco show",
    "Yacht: whales and dolphins",
    "Loro Parque, botanic garden and Puerto de la Cruz",
    "Teide cable car and sunset above the clouds",
  ],
  program: [
    "Day 1. Airport pickup, transfer and check-in to a 2–4 person apartment.",
    "Day 2. Morning on the beach, Masca gorge, Canarian dinner.",
    "Day 3. Siam Park, evening walk on the promenade.",
    "Day 4. Playa de Fañabé, flamenco show in the evening.",
    "Day 5. Yacht trip with lunch and drinks, Las Américas.",
    "Day 6. Loro Parque, botanic garden and Puerto de la Cruz.",
    "Day 7. Beach, Mount Teide and sunset above the clouds.",
    "Day 8. Check-out and transfer to the airport.",
  ],
  included: [
    "Apartment stay",
    "Transfers on the programme",
    "Guide",
    "Excursion programme",
  ],
  excluded: ["Flights", "Meals"],
};

const EN_BEACHES: AuthorTour = {
  id: "seven-beaches",
  days: 7,
  priceEur: 500,
  title: "7 Tenerife beaches in 7 days",
  summary:
    "A week by the ocean: seven beaches, Masca, Teide and a yacht trip. Stay by the sea and transfers are included.",
  highlights: [
    "7 days — 7 different beaches",
    "Masca gorge",
    "Mount Teide and sunset",
    "Yacht: whales and dolphins",
  ],
  program: [
    "Seven different Tenerife beaches in one week.",
    "Excursion to Masca gorge.",
    "Trip to Mount Teide and sunset.",
    "Yacht trip with a chance to see whales and dolphins.",
  ],
  included: [
    "Airport transfers both ways",
    "Transfers to every beach on the programme",
    "Excursions: Masca and Teide",
    "Yacht trip",
    "Apartment by the ocean",
  ],
  excluded: ["Flights", "Meals"],
};

const BUNDLES: Record<string, Bundle> = {
  ru: {
    ui: {
      sectionTitle: "Авторские туры",
      sectionSubtitle:
        "Готовые маршруты с проживанием, трансферами и гидом. Это заявка на даты, не мгновенная оплата.",
      backLabel: "К авторским турам",
      perPerson: "с человека",
      includedLabel: "Входит",
      excludedLabel: "Не входит",
      programLabel: "Программа",
      placesNote: "Мест в группе немного",
      priceNote:
        "Цена за человека. Авиаперелёт и питание оплачиваются отдельно. Даты подтверждаем после заявки.",
    },
    tours: [RU_EIGHT, RU_BEACHES],
  },
  uk: {
    ui: {
      sectionTitle: "Авторські тури",
      sectionSubtitle:
        "Готові маршрути з проживанням, трансферами та гідом. Це заявка на дати, не миттєва оплата.",
      backLabel: "До авторських турів",
      perPerson: "з особи",
      includedLabel: "Входить",
      excludedLabel: "Не входить",
      programLabel: "Програма",
      placesNote: "Місць у групі небагато",
      priceNote:
        "Ціна за особу. Авіапереліт і харчування оплачуються окремо. Дати підтверджуємо після заявки.",
    },
    tours: [UK_EIGHT, UK_BEACHES],
  },
  en: {
    ui: {
      sectionTitle: "Author tours",
      sectionSubtitle:
        "Set routes with a stay, transfers and a guide. This is a date request, not instant payment.",
      backLabel: "Back to author tours",
      perPerson: "per person",
      includedLabel: "Included",
      excludedLabel: "Not included",
      programLabel: "Programme",
      placesNote: "Group places are limited",
      priceNote:
        "Price per person. Flights and meals are paid separately. Dates are confirmed after the request.",
    },
    tours: [EN_EIGHT, EN_BEACHES],
  },
};

export function getAuthorTourBundle(locale: Locale | string): Bundle {
  const key = localeContentKey(locale);
  return BUNDLES[key] ?? BUNDLES.en;
}

export function listAuthorTourIds(): string[] {
  return BUNDLES.en.tours.map((tour) => tour.id);
}

export function getAuthorTour(
  locale: Locale | string,
  tourId: string
): { ui: AuthorTourUi; tour: AuthorTour } | null {
  const bundle = getAuthorTourBundle(locale);
  const tour = bundle.tours.find((item) => item.id === tourId);
  if (!tour) return null;
  return { ui: bundle.ui, tour };
}

const AUTHOR_TOUR_IMAGES: Record<string, string> = {
  "tenerife-8-days": "/author-tours/teide-landscape.jpg",
  "seven-beaches": "/author-tours/beach-landscape.jpg",
};

export function getAuthorTourImageSrc(tourId: string): string {
  return AUTHOR_TOUR_IMAGES[tourId] ?? AUTHOR_TOUR_IMAGES["tenerife-8-days"];
}

export function formatAuthorTourPrice(priceEur: number): string {
  return `${priceEur} €`;
}
