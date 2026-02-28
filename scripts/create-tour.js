import fs from "fs";
import path from "path";
import inquirer from "inquirer";

/* ================= КОНФИГУРАЦИЯ ================= */
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const RED = "\x1b[31m", GREEN = "\x1b[32m", CYAN = "\x1b[36m", RESET = "\x1b[0m", BOLD = "\x1b[1m";

/* ================= НАСТРОЙКА ИНТЕРФЕЙСА ================= */
const prompt = inquirer.createPromptModule();

/* ================= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ UI ================= */
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

/* ================= API ФУНКЦИИ ================= */
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

async function createTour(data) {
    const res = await fetch(`${API_URL}/api/tours`, {
        method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${API_TOKEN}`},
        body: JSON.stringify({data}),
    });
    if (!res.ok) throw new Error(`Ошибка сервера: ${await res.text()}`);
    return res.json();
}

/* ================= ОСНОВНОЙ ПРОЦЕСС ================= */
async function main() {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
    }

    // БЕСКОНЕЧНЫЙ ЦИКЛ ДЛЯ ПЕРЕЗАПУСКА
    while (true) {
        console.clear();
        console.log(`${BOLD}${GREEN}--- Создание тура ---${RESET}\n`);

        try {
            const answers = await prompt([
                {
                    type: 'input',
                    name: 'title',
                    prefix: '',
                    message: `${BOLD}Заголовок*${RESET}\n   ${CYAN}Пример: Прогулка на яхте к китам${RESET}\n   >`,
                    validate: i => i.trim().length >= 2 ? true : `${RED}Введите корректное название!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'slug',
                    message: `${BOLD}Слаг*${RESET}\n   ${CYAN}Пример: progulka-na-yakhte${RESET}\n   >`,
                    validate: i => /^[a-z0-9-]+$/.test(i) ? true : `${RED}Только маленькие латинские буквы и дефис!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'description',
                    message: `${BOLD}Описание*${RESET}\n   ${CYAN}Пример: Увлекательное путешествие на 15-метровой яхте...${RESET}\n   >`,
                    validate: i => i.trim().length > 5 ? true : `${RED}Описание слишком короткое!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'duration',
                    message: `${BOLD}Длительность*${RESET}\n   ${CYAN}Пример: 3 часа / 2 дня / Весь день${RESET}\n   >`,
                    validate: i => i.trim() ? true : `${RED}Укажите длительность!${RESET}`
                },
                {
                    type: 'rawlist',
                    name: 'available_days',
                    prefix: '',
                    message: `${BOLD}Доступные дни*${RESET}`,
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
                    default: 'Ежедневно'
                },
                {
                    type: 'rawlist',
                    prefix: '',
                    name: 'language',
                    message: `${BOLD}Выберите язык${RESET}`,
                    choices: [
                        {name: 'Русский', value: 'RU'},
                        {name: 'Английский', value: 'EN'},
                        {name: 'Испанский', value: 'ES'},
                        {name: 'Немецкий', value: 'DE'},
                        {name: 'Французский', value: 'FR'},
                        {name: 'Польский', value: 'PL'},
                        {name: 'Украинский', value: 'UK'}
                    ],
                    default: 'RU'
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'address',
                    message: `${BOLD}Адрес*${RESET}\n   ${CYAN}Пример: Puerto Colon, Pantalan 4${RESET}\n   >`,
                    validate: i => i.trim() ? true : `${RED}Адрес обязателен!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'city',
                    message: `${BOLD}Город*${RESET}\n   ${CYAN}Пример: Adeje / Las Americas${RESET}\n   >`,
                    validate: i => i.trim() ? true : `${RED}Город обязателен!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'region',
                    message: `${BOLD}Регион${RESET}\n   ${CYAN}Пример: Tenerife / Gran Canaria${RESET}\n   >`,
                    default: "Tenerife"
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'lat',
                    message: `${BOLD}Широта${RESET}\n    ${CYAN}Пример: 28.0772${RESET}\n    >`,
                    validate: v => v === '' || !isNaN(Number(v)) ? true : `${RED}Введите число!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'lng',
                    message: `${BOLD}Долгота${RESET}\n    ${CYAN}Пример: -16.7325${RESET}\n    >`,
                    validate: v => v === '' || !isNaN(Number(v)) ? true : `${RED}Введите число!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'amount',
                    message: `${BOLD}Цена*${RESET}\n    ${CYAN}Пример: 45${RESET}\n    >`,
                    validate: v => {
                        if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                        if (!/^\d+$/.test(v)) return `${RED}Введите только число${RESET}`;
                        return true;
                    }
                },
                {
                    type: 'rawlist',
                    prefix: '',
                    name: 'currency',
                    message: `${BOLD}Валюта${RESET}`,
                    choices: ['EUR', 'USD'],
                    default: 'EUR'
                },
                {
                    type: 'rawlist',
                    prefix: '',
                    name: 'period',
                    message: `${BOLD}Период оплаты${RESET}`,
                    choices: [
                        {name: 'Օбщий', value: 'total'},
                        {name: 'Час', value: 'hour'},
                        {name: 'День', value: 'day'},
                        {name: 'Недель', value: 'week'}
                    ],
                    default: 'total'
                },
                {
                    type: 'input',
                    name: 'c_name',
                    prefix: '',
                    message: `${BOLD}Имя*${RESET}\n    ${CYAN}Пример: Иван / Tenerife Tours${RESET}\n    >`,
                    validate: i => {
                        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

                        if (!i.trim()) {
                            return `${RED}Имя обязательно!${RESET}`;
                        }
                        if (!nameRegex.test(i)) {
                            return `${RED}Имя должно содержать только буквы! (Цифры запрещены)${RESET}`;
                        }
                        return true;
                    }
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'c_phone',
                    message: `${BOLD}Телефон*${RESET}\n    ${CYAN}Пример: +44 XXXX XXXXX${RESET}\n    >`,
                    validate: i => /^\+?[0-9\s-]{7,20}$/.test(i) ? true : `${RED}Неверный формат телефона!${RESET}`
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'c_whatsapp',
                    message: `${BOLD}WhatsApp${RESET}\n    ${CYAN}Пример: +44 XXXX XXXXX${RESET}\n    >`,
                },
                {
                    type: 'rawlist',
                    prefix: '',
                    name: 'c_pref',
                    message: `${BOLD}Способ связи${RESET}`,
                    choices: [
                        {name: 'WhatsApp', value: 'whatsapp'},
                        {name: 'Telegram', value: 'telegram'},
                        {name: 'Телефон', value: 'phone'}
                    ],
                    default: 'whatsapp'
                },
                {
                    type: 'input',
                    prefix: '',
                    name: 'imagesDir',
                    message: `${BOLD}Путь к папке с фото*${RESET}\n    ${CYAN}Пример: ./photos/tour1${RESET}\n    >`,
                    validate: p => fs.existsSync(p) && fs.lstatSync(p).isDirectory() ? true : `${RED}Папка не найдена!${RESET}`
                }
            ]);

            /* --- Обработка изображений --- */
            const files = fs.readdirSync(answers.imagesDir)
                .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
                .map(f => path.join(answers.imagesDir, f));

            const imageIds = [];
            if (files.length > 0) {
                console.log(`\n${CYAN}>> Найдено фото: ${files.length}. Загружаю...${RESET}`);
                for (const img of files) {
                    const stop = startLoading(`Загрузка ${path.basename(img)}...`);
                    try {
                        const id = await uploadImage(img);
                        imageIds.push(id);
                        stop();
                        console.log(`${GREEN}   ОК: ${path.basename(img)}${RESET}`);
                    } catch (e) {
                        stop();
                        console.log(`${RED}   ОШИБКА: ${path.basename(img)}${RESET}`);
                    }
                }
            }

            /* --- Формирование объекта для Strapi --- */
            const payload = {
                title: answers.title,
                slug: answers.slug,
                description: answers.description,
                duration: answers.duration,
                language: answers.language,
                available_days: {value: answers.available_days},
                images: imageIds,
                location: {
                    address: answers.address,
                    city: answers.city,
                    region: answers.region,
                    latitude: answers.lat ? Number(answers.lat) : null,
                    longitude: answers.lng ? Number(answers.lng) : null
                },
                price: {
                    amount: Number(answers.amount),
                    currency: answers.currency,
                    period: answers.period
                },
                contact: {
                    name: answers.c_name,
                    phone: answers.c_phone,
                    whatsapp: answers.c_whatsapp || answers.c_phone,
                    preferred_contact: answers.c_pref
                }
            };

            const stopFinal = startLoading("Сохранение в Strapi...");
            const result = await createTour(payload);
            stopFinal();

            console.log(`\n\x1b[30m\x1b[42m УСПЕХ \x1b[0m УСПЕШНО СОЗДАНО! ID: ${result.data.id}\n`);

            // Вопрос о повторе после успеха
            const { repeat } = await prompt([{
                type: 'rawlist',
                name: 'repeat',
                prefix: '',
                message: `${BOLD}Желаете добавить еще один тур?${RESET}`,
                choices: [
                    { name: 'Да, добавить еще один', value: true },
                    { name: 'Нет, завершить работу', value: false }
                ],
                default: 1
            }]);

            if (!repeat) break;

        } catch (err) {
            let userMessage = err.message;
            try {
                if (err.message.includes("API Error:")) {
                    const jsonError = JSON.parse(err.message.replace("API Error: ", ""));
                    userMessage = jsonError.error?.message || "Ошибка сервера Strapi";
                }
            } catch (e) {
                userMessage = err.message;
            }
            console.error(`\n${RED}❌ ОШИБКА: ${BOLD}${userMessage}${RESET}`);
        }
    }

    console.log(`\n${CYAN}Программа завершена. До свидания!${RESET}`);
    process.exit();
}

main();