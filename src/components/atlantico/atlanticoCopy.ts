import { pickLocaleBundle } from "@/types/locale";

export type AtlanticoUiCopy = {
  from: string;
  hours: string;
  allCategories: string;
  mainCategoriesLead: string;
  mainCategoriesAccent: string;
  categoriesSubtitle: string;
  backToCategories: string;
  loadingCategories: string;
  option: string;
  date: string;
  session: string;
  adults: string;
  children: string;
  infants: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  notesPlaceholder: string;
  hotel: string;
  hotelPlaceholder: string;
  bookNow: string;
  viewDetails: string;
  processing: string;
  successTitle: string;
  successBody: string;
  bookingCode: string;
  errorGeneric: string;
  loadingTours: string;
  loadingAvailability: string;
  noAvailability: string;
  noTours: string;
  selectOption: string;
  selectDate: string;
  perPerson: string;
  total: string;
  childAge: string;
  infantAge: string;
  duration: string;
  atLeastOneGuest: string;
  emailError: string;
  phoneError: string;
  nameError: string;
  partnerPowered: string;
  notConfigured: string;
  noSession: string;
  iframeTitle: string;
  iframeHint: string;
  iframeOpenExternal: string;
};

const COPY: Record<string, AtlanticoUiCopy> = {
  de: {
    from: "Ab",
    hours: "Stunden",
    allCategories: "Alle Kategorien",
    mainCategoriesLead: "Haupt",
    mainCategoriesAccent: "kategorien",
    categoriesSubtitle:
      "Entdecken Sie Erlebnisse und spüren Sie die Emotion, jeden Winkel Teneriffas zu erkunden!",
    backToCategories: "Alle Kategorien",
    loadingCategories: "Kategorien werden geladen…",
    option: "Option",
    date: "Datum",
    session: "Uhrzeit",
    adults: "Erwachsene",
    children: "Kinder",
    infants: "Kleinkinder",
    fullName: "Vollständiger Name",
    email: "E-Mail",
    phone: "Telefon",
    notes: "Anmerkungen (optional)",
    notesPlaceholder: "Abholung, besondere Wünsche…",
    hotel: "Hotel (optional)",
    hotelPlaceholder: "Hotelname für den Transfer",
    bookNow: "Jetzt buchen",
    viewDetails: "Details anzeigen",
    processing: "Buchung wird gesendet…",
    successTitle: "Reservierung bestätigt",
    successBody:
      "Atlántico Excursiones hat Ihre Buchung registriert. Bewahren Sie die Referenz auf.",
    bookingCode: "Buchungsnummer",
    errorGeneric: "Die Buchung konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
    loadingTours: "Touren werden geladen…",
    loadingAvailability: "Verfügbarkeit wird geprüft…",
    noAvailability: "Für diese Option sind derzeit keine Termine verfügbar.",
    noTours: "Derzeit sind keine Touren von Atlántico Excursiones verfügbar.",
    selectOption: "Option wählen",
    selectDate: "Datum wählen",
    perPerson: "pro Person",
    total: "Gesamt",
    childAge: "Kinder",
    infantAge: "Kleinkinder",
    duration: "Dauer",
    atLeastOneGuest: "Mindestens ein Teilnehmer ist erforderlich.",
    emailError: "Bitte eine gültige E-Mail-Adresse eingeben.",
    phoneError: "Bitte eine gültige Telefonnummer eingeben.",
    nameError: "Bitte Ihren Namen eingeben.",
    partnerPowered: "Buchung über Atlántico Excursiones",
    notConfigured: "Die Atlántico-API ist noch nicht konfiguriert.",
    noSession: "Kein Zeitslot — Standard 00:00",
    iframeTitle: "Atlántico Excursiones Katalog",
    iframeHint:
      "Buchen Sie über den offiziellen Atlántico-Katalog (Affiliate 3726).",
    iframeOpenExternal: "Im neuen Tab öffnen",
  },
  en: {
    from: "From",
    hours: "hours",
    allCategories: "All categories",
    mainCategoriesLead: "Main",
    mainCategoriesAccent: "categories",
    categoriesSubtitle:
      "Discover experiences and feel the emotion of exploring every corner of Tenerife!",
    backToCategories: "All categories",
    loadingCategories: "Loading categories…",
    option: "Option",
    date: "Date",
    session: "Time",
    adults: "Adults",
    children: "Children",
    infants: "Infants",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    notes: "Notes (optional)",
    notesPlaceholder: "Pickup, special requests…",
    hotel: "Hotel (optional)",
    hotelPlaceholder: "Hotel name for pickup",
    bookNow: "Book now",
    viewDetails: "View details",
    processing: "Sending booking…",
    successTitle: "Reservation confirmed",
    successBody:
      "Atlántico Excursiones has registered your booking. Please keep this reference.",
    bookingCode: "Booking code",
    errorGeneric: "Could not complete the booking. Please try again.",
    loadingTours: "Loading tours…",
    loadingAvailability: "Checking availability…",
    noAvailability: "No dates are available for this option right now.",
    noTours: "No Atlántico Excursiones tours are available right now.",
    selectOption: "Choose an option",
    selectDate: "Choose a date",
    perPerson: "per person",
    total: "Total",
    childAge: "Children",
    infantAge: "Infants",
    duration: "Duration",
    atLeastOneGuest: "At least one guest is required.",
    emailError: "Please enter a valid email address.",
    phoneError: "Please enter a valid phone number.",
    nameError: "Please enter your name.",
    partnerPowered: "Booked with Atlántico Excursiones",
    notConfigured: "The Atlántico API is not configured yet.",
    noSession: "No time slot — default 00:00",
    iframeTitle: "Atlántico Excursiones catalog",
    iframeHint:
      "Book through the official Atlántico white-label catalog (affiliate 3726).",
    iframeOpenExternal: "Open in a new tab",
  },
  es: {
    from: "Desde",
    hours: "horas",
    allCategories: "Todas las categorías",
    mainCategoriesLead: "Categorías",
    mainCategoriesAccent: "principales",
    categoriesSubtitle:
      "¡Descubre experiencias y siente la emoción de explorar cada rincón de Tenerife!",
    backToCategories: "Todas las categorías",
    loadingCategories: "Cargando categorías…",
    option: "Opción",
    date: "Fecha",
    session: "Hora",
    adults: "Adultos",
    children: "Niños",
    infants: "Bebés",
    fullName: "Nombre completo",
    email: "Email",
    phone: "Teléfono",
    notes: "Notas (opcional)",
    notesPlaceholder: "Recogida, peticiones especiales…",
    hotel: "Hotel (opcional)",
    hotelPlaceholder: "Nombre del hotel para la recogida",
    bookNow: "Reservar ahora",
    viewDetails: "Ver detalles",
    processing: "Enviando reserva…",
    successTitle: "Reserva confirmada",
    successBody:
      "Atlántico Excursiones ha registrado su reserva. Conserve esta referencia.",
    bookingCode: "Código de reserva",
    errorGeneric: "No se pudo completar la reserva. Inténtelo de nuevo.",
    loadingTours: "Cargando excursiones…",
    loadingAvailability: "Comprobando disponibilidad…",
    noAvailability: "No hay fechas disponibles para esta opción ahora mismo.",
    noTours: "No hay excursiones de Atlántico Excursiones disponibles ahora.",
    selectOption: "Elige una opción",
    selectDate: "Elige una fecha",
    perPerson: "por persona",
    total: "Total",
    childAge: "Niños",
    infantAge: "Bebés",
    duration: "Duración",
    atLeastOneGuest: "Se requiere al menos un participante.",
    emailError: "Introduce un email válido.",
    phoneError: "Introduce un teléfono válido.",
    nameError: "Introduce tu nombre.",
    partnerPowered: "Reserva con Atlántico Excursiones",
    notConfigured: "La API de Atlántico aún no está configurada.",
    noSession: "Sin horario — se usa 00:00",
    iframeTitle: "Catálogo Atlántico Excursiones",
    iframeHint:
      "Reserve a través del catálogo white-label oficial de Atlántico (afiliado 3726).",
    iframeOpenExternal: "Abrir en una pestaña nueva",
  },
  fr: {
    from: "À partir de",
    hours: "heures",
    allCategories: "Toutes les catégories",
    mainCategoriesLead: "Catégories",
    mainCategoriesAccent: "principales",
    categoriesSubtitle:
      "Découvrez des expériences et ressentez l'émotion d'explorer chaque coin de Tenerife !",
    backToCategories: "Toutes les catégories",
    loadingCategories: "Chargement des catégories…",
    option: "Option",
    date: "Date",
    session: "Heure",
    adults: "Adultes",
    children: "Enfants",
    infants: "Bébés",
    fullName: "Nom complet",
    email: "E-mail",
    phone: "Téléphone",
    notes: "Notes (facultatif)",
    notesPlaceholder: "Prise en charge, demandes spéciales…",
    hotel: "Hôtel (facultatif)",
    hotelPlaceholder: "Nom de l'hôtel pour la prise en charge",
    bookNow: "Réserver",
    viewDetails: "Voir les détails",
    processing: "Envoi de la réservation…",
    successTitle: "Réservation confirmée",
    successBody:
      "Atlántico Excursiones a enregistré votre réservation. Conservez cette référence.",
    bookingCode: "Code de réservation",
    errorGeneric: "Impossible de finaliser la réservation. Réessayez.",
    loadingTours: "Chargement des excursions…",
    loadingAvailability: "Vérification des disponibilités…",
    noAvailability: "Aucune date n'est disponible pour cette option pour le moment.",
    noTours: "Aucune excursion Atlántico Excursiones n'est disponible pour le moment.",
    selectOption: "Choisir une option",
    selectDate: "Choisir une date",
    perPerson: "par personne",
    total: "Total",
    childAge: "Enfants",
    infantAge: "Bébés",
    duration: "Durée",
    atLeastOneGuest: "Au moins un participant est requis.",
    emailError: "Veuillez saisir un e-mail valide.",
    phoneError: "Veuillez saisir un numéro de téléphone valide.",
    nameError: "Veuillez saisir votre nom.",
    partnerPowered: "Réservation via Atlántico Excursiones",
    notConfigured: "L'API Atlántico n'est pas encore configurée.",
    noSession: "Pas de créneau — 00:00 par défaut",
    iframeTitle: "Catalogue Atlántico Excursiones",
    iframeHint:
      "Réservez via le catalogue white-label officiel Atlántico (affilié 3726).",
    iframeOpenExternal: "Ouvrir dans un nouvel onglet",
  },
  pl: {
    from: "Od",
    hours: "godz.",
    allCategories: "Wszystkie kategorie",
    mainCategoriesLead: "Główne",
    mainCategoriesAccent: "kategorie",
    categoriesSubtitle:
      "Odkryj wrażenia i poczuj emocje, zwiedzając każdy zakątek Teneryfy!",
    backToCategories: "Wszystkie kategorie",
    loadingCategories: "Ładowanie kategorii…",
    option: "Opcja",
    date: "Data",
    session: "Godzina",
    adults: "Dorośli",
    children: "Dzieci",
    infants: "Niemowlęta",
    fullName: "Imię i nazwisko",
    email: "E-mail",
    phone: "Telefon",
    notes: "Uwagi (opcjonalnie)",
    notesPlaceholder: "Odbiór, specjalne prośby…",
    hotel: "Hotel (opcjonalnie)",
    hotelPlaceholder: "Nazwa hotelu do odbioru",
    bookNow: "Zarezerwuj",
    viewDetails: "Zobacz szczegóły",
    processing: "Wysyłanie rezerwacji…",
    successTitle: "Rezerwacja potwierdzona",
    successBody:
      "Atlántico Excursiones zarejestrowało rezerwację. Zachowaj ten numer.",
    bookingCode: "Kod rezerwacji",
    errorGeneric: "Nie udało się dokończyć rezerwacji. Spróbuj ponownie.",
    loadingTours: "Ładowanie wycieczek…",
    loadingAvailability: "Sprawdzanie dostępności…",
    noAvailability: "Brak dostępnych terminów dla tej opcji.",
    noTours: "Brak wycieczek Atlántico Excursiones.",
    selectOption: "Wybierz opcję",
    selectDate: "Wybierz datę",
    perPerson: "osoba",
    total: "Suma",
    childAge: "Dzieci",
    infantAge: "Niemowlęta",
    duration: "Czas trwania",
    atLeastOneGuest: "Wymagany jest co najmniej jeden uczestnik.",
    emailError: "Podaj prawidłowy adres e-mail.",
    phoneError: "Podaj prawidłowy numer telefonu.",
    nameError: "Podaj imię i nazwisko.",
    partnerPowered: "Rezerwacja przez Atlántico Excursiones",
    notConfigured: "API Atlántico nie jest jeszcze skonfigurowane.",
    noSession: "Brak godziny — domyślnie 00:00",
    iframeTitle: "Katalog Atlántico Excursiones",
    iframeHint:
      "Zarezerwuj przez oficjalny katalog white-label Atlántico (afiliant 3726).",
    iframeOpenExternal: "Otwórz w nowej karcie",
  },
  ru: {
    from: "От",
    hours: "часов",
    allCategories: "Все категории",
    mainCategoriesLead: "Основные",
    mainCategoriesAccent: "категории",
    categoriesSubtitle:
      "Откройте для себя впечатления и почувствуйте эмоции, исследуя каждый уголок Тенерифе!",
    backToCategories: "Все категории",
    loadingCategories: "Загрузка категорий…",
    option: "Вариант",
    date: "Дата",
    session: "Время",
    adults: "Взрослые",
    children: "Дети",
    infants: "Младенцы",
    fullName: "Имя и фамилия",
    email: "Email",
    phone: "Телефон",
    notes: "Комментарий (необязательно)",
    notesPlaceholder: "Трансфер, пожелания…",
    hotel: "Отель (необязательно)",
    hotelPlaceholder: "Название отеля для трансфера",
    bookNow: "Забронировать",
    viewDetails: "Подробнее",
    processing: "Отправляем бронь…",
    successTitle: "Бронирование подтверждено",
    successBody:
      "Atlántico Excursiones зарегистрировали вашу бронь. Сохраните этот номер.",
    bookingCode: "Код брони",
    errorGeneric: "Не удалось завершить бронирование. Попробуйте ещё раз.",
    loadingTours: "Загрузка экскурсий…",
    loadingAvailability: "Проверяем доступность…",
    noAvailability: "Для этого варианта сейчас нет свободных дат.",
    noTours: "Сейчас нет экскурсий Atlántico Excursiones.",
    selectOption: "Выберите вариант",
    selectDate: "Выберите дату",
    perPerson: "с человека",
    total: "Итого",
    childAge: "Дети",
    infantAge: "Младенцы",
    duration: "Длительность",
    atLeastOneGuest: "Нужен хотя бы один участник.",
    emailError: "Введите корректный email.",
    phoneError: "Введите корректный телефон.",
    nameError: "Введите имя.",
    partnerPowered: "Бронирование через Atlántico Excursiones",
    notConfigured: "API Atlántico ещё не настроено.",
    noSession: "Нет слота — по умолчанию 00:00",
    iframeTitle: "Каталог Atlántico Excursiones",
    iframeHint:
      "Бронируйте через официальный white-label каталог Atlántico (affiliate 3726).",
    iframeOpenExternal: "Открыть в новой вкладке",
  },
  uk: {
    from: "Від",
    hours: "годин",
    allCategories: "Усі категорії",
    mainCategoriesLead: "Основні",
    mainCategoriesAccent: "категорії",
    categoriesSubtitle:
      "Відкрийте враження і відчуйте емоції, досліджуючи кожен куточок Тенеріфе!",
    backToCategories: "Усі категорії",
    loadingCategories: "Завантаження категорій…",
    option: "Варіант",
    date: "Дата",
    session: "Час",
    adults: "Дорослі",
    children: "Діти",
    infants: "Немовлята",
    fullName: "Ім’я та прізвище",
    email: "Email",
    phone: "Телефон",
    notes: "Коментар (необов’язково)",
    notesPlaceholder: "Трансфер, побажання…",
    hotel: "Готель (необов’язково)",
    hotelPlaceholder: "Назва готелю для трансферу",
    bookNow: "Забронювати",
    viewDetails: "Детальніше",
    processing: "Надсилаємо бронювання…",
    successTitle: "Бронювання підтверджено",
    successBody:
      "Atlántico Excursiones зареєстрували ваше бронювання. Збережіть цей номер.",
    bookingCode: "Код бронювання",
    errorGeneric: "Не вдалося завершити бронювання. Спробуйте ще раз.",
    loadingTours: "Завантаження екскурсій…",
    loadingAvailability: "Перевіряємо доступність…",
    noAvailability: "Для цього варіанту зараз немає вільних дат.",
    noTours: "Зараз немає екскурсій Atlántico Excursiones.",
    selectOption: "Оберіть варіант",
    selectDate: "Оберіть дату",
    perPerson: "з особи",
    total: "Разом",
    childAge: "Діти",
    infantAge: "Немовлята",
    duration: "Тривалість",
    atLeastOneGuest: "Потрібен хоча б один учасник.",
    emailError: "Введіть коректний email.",
    phoneError: "Введіть коректний телефон.",
    nameError: "Введіть ім’я.",
    partnerPowered: "Бронювання через Atlántico Excursiones",
    notConfigured: "API Atlántico ще не налаштовано.",
    noSession: "Немає слота — за замовчуванням 00:00",
    iframeTitle: "Каталог Atlántico Excursiones",
    iframeHint:
      "Бронюйте через офіційний white-label каталог Atlántico (affiliate 3726).",
    iframeOpenExternal: "Відкрити в новій вкладці",
  },
};

COPY.ua = COPY.uk;

export function getAtlanticoUiCopy(locale: string): AtlanticoUiCopy {
  return pickLocaleBundle(COPY, locale);
}
