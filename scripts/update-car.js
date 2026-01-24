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

async function getCarById(id) {
    try {
        const res = await fetch(
            `${API_URL}/api/cars/${id}?populate=*`,
            {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (res.ok) {
            const data = await res.json();
            return data.data;
        }
    } catch (error) {
    }

    const res2 = await fetch(
        `${API_URL}/api/cars?filters[id][$eq]=${id}&populate=*`,
        {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (!res2.ok) {
        const errorText = await res2.text();
        throw new Error(`Ошибка получения автомобиля по ID ${id}: ${res2.status}`);
    }

    const data2 = await res2.json();

    if (!data2.data || data2.data.length === 0) {
        const res3 = await fetch(
            `${API_URL}/api/cars?filters[documentId][$eq]=${id}&populate=*`,
            {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!res3.ok) {
            throw new Error(`Автомобиль по ID или documentId "${id}" не найден`);
        }

        const data3 = await res3.json();

        if (!data3.data || data3.data.length === 0) {
            throw new Error(`Автомобиль по ID или documentId "${id}" не найден`);
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
        method: "POST",
        headers: {Authorization: `Bearer ${API_TOKEN}`},
        body: formData,
    });
    if (!res.ok) throw new Error(`Ошибка загрузки фото: ${await res.text()}`);
    const data = await res.json();
    return data[0].id;
}

async function searchCars(query) {
    const res = await fetch(
        `${API_URL}/api/cars?filters[title][$containsi]=${encodeURIComponent(query)}&fields[0]=title`,
        {headers: {Authorization: `Bearer ${API_TOKEN}`}}
    );
    if (!res.ok) throw new Error(`Ошибка ${await res.text()}`);
    const data = await res.json();
    return data.data || [];
}

async function getCarsList() {
    const res = await fetch(
        `${API_URL}/api/cars?fields[0]=title&sort=createdAt:desc`,
        {headers: {Authorization: `Bearer ${API_TOKEN}`}}
    );
    if (!res.ok) throw new Error(`Ошибка: ${await res.text()}`);
    const data = await res.json();
    return data.data;
}

async function updateCar(id, data) {
    let carToUpdate = null;

    try {
        carToUpdate = await getCarById(id);
    } catch (error) {
        console.log(`${YELLOW}Не удалось найти автомобиль по ID ${id}: ${error.message}${RESET}`);
    }

    if (!carToUpdate) {
        try {
            const res = await fetch(
                `${API_URL}/api/cars?filters[documentId][$eq]=${id}&populate=*`,
                {headers: {Authorization: `Bearer ${API_TOKEN}`}}
            );

            if (res.ok) {
                const searchData = await res.json();
                if (searchData.data && searchData.data[0]) {
                    carToUpdate = searchData.data[0];
                }
            }
        } catch (error) {
        }
    }

    if (!carToUpdate) {
        throw new Error(`Автомобиль с ID ${id} не найден`);
    }

    const updateId = carToUpdate.documentId;

    const url = `${API_URL}/api/cars/${updateId}`;

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({data}),
    });

    const responseText = await res.text();

    if (!res.ok) {
        throw new Error(`Ошибка обновления: ${responseText}`);
    }

    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.log(`${YELLOW}Не удалось распарсить ответ как JSON: ${responseText}${RESET}`);
        if (res.ok) {
            return {success: true, message: "Обновление выполнено"};
        }
        throw new Error(`Ошибка: ${error.message}`);
    }
}

async function main() {
    console.clear();
    console.log(`${BOLD}${YELLOW}--- ОБНОВЛЕНИЕ АВТОМОБИЛЯ ---${RESET}\n`);

    try {
        let car = null;
        const args = process.argv.slice(2);

        if (args.length > 0) {
            const carId = args[0];
            const stopLoading = startLoading(`Поиск автомобиля по ID: ${carId}...`);
            try {
                car = await getCarById(carId);
                stopLoading();
                if (!car) {
                    console.log(`${RED}❌ Автомобиль по ID "${carId}" не найден${RESET}`);
                    return;
                }
                console.log(`${GREEN}Найден автомобиль: "${car.attributes?.title || car.title}"${RESET}`);
            } catch (error) {
                stopLoading();
                console.log(`${RED}❌ ${error.message}${RESET}`);
                console.log(`${YELLOW}Попробуйте ещё раз${RESET}`);
            }
        }

        if (!car) {
            let searchQuery = "";
            let cars = [];

            while (true) {
                const searchResponse = await prompt([{
                    type: 'input',
                    name: 'searchQuery',
                    prefix: '',
                    message: `${BOLD}Введите название автомобиля для поиска${RESET}\n   >`,
                    validate: i => i.trim().length >= 2 ? true : `${RED}Введите хотя бы 2 буква!${RESET}`
                }]);

                searchQuery = searchResponse.searchQuery;
                const stopLoading = startLoading(`Поиск: "${searchQuery}"...`);
                cars = await searchCars(searchQuery);
                stopLoading();

                if (!cars || cars.length === 0) {
                    console.log(`${RED}ничего не найдено${RESET}`);
                    console.log(`${YELLOW}Выведите другой название${RESET}\n`);
                    continue;
                }

                console.log(`${GREEN}Найдено автомобилей: ${cars.length}${RESET}\n`);
                break;
            }

            const carChoices = cars.map((car) => ({
                name: `${car.attributes?.title || car.title} (${car.attributes?.specifications?.make || 'Без марки'} ${car.attributes?.specifications?.model || 'Без модели'})`,
                value: car.id
            }));

            const {selectedId} = await prompt([{
                type: 'rawlist',
                name: 'selectedId',
                prefix: '',
                message: `${BOLD}Выберите автомобиль для обновления${RESET}`,
                choices: carChoices,
                pageSize: Math.min(10, carChoices.length),
                default: 1
            }]);

            const stopLoadingCar = startLoading("Загрузка...");
            car = await getCarById(selectedId);
            stopLoadingCar();
        }

        const carData = car.attributes || car;
        const carId = car.documentId;
        const carDocumentId = car.documentId;

        console.log(`${CYAN}ID: ${car.id}${RESET}`);
        console.log(`${CYAN}DocumentID: ${car.documentId}${RESET}\n`);

        async function updateCarProcess(currentUpdates = {}, currentFields = []) {
            let updates = currentUpdates;
            let selectedFields = currentFields;

            if (selectedFields.length === 0) {
                const {fieldsToUpdate} = await prompt([{
                    type: 'rawlist',
                    name: 'fieldsToUpdate',
                    prefix: '',
                    message: `${BOLD}Выберите поля для обновления${RESET}`,
                    choices: [
                        {name: 'Название', value: 'title'},
                        {name: 'Описание', value: 'description'},
                        {name: 'Тип (аренда/продажа)', value: 'type'},
                        {name: 'Статус', value: 'car_status'},
                        {name: 'Рекомендуемый', value: 'featured'},
                        {name: 'Цены', value: 'rental_prices'},
                        {name: 'Спецификации', value: 'specifications'},
                        {name: 'Особенности', value: 'features'},
                        {name: 'Локация', value: 'location'},
                        {name: 'Контакты', value: 'contact'},
                        {name: 'Фотографии', value: 'images'}
                    ],
                    pageSize: 11,
                    default: 1
                }]);

                if (!fieldsToUpdate) {
                    console.log(`\n${YELLOW}⚠️  Не выбрано ни одного поля для обновления${RESET}`);
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
                        message: `${CYAN}Текущее: ${carData.title}${RESET}\n >`,
                        default: updates.title || carData.title,
                        validate: i => i.trim() ? true : `${RED}Название обязательно!${RESET}`
                    }]);
                    updates.title = title;
                }

                if (fieldName === 'description') {
                    const {description} = await prompt([{
                        type: 'input',
                        name: 'description',
                        prefix: '',
                        message: `${CYAN}Текущее: ${carData.description ? carData.description.substring(0, 50) + '...' : 'Нет описания'}${RESET}\n   >`,
                        default: updates.description || carData.description || '',
                        validate: i => i.trim() ? true : `${RED}Описание обязательно!${RESET}`
                    }]);
                    updates.description = description;
                }

                if (fieldName === 'type') {
                    const currentType = updates.type || carData.type || 'rent';
                    const {type} = await prompt([{
                        type: 'rawlist',
                        name: 'type',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentType === 'rent' ? 'Аренда' : 'Продажа'}${RESET}`,
                        choices: [
                            {name: 'Аренда', value: 'rent'},
                            {name: 'Продажа', value: 'sale'}
                        ],
                        default: 1,
                        pageSize: 2
                    }]);
                    updates.type = type;
                }

                if (fieldName === 'car_status') {
                    const currentStatus = updates.car_status || carData.car_status || 'available';
                    const {car_status} = await prompt([{
                        type: 'rawlist',
                        name: 'car_status',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentStatus === 'available' ? 'Доступно' : currentStatus === 'rented' ? 'Занята' : 'Продана'}${RESET}`,
                        choices: [
                            {name: 'Доступно', value: 'available'},
                            {name: 'Занята', value: 'rented'},
                            {name: 'Продана', value: 'sold'}
                        ],
                        default: 1,
                        pageSize: 3
                    }]);
                    updates.car_status = car_status;
                }

                if (fieldName === 'featured') {
                    const currentFeatured = updates.featured !== undefined ? updates.featured : (carData.featured || false);
                    const {featured} = await prompt([{
                        type: 'rawlist',
                        name: 'featured',
                        prefix: '',
                        message: `${CYAN}Текущий: ${currentFeatured ? 'Да' : 'Нет'}${RESET}`,
                        choices: [
                            {name: 'Да', value: true},
                            {name: 'Нет', value: false}
                        ],
                        default: currentFeatured ? 1 : 2,
                        pageSize: 2
                    }]);
                    updates.featured = featured;
                }

                if (fieldName === 'rental_prices') {
                    console.log(`${CYAN}--- Oбновление цены ---${RESET}`);
                    const prices = updates.rental_prices || carData.rental_prices || {};

                    const { currency } = await prompt([{
                        type: 'rawlist',
                        name: 'currency',
                        prefix: '',
                        message: `${BOLD}Валюта${RESET} ${CYAN}текущая: ${prices.currency || 'EUR'}${RESET}`,
                        choices: ['EUR', 'USD'],
                        default: 1,
                        pageSize: 2
                    }]);

                    const priceFields = {};
                    const priceDays = ['day_1', 'day_2', 'day_3', 'day_4', 'day_5', 'day_6', 'day_7', 'day_8', 'day_9', 'day_10'];

                    for (const day of priceDays) {
                        const currentValue = prices[day] || '';
                        const { [day]: value } = await prompt([{
                            type: 'input',
                            name: day,
                            prefix: '',
                            message: `${BOLD}Цена за ${day.replace('day_', '')} день${RESET} ${currentValue ? `${CYAN}текущая: ${currentValue}${RESET}` : ''}\n   >`,
                            default: currentValue.toString()
                        }]);

                        if (value.trim() !== '') {
                            priceFields[day] = Number(value);
                        }
                    }

                    updates.rental_prices = {
                        ...prices,
                        currency: currency,
                        ...priceFields
                    };
                }

                if (fieldName === 'specifications') {
                    console.log(`${CYAN}--- Обновление спецификаций ---${RESET}`);
                    const specs = updates.specifications || carData.specifications || {};

                    const { make } = await prompt([{
                        type: 'input',
                        name: 'make',
                        prefix: '',
                        message: `${BOLD}Марка${RESET} ${CYAN}текущая: ${specs.make || 'Не указана'}${RESET}\n   >`,
                        default: specs.make || '',
                        validate: i => i.trim() ? true : `${RED}Марка обязательна!${RESET}`
                    }]);

                    const { model } = await prompt([{
                        type: 'input',
                        name: 'model',
                        prefix: '',
                        message: `${BOLD}Модель${RESET} ${CYAN}текущая: ${specs.model || 'Не указана'}${RESET}\n   >`,
                        default: specs.model || '',
                        validate: i => i.trim() ? true : `${RED}Модель обязательна!${RESET}`
                    }]);

                    const { year } = await prompt([{
                        type: 'input',
                        name: 'year',
                        prefix: '',
                        message: `${BOLD}Год выпуска${RESET} ${CYAN}текущая: ${specs.year || 'Не указан'}${RESET}\n   >`,
                        default: specs.year?.toString() || '',
                        validate: v => {
                            const year = parseInt(v);
                            const currentYear = new Date().getFullYear();
                            if (!/^\d+$/.test(v)) {
                                return `${RED}Введите только положительное число!${RESET}`;
                            }
                            if (year < 1900 || year > currentYear + 1) {
                                return `${RED}Введите корректный год (от 1900 до ${currentYear + 1})${RESET}`;
                            }
                            return true;
                        }
                    }]);

                    const currentFuel = specs.fuel || 'petrol';
                    const { fuel } = await prompt([{
                        type: 'rawlist',
                        name: 'fuel',
                        prefix: '',
                        message: `${BOLD}Тип двигателя${RESET} ${CYAN}текущая: ${currentFuel}${RESET}`,
                        choices: [
                            { name: 'Бензин', value: 'petrol' },
                            { name: 'Дизель', value: 'diesel' },
                            { name: 'Гибрид', value: 'hybrid' },
                            { name: 'Электро', value: 'electric' }
                        ],
                        default: 1,
                        pageSize: 4
                    }]);

                    const currentTransmission = specs.transmission || 'automatic';
                    const { transmission } = await prompt([{
                        type: 'rawlist',
                        name: 'transmission',
                        prefix: '',
                        message: `${BOLD}Коробка передач${RESET} ${CYAN}текущая: ${currentTransmission}${RESET}`,
                        choices: [
                            { name: 'Автомат', value: 'automatic' },
                            { name: 'Механика', value: 'manual' }
                        ],
                        default: 1,
                        pageSize: 2
                    }]);

                    const { seats } = await prompt([{
                        type: 'input',
                        name: 'seats',
                        prefix: '',
                        message: `${BOLD}Количество мест${RESET} ${CYAN}текущая: ${specs.seats || '5'}${RESET}\n   >`,
                        default: specs.seats?.toString() || "5",
                        validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое число!${RESET}`
                    }]);

                    updates.specifications = {
                        ...specs,
                        make: make,
                        model: model,
                        year: Number(year),
                        fuel: fuel,
                        transmission: transmission,
                        seats: Number(seats)
                    };
                }

                if (fieldName === 'features') {
                    console.log(`${CYAN}--- Обновление особенностей ---${RESET}`);
                    const features = updates.features || carData.features || {};

                    const currentAC = features.air_conditioning || false;
                    const { ac } = await prompt([{
                        type: 'rawlist',
                        name: 'ac',
                        prefix: '',
                        message: `${BOLD}Есть кондиционер?${RESET} ${CYAN}текущая: ${currentAC ? 'Да' : 'Нет'}${RESET}`,
                        choices: [
                            { name: 'Да', value: true },
                            { name: 'Нет', value: false }
                        ],
                        default: currentAC ? 1 : 2,
                        pageSize: 2
                    }]);

                    const currentNav = features.navigation || false;
                    const { nav } = await prompt([{
                        type: 'rawlist',
                        name: 'nav',
                        prefix: '',
                        message: `${BOLD}Есть навигатор (GPS)?${RESET} ${CYAN}текущая: ${currentNav ? 'Да' : 'Нет'}${RESET}`,
                        choices: [
                            { name: 'Да', value: true },
                            { name: 'Нет', value: false }
                        ],
                        default: currentNav ? 1 : 2,
                        pageSize: 2
                    }]);

                    updates.features = {
                        ...features,
                        air_conditioning: ac,
                        navigation: nav
                    };
                }

                if (fieldName === 'location') {
                    console.log(`${CYAN}--- Обновление локации ---${RESET}`);
                    const location = updates.location || carData.location || {};

                    const { address } = await prompt([{
                        type: 'input',
                        name: 'address',
                        prefix: '',
                        message: `${BOLD}Новый адрес${RESET} ${CYAN}текущая: ${location.address || 'Не указан'}${RESET}\n   >`,
                        default: location.address || '',
                        validate: i => i.trim() ? true : `${RED}Адрес обязателен!${RESET}`
                    }]);

                    const { city } = await prompt([{
                        type: 'input',
                        name: 'city',
                        prefix: '',
                        message: `${BOLD}Новый город${RESET} ${CYAN}текущая: ${location.city || 'Не указан'}${RESET}\n   >`,
                        default: location.city || '',
                        validate: i => i.trim() ? true : `${RED}Город обязателен!${RESET}`
                    }]);

                    updates.location = {
                        ...location,
                        address: address,
                        city: city
                    };
                }

                if (fieldName === 'contact') {
                    console.log(`${CYAN}--- Обновление контактов ---${RESET}`);
                    const contact = updates.contact || carData.contact || {};

                    const { c_name } = await prompt([{
                        type: 'input',
                        name: 'c_name',
                        prefix: '',
                        message: `${BOLD}Новое имя${RESET} ${CYAN}текущая: ${contact.name || 'Не указано'}${RESET}\n   >`,
                        default: contact.name || '',
                        validate: i => i.trim() ? true : `${RED}Имя обязательно!${RESET}`
                    }]);

                    const { phone } = await prompt([{
                        type: 'input',
                        name: 'phone',
                        prefix: '',
                        message: `${BOLD}Новый телефон${RESET} ${CYAN}текущая: ${contact.phone || 'Не указан'}${RESET}\n   >`,
                        default: contact.phone || '',
                        validate: i => /^\+?[0-9\s-]{7,20}$/.test(i) ? true : `${RED}Неверный формат!${RESET}`
                    }]);

                    const currentPref = contact.preferred_contact || 'whatsapp';
                    const { pref } = await prompt([{
                        type: 'rawlist',
                        name: 'pref',
                        prefix: '',
                        message: `${BOLD}Удобный способ связи${RESET} ${CYAN}текущая: ${currentPref}${RESET}`,
                        choices: [
                            { name: 'WhatsApp', value: 'whatsapp' },
                            { name: 'Telegram', value: 'telegram' },
                            { name: 'Телефон', value: 'phone' }
                        ],
                        default: currentPref,
                        pageSize: 3
                    }]);

                    updates.contact = {
                        ...contact,
                        name: c_name,
                        phone: phone,
                        preferred_contact: pref
                    };
                }

                if (fieldName === 'images') {
                    console.log(`${CYAN}--- Обновление фотографий ---${RESET}`);

                    // Получаем текущие изображения
                    let currentImageIds = [];
                    let currentImageCount = 0;

                    if (carData.images && Array.isArray(carData.images)) {
                        currentImageIds = carData.images.map(img => img.id);
                        currentImageCount = carData.images.length;
                    }

                    // Показываем количество текущих изображений
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
                        default: 1,
                        pageSize: 3,
                    }]);

                    if (action !== 'keep') {
                        const {imagesDir} = await prompt([{
                            type: 'input',
                            prefix: '',
                            name: 'imagesDir',
                            message: `${CYAN}Путь к папке с новыми фото (сейчас: ${currentImageCount} изображений)${CYAN} ${CYAN}пример: ./photos/car1${RESET}\n    >`,
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
                            console.log(`${YELLOW}⚠️ В папке нет подходящих изображений${RESET}`);
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
                    message: `${BOLD}Сохранить изменения?${RESET}`,
                    choices: [
                        {name: 'Да, сохранить изменения', value: 'save'},
                        {name: 'Нет, вернуться и изменить', value: 'back'},
                        {name: 'Отмена (вернуться к выбору полей)', value: 'cancel'}
                    ],
                    default: 1,
                    pageSize: 3,
                }]);

                if (confirmChoice === 'save') {
                    const stopUpdate = startLoading("Идёт обновление...");
                    try {
                        const updateId = carDocumentId || carId;

                        const result = await updateCar(updateId, updates);
                        stopUpdate();

                        if (result && result.data) {
                            console.log(`${GREEN}УСПЕШНО ОБНОВЛЕН!${RESET}`);
                            console.log(`${CYAN}ID: ${result.data.id || result.data.documentId || 'N/A'}${RESET}`);
                            console.log(`${CYAN}DocumentID: ${result.data.documentId || result.data.id || 'N/A'}${RESET}`);
                            console.log(`${CYAN}Название: ${result.data.attributes?.title || result.data.title || 'N/A'}${RESET}`);

                        } else if (result && result.success) {
                            console.log(`${GREEN}УСПЕШНО ОБНОВЛЕН!${RESET}`);
                            console.log(`${CYAN}${result.message}${RESET}`);
                        } else {
                            console.log(`${GREEN}УСПЕШНО ОБНОВЛЕН!${RESET}`);
                            console.log(`${CYAN}Ответ получен (проверьте в Strapi)${RESET}`);
                        }

                        await updateCarProcess();
                        return;
                    } catch (error) {
                        stopUpdate();
                        console.error(`${RED}❌ ОШИБКА:${RESET}`);
                        console.error(`${YELLOW}Сообщение: ${error.message}${RESET}`);
                    }
                    break;
                } else if (confirmChoice === 'back') {
                    if (selectedFields.length === 1) {
                        await editField(selectedFields[0]);
                    } else {
                        const choices = selectedFields.map(field => ({
                            name: field,
                            value: field
                        }));

                        const {fieldToEdit} = await prompt([{
                            type: 'rawlist',
                            name: 'fieldToEdit',
                            prefix: '',
                            message: `${BOLD}Выберите поле, которое хотите изменить${RESET}`,
                            choices: choices,
                            pageSize: Math.min(10, choices.length),
                            default: 1
                        }]);

                        await editField(fieldToEdit);
                    }

                    continue;
                } else if (confirmChoice === 'cancel') {
                    await updateCarProcess();
                    return;
                }
            }


        }

        await updateCarProcess();

    } catch (err) {
        console.error(`\n${RED}❌ ОШИБКА: ${BOLD}${err.message}${RESET}`);
    }
}

process.on('unhandledRejection', (error) => {
    console.error(`${RED}Необработанное отклонение промиса:${RESET}`, error);
    process.exit(1);
});

main();


