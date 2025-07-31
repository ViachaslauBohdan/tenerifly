import { Locale } from '@/types/locale';

export interface Translations {
  hero: {
    title: string;
    subtitle: string;
    search: string;
    tabs: {
      excursions: string;
      cars: string;
      accommodation: string;
    };
    excursions: {
      title: string;
      type: string;
      date: string;
      people: string;
      types: Array<{ value: string; label: string }>;
    };
    cars: {
      title: string;
      pickup: string;
      dropoff: string;
      type: string;
      types: Array<{ value: string; label: string }>;
    };
    accommodation: {
      title: string;
      checkin: string;
      checkout: string;
      guests: string;
      type: string;
      types: Array<{ value: string; label: string }>;
    };
  };
  navigation: {
    home: string;
    excursions: string;
    cars: string;
    accommodation: string;
    blog: string;
    contact: string;
  };
  filters: {
    priceRange: string;
    location: string;
    type: string;
    bedrooms: string;
    area: string;
    year: string;
    condition: string;
    furnished: string;
    parking: string;
    availability: string;
    resetFilters: string;
    applyFilters: string;
    // Фильтры для машин
    make: string;
    model: string;
    mileage: string;
    fuel: string;
    transmission: string;
    bodyType: string;
    color: string;
    doors: string;
    power: string;
    // Фильтры для экскурсий
    duration: string;
    language: string;
    difficulty: string;
    groupSize: string;
    included: string;
    category: string;
    // НОВЫЕ КЛЮЧИ ДЛЯ СОРТИРОВКИ
    newest: string;
    oldest: string;
    priceAsc: string;
    priceDesc: string;
    yearDesc: string;
    yearAsc: string;
  };
  common: {
    bookNow: string;
    viewDetails: string;
    loading: string;
    noResults: string;
    from: string;
    to: string;
    perDay: string;
    perNight: string;
    per: string;
    currency: string;
    date: string;
    time: string;
    guests: string;
    rooms: string;
    adults: string;
    children: string;
    contact: string;
    phone: string;
    email: string;
    whatsapp: string;
    backToHome: string;
    // НОВЫЕ КЛЮЧИ
    found: string;
    rental: string;
    sale: string;
    type: string;
  };
  sections: {
    excursions: {
      title: string;
      subtitle: string;
      duration: string;
      groupSize: string;
      price: string;
      language: string;
    };
    cars: {
      title: string;
      subtitle: string;
      features: string;
      transmission: string;
      fuelType: string;
      seats: string;
      year: string;
    };
    accommodation: {
      title: string;
      subtitle: string;
      amenities: string;
      location: string;
      bedrooms: string;
      bathrooms: string;
      area: string;
    };
  };
  blog: {
    title: string;
    readMore: string;
    publishedOn: string;
    author: string;
    tags: string;
    relatedPosts: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    description: string;
    contacts: string;
    social: string;
    services: string;
    quickLinks: string;
    aboutUs: string;
    privacyPolicy: string;
    termsOfService: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    hero: {
      title: "Welcome to Tenerife",
      subtitle: "Find accommodation, excursions or car rental",
      search: "Search",
      tabs: {
        excursions: "Excursions",
        cars: "Cars",
        accommodation: "Accommodation"
      },
      excursions: {
        title: "Excursions",
        type: "Type of excursion",
        date: "Date",
        people: "Number of people",
        types: [
          { value: 'all', label: 'All excursions' },
          { value: 'teide', label: 'Teide National Park' },
          { value: 'water', label: 'Water activities' },
          { value: 'culture', label: 'Cultural tours' }
        ]
      },
      cars: {
        title: "Cars",
        pickup: "Pick-up date",
        dropoff: "Drop-off date",
        type: "Car type",
        types: [
          { value: 'all', label: 'All cars' },
          { value: 'economy', label: 'Economy' },
          { value: 'standard', label: 'Standard' },
          { value: 'premium', label: 'Premium' }
        ]
      },
      accommodation: {
        title: "Accommodation",
        checkin: "Check-in",
        checkout: "Check-out",
        guests: "Guests",
        type: "Property type",
        types: [
          { value: 'all', label: 'All properties' },
          { value: 'apartment', label: 'Apartments' },
          { value: 'villa', label: 'Villas' },
          { value: 'hotel', label: 'Hotels' }
        ]
      }
    },
    navigation: {
      home: "Home",
      excursions: "Excursions",
      cars: "Cars",
      accommodation: "Accommodation",
      blog: "Blog",
      contact: "Contact"
    },
    filters: {
      priceRange: "Price Range",
      location: "Location",
      type: "Type",
      bedrooms: "Bedrooms",
      area: "Area (m²)",
      year: "Year Built",
      condition: "Condition",
      furnished: "Furnished",
      parking: "Parking",
      availability: "Available from",
      resetFilters: "Reset Filters",
      applyFilters: "Apply Filters",
      make: "Make",
      model: "Model",
      mileage: "Mileage (km)",
      fuel: "Fuel Type",
      transmission: "Transmission",
      bodyType: "Body Type",
      color: "Color",
      doors: "Doors",
      power: "Engine Power",
      duration: "Duration",
      language: "Language",
      difficulty: "Difficulty",
      groupSize: "Group Size",
      included: "Included",
      category: "Category",
      newest: "Newest first",
      oldest: "Oldest first",
      priceAsc: "Price: Low to High",
      priceDesc: "Price: High to Low",
      yearDesc: "Year: Newest first",
      yearAsc: "Year: Oldest first"
    },
    common: {
      bookNow: "Book",
      viewDetails: "View Details",
      loading: "Loading...",
      noResults: "No results found",
      from: "From",
      to: "To",
      perDay: "/day",
      perNight: "/night",
      per: "per",
      currency: "€",
      date: "Date",
      time: "Time",
      guests: "Guests",
      rooms: "Rooms",
      adults: "Adults",
      children: "Children",
      contact: "Contact",
      phone: "Phone",
      email: "Email",
      whatsapp: "WhatsApp",
      backToHome: "Back to Home",
      found: "Found",
      rental: "Rental",
      sale: "Sale",
      type: "Type"
    },
    sections: {
      excursions: {
        title: "Popular Excursions",
        subtitle: "Discover the best of Tenerife",
        duration: "Duration",
        groupSize: "Group Size",
        price: "Price",
        language: "Language"
      },
      cars: {
        title: "Car Rental",
        subtitle: "Find the perfect car for your Tenerife adventure",
        features: "Features",
        transmission: "Transmission",
        fuelType: "Fuel Type",
        seats: "Seats",
        year: "Year"
      },
      accommodation: {
        title: "Places to Stay",
        subtitle: "Find your perfect accommodation in Tenerife",
        amenities: "Amenities",
        location: "Location",
        bedrooms: "Bedrooms",
        bathrooms: "Bathrooms",
        area: "Area"
      }
    },
    blog: {
      title: "Tenerife Guide",
      readMore: "Read More",
      publishedOn: "Published on",
      author: "Author",
      tags: "Tags",
      relatedPosts: "Related Posts"
    },
    cta: {
      title: "Don't know where to start?",
      subtitle: "Get a personal selection!",
      button: "Write on WhatsApp"
    },
    footer: {
      description: "Your guide to Tenerife",
      contacts: "Contacts",
      social: "Social Media",
      services: "Our Services",
      quickLinks: "Quick Links",
      aboutUs: "About Us",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service"
    }
  },
  pl: {
    hero: {
      title: "Witamy na Teneryfie",
      subtitle: "Znajdź zakwaterowanie, wycieczki lub wynajem samochodu",
      search: "Szukaj",
      tabs: {
        excursions: "Wycieczki",
        cars: "Samochody",
        accommodation: "Zakwaterowanie"
      },
      excursions: {
        title: "Wycieczki",
        type: "Rodzaj wycieczki",
        date: "Data",
        people: "Liczba osób",
        types: [
          { value: 'all', label: 'Wszystkie wycieczki' },
          { value: 'teide', label: 'Park Narodowy Teide' },
          { value: 'water', label: 'Aktywności wodne' },
          { value: 'culture', label: 'Wycieczki kulturowe' }
        ]
      },
      cars: {
        title: "Samochody",
        pickup: "Data odbioru",
        dropoff: "Data zwrotu",
        type: "Typ samochodu",
        types: [
          { value: 'all', label: 'Wszystkie samochody' },
          { value: 'economy', label: 'Ekonomiczne' },
          { value: 'standard', label: 'Standardowe' },
          { value: 'premium', label: 'Premium' }
        ]
      },
      accommodation: {
        title: "Zakwaterowanie",
        checkin: "Zameldowanie",
        checkout: "Wymeldowanie",
        guests: "Goście",
        type: "Typ zakwaterowania",
        types: [
          { value: 'all', label: 'Wszystkie obiekty' },
          { value: 'apartment', label: 'Apartamenty' },
          { value: 'villa', label: 'Wille' },
          { value: 'hotel', label: 'Hotele' }
        ]
      }
    },
    navigation: {
      home: "Strona główna",
      excursions: "Wycieczki",
      cars: "Samochody",
      accommodation: "Zakwaterowanie",
      blog: "Blog",
      contact: "Kontakt"
    },
    filters: {
      priceRange: "Zakres cen",
      location: "Lokalizacja",
      type: "Typ",
      bedrooms: "Sypialnie",
      area: "Powierzchnia (m²)",
      year: "Rok budowy",
      condition: "Stan",
      furnished: "Umeblowane",
      parking: "Parking",
      availability: "Dostępne od",
      resetFilters: "Resetuj filtry",
      applyFilters: "Zastosuj filtry",
      make: "Marka",
      model: "Model",
      mileage: "Przebieg (km)",
      fuel: "Rodzaj paliwa",
      transmission: "Skrzynia biegów",
      bodyType: "Typ nadwozia",
      color: "Kolor",
      doors: "Drzwi",
      power: "Moc silnika",
      duration: "Czas trwania",
      language: "Język",
      difficulty: "Trudność",
      groupSize: "Rozmiar grupy",
      included: "W cenie",
      category: "Kategoria",
      newest: "Najnowsze najpierw",
      oldest: "Najstarsze najpierw",
      priceAsc: "Cena: od najniższej",
      priceDesc: "Cena: od najwyższej",
      yearDesc: "Rok: najnowsze najpierw",
      yearAsc: "Rok: najstarsze najpierw"
    },
    common: {
      bookNow: "Rezerwuj",
      viewDetails: "Zobacz szczegóły",
      loading: "Ładowanie...",
      noResults: "Brak wyników",
      from: "Od",
      to: "Do",
      perDay: "/dzień",
      perNight: "/noc",
      per: "za",
      currency: "€",
      date: "Data",
      time: "Czas",
      guests: "Goście",
      rooms: "Pokoje",
      adults: "Dorośli",
      children: "Dzieci",
      contact: "Kontakt",
      phone: "Telefon",
      email: "Email",
      whatsapp: "WhatsApp",
      backToHome: "Powrót do strony głównej",
      found: "Znaleziono",
      rental: "Wynajem",
      sale: "Sprzedaż",
      type: "Typ"
    },
    sections: {
      excursions: {
        title: "Popularne wycieczki",
        subtitle: "Odkryj najlepsze miejsca na Teneryfie",
        duration: "Czas trwania",
        groupSize: "Rozmiar grupy",
        price: "Cena",
        language: "Język"
      },
      cars: {
        title: "Wynajem Samochodów",
        subtitle: "Znajdź idealny samochód dla Twojej wycieczki na Teneryfę",
        features: "Cechy",
        transmission: "Skrzynia biegów",
        fuelType: "Rodzaj paliwa",
        seats: "Miejsca",
        year: "Rok"
      },
      accommodation: {
        title: "Miejsca do Zamieszkania",
        subtitle: "Znajdź idealne zakwaterowanie w Tenerife",
        amenities: "Udogodnienia",
        location: "Lokalizacja",
        bedrooms: "Sypialnie",
        bathrooms: "Łazienki",
        area: "Powierzchnia"
      }
    },
    blog: {
      title: "Przewodnik po Teneryfie",
      readMore: "Czytaj więcej",
      publishedOn: "Opublikowano",
      author: "Autor",
      tags: "Tagi",
      relatedPosts: "Powiązane posty"
    },
    cta: {
      title: "Nie wiesz od czego zacząć?",
      subtitle: "Otrzymaj spersonalizowaną ofertę!",
      button: "Napisz na WhatsApp"
    },
    footer: {
      description: "Twój przewodnik po Teneryfie",
      contacts: "Kontakt",
      social: "Media społecznościowe",
      services: "Nasze usługi",
      quickLinks: "Szybkie linki",
      aboutUs: "O nas",
      privacyPolicy: "Polityka prywatności",
      termsOfService: "Regulamin"
    }
  },
  fr: {
    hero: {
      title: "Bienvenue à Tenerife",
      subtitle: "Trouvez un hébergement, des excursions ou une location de voiture",
      search: "Rechercher",
      tabs: {
        excursions: "Excursions",
        cars: "Voitures",
        accommodation: "Hébergement"
      },
      excursions: {
        title: "Excursions",
        type: "Type d'excursion",
        date: "Date",
        people: "Nombre de personnes",
        types: [
          { value: 'all', label: 'Toutes les excursions' },
          { value: 'teide', label: 'Parc National du Teide' },
          { value: 'water', label: 'Activités aquatiques' },
          { value: 'culture', label: 'Visites culturelles' }
        ]
      },
      cars: {
        title: "Voitures",
        pickup: "Date de prise en charge",
        dropoff: "Date de retour",
        type: "Type de voiture",
        types: [
          { value: 'all', label: 'Toutes les voitures' },
          { value: 'economy', label: 'Économique' },
          { value: 'standard', label: 'Standard' },
          { value: 'premium', label: 'Premium' }
        ]
      },
      accommodation: {
        title: "Hébergement",
        checkin: "Arrivée",
        checkout: "Départ",
        guests: "Invités",
        type: "Type de propriété",
        types: [
          { value: 'all', label: 'Toutes les propriétés' },
          { value: 'apartment', label: 'Appartements' },
          { value: 'villa', label: 'Villas' },
          { value: 'hotel', label: 'Hôtels' }
        ]
      }
    },
    navigation: {
      home: "Accueil",
      excursions: "Excursions",
      cars: "Voitures",
      accommodation: "Hébergement",
      blog: "Blog",
      contact: "Contact"
    },
    filters: {
      priceRange: "Fourchette de prix",
      location: "Lieu",
      type: "Type",
      bedrooms: "Chambres",
      area: "Superficie (m²)",
      year: "Année de construction",
      condition: "État",
      furnished: "Meublé",
      parking: "Parking",
      availability: "Disponible à partir de",
      resetFilters: "Réinitialiser les filtres",
      applyFilters: "Appliquer les filtres",
      make: "Marque",
      model: "Modèle",
      mileage: "Kilométrage (km)",
      fuel: "Type de carburant",
      transmission: "Transmission",
      bodyType: "Type de carrosserie",
      color: "Couleur",
      doors: "Portes",
      power: "Puissance du moteur",
      duration: "Durée",
      language: "Langue",
      difficulty: "Difficulté",
      groupSize: "Taille du groupe",
      included: "Inclus",
      category: "Catégorie",
      newest: "Plus récents d'abord",
      oldest: "Plus anciens d'abord",
      priceAsc: "Prix: croissant",
      priceDesc: "Prix: décroissant",
      yearDesc: "Année: récents d'abord",
      yearAsc: "Année: anciens d'abord"
    },
    common: {
      bookNow: "Réserver",
      viewDetails: "Voir les détails",
      loading: "Chargement...",
      noResults: "Aucun résultat trouvé",
      from: "De",
      to: "À",
      perDay: "/jour",
      perNight: "/nuit",
      per: "par",
      currency: "€",
      date: "Date",
      time: "Heure",
      guests: "Invités",
      rooms: "Chambres",
      adults: "Adultes",
      children: "Enfants",
      contact: "Contact",
      phone: "Téléphone",
      email: "Email",
      whatsapp: "WhatsApp",
      backToHome: "Retour à l'accueil",
      found: "Trouvé",
      rental: "Location",
      sale: "Vente",
      type: "Type"
    },
    sections: {
      excursions: {
        title: "Excursions populaires",
        subtitle: "Découvrez le meilleur de Tenerife",
        duration: "Durée",
        groupSize: "Taille du groupe",
        price: "Prix",
        language: "Langue"
      },
      cars: {
        title: "Location de voitures",
        subtitle: "Trouvez la voiture parfaite pour votre aventure à Tenerife",
        features: "Caractéristiques",
        transmission: "Transmission",
        fuelType: "Type de carburant",
        seats: "Sièges",
        year: "Année"
      },
      accommodation: {
        title: "Lieux de séjour",
        subtitle: "Trouvez votre hébergement parfait à Tenerife",
        amenities: "Équipements",
        location: "Localisation",
        bedrooms: "Chambres",
        bathrooms: "Salles de bain",
        area: "Superficie"
      }
    },
    blog: {
      title: "Guide de Tenerife",
      readMore: "Lire la suite",
      publishedOn: "Publié le",
      author: "Auteur",
      tags: "Tags",
      relatedPosts: "Articles connexes"
    },
    cta: {
      title: "Vous ne savez pas par où commencer ?",
      subtitle: "Obtenez une sélection personnalisée !",
      button: "Écrire sur WhatsApp"
    },
    footer: {
      description: "Votre guide de Tenerife",
      contacts: "Contacts",
      social: "Réseaux sociaux",
      services: "Nos services",
      quickLinks: "Liens rapides",
      aboutUs: "À propos de nous",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions d'utilisation"
    }
  },
  ru: {
    hero: {
      title: "Добро пожаловать на Тенерифе",
      subtitle: "Найдите жилье, экскурсии или аренду автомобиля",
      search: "Поиск",
      tabs: {
        excursions: "Экскурсии",
        cars: "Автомобили",
        accommodation: "Жилье"
      },
      excursions: {
        title: "Экскурсии",
        type: "Тип экскурсии",
        date: "Дата",
        people: "Количество человек",
        types: [
          { value: 'all', label: 'Все экскурсии' },
          { value: 'teide', label: 'Национальный парк Тейде' },
          { value: 'water', label: 'Водные развлечения' },
          { value: 'culture', label: 'Культурные туры' }
        ]
      },
      cars: {
        title: "Автомобили",
        pickup: "Дата получения",
        dropoff: "Дата возврата",
        type: "Тип автомобиля",
        types: [
          { value: 'all', label: 'Все автомобили' },
          { value: 'economy', label: 'Эконом' },
          { value: 'standard', label: 'Стандарт' },
          { value: 'premium', label: 'Премиум' }
        ]
      },
      accommodation: {
        title: "Жилье",
        checkin: "Заезд",
        checkout: "Выезд",
        guests: "Гости",
        type: "Тип недвижимости",
        types: [
          { value: 'all', label: 'Все объекты' },
          { value: 'apartment', label: 'Квартиры' },
          { value: 'villa', label: 'Виллы' },
          { value: 'hotel', label: 'Отели' }
        ]
      }
    },
    navigation: {
      home: "Главная",
      excursions: "Экскурсии",
      cars: "Автомобили",
      accommodation: "Жилье",
      blog: "Блог",
      contact: "Контакты"
    },
    filters: {
      priceRange: "Диапазон цен",
      location: "Местоположение",
      type: "Тип",
      bedrooms: "Спальни",
      area: "Площадь (м²)",
      year: "Год постройки",
      condition: "Состояние",
      furnished: "Меблированное",
      parking: "Парковка",
      availability: "Доступно с",
      resetFilters: "Сбросить фильтры",
      applyFilters: "Применить фильтры",
      make: "Марка",
      model: "Модель",
      mileage: "Пробег (км)",
      fuel: "Тип топлива",
      transmission: "Коробка передач",
      bodyType: "Тип кузова",
      color: "Цвет",
      doors: "Двери",
      power: "Мощность двигателя",
      duration: "Продолжительность",
      language: "Язык",
      difficulty: "Сложность",
      groupSize: "Размер группы",
      included: "Включено",
      category: "Категория",
      newest: "Сначала новые",
      oldest: "Сначала старые",
      priceAsc: "Цена: по возрастанию",
      priceDesc: "Цена: по убыванию",
      yearDesc: "Год: новые первыми",
      yearAsc: "Год: старые первыми"
    },
    common: {
      bookNow: "Бронь",
      viewDetails: "Подробнее",
      loading: "Загрузка...",
      noResults: "Результаты не найдены",
      from: "От",
      to: "До",
      perDay: "/день",
      perNight: "/ночь",
      per: "за",
      currency: "€",
      date: "Дата",
      time: "Время",
      guests: "Гости",
      rooms: "Комнаты",
      adults: "Взрослые",
      children: "Дети",
      contact: "Контакт",
      phone: "Телефон",
      email: "Email",
      whatsapp: "WhatsApp",
      backToHome: "Вернуться на главную",
      found: "Найдено",
      rental: "Аренда",
      sale: "Продажа",
      type: "Тип"
    },
    sections: {
      excursions: {
        title: "Популярные экскурсии",
        subtitle: "Откройте для себя лучшее на Тенерифе",
        duration: "Продолжительность",
        groupSize: "Размер группы",
        price: "Цена",
        language: "Язык"
      },
      cars: {
        title: "Аренда автомобилей",
        subtitle: "Найдите идеальный автомобиль для приключений на Тенерифе",
        features: "Особенности",
        transmission: "Коробка передач",
        fuelType: "Тип топлива",
        seats: "Места",
        year: "Год"
      },
      accommodation: {
        title: "Места для проживания",
        subtitle: "Найдите идеальное жилье на Тенерифе",
        amenities: "Удобства",
        location: "Местоположение",
        bedrooms: "Спальни",
        bathrooms: "Ванные комнаты",
        area: "Площадь"
      }
    },
    blog: {
      title: "Гид по Тенерифе",
      readMore: "Читать далее",
      publishedOn: "Опубликовано",
      author: "Автор",
      tags: "Теги",
      relatedPosts: "Похожие статьи"
    },
    cta: {
      title: "Не знаете с чего начать?",
      subtitle: "Получите персональную подборку!",
      button: "Написать в WhatsApp"
    },
    footer: {
      description: "Ваш гид по Тенерифе",
      contacts: "Контакты",
      social: "Социальные сети",
      services: "Наши услуги",
      quickLinks: "Быстрые ссылки",
      aboutUs: "О нас",
      privacyPolicy: "Политика конфиденциальности",
      termsOfService: "Условия использования"
    }
  },
  uk: {
    hero: {
      title: "Ласкаво просимо на Тенеріфе",
      subtitle: "Знайдіть житло, екскурсії або оренду автомобіля",
      search: "Пошук",
      tabs: {
        excursions: "Екскурсії",
        cars: "Автомобілі",
        accommodation: "Житло"
      },
      excursions: {
        title: "Екскурсії",
        type: "Тип екскурсії",
        date: "Дата",
        people: "Кількість осіб",
        types: [
          { value: 'all', label: 'Всі екскурсії' },
          { value: 'teide', label: 'Національний парк Тейде' },
          { value: 'water', label: 'Водні розваги' },
          { value: 'culture', label: 'Культурні тури' }
        ]
      },
      cars: {
        title: "Автомобілі",
        pickup: "Дата отримання",
        dropoff: "Дата повернення",
        type: "Тип автомобіля",
        types: [
          { value: 'all', label: 'Всі автомобілі' },
          { value: 'economy', label: 'Економ' },
          { value: 'standard', label: 'Стандарт' },
          { value: 'premium', label: 'Преміум' }
        ]
      },
      accommodation: {
        title: "Житло",
        checkin: "Заїзд",
        checkout: "Виїзд",
        guests: "Гості",
        type: "Тип нерухомості",
        types: [
          { value: 'all', label: 'Всі об\'єкти' },
          { value: 'apartment', label: 'Квартири' },
          { value: 'villa', label: 'Вілли' },
          { value: 'hotel', label: 'Готелі' }
        ]
      }
    },
    navigation: {
      home: "Головна",
      excursions: "Екскурсії",
      cars: "Автомобілі",
      accommodation: "Житло",
      blog: "Блог",
      contact: "Контакти"
    },
    filters: {
      priceRange: "Діапазон цін",
      location: "Місцезнаходження",
      type: "Тип",
      bedrooms: "Спальні",
      area: "Площа (м²)",
      year: "Рік будівництва",
      condition: "Стан",
      furnished: "Мебльоване",
      parking: "Парковка",
      availability: "Доступно з",
      resetFilters: "Скинути фільтри",
      applyFilters: "Застосувати фільтри",
      make: "Марка",
      model: "Модель",
      mileage: "Пробіг (км)",
      fuel: "Тип палива",
      transmission: "Коробка передач",
      bodyType: "Тип кузова",
      color: "Колір",
      doors: "Двері",
      power: "Потужність двигуна",
      duration: "Тривалість",
      language: "Мова",
      difficulty: "Складність",
      groupSize: "Розмір групи",
      included: "Включено",
      category: "Категорія",
      newest: "Спочатку нові",
      oldest: "Спочатку старі",
      priceAsc: "Ціна: за зростанням",
      priceDesc: "Ціна: за спаданням",
      yearDesc: "Рік: нові першими",
      yearAsc: "Рік: старі першими"
    },
    common: {
      bookNow: "Бронь",
      viewDetails: "Детальніше",
      loading: "Завантаження...",
      noResults: "Результати не знайдено",
      from: "Від",
      to: "До",
      perDay: "/день",
      perNight: "/ніч",
      per: "за",
      currency: "€",
      date: "Дата",
      time: "Час",
      guests: "Гості",
      rooms: "Кімнати",
      adults: "Дорослі",
      children: "Діти",
      contact: "Контакт",
      phone: "Телефон",
      email: "Email",
      whatsapp: "WhatsApp",
      backToHome: "Повернутися на головну",
      found: "Знайдено",
      rental: "Оренда",
      sale: "Продаж",
      type: "Тип"
    },
    sections: {
      excursions: {
        title: "Популярні екскурсії",
        subtitle: "Відкрийте для себе найкраще на Тенеріфе",
        duration: "Тривалість",
        groupSize: "Розмір групи",
        price: "Ціна",
        language: "Мова"
      },
      cars: {
        title: "Оренда автомобілів",
        subtitle: "Знайдіть ідеальний автомобіль для пригод на Тенеріфе",
        features: "Особливості",
        transmission: "Коробка передач",
        fuelType: "Тип палива",
        seats: "Місця",
        year: "Рік"
      },
      accommodation: {
        title: "Місця для проживання",
        subtitle: "Знайдіть ідеальне житло на Тенеріфе",
        amenities: "Зручності",
        location: "Місцезнаходження",
        bedrooms: "Спальні",
        bathrooms: "Ванні кімнати",
        area: "Площа"
      }
    },
    blog: {
      title: "Гід по Тенеріфе",
      readMore: "Читати далі",
      publishedOn: "Опубліковано",
      author: "Автор",
      tags: "Теги",
      relatedPosts: "Схожі статті"
    },
    cta: {
      title: "Не знаєте з чого почати?",
      subtitle: "Отримайте персональну добірку!",
      button: "Написати в WhatsApp"
    },
    footer: {
      description: "Ваш гід по Тенеріфе",
      contacts: "Контакти",
      social: "Соціальні мережі",
      services: "Наші послуги",
      quickLinks: "Швидкі посилання",
      aboutUs: "Про нас",
      privacyPolicy: "Політика конфіденційності",
      termsOfService: "Умови використання"
    }
  }
};
