import fs from "fs";
import path from "path";
import inquirer from "inquirer";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const YELLOW = "\x1b[33m";

const prompt = inquirer.createPromptModule();

function startLoading(text) {
    const frames = ["-", "\\", "|", "/"];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${CYAN}${frames[i]} ${text}${RESET}`);
        i = (i + 1) % frames.length;
    }, 100);
    return () => {
        clearInterval(interval);
        process.stdout.write("\r\x1b[K");
    };
}

async function searchProperties(query) {
    const res = await fetch(`${API_URL}/api/properties?filters[title][$containsi]=${encodeURIComponent(query)}&fields[0]=title&fields[1]=id&fields[2]=documentId`, {headers: {Authorization: `Bearer ${API_TOKEN}`}});
    if (!res.ok) throw new Error(`Ошибка ${await res.text()}`);
    const data = await res.json();
    return data.data || [];
}

async function getPropertyById(id) {
    try {
        const res = await fetch(`${API_URL}/api/properties/${id}?populate=*`, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`, "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            const data = await res.json();
            return data.data;
        }
    } catch (error) {
    }

    const res2 = await fetch(`${API_URL}/api/properties?filters[id][$eq]=${id}&populate=*`, {
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`, "Content-Type": "application/json"
        }
    });

    if (!res2.ok) {
        const errorText = await res2.text();
        throw new Error(`Ошибка: ${res2.status}`);
    }

    const data2 = await res2.json();

    if (!data2.data || data2.data.length === 0) {
        const res3 = await fetch(`${API_URL}/api/properties?filters[documentId][$eq]=${id}&populate=*`, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`, "Content-Type": "application/json"
            }
        });

        if (!res3.ok) {
            throw new Error(`Недвижимость по ID или documentId "${id}" не найдена`);
        }

        const data3 = await res3.json();

        if (!data3.data || data3.data.length === 0) {
            throw new Error(`Недвижимость по ID или documentId "${id}" не найдена`);
        }

        return data3.data[0];
    }

    return data2.data[0];
}

async function uploadImage(filePath) {
    const formData = new FormData();
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer]);
    formData.append("files", blob, path.basename(filePath));

    const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST", headers: {Authorization: `Bearer ${API_TOKEN}`}, body: formData,
    });
    if (!res.ok) throw new Error(`Ошибка: ${await res.text()}`);
    const data = await res.json();
    return data[0].id;
}

async function updatePropertyByDocumentId(documentId, updates) {
    const url = `${API_URL}/api/properties/${documentId}`;

    const dataToSend = {data: updates};

    const res = await fetch(url, {
        method: "PUT", headers: {
            "Content-Type": "application/json", "Authorization": `Bearer ${API_TOKEN}`
        }, body: JSON.stringify(dataToSend),
    });

    const responseText = await res.text();

    if (!res.ok) {
        console.log(`${YELLOW}Запрос: PUT ${url}${RESET}`);
        console.log(`${YELLOW}Тело запроса: ${JSON.stringify(dataToSend)}${RESET}`);
        console.log(`${YELLOW}Ответ: ${responseText}${RESET}`);

        throw new Error(`Ошибка: ${responseText}`);
    }

    return JSON.parse(responseText);
}

async function main() {
    console.clear();
    console.log(`${BOLD}${YELLOW}--- ОБНОВЛЕНИЕ НЕДВИЖИМОСТИ ---${RESET}\n`);

    try {
        let property = null;
        const args = process.argv.slice(2);

        if (args.length > 0) {
            const propertyId = args[0];
            const stopLoading = startLoading(`Поиск недвижимости по ID: ${propertyId}...`);
            try {
                property = await getPropertyById(propertyId);
                stopLoading();
                if (!property) {
                    console.log(`${RED}❌ Недвижимость по ID "${propertyId}" не найдена${RESET}`);
                    return;
                }
                console.log(`${GREEN}Найдена недвижимость: "${property.attributes?.title || property.title}"${RESET}`);
            } catch (error) {
                stopLoading();
                console.log(`${RED}❌ ${error.message}${RESET}`);
                console.log(`${YELLOW}Попробуйте поиск по названию${RESET}`);
            }
        }

        if (!property) {
            let searchQuery = "";
            let properties = [];

            while (true) {
                const searchResponse = await prompt([{
                    type: 'input',
                    name: 'searchQuery',
                    prefix: '',
                    message: `${BOLD}Введите название недвижимости для поиска${RESET}\n   >`,
                    validate: i => i.trim().length >= 2 ? true : `${RED}Введите хотя бы 2 буква!${RESET}`
                }]);

                searchQuery = searchResponse.searchQuery;
                const stopLoading = startLoading(`Поиск: "${searchQuery}"...`);
                properties = await searchProperties(searchQuery);
                stopLoading();

                if (!properties || properties.length === 0) {
                    console.log(`${RED}ничего не найдено${RESET}`);
                    console.log(`${YELLOW}Выведите другой название${RESET}\n`);
                    continue;
                }

                console.log(`${GREEN}Найдено: ${properties.length}${RESET}\n`);
                break;
            }

            const propertyChoices = properties.map((property) => ({
                name: `${property.attributes?.title || property.title}`, value: property.id
            }));

            const {selectedId} = await prompt([{
                type: 'rawlist',
                name: 'selectedId',
                prefix: '',
                message: `${BOLD}Выберите недвижимость для обновления${RESET}`,
                choices: propertyChoices,
                pageSize: Math.min(10, propertyChoices.length),
            }]);

            const stopLoadingProperty = startLoading("Загрузка...");
            property = await getPropertyById(selectedId);
            stopLoadingProperty();
        }

        const propertyData = property.attributes || property;
        const propertyId = property.id;
        const propertyDocumentId = property.documentId;

        console.log(`${GREEN}Загружена недвижимость: "${propertyData.title}"${RESET}`);
        console.log(`${CYAN}ID: ${property.id}${RESET}`);
        console.log(`${CYAN}DocumentID: ${property.documentId}${RESET}\n`);

        async function updatePropertyProcess(currentUpdates = {}, currentFields = []) {
            let updates = currentUpdates;
            let selectedFields = currentFields;

            if (selectedFields.length === 0) {
                const {fieldsToUpdate} = await prompt([{
                    type: 'rawlist',
                    name: 'fieldsToUpdate',
                    prefix: '',
                    message: `${BOLD}Какие поля хотите обновить?${RESET}`,
                    choices: [{name: 'Заголовок', value: 'title'}, {name: 'Слаг', value: 'slug'}, {
                        name: 'Описание',
                        value: 'description'
                    }, {name: 'Тип (аренда/продажа)', value: 'type'}, {
                        name: 'Статус',
                        value: 'property_status'
                    }, {name: 'Категория', value: 'category'}, {
                        name: 'Рекомендуемый',
                        value: 'featured'
                    }, {name: 'Цена (сумма)', value: 'price_amount'}, {
                        name: 'Валюта',
                        value: 'currency'
                    }, {name: 'Период оплаты', value: 'period'}, {
                        name: 'Общая площадь',
                        value: 'total_area'
                    }, {name: 'Количество спален', value: 'bedrooms'}, {
                        name: 'Количество ванных',
                        value: 'bathrooms'
                    }, {name: 'Этаж', value: 'floor'}, {
                        name: 'Наличие бассейна',
                        value: 'has_pool'
                    }, {name: 'Наличие кондиционера', value: 'has_ac'}, {
                        name: 'Наличие интернета',
                        value: 'has_internet'
                    }, {name: 'Наличие мебели', value: 'furnished'}, {name: 'Адрес', value: 'address'}, {
                        name: 'Город',
                        value: 'city'
                    }, {name: 'Регион', value: 'region'}, {
                        name: 'Координаты (широта/долгота)',
                        value: 'coordinates'
                    }, {name: 'Контактная информация', value: 'contact'}, {name: 'Фотографии', value: 'images'}],
                    pageSize: 24,
                    default: 1
                }]);

                if (!fieldsToUpdate) {
                    console.log(`\n${YELLOW}⚠️ Не выбрано ни одного поля для обновления${RESET}`);
                    return;
                }

                selectedFields = [fieldsToUpdate];
            }

            async function editField(fieldName) {
                if (fieldName === 'title') {
                    const {title} = await prompt([{
                        type: 'input',
                        name: 'title',
                        prefix: '',
                        message: propertyData?.title ? `${CYAN}Текущий: ${propertyData.title}${RESET}\n   >` : `${CYAN}Введите значение${RESET}\n   >`,
                        default: 1,
                        validate: i => i.trim().length >= 2 ? true : `${RED}Введите корректное название!${RESET}`
                    }]);
                    updates.title = title;
                }

                if (fieldName === 'description') {
                    const shortDescription = propertyData?.description ? propertyData.description.substring(0, 50) + '...' : 'Нет описания';

                    const {description} = await prompt([{
                        type: 'input',
                        name: 'description',
                        prefix: '',
                        message: `${CYAN}Текущий: ${shortDescription}${RESET}\n   >`,
                        default: updates.description ?? propertyData?.description ?? '',
                        validate: i => i.trim().length > 5 ? true : `${RED}Описание слишком короткое!${RESET}`
                    }]);

                    updates.description = description;
                }

                if (fieldName === 'type') {
                    const currentType = updates.type || propertyData.type || 'rent';
                    const {type} = await prompt([{
                        type: 'rawlist',
                        name: 'type',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentType === 'rent' ? 'Аренда' : 'Продажа'}${RESET}`,
                        choices: [{name: 'Аренда', value: 'rent'}, {name: 'Продажа', value: 'sale'}],
                        default: currentType === 'rent' ? 0 : 1,
                        pageSize: 2,
                    }]);
                    updates.type = type;
                }

                if (fieldName === 'property_status') {
                    const currentStatus = updates.property_status || propertyData.property_status || 'available';
                    const statusText = currentStatus === 'available' ? 'Свободно' : currentStatus === 'rented' ? 'Арендовано' : 'Продано';

                    const {property_status} = await prompt([{
                        type: 'rawlist',
                        name: 'property_status',
                        prefix: '',
                        message: `${CYAN}Текущий: ${statusText}${RESET}`,
                        choices: [{name: 'Свободно', value: 'available'}, {
                            name: 'Арендовано',
                            value: 'rented'
                        }, {name: 'Продано', value: 'sold'}],
                        default: currentStatus === 'available' ? 0 : currentStatus === 'rented' ? 1 : 2,
                        pageSize: 3,
                    }]);
                    updates.property_status = property_status;
                }

                if (fieldName === 'category') {
                    const currentCategory = updates.category || propertyData.category || 'apartment';
                    const categoryText = currentCategory === 'apartment' ? 'Апартаменты' : currentCategory === 'house' ? 'Дом' : currentCategory === 'villa' ? 'Вилла' : 'Коммерческая недвижимость';

                    const {category} = await prompt([{
                        type: 'rawlist',
                        name: 'category',
                        prefix: '',
                        message: `${CYAN}Текущая: ${categoryText}${RESET}`,
                        choices: [{name: 'Апартаменты', value: 'apartment'}, {
                            name: 'Дом',
                            value: 'house'
                        }, {name: 'Вилла', value: 'villa'}, {name: 'Коммерческая недвижимость', value: 'commercial'}],
                        default: currentCategory === 'apartment' ? 0 : currentCategory === 'house' ? 1 : currentCategory === 'villa' ? 2 : 3,
                        pageSize: 4,
                    }]);
                    updates.category = category;
                }

                if (fieldName === 'featured') {
                    const currentFeatured = updates.featured !== undefined ? updates.featured : (propertyData.featured || false);
                    const {featured} = await prompt([{
                        type: 'rawlist',
                        name: 'featured',
                        prefix: '',
                        message: `${CYAN}Сделать этот рекомендуемым? текущий: ${currentFeatured ? 'Да' : 'Нет'}${RESET}`,
                        choices: [{name: 'Да', value: true}, {name: 'Нет', value: false}],
                        default: currentFeatured ? 0 : 1,
                        pageSize: 2,
                    }]);
                    updates.featured = featured;
                }

                if (fieldName === 'price_amount') {
                    const currentAmount = (updates.price?.amount !== undefined ? updates.price.amount : propertyData.price?.amount) || 0;
                    const {amount} = await prompt([{
                        type: 'input',
                        name: 'amount',
                        prefix: '',
                        message: `${CYAN}Текущая: ${currentAmount}${RESET}\n   >`,
                        default: currentAmount.toString(),
                        validate: v => {
                            if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                            if (!/^\d+$/.test(v)) return `${RED}Введите только число${RESET}`;
                            return true;
                        }
                    }]);

                    updates.price = {
                        ...(updates.price || propertyData.price || {}), amount: Number(amount)
                    };
                }

                if (fieldName === 'currency') {
                    const currentCurrency = (updates.price?.currency !== undefined ? updates.price.currency : propertyData.price?.currency) || 'EUR';
                    const {currency} = await prompt([{
                        type: 'rawlist',
                        name: 'currency',
                        prefix: '',
                        message: `${CYAN}Текущая: ${currentCurrency}${RESET}`,
                        choices: ['EUR', 'USD'],
                        default: currentCurrency === 'EUR' ? 0 : 1,
                        pageSize: 2,
                    }]);

                    updates.price = {
                        ...(updates.price || propertyData.price || {}), currency: currency
                    };
                }

                if (fieldName === 'period') {
                    const currentPeriod = (updates.price?.period !== undefined ? updates.price.period : propertyData.price?.period) || 'total';
                    const periodText = currentPeriod === 'total' ? 'Общий' : currentPeriod === 'day' ? 'День' : currentPeriod === 'week' ? 'Неделя' : 'Месяц';

                    const {period} = await prompt([{
                        type: 'rawlist',
                        name: 'period',
                        prefix: '',
                        message: `${CYAN}Текущий: ${periodText}${RESET}`,
                        choices: [{name: 'Общий', value: 'total'}, {name: 'День', value: 'day'}, {
                            name: 'Неделя',
                            value: 'week'
                        }, {name: 'Месяц', value: 'month'},],
                        default: currentPeriod === 'total' ? 0 : currentPeriod === 'day' ? 1 : currentPeriod === 'week' ? 2 : 3,
                        pageSize: 4,
                    }]);

                    updates.price = {
                        ...(updates.price || propertyData.price || {}), period: period
                    };
                }

                if (fieldName === 'total_area') {
                    const currentTotalArea = (updates.specifications?.total_area !== undefined ? updates.specifications.total_area : propertyData.specifications?.total_area) || 0;
                    const {total_area} = await prompt([{
                        type: 'input',
                        name: 'total_area',
                        prefix: '',
                        message: `${CYAN}Текущая: ${currentTotalArea}${RESET}\n   >`,
                        default: currentTotalArea.toString(),
                        validate: v => {
                            if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                            if (!/^\d+(\.\d+)?$/.test(v)) return `${RED}Введите положительное число${RESET}`;
                            return true;
                        }
                    }]);

                    updates.specifications = {
                        ...(updates.specifications || propertyData.specifications || {}), total_area: Number(total_area)
                    };
                }

                if (fieldName === 'bedrooms') {
                    const currentBedrooms = (updates.specifications?.bedrooms !== undefined ? updates.specifications.bedrooms : propertyData.specifications?.bedrooms) || 1;
                    const {bedrooms} = await prompt([{
                        type: 'input',
                        name: 'bedrooms',
                        prefix: '',
                        message: `${CYAN}Текущее: ${currentBedrooms}${RESET}\n   >`,
                        default: currentBedrooms.toString(),
                        validate: v => {
                            if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                            if (!/^\d+$/.test(v) || Number(v) <= 0) return `${RED}Введите целое число больше 0${RESET}`;
                            return true;
                        }
                    }]);

                    updates.specifications = {
                        ...(updates.specifications || propertyData.specifications || {}), bedrooms: Number(bedrooms)
                    };
                }

                if (fieldName === 'bathrooms') {
                    const currentBathrooms = (updates.specifications?.bathrooms !== undefined ? updates.specifications.bathrooms : propertyData.specifications?.bathrooms) || 1;
                    const {bathrooms} = await prompt([{
                        type: 'input',
                        name: 'bathrooms',
                        prefix: '',
                        message: `${CYAN}Текущее: ${currentBathrooms}${RESET}\n   >`,
                        default: currentBathrooms.toString(),
                        validate: v => {
                            if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                            if (!/^\d+$/.test(v) || Number(v) <= 0) return `${RED}Введите целое число больше 0${RESET}`;
                            return true;
                        }
                    }]);

                    updates.specifications = {
                        ...(updates.specifications || propertyData.specifications || {}), bathrooms: Number(bathrooms)
                    };
                }

                if (fieldName === 'floor') {
                    const currentFloor = (updates.specifications?.floor !== undefined ? updates.specifications.floor : propertyData.specifications?.floor) || 0;
                    const {floor} = await prompt([{
                        type: 'input',
                        name: 'floor',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentFloor}${RESET}\n   >`,
                        default: currentFloor.toString(),
                        validate: v => {
                            if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                            if (!/^\d+$/.test(v) || Number(v) < 0) return `${RED}Введите целое число, 0 или больше${RESET}`;
                            return true;
                        }
                    }]);

                    updates.specifications = {
                        ...(updates.specifications || propertyData.specifications || {}), floor: Number(floor)
                    };
                }

                if (fieldName === 'has_pool') {
                    const currentHasPool = (updates.features?.has_pool !== undefined ? updates.features.has_pool : propertyData.features?.has_pool) || false;
                    const {has_pool} = await prompt([{
                        type: 'rawlist',
                        name: 'has_pool',
                        prefix: '',
                        message: `${CYAN}Текущее: ${currentHasPool ? 'Да' : 'Нет'}${RESET}`,
                        choices: [{name: 'Да', value: true}, {name: 'Нет', value: false}],
                        default: currentHasPool ? 0 : 1,
                        pageSize: 2,
                    }]);

                    updates.features = {
                        ...(updates.features || propertyData.features || {}), has_pool: has_pool
                    };
                }

                if (fieldName === 'has_ac') {
                    const currentHasAC = (updates.features?.has_air_conditioning !== undefined ? updates.features.has_air_conditioning : propertyData.features?.has_air_conditioning) || false;
                    const {has_ac} = await prompt([{
                        type: 'rawlist',
                        name: 'has_ac',
                        prefix: '',
                        message: `${CYAN}Текущее: ${currentHasAC ? 'Да' : 'Нет'}${RESET}`,
                        choices: [{name: 'Да', value: true}, {name: 'Нет', value: false}],
                        default: currentHasAC ? 0 : 1,
                        pageSize: 2,
                    }]);

                    updates.features = {
                        ...(updates.features || propertyData.features || {}), has_air_conditioning: has_ac
                    };
                }

                if (fieldName === 'has_internet') {
                    const currentHasInternet = (updates.features?.has_internet !== undefined ? updates.features.has_internet : propertyData.features?.has_internet) || false;
                    const {has_internet} = await prompt([{
                        type: 'rawlist',
                        name: 'has_internet',
                        prefix: '',
                        message: `${CYAN}Текущее: ${currentHasInternet ? 'Да' : 'Нет'}${RESET}`,
                        choices: [{name: 'Да', value: true}, {name: 'Нет', value: false}],
                        default: currentHasInternet ? 0 : 1,
                        pageSize: 2,
                    }]);

                    updates.features = {
                        ...(updates.features || propertyData.features || {}), has_internet: has_internet
                    };
                }

                if (fieldName === 'furnished') {
                    const currentFurnished = (updates.features?.furnished !== undefined ? updates.features.furnished : propertyData.features?.furnished) || false;
                    const {furnished} = await prompt([{
                        type: 'rawlist',
                        name: 'furnished',
                        prefix: '',
                        message: `${CYAN}Текущее: ${currentFurnished ? 'Да' : 'Нет'}${RESET}`,
                        choices: [{name: 'Да', value: true}, {name: 'Нет', value: false}],
                        default: currentFurnished ? 0 : 1,
                        pageSize: 2,
                    }]);

                    updates.features = {
                        ...(updates.features || propertyData.features || {}), furnished: furnished
                    };
                }

                if (fieldName === 'address') {
                    const currentAddress = (updates.location?.address !== undefined ? updates.location.address : propertyData.location?.address) || '';
                    const {address} = await prompt([{
                        type: 'input',
                        name: 'address',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentAddress}${RESET}\n   >`,
                        default: currentAddress,
                        validate: i => i.trim() ? true : `${RED}Адрес обязателен!${RESET}`
                    }]);

                    updates.location = {
                        ...(updates.location || propertyData.location || {}), address: address
                    };
                }

                if (fieldName === 'city') {
                    const currentCity = (updates.location?.city !== undefined ? updates.location.city : propertyData.location?.city) || '';
                    const {city} = await prompt([{
                        type: 'input',
                        name: 'city',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentCity}${RESET}\n   >`,
                        default: currentCity,
                        validate: i => i.trim() ? true : `${RED}Город обязателен!${RESET}`
                    }]);

                    updates.location = {
                        ...(updates.location || propertyData.location || {}), city: city
                    };
                }

                if (fieldName === 'region') {
                    const currentRegion = (updates.location?.region !== undefined ? updates.location.region : propertyData.location?.region) || 'Тенерифе';
                    const {region} = await prompt([{
                        type: 'input',
                        name: 'region',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentRegion}${RESET}\n   >`,
                        default: currentRegion
                    }]);

                    updates.location = {
                        ...(updates.location || propertyData.location || {}), region: region
                    };
                }

                if (fieldName === 'coordinates') {
                    console.log(`${CYAN}--- Обновление координат ---${RESET}`);
                    const location = updates.location || propertyData.location || {};

                    const {lat} = await prompt([{
                        type: 'input',
                        name: 'lat',
                        prefix: '',
                        message: `${CYAN}Текущая: ${location.latitude || 'Не указана'}${RESET}\n   >`,
                        default: location.latitude?.toString() || '',
                        validate: v => v === '' || !isNaN(Number(v)) ? true : `${RED}Введите число!${RESET}`
                    }]);

                    const {lng} = await prompt([{
                        type: 'input',
                        name: 'lng',
                        prefix: '',
                        message: `${CYAN}Текущая: ${location.longitude || 'Не указана'}${RESET}\n   >`,
                        default: location.longitude?.toString() || '',
                        validate: v => v === '' || !isNaN(Number(v)) ? true : `${RED}Введите число!${RESET}`
                    }]);

                    updates.location = {
                        ...(updates.location || propertyData.location || {}),
                        latitude: lat ? Number(lat) : null,
                        longitude: lng ? Number(lng) : null
                    };
                }

                if (fieldName === 'contact') {
                    console.log(`${CYAN}--- Обновление контактов ---${RESET}`);
                    const contact = updates.contact || propertyData.contact || {};

                    const {c_name} = await prompt([{
                        type: 'input',
                        name: 'c_name',
                        prefix: '',
                        message: `${BOLD}Новое имя${RESET} ${CYAN}текущее: ${contact.name || 'Не указано'}${RESET}\n   >`,
                        default: contact.name || '',
                        validate: i => {
                            const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
                            if (!i.trim()) return `${RED}Имя обязательно!${RESET}`;
                            if (!nameRegex.test(i)) return `${RED}Имя должно содержать только буквы!${RESET}`;
                            return true;
                        }
                    }]);

                    const {c_phone} = await prompt([{
                        type: 'input',
                        name: 'c_phone',
                        prefix: '',
                        message: `${BOLD}Новый телефон${RESET} ${CYAN}текущее: ${contact.phone || 'Не указан'}${RESET}\n   >`,
                        default: contact.phone || '',
                        validate: i => /^\+?[0-9\s-]{7,20}$/.test(i) ? true : `${RED}Неверный формат телефона!${RESET}`
                    }]);

                    const {c_whatsapp} = await prompt([{
                        type: 'input',
                        name: 'c_whatsapp',
                        prefix: '',
                        message: `${BOLD}Новый WhatsApp${RESET} ${CYAN}текущее: ${contact.whatsapp || contact.phone || 'Не указан'}${RESET}\n   >`,
                        default: contact.whatsapp || contact.phone || ''
                    }]);

                    const currentPref = contact.preferred_contact || 'whatsapp';
                    const {c_pref} = await prompt([{
                        type: 'rawlist',
                        prefix: '',
                        name: 'c_pref',
                        message: `${BOLD}Новый способ связи${RESET} ${CYAN}текущее: ${currentPref}${RESET}`,
                        choices: [{name: 'WhatsApp', value: 'whatsapp'}, {
                            name: 'Telegram',
                            value: 'telegram'
                        }, {name: 'Телефон', value: 'phone'}],
                        default: currentPref,
                        pageSize: 3,
                    }]);

                    updates.contact = {
                        ...contact,
                        name: c_name,
                        phone: c_phone,
                        whatsapp: c_whatsapp || c_phone,
                        preferred_contact: c_pref
                    };
                }

                if (fieldName === 'images') {
                    console.log(`${CYAN}--- Обновление фотографий ---${RESET}`);

                    let currentImageIds = [];
                    let currentImageCount = 0;

                    if (propertyData.images && Array.isArray(propertyData.images)) {
                        currentImageIds = propertyData.images.map(img => img.id);
                        currentImageCount = propertyData.images.length;
                    }

                    console.log(`${YELLOW}Текущее количество изображений: ${currentImageCount}${RESET}`);

                    const {action} = await prompt([{
                        type: 'rawlist',
                        name: 'action',
                        prefix: '',
                        message: `${BOLD}Что сделать с фотографиями? (сейчас: ${currentImageCount})${RESET}`,
                        choices: [
                            {name: `Добавить новые фото (сейчас: ${currentImageCount})`, value: 'add'},
                            {name: `Заменить все фото (сейчас: ${currentImageCount})`, value: 'replace'},
                            {name: `Оставить текущие (${currentImageCount})`, value: 'keep'}
                        ],
                        default: 'add',
                        pageSize: 3,
                    }]);

                    if (action !== 'keep') {
                        const {imagesDir} = await prompt([{
                            type: 'input',
                            prefix: '',
                            name: 'imagesDir',
                            message: `${CYAN}Путь к папке с новыми фото (сейчас: ${currentImageCount} изображений)${RESET} ${CYAN}пример: ./photos/property1${RESET}\n    >`,
                            validate: p => fs.existsSync(p) && fs.lstatSync(p).isDirectory() ? true : `${RED}Папка не найдена!${RESET}`
                        }]);

                        const files = fs.readdirSync(imagesDir)
                            .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
                            .map(f => path.join(imagesDir, f));

                        if (files.length > 0) {
                            console.log(`\n${CYAN}>> Найдено новых фото: ${files.length}${RESET}`);
                            console.log(`${CYAN}>> Текущих фото: ${currentImageCount}${RESET}`);
                            if (action === 'add') {
                                console.log(`${CYAN}>> Всего будет: ${currentImageCount + files.length} фото${RESET}`);
                            } else if (action === 'replace') {
                                console.log(`${CYAN}>> Всего будет: ${files.length} фото${RESET}`);
                            }
                            console.log(`${CYAN}>> Загрузка...${RESET}`);

                            const newImageIds = [];

                            for (const img of files) {
                                const stop = startLoading(`Загрузка ${path.basename(img)}...`);
                                try {
                                    const id = await uploadImage(img);
                                    newImageIds.push(id);
                                    stop();
                                    console.log(`${GREEN}   ОК: ${path.basename(img)}${RESET}`);
                                } catch (e) {
                                    stop();
                                    console.log(`${RED}   ОШИБКА: ${path.basename(img)}${RESET}`);
                                }
                            }

                            if (action === 'add' && currentImageIds.length > 0) {
                                updates.images = [...currentImageIds, ...newImageIds];
                            } else if (action === 'replace') {
                                updates.images = newImageIds;
                            } else if (action === 'add') {
                                updates.images = newImageIds;
                            }
                        } else {
                            console.log(`${YELLOW}⚠️  В папке нет подходящих изображений${RESET}`);
                        }
                    }
                }
            }

            for (const fieldName of selectedFields) {
                if (!updates.hasOwnProperty(fieldName) && !updates.hasOwnProperty(fieldName === 'rental_prices' ? 'rental_prices' : fieldName)) {
                    await editField(fieldName);
                }
            }

            while (true) {
                const {confirmChoice} = await prompt([{
                    type: 'rawlist',
                    name: 'confirmChoice',
                    prefix: '',
                    message: `${BOLD}Сохранить изменение?${RESET}`,
                    choices: [{name: 'Да, сохранить изменения', value: 'save'}, {
                        name: 'Нет, вернуться и изменить',
                        value: 'back'
                    }, {name: 'Отмена (вернуться к выбору полей)', value: 'cancel'}],
                    default: 1,
                    pageSize: 3,
                }]);

                if (confirmChoice === 'save') {
                    const stopUpdate = startLoading("Идёт обновление...");
                    try {
                        const updateId = propertyDocumentId || propertyId;

                        const result = await updatePropertyByDocumentId(updateId, updates);
                        stopUpdate();

                        if (result && result.data) {
                            console.log(`${GREEN}УСПЕШНО ОБНОВЛЕН!${RESET}`);
                            console.log(`${CYAN}ID: ${result.data.id || result.data.documentId || 'N/A'}${RESET}`);
                            console.log(`${CYAN}DocumentID: ${result.data.documentId || result.data.id || 'N/A'}${RESET}`);
                            console.log(`${CYAN}Название: ${result.data.title || result.data.attributes?.title || 'N/A'}${RESET}`);

                        } else if (result && result.success) {
                            console.log(`${GREEN}УСПЕШНО ОБНОВЛЕН!${RESET}`);
                            console.log(`${CYAN}${result.message}${RESET}`);
                        } else {
                            console.log(`${GREEN}УСПЕШНО ОБНОВЛЕН!${RESET}`);
                            console.log(`${CYAN}Ответ получен (проверьте в Strapi)${RESET}`);
                        }

                        await updatePropertyProcess();
                        return;

                    } catch (error) {
                        stopUpdate();
                        console.error(`${RED}❌ ОШИБКА ПРИ ОБНОВЛЕНИИ:${RESET}`);
                        console.error(`${YELLOW}Сообщение: ${error.message}${RESET}`);
                    }
                    break;

                } else if (confirmChoice === 'back') {
                    if (selectedFields.length === 1) {
                        await editField(selectedFields[0]);
                    } else {
                        const choices = selectedFields.map(field => ({
                            name: field, value: field
                        }));

                        const {fieldToEdit} = await prompt([{
                            type: 'rawlist',
                            name: 'fieldToEdit',
                            prefix: '',
                            message: `${BOLD}Выберите поле, которое хотите изменить${RESET}`,
                            choices,
                            pageSize: Math.min(10, choices.length),
                            default: 1
                        }]);

                        await editField(fieldToEdit);
                    }

                    continue;
                } else if (confirmChoice === 'cancel') {
                    await updatePropertyProcess();
                    return;
                }

            }
        }

        await updatePropertyProcess();

    } catch (err) {
        console.error(`\n${RED}❌ ОШИБКА: ${BOLD}${err.message}${RESET}`);
    }
}

process.on('unhandledRejection', (error) => {
    console.error(`${RED}Необработанное отклонение промиса:${RESET}`, error);
    process.exit(1);
});

main();
