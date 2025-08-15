"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function ApartmentDetailPageClient({ property }: { property: any }) {
    const [language, setLanguage] = useState<"en" | "ru" | "pl" | "fr" | "uk">("en")
    const [currentProperty, setCurrentProperty] = useState<any>(null)

    useEffect(() => {
        if (property && property[language]) {
            setCurrentProperty(property[language])
        }
    }, [property, language])

    if (!currentProperty) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Link href="/apartments" className="text-blue-600 hover:text-blue-800">
                    ← Back to Properties
                </Link>
                
                <h1 className="text-3xl font-bold text-gray-900 mt-6">
                    {currentProperty.title}
                </h1>
                
                <div className="mt-6">
                    <p className="text-gray-600">{currentProperty.description}</p>
                </div>
            </div>
        </div>
    )
} 