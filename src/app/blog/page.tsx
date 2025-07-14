"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Интерфейс для данных блога из API
interface BlogPost {
    id: number
    documentId: string
    title: string
    slug: string
    description: string
    content: string
    author: string
    featured: boolean
    reading_time: number
    category_name: string | null
    tags: string | null
    seo_title: string | null
    seo_description: string | null
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string
    featured_image: {
        id: number
        url: string
        formats?: {
            thumbnail?: { url: string }
            small?: { url: string }
            medium?: { url: string }
        }
    } | null
    localizations: any[]
}

// Переводы для всех языков
const translations = {
    en: {
        backToHome: "Back to Home",
        blogsTitle: "Travel Blog",
        readMore: "Read More",
        share: "Share",
        selectLanguage: "Select Language",
        author: "Author",
        publishedOn: "Published on",
        readTime: "min read",
        category: "Category",
        featured: "FEATURED",
        latest: "LATEST",
        noCategory: "General",
        loadingBlogs: "Loading blogs...",
        errorLoading: "Error loading blogs",
        noBlogsFound: "No blog posts found",
        blogDescription: "Discover amazing stories, tips, and insights about traveling in Tenerife and the Canary Islands",
        categories: {
            travel: "Travel",
            culture: "Culture",
            food: "Food & Dining",
            adventure: "Adventure",
            tips: "Travel Tips",
            nature: "Nature",
            history: "History",
            lifestyle: "Lifestyle",
            general: "General",
        },
    },
    ru: {
        backToHome: "Назад на главную",
        blogsTitle: "Блог о путешествиях",
        readMore: "Читать далее",
        share: "Поделиться",
        selectLanguage: "Выбрать язык",
        author: "Автор",
        publishedOn: "Опубликовано",
        readTime: "мин чтения",
        category: "Категория",
        featured: "РЕКОМЕНДУЕМОЕ",
        latest: "НОВОЕ",
        noCategory: "Общее",
        loadingBlogs: "Загрузка блогов...",
        errorLoading: "Ошибка загрузки блогов",
        noBlogsFound: "Блогов не найдено",
        blogDescription: "Откройте для себя удивительные истории, советы и идеи о путешествиях по Тенерифе и Канарским островам",
        categories: {
            travel: "Путешествия",
            culture: "Культура",
            food: "Еда и рестораны",
            adventure: "Приключения",
            tips: "Советы путешественникам",
            nature: "Природа",
            history: "История",
            lifestyle: "Образ жизни",
            general: "Общее",
        },
    },
    pl: {
        backToHome: "Powrót do strony głównej",
        blogsTitle: "Blog podróżniczy",
        readMore: "Czytaj więcej",
        share: "Udostępnij",
        selectLanguage: "Wybierz język",
        author: "Autor",
        publishedOn: "Opublikowano",
        readTime: "min czytania",
        category: "Kategoria",
        featured: "POLECANE",
        latest: "NAJNOWSZE",
        noCategory: "Ogólne",
        loadingBlogs: "Ładowanie blogów...",
        errorLoading: "Błąd ładowania blogów",
        noBlogsFound: "Nie znaleziono postów",
        blogDescription: "Odkryj niesamowite historie, porady i spostrzeżenia o podróżowaniu po Teneryfie i Wyspach Kanaryjskich",
        categories: {
            travel: "Podróże",
            culture: "Kultura",
            food: "Jedzenie i restauracje",
            adventure: "Przygoda",
            tips: "Porady podróżnicze",
            nature: "Natura",
            history: "Historia",
            lifestyle: "Styl życia",
            general: "Ogólne",
        },
    },
    fr: {
        backToHome: "Retour à l'accueil",
        blogsTitle: "Blog de voyage",
        readMore: "Lire la suite",
        share: "Partager",
        selectLanguage: "Choisir la langue",
        author: "Auteur",
        publishedOn: "Publié le",
        readTime: "min de lecture",
        category: "Catégorie",
        featured: "À LA UNE",
        latest: "RÉCENT",
        noCategory: "Général",
        loadingBlogs: "Chargement des blogs...",
        errorLoading: "Erreur de chargement des blogs",
        noBlogsFound: "Aucun article trouvé",
        blogDescription: "Découvrez des histoires incroyables, des conseils et des idées sur les voyages à Tenerife et aux îles Canaries",
        categories: {
            travel: "Voyage",
            culture: "Culture",
            food: "Gastronomie",
            adventure: "Aventure",
            tips: "Conseils de voyage",
            nature: "Nature",
            history: "Histoire",
            lifestyle: "Style de vie",
            general: "Général",
        },
    },
    uk: {
        backToHome: "Повернутися на головну",
        blogsTitle: "Блог про подорожі",
        readMore: "Читати далі",
        share: "Поділитися",
        selectLanguage: "Обрати мову",
        author: "Автор",
        publishedOn: "Опубліковано",
        readTime: "хв читання",
        category: "Категорія",
        featured: "РЕКОМЕНДОВАНЕ",
        latest: "НОВЕ",
        noCategory: "Загальне",
        loadingBlogs: "Завантаження блогів...",
        errorLoading: "Помилка завантаження блогів",
        noBlogsFound: "Блогів не знайдено",
        blogDescription: "Відкрийте для себе дивовижні історії, поради та ідеї про подорожі Тенеріфе та Канарськими островами",
        categories: {
            travel: "Подорожі",
            culture: "Культура",
            food: "Їжа та ресторани",
            adventure: "Пригоди",
            tips: "Поради мандрівникам",
            nature: "Природа",
            history: "Історія",
            lifestyle: "Спосіб життя",
            general: "Загальне",
        },
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

export default function BlogsPage() {
    const [language, setLanguage] = useState<"en" | "ru" | "pl" | "fr" | "uk">("en")
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const t = translations[language]
    const currentLanguage = languages.find((lang) => lang.code === language)

    // Загрузка сохраненного языка из localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem("selectedLanguage")
        if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
            setLanguage(savedLanguage as "en" | "ru" | "pl" | "fr" | "uk")
        }
    }, [])

    // Загрузка блогов с API
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`http://localhost:1337/api/blog-posts?populate=*&locale=${language}`)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()

                if (data.data) {
                    setBlogPosts(data.data)
                } else {
                    setBlogPosts([])
                }
            } catch (error) {
                console.error('Error fetching blogs:', error)
                setError(error instanceof Error ? error.message : 'Unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    // Сохранение языка в localStorage
    const handleLanguageChange = (langCode: "en" | "ru" | "pl" | "fr" | "uk") => {
        setLanguage(langCode)
        localStorage.setItem("selectedLanguage", langCode)
        setIsLanguageDropdownOpen(false)
    }

    const getCategoryText = (category: string | null) => {
        if (!category) return t.noCategory

        const lowerCategory = category.toLowerCase()
        return t.categories[lowerCategory as keyof typeof t.categories] || category
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(
            language === "en"
                ? "en-US"
                : language === "ru"
                    ? "ru-RU"
                    : language === "pl"
                        ? "pl-PL"
                        : language === "fr"
                            ? "fr-FR"
                            : "uk-UA",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            },
        )
    }

    const getImageUrl = (post: BlogPost) => {
        if (post.featured_image) {
            // Используем medium размер если доступен, иначе оригинал
            if (post.featured_image.formats?.medium?.url) {
                return `http://localhost:1337${post.featured_image.formats.medium.url}`
            }
            return `http://localhost:1337${post.featured_image.url}`
        }
        return "/placeholder.svg?height=200&width=300"
    }

    const getTags = (tagsString: string | null) => {
        if (!tagsString) return []

        // Предполагаем, что теги разделены запятыми
        return tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength).trim() + '...'
    }

    const handleShare = (post: BlogPost) => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.description,
                url: `${window.location.origin}/blogs/${post.documentId}`,
            })
        } else {
            // Fallback для браузеров без Web Share API
            const url = `${window.location.origin}/blogs/${post.documentId}`
            navigator.clipboard.writeText(url).then(() => {
                alert('Ссылка скопирована в буфер обмена!')
            })
        }
    }

    // Сортируем посты: сначала featured, потом по дате публикации
    const sortedPosts = [...blogPosts].sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header with Language Switcher */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.backToHome}
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            <span className="text-xl">{currentLanguage?.flag}</span>
                            <span className="font-medium text-gray-700 hidden sm:block">{currentLanguage?.name}</span>
                            <span className="font-medium text-gray-700 sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                    isLanguageDropdownOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isLanguageDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                                <div className="py-2">
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                        {t.selectLanguage}
                                    </div>
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code as "en" | "ru" | "pl" | "fr" | "uk")}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                                                language === lang.code ? "bg-blue-50 text-blue-700" : "text-gray-700"
                                            }`}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            <span className="font-medium">{lang.name}</span>
                                            {language === lang.code && (
                                                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.blogsTitle}</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t.blogDescription}
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-gray-600 font-medium">{t.loadingBlogs}</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
                        <div className="text-red-600 font-medium mb-2">{t.errorLoading}</div>
                        <div className="text-red-500 text-sm">{error}</div>
                    </div>
                )}

                {/* No Posts State */}
                {!loading && !error && sortedPosts.length === 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                        <div className="text-gray-500 text-lg mb-2">{t.noBlogsFound}</div>
                    </div>
                )}

                {/* Blog Posts Grid */}
                {!loading && !error && sortedPosts.length > 0 && (
                    <>
                        {/* Posts Count */}
                        <div className="mb-6 text-center">
                            <span className="text-gray-600">
                                {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'} found
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Featured Badge */}
                                    <div className="relative">
                                        {post.featured && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                    {t.featured}
                                                </span>
                                            </div>
                                        )}

                                        {/* Blog Image */}
                                        <div className="aspect-video relative bg-gray-100">
                                            <Image
                                                src={getImageUrl(post)}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="p-6">
                                        {/* Category */}
                                        <div className="mb-3">
                                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                                {getCategoryText(post.category_name)}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {truncateText(post.description, 120)}
                                        </p>

                                        {/* Meta Information */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                <span className="truncate">{post.author}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>
                                                    {post.reading_time} {t.readTime}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Publish Date */}
                                        <div className="text-sm text-gray-500 mb-4">
                                            {t.publishedOn} {formatDate(post.publishedAt)}
                                        </div>

                                        {/* Tags */}
                                        {post.tags && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {getTags(post.tags).slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/blog/${post.documentId}`}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center font-medium"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                    />
                                                </svg>
                                                {t.readMore}
                                            </Link>
                                            <button
                                                onClick={() => handleShare(post)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                                    />
                                                </svg>
                                                {t.share}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}

                {/* Click outside to close dropdown */}
                {isLanguageDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
                )}
            </div>
        </div>
    )
}