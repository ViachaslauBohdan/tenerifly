import fetch from 'node-fetch';
import fs from 'fs';
import inquirer from 'inquirer';

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

async function updateProperty(documentId, location) {
    try {
        // Remove id field from location object as Strapi v5 doesn't allow it in updates
        const { id, ...locationWithoutId } = location;
        
        const response = await fetch(
            `${API_URL}/api/properties/${documentId}?locale=en`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        location: locationWithoutId
                    }
                })
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`Ошибка обновления: ${error.message}`);
    }
}

async function updateDistricts() {
    console.clear();
    console.log(`${BOLD}${GREEN}=== ОБНОВЛЕНИЕ РАЙОНОВ АПАРТАМЕНТОВ ===${RESET}\n`);
    
    try {
        const properties = await fetchAllProperties();
        console.log(`${GREEN}Загружено апартаментов: ${properties.length}${RESET}\n`);
        
        // Анализируем какие апартаменты нужно обновить
        const toUpdate = [];
        
        for (const prop of properties) {
            if (!prop.location) {
                console.log(`${YELLOW}Пропущен апартамент без location: ID ${prop.id}${RESET}`);
                continue;
            }
            
            const loc = prop.location;
            const city = loc?.city || '';
            const address = loc?.address || '';
            const currentRegion = loc?.region || '';
            
            const detectedDistrict = detectDistrict(city, address);
            
            // Обновляем если:
            // 1. Район не указан
            // 2. Район = "Tenerife" (слишком общий)
            // 3. Определенный район отличается от текущего
            if (detectedDistrict && (
                !currentRegion || 
                currentRegion === 'Tenerife' || 
                currentRegion !== detectedDistrict
            )) {
                toUpdate.push({
                    id: prop.id,
                    documentId: prop.documentId,
                    title: prop.title,
                    currentLocation: loc,
                    newRegion: detectedDistrict
                });
            }
        }
        
        if (toUpdate.length === 0) {
            console.log(`${GREEN}Все районы уже актуальны! Обновление не требуется.${RESET}`);
            return;
        }
        
        console.log(`${YELLOW}Найдено апартаментов для обновления: ${toUpdate.length}${RESET}\n`);
        
        // Показываем первые 10 примеров
        console.log(`${BOLD}Примеры обновлений:${RESET}`);
        toUpdate.slice(0, 10).forEach((apt, idx) => {
            console.log(`\n${idx + 1}. ${BOLD}${apt.title}${RESET}`);
            console.log(`   Город: ${apt.currentLocation?.city || 'НЕТ'}`);
            console.log(`   Адрес: ${apt.currentLocation?.address || 'НЕТ'}`);
            console.log(`   Текущий район: ${apt.currentLocation?.region || RED + 'НЕТ' + RESET}`);
            console.log(`   ${CYAN}→ Новый район: ${GREEN}${apt.newRegion}${RESET}`);
        });
        
        if (toUpdate.length > 10) {
            console.log(`\n${YELLOW}... и еще ${toUpdate.length - 10} апартаментов${RESET}`);
        }
        
        console.log();
        
        const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: `Обновить районы для ${toUpdate.length} апартаментов?`,
            default: false
        }]);
        
        if (!confirm) {
            console.log(`${YELLOW}Обновление отменено${RESET}`);
            return;
        }
        
        // Обновляем апартаменты
        console.log(`\n${CYAN}Обновление апартаментов...${RESET}\n`);
        
        let updated = 0;
        let failed = 0;
        
        for (const apt of toUpdate) {
            try {
                const newLocation = {
                    ...apt.currentLocation,
                    region: apt.newRegion
                };
                
                await updateProperty(apt.documentId, newLocation);
                
                updated++;
                console.log(`${GREEN}✓${RESET} [${updated}/${toUpdate.length}] ${apt.title}`);
                
                // Небольшая задержка чтобы не перегружать API
                await new Promise(r => setTimeout(r, 200));
                
            } catch (error) {
                failed++;
                console.log(`${RED}✗${RESET} Ошибка при обновлении "${apt.title}": ${error.message}`);
            }
        }
        
        console.log(`\n${BOLD}${GREEN}=== РЕЗУЛЬТАТЫ ===${RESET}`);
        console.log(`${GREEN}Успешно обновлено: ${updated}${RESET}`);
        if (failed > 0) {
            console.log(`${RED}Ошибок: ${failed}${RESET}`);
        }
        
        // Сохраняем лог обновления
        const logFile = `./data/district-update-${new Date().toISOString().split('T')[0]}.json`;
        fs.mkdirSync('./data', { recursive: true });
        fs.writeFileSync(logFile, JSON.stringify({
            timestamp: new Date().toISOString(),
            updated: updated,
            failed: failed,
            updates: toUpdate
        }, null, 2));
        
        console.log(`\n${CYAN}Лог сохранен: ${logFile}${RESET}`);
        
    } catch (error) {
        console.error(`${RED}Ошибка: ${error.message}${RESET}`);
        console.error(error.stack);
        process.exit(1);
    }
}

updateDistricts();
