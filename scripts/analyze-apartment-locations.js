import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

// Список известных районов Тенерифе с их городами/муниципалитетами
const TENERIFE_DISTRICTS = {
    // Южные районы
    "Costa Adeje": [
        "Costa Adeje", 
        "Playa de las Américas", "Playa de las Americas", "Las Americas", "Las Américas",
        "Playa del Duque", "El Duque",
        "Fañabé", "Torviscas",
        "Playa Paraiso", "Playa Paraíso",
        "San Eugenio"
    ],
    "Adeje": ["Adeje", "La Caleta", "El Puertito", "Callao Salvaje", "Los Menores", "La Jaca"],
    "Arona": [
        "Los Cristianos", 
        "Las Galletas", 
        "Palm-Mar", "Palm Mar",
        "Cabo Blanco", 
        "Chayofa",
        "Los Abrigos"
    ],
    "San Miguel de Abona": ["San Miguel", "San Miguel de Abona", "Golf del Sur", "Amarilla Golf"],
    "Granadilla de Abona": ["El Médano", "El Medano", "Granadilla", "San Isidro"],
    "Guía de Isora": ["Playa San Juan", "Playa de San Juan", "San Juan", "Alcalá", "Guía de Isora"],
    "Santiago del Teide": [
        "Puerto de Santiago", "Puerto Santiago",
        "Los Gigantes", 
        "Tamaimo", 
        "Playa de la Arena", "Playa Arena",
        "Playa de Santiago", "Playa Santiago"
    ],
    
    // Северные районы
    "Puerto de la Cruz": ["Puerto de la Cruz", "La Paz", "San Antonio"],
    "La Orotava": ["La Orotava", "La Perdoma"],
    "Santa Cruz de Tenerife": ["Santa Cruz", "Añaza", "Ofra"],
    "La Laguna": ["San Cristóbal de La Laguna", "Taco", "Geneto"],
    "Tacoronte": ["Tacoronte", "El Sauzal"],
    "Los Realejos": ["Los Realejos", "La Guancha"],
    
    // Центральные районы
    "Candelaria": ["Candelaria", "Igueste de Candelaria"],
    "Güímar": ["Güímar", "El Puertito de Güímar"],
    "Fasnia": ["Fasnia"],
    "Arico": ["Arico", "Poris de Abona"],
    
    // Западные районы
    "Buenavista del Norte": ["Buenavista del Norte"],
    "Garachico": ["Garachico"],
    "El Tanque": ["El Tanque"],
    "Los Silos": ["Los Silos"],
    "Icod de los Vinos": ["Icod de los Vinos"],
    
    // Другие
    "Vilaflor": ["Vilaflor"],
    "Santa Úrsula": ["Santa Úrsula"],
    "La Victoria de Acentejo": ["La Victoria"],
    "La Matanza de Acentejo": ["La Matanza"],
    "El Rosario": ["El Rosario"],
    "Tegueste": ["Tegueste"],
};

/**
 * Определяет район на основе адреса или города
 */
function detectDistrict(city, address) {
    if (!city && !address) return null;
    
    const searchText = `${city || ''} ${address || ''}`.toLowerCase();
    
    // Ищем точное совпадение с районом или его городами
    for (const [district, locations] of Object.entries(TENERIFE_DISTRICTS)) {
        // Проверяем район
        if (searchText.includes(district.toLowerCase())) {
            return district;
        }
        
        // Проверяем города в районе
        for (const location of locations) {
            if (searchText.includes(location.toLowerCase())) {
                return district;
            }
        }
    }
    
    return null;
}

async function fetchAllProperties() {
    console.log(`${CYAN}Загрузка апартаментов из Strapi...${RESET}`);
    
    try {
        const response = await fetch(
            `${API_URL}/api/properties?populate=*&pagination[pageSize]=1000&locale=en`,
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error(`${RED}Ошибка при загрузке: ${error.message}${RESET}`);
        throw error;
    }
}

async function analyzeLocations() {
    console.clear();
    console.log(`${BOLD}${GREEN}=== АНАЛИЗ АДРЕСОВ АПАРТАМЕНТОВ ===${RESET}\n`);
    
    try {
        const properties = await fetchAllProperties();
        
        console.log(`${GREEN}Загружено апартаментов: ${properties.length}${RESET}\n`);
        
        const analysis = {
            total: properties.length,
            withCity: 0,
            withAddress: 0,
            withRegion: 0,
            withoutLocation: 0,
            districtDetected: 0,
            districtNotDetected: 0,
            byDistrict: {},
            problemApartments: []
        };
        
        const results = [];
        
        for (const prop of properties) {
            if (!prop.location) {
                console.log(`${YELLOW}Пропущен апартамент без location: ID ${prop.id}${RESET}`);
                continue;
            }
            
            const loc = prop.location;
            const city = loc?.city || '';
            const address = loc?.address || '';
            const region = loc?.region || '';
            
            if (city && city !== '-') analysis.withCity++;
            if (address && address !== '-') analysis.withAddress++;
            if (region && region !== 'Tenerife') analysis.withRegion++;
            if ((!city || city === '-') && (!address || address === '-') && (!region || region === 'Tenerife')) analysis.withoutLocation++;
            
            // Определяем район
            const detectedDistrict = detectDistrict(city, address);
            
            const result = {
                id: prop.id,
                documentId: prop.documentId,
                title: prop.title,
                city: city,
                address: address,
                region: region,
                detectedDistrict: detectedDistrict,
                needsUpdate: !region || region === 'Tenerife' || detectedDistrict !== region
            };
            
            if (detectedDistrict) {
                analysis.districtDetected++;
                if (!analysis.byDistrict[detectedDistrict]) {
                    analysis.byDistrict[detectedDistrict] = 0;
                }
                analysis.byDistrict[detectedDistrict]++;
            } else {
                analysis.districtNotDetected++;
            }
            
            // Проблемные апартаменты
            if (!city || city === 'Tenerife' || !detectedDistrict) {
                analysis.problemApartments.push(result);
            }
            
            results.push(result);
        }
        
        // Выводим статистику
        console.log(`${BOLD}${CYAN}ОБЩАЯ СТАТИСТИКА:${RESET}`);
        console.log(`- Всего апартаментов: ${BOLD}${analysis.total}${RESET}`);
        console.log(`- С городом: ${GREEN}${analysis.withCity}${RESET} (${Math.round(analysis.withCity / analysis.total * 100)}%)`);
        console.log(`- С адресом: ${GREEN}${analysis.withAddress}${RESET} (${Math.round(analysis.withAddress / analysis.total * 100)}%)`);
        console.log(`- С районом: ${GREEN}${analysis.withRegion}${RESET} (${Math.round(analysis.withRegion / analysis.total * 100)}%)`);
        console.log(`- Без локации: ${RED}${analysis.withoutLocation}${RESET}`);
        console.log();
        
        console.log(`${BOLD}${CYAN}ОПРЕДЕЛЕНИЕ РАЙОНОВ:${RESET}`);
        console.log(`- Район определен: ${GREEN}${analysis.districtDetected}${RESET} (${Math.round(analysis.districtDetected / analysis.total * 100)}%)`);
        console.log(`- Район НЕ определен: ${RED}${analysis.districtNotDetected}${RESET} (${Math.round(analysis.districtNotDetected / analysis.total * 100)}%)`);
        console.log();
        
        if (Object.keys(analysis.byDistrict).length > 0) {
            console.log(`${BOLD}${CYAN}РАСПРЕДЕЛЕНИЕ ПО РАЙОНАМ:${RESET}`);
            Object.entries(analysis.byDistrict)
                .sort((a, b) => b[1] - a[1])
                .forEach(([district, count]) => {
                    console.log(`- ${district}: ${count} апартаментов`);
                });
            console.log();
        }
        
        if (analysis.problemApartments.length > 0) {
            console.log(`${BOLD}${YELLOW}ПРОБЛЕМНЫЕ АПАРТАМЕНТЫ (${analysis.problemApartments.length}):${RESET}`);
            analysis.problemApartments.slice(0, 20).forEach(apt => {
                console.log(`\n${BOLD}[${apt.id}] ${apt.title}${RESET}`);
                console.log(`  Город: ${apt.city || RED + 'НЕТ' + RESET}`);
                console.log(`  Адрес: ${apt.address || RED + 'НЕТ' + RESET}`);
                console.log(`  Текущий район: ${apt.region || RED + 'НЕТ' + RESET}`);
                console.log(`  Определенный район: ${apt.detectedDistrict || RED + 'НЕ ОПРЕДЕЛЕН' + RESET}`);
            });
            
            if (analysis.problemApartments.length > 20) {
                console.log(`\n${YELLOW}... и еще ${analysis.problemApartments.length - 20} апартаментов${RESET}`);
            }
        }
        
        // Сохраняем результаты в файл
        const outputFile = './data/location-analysis.json';
        fs.mkdirSync('./data', { recursive: true });
        fs.writeFileSync(outputFile, JSON.stringify({
            analysis,
            apartments: results
        }, null, 2));
        
        console.log(`\n${GREEN}Результаты сохранены в: ${outputFile}${RESET}`);
        console.log(`${CYAN}Используйте скрипт update-apartment-districts.js для обновления районов${RESET}`);
        
    } catch (error) {
        console.error(`${RED}Ошибка: ${error.message}${RESET}`);
        console.error(error.stack);
        process.exit(1);
    }
}

analyzeLocations();
