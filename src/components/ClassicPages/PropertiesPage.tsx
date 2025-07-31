'use client';

import { useState, useEffect } from 'react';

// Типы данных
interface Property {
  id: number;
  title: string;
  location: string;
  description: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  image: string;
  status: 'available' | 'sold' | 'reserved';
}

interface ClassicPropertiesPageProps {
  locale: string;
}

export function ClassicPropertiesPage({ locale }: ClassicPropertiesPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    type: '',
    bedrooms: '',
    location: ''
  });

  // Мок данные
  useEffect(() => {
    const mockProperties: Property[] = [
      {
        id: 1,
        title: 'Apartment in Puerto de la Cruz',
        location: 'Puerto de la Cruz',
        description: 'Apartment in Puerto de la Cruz 1 bedroom',
        price: '€230/TOTAL',
        bedrooms: 0,
        bathrooms: 0,
        floor: 'Floor 0/0',
        image: 'https://picsum.photos/350/200?random=1',
        status: 'available'
      },
      {
        id: 2,
        title: 'Apartment in Adeje',
        location: 'Adeje',
        description: 'An apartment with a total area of 48 m², suitable for both short-term and long-term rentals, features 1 spacious and bright bedroom.',
        price: '€186000/TOTAL',
        bedrooms: 0,
        bathrooms: 0,
        floor: 'Floor 0/0',
        image: 'https://picsum.photos/350/200?random=2',
        status: 'available'
      },
      {
        id: 3,
        title: '1-Bedroom Apartment After Renovation – Costa...',
        location: 'Costa del Sol',
        description: 'Beautiful renovated apartment with modern amenities',
        price: '€295000/TOTAL',
        bedrooms: 1,
        bathrooms: 1,
        floor: 'Floor 2/5',
        image: 'https://picsum.photos/350/200?random=3',
        status: 'available'
      },
      {
        id: 4,
        title: 'Sunny Duplex in Playa de San Juan',
        location: 'Street Mar Rizada, s/n, Playa San Juan',
        description: 'Bright and sunny duplex with sea views',
        price: '€1150/DAY',
        bedrooms: 2,
        bathrooms: 2,
        floor: 'Floor 1/3',
        image: 'https://picsum.photos/350/200?random=4',
        status: 'available'
      }
    ];
    setProperties(mockProperties);
  }, []);

  const getBackText = (locale: string) => {
    const texts = {
      en: 'Back to Home',
      ru: 'Назад на главную',
      es: 'Volver al inicio'
    };
    return texts[locale as keyof typeof texts] || texts.en;
  };

  return (
    <div className="classic-layout">
      <div className="classic-header">
        <a href={`/${locale}`} className="classic-back-link">
          ← {getBackText(locale)}
        </a>
        <h1 className="classic-title">Properties in Tenerife</h1>
      </div>

      <div className="classic-content">
        {/* Фильтры */}
        <div className="classic-filters">
          <h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.73-4.8 5.75-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61z" />
            </svg>
            Filters
          </h3>

          <div className="filter-group">
            <label>Price Range</label>
            <input
              type="range"
              min="0"
              max="500000"
              className="price-range-slider"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters({
                ...filters,
                priceRange: [0, parseInt(e.target.value)]
              })}
            />
            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
              €0 - €{filters.priceRange[1].toLocaleString()}
            </div>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select
              className="filter-select"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Bedrooms</label>
            <select
              className="filter-select"
              value={filters.bedrooms}
              onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            >
              <option value="">Select bedrooms</option>
              <option value="1">1 bedroom</option>
              <option value="2">2 bedrooms</option>
              <option value="3">3+ bedrooms</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select
              className="filter-select"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="">Select location</option>
              <option value="puerto">Puerto de la Cruz</option>
              <option value="adeje">Adeje</option>
              <option value="santa-cruz">Santa Cruz</option>
            </select>
          </div>

          <button
            className="reset-filters-btn"
            onClick={() => setFilters({ priceRange: [0, 500000], type: '', bedrooms: '', location: '' })}
          >
            Reset Filters
          </button>
        </div>

        {/* Сетка недвижимости */}
        <div className="classic-grid">
          {properties.map((property) => (
            <div key={property.id} className="classic-card">
              <img
                src={property.image}
                alt={property.title}
                className="classic-card-image"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />

              <div className="classic-card-content">
                <div className="classic-badge classic-badge-price">
                  {property.price}
                </div>

                <h3 className="classic-card-title">{property.title}</h3>

                <div className="classic-card-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {property.location}
                </div>

                <p className="classic-card-description">
                  {property.description}
                </p>

                <div className="classic-card-specs">
                  <div className="classic-card-spec">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V7H1v11h2v3h2v-3h6v3h2v-3h8V7z" />
                    </svg>
                    {property.bedrooms} beds
                  </div>
                  <div className="classic-card-spec">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 14c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm4-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                    {property.bathrooms} baths
                  </div>
                  <div className="classic-card-spec">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {property.floor}
                  </div>
                </div>

                <div className="classic-card-buttons">
                  <a
                    href={`/${locale}/accommodation/${property.id}`}
                    className="classic-btn classic-btn-primary"
                  >
                    Book
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
