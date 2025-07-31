"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  Check,
  Home,
  Car,
  MapPin,
  Star,
  Clock,
  Users,
  Euro,
  Phone,
  Eye,
  BookOpen,
  Search,
  Mail,
  AlertCircle,
  Wifi,
  WifiOff,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react"
import { useDataLoader } from "./useDataLoader"

// Переводы для всех языков
const translations = {
  en: {
    hero: {
      title: "Discover Tenerife",
      subtitle: "Your gateway to amazing experiences in the Canary Islands",
      tabs: {
        accommodation: "Accommodation",
        cars: "Cars",
        excursions: "Excursions",
        blog: "Blog",
      },
      accommodation: {
        type: "Property Type",
        types: [
          { value: "apartment", label: "Apartment" },
          { value: "villa", label: "Villa" },
          { value: "house", label: "House" },
        ],
        checkin: "Check-in",
        checkout: "Check-out",
        guests: "Guests",
      },
      cars: {
        type: "Car Type",
        types: [
          { value: "economy", label: "Economy" },
          { value: "compact", label: "Compact" },
          { value: "suv", label: "SUV" },
        ],
        pickup: "Pick-up",
        dropoff: "Drop-off",
      },
      excursions: {
        type: "Excursion Type",
        types: [
          { value: "nature", label: "Nature" },
          { value: "cultural", label: "Cultural" },
          { value: "adventure", label: "Adventure" },
        ],
        date: "Date",
        people: "People",
      },
      search: "Search",
    },
    sections: {
      excursions: {
        title: "Popular Excursions",
        subtitle: "Discover the best of Tenerife with our guided tours",
        duration: "Duration",
        groupSize: "Group Size",
        price: "Price",
        viewAll: "View All Tours",
      },
      cars: {
        title: "Car Rentals",
        subtitle: "Explore Tenerife at your own pace",
        transmission: "Transmission",
        features: "Features",
        viewAll: "View All Cars",
      },
      accommodation: {
        title: "Accommodation",
        subtitle: "Find your perfect place to stay",
        location: "Location",
        amenities: "Amenities",
        viewAll: "View All Properties",
      },
      blog: {
        title: "Latest News & Tips",
        subtitle: "Read our latest articles about Tenerife",
        author: "Author",
        readTime: "Read Time",
        publishedDate: "Published",
        viewAll: "View All Articles",
      },
    },
    common: {
      bookNow: "Book",
      readMore: "Read More",
      loading: "Loading our featured experiences...",
      serverError: "We're experiencing server issues. Please try refreshing the page or contact support.",
      noData: "Currently updating our featured selections. New options will be available soon!",
    },
    cta: {
      title: "Ready to Start Your Adventure?",
      subtitle: "Contact us for personalized recommendations and bookings",
      button: "Write on WhatsApp",
    },
    footer: {
      description: "Your trusted partner for unforgettable experiences in Tenerife",
      services: "Our Services",
      contacts: "Contacts",
    },
    selectLanguage: "Select Language",
  },
  ru: {
    hero: {
      title: "Откройте Тенерифе",
      subtitle: "Ваш путь к удивительным впечатлениям на Канарских островах",
      tabs: {
        accommodation: "Жилье",
        cars: "Автомобили",
        excursions: "Экскурсии",
        blog: "Блог",
      },
      accommodation: {
        type: "Тип недвижимости",
        types: [
          { value: "apartment", label: "Квартира" },
          { value: "villa", label: "Вилла" },
          { value: "house", label: "Дом" },
        ],
        checkin: "Заезд",
        checkout: "Выезд",
        guests: "Гости",
      },
      cars: {
        type: "Тип автомобиля",
        types: [
          { value: "economy", label: "Эконом" },
          { value: "compact", label: "Компакт" },
          { value: "suv", label: "Внедорожник" },
        ],
        pickup: "Получение",
        dropoff: "Возврат",
      },
      excursions: {
        type: "Тип экскурсии",
        types: [
          { value: "nature", label: "Природа" },
          { value: "cultural", label: "Культура" },
          { value: "adventure", label: "Приключения" },
        ],
        date: "Дата",
        people: "Люди",
      },
      search: "Поиск",
    },
    sections: {
      excursions: {
        title: "Популярные экскурсии",
        subtitle: "Откройте для себя лучшее в Тенерифе с нашими гидами",
        duration: "Длительность",
        groupSize: "Размер группы",
        price: "Цена",
        viewAll: "Все экскурсии",
      },
      cars: {
        title: "Аренда автомобилей",
        subtitle: "Исследуйте Тенерифе в своем темпе",
        transmission: "Коробка передач",
        features: "Особенности",
        viewAll: "Все автомобили",
      },
      accommodation: {
        title: "Жилье",
        subtitle: "Найдите идеальное место для проживания",
        location: "Местоположение",
        amenities: "Удобства",
        viewAll: "Все варианты жилья",
      },
      blog: {
        title: "Последние новости и советы",
        subtitle: "Читайте наши последние статьи о Тенерифе",
        author: "Автор",
        readTime: "Время чтения",
        publishedDate: "Опубликовано",
        viewAll: "Все статьи",
      },
    },
    common: {
      bookNow: "Забронировать",
      readMore: "Читать далее",
      loading: "Загружаем лучшие предложения...",
      serverError: "Проблемы с сервером. Попробуйте обновить страницу или свяжитесь с поддержкой.",
      noData: "Обновляем наши рекомендации. Скоро появятся новые варианты!",
    },
    cta: {
      title: "Готовы начать свое приключение?",
      subtitle: "Свяжитесь с нами для персональных рекомендаций и бронирования",
      button: "Написать в WhatsApp",
    },
    footer: {
      description: "Ваш надежный партнер для незабываемых впечатлений на Тенерифе",
      services: "Наши услуги",
      contacts: "Контакты",
    },
    selectLanguage: "Выбрать язык",
  },
  pl: {
    hero: {
      title: "Odkryj Teneryfę",
      subtitle: "Twoja brama do niesamowitych doświadczeń na Wyspach Kanaryjskich",
      tabs: {
        accommodation: "Zakwaterowanie",
        cars: "Samochody",
        excursions: "Wycieczki",
        blog: "Blog",
      },
      accommodation: {
        type: "Typ nieruchomości",
        types: [
          { value: "apartment", label: "Apartament" },
          { value: "villa", label: "Willa" },
          { value: "house", label: "Dom" },
        ],
        checkin: "Zameldowanie",
        checkout: "Wymeldowanie",
        guests: "Goście",
      },
      cars: {
        type: "Typ samochodu",
        types: [
          { value: "economy", label: "Ekonomiczny" },
          { value: "compact", label: "Kompaktowy" },
          { value: "suv", label: "SUV" },
        ],
        pickup: "Odbiór",
        dropoff: "Zwrot",
      },
      excursions: {
        type: "Typ wycieczki",
        types: [
          { value: "nature", label: "Natura" },
          { value: "cultural", label: "Kultura" },
          { value: "adventure", label: "Przygoda" },
        ],
        date: "Data",
        people: "Ludzie",
      },
      search: "Szukaj",
    },
    sections: {
      excursions: {
        title: "Popularne wycieczki",
        subtitle: "Odkryj to, co najlepsze na Teneryfie z naszymi przewodnikami",
        duration: "Czas trwania",
        groupSize: "Wielkość grupy",
        price: "Cena",
        viewAll: "Zobacz wszystkie wycieczki",
      },
      cars: {
        title: "Wypożyczalnia samochodów",
        subtitle: "Zwiedzaj Teneryfę we własnym tempie",
        transmission: "Skrzynia biegów",
        features: "Cechy",
        viewAll: "Zobacz wszystkie samochody",
      },
      accommodation: {
        title: "Zakwaterowanie",
        subtitle: "Znajdź idealne miejsce do pobytu",
        location: "Lokalizacja",
        amenities: "Udogodnienia",
        viewAll: "Zobacz wszystkie nieruchomości",
      },
      blog: {
        title: "Najnowsze wiadomości i wskazówki",
        subtitle: "Przeczytaj nasze najnowsze artykuły o Teneryfie",
        author: "Autor",
        readTime: "Czas czytania",
        publishedDate: "Opublikowano",
        viewAll: "Zobacz wszystkie artykuły",
      },
    },
    common: {
      bookNow: "Zarezerwuj teraz",
      readMore: "Czytaj więcej",
      loading: "Ładujemy najlepsze oferty...",
      serverError: "Problemy z serwerem. Spróbuj odświeżyć stronę lub skontaktuj się z pomocą.",
      noData: "Aktualizujemy nasze rekomendacje. Nowe opcje wkrótce będą dostępne!",
    },
    cta: {
      title: "Gotowy na przygodę?",
      subtitle: "Skontaktuj się z nami po spersonalizowane rekomendacje i rezerwacje",
      button: "Napisz na WhatsApp",
    },
    footer: {
      description: "Twój zaufany partner dla niezapomnianych doświadczeń na Teneryfie",
      services: "Nasze usługi",
      contacts: "Kontakty",
    },
    selectLanguage: "Wybierz język",
  },
  fr: {
    hero: {
      title: "Découvrez Tenerife",
      subtitle: "Votre porte d'entrée vers des expériences incroyables aux îles Canaries",
      tabs: {
        accommodation: "Logement",
        cars: "Voitures",
        excursions: "Excursions",
        blog: "Blog",
      },
      accommodation: {
        type: "Type de propriété",
        types: [
          { value: "apartment", label: "Appartement" },
          { value: "villa", label: "Villa" },
          { value: "house", label: "Maison" },
        ],
        checkin: "Arrivée",
        checkout: "Départ",
        guests: "Invités",
      },
      cars: {
        type: "Type de voiture",
        types: [
          { value: "economy", label: "Économique" },
          { value: "compact", label: "Compacte" },
          { value: "suv", label: "SUV" },
        ],
        pickup: "Prise en charge",
        dropoff: "Retour",
      },
      excursions: {
        type: "Type d'excursion",
        types: [
          { value: "nature", label: "Nature" },
          { value: "cultural", label: "Culture" },
          { value: "adventure", label: "Aventure" },
        ],
        date: "Date",
        people: "Personnes",
      },
      search: "Rechercher",
    },
    sections: {
      excursions: {
        title: "Excursions populaires",
        subtitle: "Découvrez le meilleur de Tenerife avec nos guides",
        duration: "Durée",
        groupSize: "Taille du groupe",
        price: "Prix",
        viewAll: "Voir toutes les excursions",
      },
      cars: {
        title: "Location de voitures",
        subtitle: "Explorez Tenerife à votre rythme",
        transmission: "Transmission",
        features: "Caractéristiques",
        viewAll: "Voir toutes les voitures",
      },
      accommodation: {
        title: "Logement",
        subtitle: "Trouvez l'endroit parfait pour séjourner",
        location: "Emplacement",
        amenities: "Équipements",
        viewAll: "Voir tous les logements",
      },
      blog: {
        title: "Dernières nouvelles et conseils",
        subtitle: "Lisez nos derniers articles sur Tenerife",
        author: "Auteur",
        readTime: "Temps de lecture",
        publishedDate: "Publié",
        viewAll: "Voir tous les articles",
      },
    },
    common: {
      bookNow: "Réserver maintenant",
      readMore: "Lire la suite",
      loading: "Chargement de nos meilleures offres...",
      serverError: "Problèmes de serveur. Essayez de rafraîchir la page ou contactez le support.",
      noData: "Mise à jour de nos recommandations. De nouvelles options seront bientôt disponibles!",
    },
    cta: {
      title: "Prêt à commencer votre aventure ?",
      subtitle: "Contactez-nous pour des recommandations personnalisées et des réservations",
      button: "Écrire sur WhatsApp",
    },
    footer: {
      description: "Votre partenaire de confiance pour des expériences inoubliables à Tenerife",
      services: "Nos services",
      contacts: "Contacts",
    },
    selectLanguage: "Choisir la langue",
  },
  uk: {
    hero: {
      title: "Відкрийте Тенеріфе",
      subtitle: "Ваш шлях до дивовижних вражень на Канарських островах",
      tabs: {
        accommodation: "Житло",
        cars: "Автомобілі",
        excursions: "Екскурсії",
        blog: "Блог",
      },
      accommodation: {
        type: "Тип нерухомості",
        types: [
          { value: "apartment", label: "Квартира" },
          { value: "villa", label: "Вілла" },
          { value: "house", label: "Будинок" },
        ],
        checkin: "Заїзд",
        checkout: "Виїзд",
        guests: "Гості",
      },
      cars: {
        type: "Тип автомобіля",
        types: [
          { value: "economy", label: "Економ" },
          { value: "compact", label: "Компакт" },
          { value: "suv", label: "Позашляховик" },
        ],
        pickup: "Отримання",
        dropoff: "Повернення",
      },
      excursions: {
        type: "Тип екскурсії",
        types: [
          { value: "nature", label: "Природа" },
          { value: "cultural", label: "Культура" },
          { value: "adventure", label: "Пригоди" },
        ],
        date: "Дата",
        people: "Люди",
      },
      search: "Пошук",
    },
    sections: {
      excursions: {
        title: "Популярні екскурсії",
        subtitle: "Відкрийте найкраще на Тенеріфе з нашими гідами",
        duration: "Тривалість",
        groupSize: "Розмір групи",
        price: "Ціна",
        viewAll: "Всі екскурсії",
      },
      cars: {
        title: "Оренда автомобілів",
        subtitle: "Досліджуйте Тенеріфе у своєму темпі",
        transmission: "Коробка передач",
        features: "Особливості",
        viewAll: "Всі автомобілі",
      },
      accommodation: {
        title: "Житло",
        subtitle: "Знайдіть ідеальне місце для проживання",
        location: "Розташування",
        amenities: "Зручності",
        viewAll: "Всі варіанти житла",
      },
      blog: {
        title: "Останні новини та поради",
        subtitle: "Читайте наші останні статті про Тенеріфе",
        author: "Автор",
        readTime: "Час читання",
        publishedDate: "Опубліковано",
        viewAll: "Всі статті",
      },
    },
    common: {
      bookNow: "Забронювати",
      readMore: "Читати далі",
      loading: "Завантажуємо найкращі пропозиції...",
      serverError: "Проблеми з сервером. Спробуйте оновити сторінку або зв'яжіться з підтримкою.",
      noData: "Оновлюємо наші рекомендації. Нові варіанти будуть доступні незабаром!",
    },
    cta: {
      title: "Готові почати свою пригоду?",
      subtitle: "Зв'яжіться з нами для персональних рекомендацій та бронювання",
      button: "Написати в WhatsApp",
    },
    footer: {
      description: "Ваш надійний партнер для незабутніх вражень на Тенеріфе",
      services: "Наші послуги",
      contacts: "Контакти",
    },
    selectLanguage: "Обрати мову",
  },
}

// Языки с флагами
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
]

type LanguageCode = "en" | "ru" | "pl" | "fr" | "uk"

// Функция для WhatsApp
const openWhatsApp = (type: string, item: any, language: string) => {
  const phone = "+34656641433"
  const message = `Hello! I would like to book ${type}: ${item.title}. Price: ${item.price}`
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
}

export function LocalePageClient() {
  const router = useRouter()

  // State для языка
  const [language, setLanguage] = useState<LanguageCode>("en")
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  // State для компонента
  const [mounted, setMounted] = useState(false)
  const [dates, setDates] = useState<[string, string]>(["", ""])
  const [guests, setGuests] = useState(2)
  const [excursionType, setExcursionType] = useState("")
  const [excursionDate, setExcursionDate] = useState("")
  const [excursionPeople, setExcursionPeople] = useState(2)
  const [carType, setCarType] = useState("")
  const [activeTab, setActiveTab] = useState("accommodation") // Изменено на accommodation как первый таб

  const t = translations[language]
  const currentLanguage = languages.find((lang) => lang.code === language)

  // Загрузка данных из нового хука
  const { excursions, cars, accommodation, blogPosts, dataLoading, hasError } = useDataLoader(mounted, language)

  // Загрузка сохраненного языка из localStorage
  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("selectedLanguage")
    if (savedLanguage && translations[savedLanguage as LanguageCode]) {
      setLanguage(savedLanguage as LanguageCode)
    }
  }, [])

  // Сохранение языка в localStorage
  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode)
    localStorage.setItem("selectedLanguage", langCode)
    setIsLanguageDropdownOpen(false)
  }

  // Показываем загрузку до инициализации
  if (!mounted) {
    return null
  }

  const handleSearch = () => {
    switch (activeTab) {
      case "excursions":
        router.push(`/tours`)
        break
      case "cars":
        router.push(`/cars`)
        break
      case "accommodation":
        router.push(`/apartments`)
        break
      case "blog":
        router.push(`/blog`)
        break
    }
  }

  const EmptyState = ({ type }: { type: "loading" | "error" | "empty" }) => {
    if (type === "loading") {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600">{t.common.loading}</p>
        </div>
      )
    }

    if (type === "error") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-red-600">{t.common.serverError}</p>
        </div>
      )
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <WifiOff className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-blue-600">{t.common.noData}</p>
      </div>
    )
  }

  return (
    <main>
      {/* Language Selector */}
      <div className="absolute top-5 right-5 z-50">
        <div className="relative">
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg hover:bg-white transition-all duration-200"
          >
            <span className="text-lg">{currentLanguage?.flag}</span>
            <span className="font-medium text-gray-700 hidden sm:block">{currentLanguage?.name}</span>
            <span className="font-medium text-gray-700 sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLanguageDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  {t.selectLanguage}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as LanguageCode)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${language === lang.code ? "bg-blue-50 text-blue-700" : "text-gray-700"
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === lang.code && <Check className="w-4 h-4 ml-auto text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg')`,
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          {/* Title - moved higher */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">{t.hero.subtitle}</p>
          </div>

          {/* Search Card - centered */}
          <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* Tabs - изменен порядок, accommodation теперь первый */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { key: "accommodation", icon: Home, label: t.hero.tabs.accommodation },
                  { key: "cars", icon: Car, label: t.hero.tabs.cars },
                  { key: "excursions", icon: MapPin, label: t.hero.tabs.excursions },
                  { key: "blog", icon: BookOpen, label: t.hero.tabs.blog },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${activeTab === key
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {/* Accommodation Tab */}
              {activeTab === "accommodation" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.hero.accommodation.type}</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">
                        {language === "en"
                          ? "Select type"
                          : language === "ru"
                            ? "Выберите тип"
                            : language === "pl"
                              ? "Wybierz typ"
                              : language === "fr"
                                ? "Sélectionner le type"
                                : "Оберіть тип"}
                      </option>
                      {t.hero.accommodation.types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.hero.accommodation.checkin}
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={dates[0]}
                      onChange={(e) => setDates([e.target.value, dates[1]])}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.hero.accommodation.checkout}
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={dates[1]}
                      onChange={(e) => setDates([dates[0], e.target.value])}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.hero.accommodation.guests}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cars Tab */}
              {activeTab === "cars" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.hero.cars.type}</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                    >
                      <option value="">
                        {language === "en"
                          ? "Select car type"
                          : language === "ru"
                            ? "Выберите тип авто"
                            : language === "pl"
                              ? "Wybierz typ samochodu"
                              : language === "fr"
                                ? "Sélectionner le type de voiture"
                                : "Оберіть тип авто"}
                      </option>
                      {t.hero.cars.types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.hero.cars.pickup}</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={dates[0]}
                      onChange={(e) => setDates([e.target.value, dates[1]])}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.hero.cars.dropoff}</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={dates[1]}
                      onChange={(e) => setDates([dates[0], e.target.value])}
                    />
                  </div>
                </div>
              )}

              {/* Excursions Tab */}
              {activeTab === "excursions" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.hero.excursions.type}</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={excursionType}
                      onChange={(e) => setExcursionType(e.target.value)}
                    >
                      <option value="">
                        {language === "en"
                          ? "Select type"
                          : language === "ru"
                            ? "Выберите тип"
                            : language === "pl"
                              ? "Wybierz typ"
                              : language === "fr"
                                ? "Sélectionner le type"
                                : "Оберіть тип"}
                      </option>
                      {t.hero.excursions.types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.hero.excursions.date}</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={excursionDate}
                      onChange={(e) => setExcursionDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.hero.excursions.people}</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={excursionPeople}
                        onChange={(e) => setExcursionPeople(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Blog Tab */}
              {activeTab === "blog" && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === "en"
                      ? "Discover Our Blog"
                      : language === "ru"
                        ? "Откройте наш блог"
                        : language === "pl"
                          ? "Odkryj nasz blog"
                          : language === "fr"
                            ? "Découvrez notre blog"
                            : "Відкрийте наш блог"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === "en"
                      ? "Read about the best places, tips and experiences in Tenerife"
                      : language === "ru"
                        ? "Читайте о лучших местах, советах и впечатлениях на Тенерифе"
                        : language === "pl"
                          ? "Czytaj o najlepszych miejscach, wskazówkach i doświadczeniach na Teneryfie"
                          : language === "fr"
                            ? "Lisez sur les meilleurs endroits, conseils et expériences à Tenerife"
                            : "Читайте про найкращі місця, поради та враження на Тенеріфе"}
                  </p>
                  <button
                    onClick={() => router.push("/blog")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    {language === "en"
                      ? "Visit Blog"
                      : language === "ru"
                        ? "Перейти в блог"
                        : language === "pl"
                          ? "Odwiedź blog"
                          : language === "fr"
                            ? "Visiter le blog"
                            : "Відвідати блог"}
                  </button>
                </div>
              )}

              {/* Search Button */}
              {activeTab !== "blog" && (
                <button
                  onClick={handleSearch}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  {t.hero.search}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Секция экскурсий */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.sections.excursions.title}</h2>
              <p className="text-xl text-gray-600">{t.sections.excursions.subtitle}</p>
            </div>
            <button
              onClick={() => router.push("/tours")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.excursions.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : excursions.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                console.log("🎨 Rendering excursions, count:", excursions.length)
                console.log("🎨 Excursions data:", excursions)
                return excursions.map((excursion, index) => (
                  <div
                    key={excursion.id || index}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={excursion.image || "/placeholder.svg"}
                        alt={excursion.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{excursion.title}</h3>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-yellow-700">{excursion.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{excursion.description}</p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {t.sections.excursions.duration}: {excursion.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {t.sections.excursions.groupSize}: {excursion.groupSize}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Euro className="w-4 h-4" />
                          <span>
                            {t.sections.excursions.price}: {excursion.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/tours/${excursion.documentId || index + 1}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {language === "en" ? "View Details" : "Подробнее"}
                        </button>
                        <button
                          onClick={() =>
                            openWhatsApp(
                              "excursion",
                              {
                                title: excursion.title,
                                price: excursion.price,
                              },
                              language,
                            )
                          }
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {t.common.bookNow}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Секция автомобилей */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.sections.cars.title}</h2>
              <p className="text-xl text-gray-600">{t.sections.cars.subtitle}</p>
            </div>
            <button
              onClick={() => router.push("/cars")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.cars.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : cars.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car, index) => (
                <div
                  key={car.id || index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img src={car.image || "/placeholder.svg"} alt={car.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{car.title}</h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">{car.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{car.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car className="w-4 h-4" />
                        <span>
                          {t.sections.cars.transmission}: {car.transmission}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="w-4 h-4" />
                        <span>
                          {t.sections.cars.features}: {car.features}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Euro className="w-4 h-4" />
                        <span>{car.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        openWhatsApp(
                          "car",
                          {
                            title: car.title,
                            price: car.price,
                          },
                          language,
                        )
                      }
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t.common.bookNow}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Секция недвижимости */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.sections.accommodation.title}</h2>
              <p className="text-xl text-gray-600">{t.sections.accommodation.subtitle}</p>
            </div>
            <button
              onClick={() => router.push("/apartments")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.accommodation.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : accommodation.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodation.map((place, index) => (
                <div
                  key={place.id || index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={place.image || "/placeholder.svg"}
                      alt={place.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{place.title}</h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">{place.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{place.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {t.sections.accommodation.location}: {place.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="w-4 h-4" />
                        <span>
                          {t.sections.accommodation.amenities}: {place.amenities}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Euro className="w-4 h-4" />
                        <span>{place.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        openWhatsApp(
                          "accommodation",
                          {
                            title: place.title,
                            price: place.price,
                          },
                          language,
                        )
                      }
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t.common.bookNow}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Секция блогов */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.sections.blog.title}</h2>
              <p className="text-xl text-gray-600">{t.sections.blog.subtitle}</p>
            </div>
            <button
              onClick={() => router.push("/blog")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.blog.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : blogPosts.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <div
                  key={post.id || index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">{post.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>
                          {t.sections.blog.author}: {post.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {t.sections.blog.readTime}: {post.readTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {t.sections.blog.publishedDate}: {post.publishedDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/blog/${post.documentId || index + 1}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {language === "en" ? "View Details" : "Подробнее"}
                      </button>
                      <button
                        onClick={() => router.push(`/blog/${post.id || index + 1}`)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t.common.readMore}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.cta.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{t.cta.subtitle}</p>
            <a
              href="https://wa.me/34656641433"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              <Phone className="w-5 h-5" />
              {t.cta.button}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20" style={{ backgroundColor: "#1a1b1e" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Tenerifly.io</h3>
              <p className="text-gray-400 mb-4">{t.footer.description}</p>
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} Tenerifly. All rights reserved.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">{t.footer.services}</h4>
              <div className="space-y-3">
                <a href="/cars" className="block text-gray-400 hover:text-white transition-colors">
                  Airport Transfers
                </a>
                <a href="/tours" className="block text-gray-400 hover:text-white transition-colors">
                  Excursions & Tours
                </a>
                <a href="/apartments" className="block text-gray-400 hover:text-white transition-colors">
                  Property Rental & Sales
                </a>
                <a href="/cars" className="block text-gray-400 hover:text-white transition-colors">
                  Car Rental Services
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">{t.footer.contacts}</h4>
              <div className="space-y-3">
                <a
                  href="tel:+34656641433"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +34656641433
                </a>
                <a
                  href="mailto:info@tenerifly.io"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@tenerifly.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Click outside to close dropdown */}
      {isLanguageDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
      )}
    </main>
  )
}
