"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

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
            large?: { url: string }
        }
    } | null
    localizations: any[]
}

// Переводы для всех языков
const translations = {
    en: {
        backToBlogs: "Back to Blog",
        author: "Author",
        publishedOn: "Published on",
        readTime: "min read",
        category: "Category",
        tags: "Tags",
        selectLanguage: "Select Language",
        share: "Share",
        nextPost: "Next Post",
        previousPost: "Previous Post",
        noCategory: "General",
        loadingBlog: "Loading blog post...",
        errorLoading: "Error loading blog post",
        blogNotFound: "Blog post not found",
        relatedPosts: "Related Posts",
        readMore: "Read More",
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
        backToBlogs: "Назад к блогу",
        author: "Автор",
        publishedOn: "Опубликовано",
        readTime: "мин чтения",
        category: "Категория",
        tags: "Теги",
        selectLanguage: "Выбрать язык",
        share: "Поделиться",
        nextPost: "Следующий пост",
        previousPost: "Предыдущий пост",
        noCategory: "Общее",
        loadingBlog: "Загрузка поста...",
        errorLoading: "Ошибка загрузки поста",
        blogNotFound: "Пост не найден",
        relatedPosts: "Похожие посты",
        readMore: "Читать далее",
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
        backToBlogs: "Powrót do bloga",
        author: "Autor",
        publishedOn: "Opublikowano",
        readTime: "min czytania",
        category: "Kategoria",
        tags: "Tagi",
        selectLanguage: "Wybierz język",
        share: "Udostępnij",
        nextPost: "Następny post",
        previousPost: "Poprzedni post",
        noCategory: "Ogólne",
        loadingBlog: "Ładowanie postu...",
        errorLoading: "Błąd ładowania postu",
        blogNotFound: "Post nie został znaleziony",
        relatedPosts: "Powiązane posty",
        readMore: "Czytaj więcej",
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
        backToBlogs: "Retour au blog",
        author: "Auteur",
        publishedOn: "Publié le",
        readTime: "min de lecture",
        category: "Catégorie",
        tags: "Tags",
        selectLanguage: "Choisir la langue",
        share: "Partager",
        nextPost: "Article suivant",
        previousPost: "Article précédent",
        noCategory: "Général",
        loadingBlog: "Chargement de l'article...",
        errorLoading: "Erreur de chargement de l'article",
        blogNotFound: "Article non trouvé",
        relatedPosts: "Articles connexes",
        readMore: "Lire la suite",
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
        backToBlogs: "Назад до блогу",
        author: "Автор",
        publishedOn: "Опубліковано",
        readTime: "хв читання",
        category: "Категорія",
        tags: "Теги",
        selectLanguage: "Обрати мову",
        share: "Поділитися",
        nextPost: "Наступний пост",
        previousPost: "Попередній пост",
        noCategory: "Загальне",
        loadingBlog: "Завантаження поста...",
        errorLoading: "Помилка завантаження поста",
        blogNotFound: "Пост не знайдено",
        relatedPosts: "Схожі пости",
        readMore: "Читати далі",
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

export default function BlogDetailPage() {
    const params = useParams()
    const documentId = params.id as string

    const [language, setLanguage] = useState<"en" | "ru" | "pl" | "fr" | "uk">("en")
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
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

    // Загрузка конкретного блога по documentId
    useEffect(() => {
        const fetchBlogPost = async () => {
            if (!documentId) return

            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`http://localhost:1337/api/blogs/${documentId}?populate=*`)

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Blog post not found')
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                console.log('Blog post data:', data) // Отладка

                if (data.data) {
                    setBlogPost(data.data)

                    // Загружаем похожие посты
                    fetchRelatedPosts(data.data.category_name)
                } else {
                    throw new Error('No blog post data')
                }
            } catch (error) {
                console.error('Error fetching blog post:', error)
                setError(error instanceof Error ? error.message : 'Unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchBlogPost()
    }, [documentId])

    // Загрузка похожих постов
    const fetchRelatedPosts = async (category: string | null) => {
        try {
            let url = 'http://localhost:1337/api/blog-posts?populate=*&pagination[limit]=3'

            // Если есть категория, ищем посты из той же категории
            if (category) {
                url += `&filters[category_name][$eq]=${encodeURIComponent(category)}`
            }

            const response = await fetch(url)

            if (response.ok) {
                const data = await response.json()
                if (data.data) {
                    // Исключаем текущий пост из похожих
                    const filtered = data.data.filter((post: BlogPost) => post.documentId !== documentId)
                    setRelatedPosts(filtered.slice(0, 3))
                }
            }
        } catch (error) {
            console.error('Error fetching related posts:', error)
        }
    }

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
        if (post.featured_image && post.featured_image.url) {
            // Используем large размер если доступен, иначе medium, потом original
            if (post.featured_image.formats?.large?.url) {
                return `http://localhost:1337${post.featured_image.formats.large.url}`
            }
            if (post.featured_image.formats?.medium?.url) {
                return `http://localhost:1337${post.featured_image.formats.medium.url}`
            }
            return `http://localhost:1337${post.featured_image.url}`
        }

        return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&auto=format&q=80`
    }

    const getTags = (tagsString: string | null) => {
        if (!tagsString) return []

        return tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blogPost?.title,
                text: blogPost?.description,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Ссылка скопирована в буфер обмена!')
            })
        }
    }

    // Функция для безопасного рендеринга HTML контента
    const renderContent = (content: string) => {
        // Простая обработка переносов строк
        const formattedContent = content.replace(/\n/g, '<br />')

        return (
            <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
        )
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-center items-center py-12">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-gray-600 font-medium">{t.loadingBlog}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !blogPost) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {error === 'Blog post not found' ? t.blogNotFound : t.errorLoading}
                    </h1>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    <Link href="/blogs" className="text-blue-600 hover:text-blue-800 font-medium">
                        {t.backToBlogs}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header with Language Switcher */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.backToBlogs}
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

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-3 order-2 xl:order-1">
                        {/* Article Header */}
                        <article className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
                            {/* Featured Image */}
                            <div className="aspect-video relative bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                                <Image
                                    src={getImageUrl(blogPost)}
                                    alt={blogPost.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&auto=format&q=80`;
                                    }}
                                />
                                {blogPost.featured && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            FEATURED
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-8">
                                {/* Category Badge */}
                                <div className="mb-4">
                                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {getCategoryText(blogPost.category_name)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{blogPost.title}</h1>

                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span>{t.author}: {blogPost.author}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>{t.publishedOn} {formatDate(blogPost.publishedAt)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>{blogPost.reading_time} {t.readTime}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="text-xl text-gray-600 mb-8 italic border-l-4 border-blue-500 pl-6">
                                    {blogPost.description}
                                </div>

                                {/* Article Content */}
                                {renderContent(blogPost.content)}

                                {/* Tags */}
                                {blogPost.tags && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.tags}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {getTags(blogPost.tags).map((tag, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Share Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handleShare}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1 order-1 xl:order-2">
                        <div className="space-y-6">
                            {/* Author Info */}
                            <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.author}</h3>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {blogPost.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">{blogPost.author}</h4>
                                        <p className="text-gray-600 text-sm">
                                            Travel writer and blogger sharing amazing stories from around the world.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Related Posts */}
                            {relatedPosts.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.relatedPosts}</h3>
                                    <div className="space-y-4">
                                        {relatedPosts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/blog/${post.documentId}`}
                                                className="block group"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={getImageUrl(post)}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                                                            sizes="64px"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                                                            {post.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {post.reading_time} {t.readTime}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Click outside to close dropdown */}
                {isLanguageDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
                )}
            </div>
        </div>
    )
}