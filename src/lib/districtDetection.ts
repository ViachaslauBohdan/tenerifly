/**
 * Автоматическое определение района Тенерифе на основе адреса или города
 * Automatic district detection for Tenerife based on address or city
 */

// Список известных районов Тенерифе с их городами/муниципалитетами
export const TENERIFE_DISTRICTS: Record<string, string[]> = {
  // Южные районы (South)
  "Costa Adeje": [
    "Costa Adeje",
    "Playa de las Américas",
    "Playa de las Americas",
    "Las Americas",
    "Las Américas",
    "Playa del Duque",
    "El Duque",
    "Fañabé",
    "Torviscas",
    "Playa Paraiso",
    "Playa Paraíso",
    "San Eugenio",
  ],
  Adeje: [
    "Adeje",
    "La Caleta",
    "El Puertito",
    "Callao Salvaje",
    "Los Menores",
    "La Jaca",
  ],
  Arona: [
    "Los Cristianos",
    "Las Galletas",
    "Palm-Mar",
    "Palm Mar",
    "Cabo Blanco",
    "Chayofa",
    "Los Abrigos",
  ],
  "San Miguel de Abona": [
    "San Miguel",
    "San Miguel de Abona",
    "Golf del Sur",
    "Amarilla Golf",
  ],
  "Granadilla de Abona": ["El Médano", "El Medano", "Granadilla", "San Isidro"],
  "Guía de Isora": [
    "Playa San Juan",
    "Playa de San Juan",
    "San Juan",
    "Alcalá",
    "Guía de Isora",
  ],
  "Santiago del Teide": [
    "Puerto de Santiago",
    "Puerto Santiago",
    "Los Gigantes",
    "Tamaimo",
    "Playa de la Arena",
    "Playa Arena",
    "Playa de Santiago",
    "Playa Santiago",
  ],

  // Северные районы (North)
  "Puerto de la Cruz": ["Puerto de la Cruz", "La Paz", "San Antonio"],
  "La Orotava": ["La Orotava", "La Perdoma"],
  "Santa Cruz de Tenerife": ["Santa Cruz", "Añaza", "Ofra"],
  "La Laguna": ["San Cristóbal de La Laguna", "Taco", "Geneto"],
  Tacoronte: ["Tacoronte", "El Sauzal"],
  "Los Realejos": ["Los Realejos", "La Guancha"],

  // Центральные районы (Central)
  Candelaria: ["Candelaria", "Igueste de Candelaria"],
  Güímar: ["Güímar", "El Puertito de Güímar"],
  Fasnia: ["Fasnia"],
  Arico: ["Arico", "Poris de Abona"],

  // Западные районы (West)
  "Buenavista del Norte": ["Buenavista del Norte"],
  Garachico: ["Garachico"],
  "El Tanque": ["El Tanque"],
  "Los Silos": ["Los Silos"],
  "Icod de los Vinos": ["Icod de los Vinos"],

  // Другие (Other)
  Vilaflor: ["Vilaflor"],
  "Santa Úrsula": ["Santa Úrsula"],
  "La Victoria de Acentejo": ["La Victoria"],
  "La Matanza de Acentejo": ["La Matanza"],
  "El Rosario": ["El Rosario"],
  Tegueste: ["Tegueste"],
};

/**
 * Определяет район на основе адреса или города
 * Detects district based on address or city
 *
 * @param city - Город / City
 * @param address - Адрес / Address
 * @returns Название района или null если не определен / District name or null if not detected
 */
export function detectDistrict(
  city?: string | null,
  address?: string | null
): string | null {
  if (!city && !address) return null;

  const searchText = `${city || ""} ${address || ""}`.toLowerCase();

  // Ищем точное совпадение с районом или его городами
  // Look for exact match with district or its locations
  for (const [district, locations] of Object.entries(TENERIFE_DISTRICTS)) {
    // Проверяем район / Check district
    if (searchText.includes(district.toLowerCase())) {
      return district;
    }

    // Проверяем города в районе / Check locations in district
    for (const location of locations) {
      if (searchText.includes(location.toLowerCase())) {
        return district;
      }
    }
  }

  return null;
}

/**
 * Получает список всех районов
 * Gets list of all districts
 */
export function getAllDistricts(): string[] {
  return Object.keys(TENERIFE_DISTRICTS).sort();
}

/**
 * Получает список городов для района
 * Gets list of cities for a district
 */
export function getDistrictLocations(district: string): string[] {
  return TENERIFE_DISTRICTS[district] || [];
}

/**
 * Проверяет, является ли значение валидным районом
 * Checks if value is a valid district
 */
export function isValidDistrict(district: string): boolean {
  return district in TENERIFE_DISTRICTS;
}
