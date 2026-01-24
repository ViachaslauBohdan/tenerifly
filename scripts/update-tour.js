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

async function searchTours(query) {
    const res = await fetch(
        `${API_URL}/api/tours?filters[title][$containsi]=${encodeURIComponent(query)}&fields[0]=title&fields[1]=slug`,
        {headers: {Authorization: `Bearer ${API_TOKEN}`}}
    );
    if (!res.ok) throw new Error(`Ошибка ${await res.text()}`);
    const data = await res.json();
    return data.data || [];
}

async function getTourById(id) {
    try {
        const res = await fetch(
            `${API_URL}/api/tours/${id}?populate=*`,
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
        `${API_URL}/api/tours?filters[id][$eq]=${id}&populate=*`,
        {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (!res2.ok) {
        const errorText = await res2.text();
        throw new Error(`Ошибка ${id}: ${res2.status}`);
    }

    const data2 = await res2.json();

    if (!data2.data || data2.data.length === 0) {
        const res3 = await fetch(
            `${API_URL}/api/tours?filters[documentId][$eq]=${id}&populate=*`,
            {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!res3.ok) {
            throw new Error(`Тур по ID или documentId "${id}" не найден`);
        }

        const data3 = await res3.json();

        if (!data3.data || data3.data.length === 0) {
            throw new Error(`Тур по ID или documentId "${id}" не найден`);
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
    if (!res.ok) throw new Error(`Ошибка: ${await res.text()}`);
    const data = await res.json();
    return data[0].id;
}

async function getTour(slug) {
    const res = await fetch(
        `${API_URL}/api/tours?filters[slug][$eq]=${slug}&populate=*`,
        {headers: {Authorization: `Bearer ${API_TOKEN}`}}
    );
    if (!res.ok) throw new Error(`Ошибка: ${await res.text()}`);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
        throw new Error(`Тур со слагом "${slug}" не найден`);
    }

    return data.data[0];
}

async function getToursList() {
    const res = await fetch(
        `${API_URL}/api/tours?fields[0]=title&fields[1]=slug&sort=createdAt:desc`,
        {headers: {Authorization: `Bearer ${API_TOKEN}`}}
    );
    if (!res.ok) throw new Error(`Ошибка: ${await res.text()}`);
    const data = await res.json();
    return data.data;
}

async function updateTour(id, data) {
    let url = `${API_URL}/api/tours/${id}`;

    let res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({data}),
    });

    let responseText = await res.text();

    if (!res.ok) {
        console.log(`${YELLOW}Первый запрос (как documentId): PUT ${url}${RESET}`);
        console.log(`${YELLOW}Ответ: ${responseText}${RESET}`);

        let tourRes = await fetch(
            `${API_URL}/api/tours?filters[documentId][$eq]=${id}&populate=*`,
            {headers: {Authorization: `Bearer ${API_TOKEN}`}}
        );

        if (tourRes.ok) {
            const tourData = await tourRes.json();
            if (tourData.data && tourData.data[0]) {
                const realId = tourData.data[0].id;
                console.log(`${YELLOW}Найден по documentId: ID = ${realId}${RESET}`);

                url = `${API_URL}/api/tours/${realId}`;
                res = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_TOKEN}`
                    },
                    body: JSON.stringify({data}),
                });

                responseText = await res.text();

                if (!res.ok) {
                    throw new Error(`Ошибка${realId}: ${responseText}`);
                }
            }
        } else {
            tourRes = await fetch(
                `${API_URL}/api/tours?filters[id][$eq]=${id}&populate=*`,
                {headers: {Authorization: `Bearer ${API_TOKEN}`}}
            );

            if (tourRes.ok) {
                const tourData = await tourRes.json();
                if (tourData.data && tourData.data[0]) {
                    const realId = tourData.data[0].id;
                    console.log(`${YELLOW}Найден по ID: ID = ${realId}${RESET}`);

                    url = `${API_URL}/api/tours/${realId}`;
                    res = await fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${API_TOKEN}`
                        },
                        body: JSON.stringify({data}),
                    });

                    responseText = await res.text();

                    if (!res.ok) {
                        throw new Error(`Ошибка ${realId}: ${responseText}`);
                    }
                }
            } else {
                throw new Error(`Ошибка: ${responseText}`);
            }
        }
    }

    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.log(`${YELLOW}Не удалось распарсить ответ как JSON: ${responseText}${RESET}`);
        if (res.ok) {
            return {success: true, message: "Обновление выполнено"};
        }
        throw new Error(`Ошибка парсинга ответа: ${error.message}`);
    }
}

async function main() {
    console.clear();
    console.log(`${BOLD}${YELLOW}--- ОБНОВЛЕНИЕ ТУРА ---${RESET}\n`);

    try {
        let tour = null;
        const args = process.argv.slice(2);

        if (args.length > 0) {
            const tourId = args[0];
            const stopLoading = startLoading(`Поиск тура по ID: ${tourId}...`);
            try {
                tour = await getTourById(tourId);
                stopLoading();
                if (!tour) {
                    console.log(`${RED}❌ Тур по ID "${tourId}" не найден${RESET}`);
                    return;
                }
                console.log(`${GREEN}Найден тур: "${tour.attributes?.title || tour.title}"${RESET}`);
            } catch (error) {
                stopLoading();
                console.log(`${RED}❌ ${error.message}${RESET}`);
                console.log(`${YELLOW}Попробуйте поиск по названию${RESET}`);
            }
        }

        if (!tour) {
            let searchQuery = "";
            let tours = [];

            while (true) {
                const searchResponse = await prompt([{
                    type: 'input',
                    name: 'searchQuery',
                    prefix: '',
                    message: `${BOLD}Введите название тура для поиска${RESET}\n   >`,
                    validate: i => i.trim().length >= 2 ? true : `${RED}Введите хотя бы 2 буква!${RESET}`
                }]);

                searchQuery = searchResponse.searchQuery;
                const stopLoading = startLoading(`Поиск: "${searchQuery}"...`);
                tours = await searchTours(searchQuery);
                stopLoading();

                if (!tours || tours.length === 0) {
                    console.log(`${RED}ничего не найдено${RESET}`);
                    console.log(`${YELLOW}Выведите другой название${RESET}\n`);
                    continue;
                }

                console.log(`${GREEN}Найдено туров: ${tours.length}${RESET}\n`);
                break;
            }

            const tourChoices = tours.map((tour) => ({
                name: tour.attributes?.title,
                value: tour.attributes?.slug || tour.slug
            }));

            const {selectedSlug} = await prompt([{
                type: 'rawlist',
                name: 'selectedSlug',
                prefix: '',
                message: `${BOLD}Выберите тур для обновления${RESET}`,
                choices: tourChoices,
                pageSize: Math.min(10, tourChoices.length),
                default: 1
            }]);

            const stopLoadingTour = startLoading("Загрузка...");
            tour = await getTour(selectedSlug);
            stopLoadingTour();
        }

        const tourData = tour.attributes || tour;
        const tourId = tour.id;
        const tourDocumentId = tour.documentId;

        console.log(`${CYAN}ID: ${tour.id}${RESET}`);
        console.log(`${CYAN}DocumentID: ${tour.documentId}${RESET}\n`);

        async function updateTourProcess(currentUpdates = {}, currentFields = []) {
            let updates = currentUpdates;
            let selectedFields = currentFields;

            if (selectedFields.length === 0) {
                const {fieldsToUpdate} = await prompt([{
                    type: 'rawlist',
                    name: 'fieldsToUpdate',
                    prefix: '',
                    message: `${BOLD}Какие поля хотите обновить?${RESET}`,
                    choices: [
                        {name: 'Заголовок', value: 'title'},
                        {name: 'Слаг', value: 'slug'},
                        {name: 'Описание', value: 'description'},
                        {name: 'Длительность', value: 'duration'},
                        {name: 'Доступные дни', value: 'available_days'},
                        {name: 'Язык', value: 'language'},
                        {name: 'Локация (адрес, город, регион)', value: 'location'},
                        {name: 'Координаты (широта/долгота)', value: 'coordinates'},
                        {name: 'Цена', value: 'price'},
                        {name: 'Контактная информация', value: 'contact'},
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
                        message: `${CYAN}Текущий: ${tourData.title}${RESET}\n   >`,
                        default: updates.title || tourData.title,
                        validate: i => i.trim().length >= 2 ? true : `${RED}Введите корректное название!${RESET}`
                    }]);
                    updates.title = title;
                }

                if (fieldName === 'slug') {
                    const {slug} = await prompt([{
                        type: 'input',
                        name: 'slug',
                        prefix: '',
                        message: `${CYAN}Текущий: ${tourData.slug}${RESET}\n   >`,
                        default: updates.slug || tourData.slug,
                        validate: i => /^[a-z0-9-]+$/.test(i) ? true : `${RED}Только маленькие латинские буквы и дефис!${RESET}`
                    }]);
                    updates.slug = slug;
                }

                if (fieldName === 'description') {
                    const {description} = await prompt([{
                        type: 'input',
                        name: 'description',
                        prefix: '',
                        message: `${CYAN}Текущий: ${tourData.description ? tourData.description.substring(0, 50) + '...' : 'Нет описания'}${RESET}\n   >`,
                        default: updates.description || tourData.description || '',
                        validate: i => i.trim().length > 5 ? true : `${RED}Описание слишком короткое!${RESET}`
                    }]);
                    updates.description = description;
                }

                if (fieldName === 'duration') {
                    const {duration} = await prompt([{
                        type: 'input',
                        name: 'duration',
                        prefix: '',
                        message: `${CYAN}Текущая: ${tourData.duration || 'Не указана'}${RESET}\n   >`,
                        default: updates.duration || tourData.duration || '',
                        validate: i => i.trim() ? true : `${RED}Укажите длительность!${RESET}`
                    }]);
                    updates.duration = duration;
                }

                if (fieldName === 'available_days') {
                    const currentDays = updates.available_days?.value || tourData.available_days?.value || 'Ежедневно';
                    const {available_days} = await prompt([{
                        type: 'rawlist',
                        name: 'available_days',
                        prefix: '',
                        message: `${CYAN}Текущие: ${currentDays}${RESET}`,
                        choices: [
                            {name: 'Ежедневно', value: 'Ежедневно'},
                            {name: 'Будни (Пн-Пт)', value: 'Пн-Пт'},
                            {name: 'Выходные (Сб-Вс)', value: 'Сб-Вс'},
                            {name: 'Понедельник', value: 'Пн'},
                            {name: 'Вторник', value: 'Вт'},
                            {name: 'Среда', value: 'Ср'},
                            {name: 'Четверг', value: 'Чт'},
                            {name: 'Пятница', value: 'Пт'},
                            {name: 'Суббота', value: 'Сб'},
                            {name: 'Воскресенье', value: 'Вс'}
                        ],
                        pageSize: 10,
                        default: 1,
                    }]);
                    updates.available_days = {value: available_days};
                }

                if (fieldName === 'language') {
                    const currentLang = updates.language || tourData.language || 'RU';
                    const {language} = await prompt([{
                        type: 'rawlist',
                        prefix: '',
                        name: 'language',
                        message: `${CYAN}Текущий: ${currentLang}${RESET}`,
                        choices: [
                            {name: 'Русский', value: 'RU'},
                            {name: 'Английский', value: 'EN'},
                            {name: 'Испанский', value: 'ES'},
                            {name: 'Немецкий', value: 'DE'},
                            {name: 'Французский', value: 'FR'},
                            {name: 'Польский', value: 'PL'},
                            {name: 'Украинский', value: 'UK'}
                        ],
                        default: 1,
                        pageSize: 7,
                    }]);
                    updates.language = language;
                }

                if (fieldName === 'location') {
                    console.log(`${CYAN}--- Обновление локации ---${RESET}`);
                    const location = updates.location || tourData.location || {};

                    const {address} = await prompt([{
                        type: 'input',
                        name: 'address',
                        prefix: '',
                        message: `${CYAN}Текущий: ${location.address || 'Не указан'}${RESET}\n   >`,
                        default: location.address || '',
                        validate: i => i.trim() ? true : `${RED}Адрес обязателен!${RESET}`
                    }]);

                    const {city} = await prompt([{
                        type: 'input',
                        name: 'city',
                        prefix: '',
                        message: `${CYAN}Текущий: ${location.city || 'Не указан'}${RESET}\n   >`,
                        default: location.city || '',
                        validate: i => i.trim() ? true : `${RED}Город обязателен!${RESET}`
                    }]);

                    const {region} = await prompt([{
                        type: 'input',
                        name: 'region',
                        prefix: '',
                        message: `${CYAN}Текущий: ${location.region || 'Tenerife'}${RESET}\n   >`,
                        default: location.region || "Tenerife"
                    }]);

                    updates.location = {
                        ...location,
                        address: address,
                        city: city,
                        region: region
                    };
                }

                if (fieldName === 'coordinates') {
                    console.log(`${CYAN}--- Обновление координат ---${RESET}`);
                    const location = updates.location || tourData.location || {};

                    const { lat } = await prompt([{
                        type: 'input',
                        name: 'lat',
                        prefix: '',
                        message: `${BOLD}Новая широта${RESET} ${CYAN}текущая: ${location.latitude || 'Не указана'}${RESET}\n   >`,
                        default: location.latitude?.toString() || '',
                        validate: v => v === '' || !isNaN(Number(v)) ? true : `${RED}Введите число!${RESET}`
                    }]);

                    const { lng } = await prompt([{
                        type: 'input',
                        name: 'lng',
                        prefix: '',
                        message: `${BOLD}Новая долгота${RESET} ${CYAN}текущая: ${location.longitude || 'Не указана'}${RESET}\n   >`,
                        default: location.longitude?.toString() || '',
                        validate: v => v === '' || !isNaN(Number(v)) ? true : `${RED}Введите число!${RESET}`
                    }]);

                    updates.location = {
                        ...(updates.location || tourData.location || {}),
                        latitude: lat ? Number(lat) : null,
                        longitude: lng ? Number(lng) : null
                    };
                }

                if (fieldName === 'price') {
                    console.log(`${CYAN}--- Oбновление цены ---${RESET}`);
                    const price = updates.price || tourData.price || {};

                    const { amount } = await prompt([{
                        type: 'input',
                        name: 'amount',
                        prefix: '',
                        message: `${BOLD}Новая цена${RESET} ${CYAN}текущая: ${price.amount || 'Не указана'}${RESET}\n   >`,
                        default: price.amount?.toString() || '',
                        validate: v => {
                            if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                            if (!/^\d+$/.test(v)) return `${RED}Введите только число${RESET}`;
                            return true;
                        }
                    }]);

                    const { currency } = await prompt([{
                        type: 'rawlist',
                        prefix: '',
                        name: 'currency',
                        message: `${BOLD}Новая валюта${RESET} ${CYAN}текущая: ${price.currency || 'EUR'}${RESET}`,
                        choices: ['EUR', 'USD'],
                        default: 1,
                        pageSize: 2,
                    }]);

                    const { period } = await prompt([{
                        type: 'rawlist',
                        prefix: '',
                        name: 'period',
                        message: `${BOLD}Новый период оплаты${RESET} ${CYAN}текущая: ${price.period || 'total'}${RESET}`,
                        choices: [
                            { name: 'Общий', value: 'total' },
                            { name: 'Час', value: 'hour' },
                            { name: 'День', value: 'day' },
                            { name: 'Неделя', value: 'week' }
                        ],
                        default: 1,
                        pageSize: 4,
                    }]);

                    updates.price = {
                        ...price,
                        amount: Number(amount),
                        currency: currency,
                        period: period
                    };
                }

                if (fieldName === 'contact') {
                    console.log(`${CYAN}--- Обновление контактов ---${RESET}`);
                    const contact = updates.contact || tourData.contact || {};

                    const { c_name } = await prompt([{
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

                    const { c_phone } = await prompt([{
                        type: 'input',
                        name: 'c_phone',
                        prefix: '',
                        message: `${BOLD}Новый телефон${RESET} ${CYAN}текущее: ${contact.phone || 'Не указан'}${RESET}\n   >`,
                        default: contact.phone || '',
                        validate: i => /^\+?[0-9\s-]{7,20}$/.test(i) ? true : `${RED}Неверный формат телефона!${RESET}`
                    }]);

                    const { c_whatsapp } = await prompt([{
                        type: 'input',
                        name: 'c_whatsapp',
                        prefix: '',
                        message: `${BOLD}Новый WhatsApp${RESET} ${CYAN}текущее: ${contact.whatsapp || contact.phone || 'Не указан'}${RESET}\n   >`,
                        default: contact.whatsapp || contact.phone || ''
                    }]);

                    const currentPref = contact.preferred_contact || 'whatsapp';
                    const { c_pref } = await prompt([{
                        type: 'rawlist',
                        prefix: '',
                        name: 'c_pref',
                        message: `${BOLD}Новый способ связи${RESET} ${CYAN}текущий: ${currentPref}${RESET}`,
                        choices: [
                            { name: 'WhatsApp', value: 'whatsapp' },
                            { name: 'Telegram', value: 'telegram' },
                            { name: 'Телефон', value: 'phone' }
                        ],
                        default: 1,
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

                    // Получаем текущие изображения
                    let currentImageIds = [];
                    let currentImageCount = 0;

                    if (tourData.images && Array.isArray(tourData.images)) {
                        currentImageIds = tourData.images.map(img => img.id);
                        currentImageCount = tourData.images.length;
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
                            message: `${CYAN}Путь к папке с новыми фото (сейчас: ${currentImageCount} изображений) ${CYAN} пример: ./photos/tour1${RESET}\n    >`,
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
                        const updateId = tourDocumentId || tourId;

                        const result = await updateTour(updateId, updates);
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

                        await updateTourProcess();
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
                            default: 1,
                        }]);

                        await editField(fieldToEdit);
                    }

                    continue;
                } else if (confirmChoice === 'cancel') {
                    await updateTourProcess();
                    return;
                }
            }
        }

        await updateTourProcess();

    } catch (err) {
        console.error(`\n${RED}❌ ОШИБКА: ${BOLD}${err.message}${RESET}`);
    }
}

process.on('unhandledRejection', (error) => {
    console.error(`${RED}Необработанное отклонение промиса:${RESET}`, error);
    process.exit(1);
});

main();