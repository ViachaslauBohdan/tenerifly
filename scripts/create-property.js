import fs from "fs";
import path from "path";
import inquirer from "inquirer";

/* ================= КОНФИГУРАЦИЯ ================= */
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const RED = "\x1b[31m", GREEN = "\x1b[32m", CYAN = "\x1b[36m", RESET = "\x1b[0m", BOLD = "\x1b[1m";

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

/* ================= API ПОМОЩНИКИ ================= */
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

async function createProperty(data) {
    const res = await fetch(`${API_URL}/api/properties`, {
        method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${API_TOKEN}`},
        body: JSON.stringify({data}),
    });
    if (!res.ok) throw new Error(`Ошибка сервера API: ${await res.text()}`);
    return res.json();
}

/* ================= ОСНОВНОЙ ПРОЦЕСС ================= */
async function main() {
    // Бесконечный цикл для повторной работы без перезапуска
    while (true) {
        console.clear();
        console.log(`${BOLD}${GREEN}--- ДОБАВЛЕНИЯ НЕДВИЖИМОСТИ ---${RESET}\n`);

        try {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    prefix: '',
                    message: `${BOLD}Заголовок* ${RESET}\n ${CYAN}(Пример: Роскошная вилла с видом на океан)${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Заголовок обязателен!${RESET}`
                },
                {
                    type: 'input',
                    name: 'description',
                    prefix: '',
                    message: `${BOLD}Oписание ${RESET}\n ${CYAN}(Пример: Тихий район, 5 минут до пляжа, современный ремонт)${RESET}\n >`
                },
                {
                    type: 'rawlist',
                    name: 'type',
                    prefix: '',
                    message: `${BOLD}Тип${RESET} `,
                    choices: [
                        {name: 'Аренда', value: 'rent'},
                        {name: 'Продажа', value: 'sale'}
                    ]
                },
                {
                    type: 'rawlist',
                    name: 'property_status',
                    prefix: '',
                    message: `${BOLD}Статус${RESET} `,
                    choices: [
                        {name: 'Свободно', value: 'available'},
                        {name: 'Арендовано', value: 'rented'},
                        {name: 'Продано', value: 'sold'}
                    ]
                },
                {
                    type: 'rawlist',
                    name: 'category',
                    prefix: '',
                    message: `${BOLD}Категория жилья${RESET} `,
                    choices: [
                        {name: 'Апартаменты', value: 'apartment'},
                        {name: 'Дом', value: 'house'},
                        {name: 'Вилла', value: 'villa'},
                        {name: 'Коммерческая недвижимость', value: 'commercial'}
                    ]
                },
                {
                    type: 'rawlist',
                    name: 'featured',
                    prefix: '',
                    message: `${BOLD}Сделать этот объект рекомендуемым?${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 1
                },
                {
                    type: 'input',
                    name: 'amount',
                    prefix: '',
                    message: `${BOLD}Цена* ${RESET}\n ${CYAN}(Пример: 1500)${RESET}\n >`,
                    validate: v => {
                        if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                        if (!/^\d+$/.test(v)) return `${RED}Введите только число${RESET}`;
                        return true;
                    }
                },
                {
                    type: 'rawlist',
                    name: 'currency',
                    prefix: '',
                    message: `${BOLD}Валюта${RESET} `,
                    choices: ['EUR', 'USD'],
                    default: 'EUR'
                },
                {
                    type: 'rawlist',
                    name: 'period',
                    prefix: '',
                    message: `${BOLD}Период оплаты${RESET} `,
                    choices: [
                        {name: 'Օбщий', value: 'total'},
                        {name: 'День', value: 'day'},
                        {name: 'Недель', value: 'week'},
                        {name: 'Месяц', value: 'month'},
                    ],
                    default: 'total'
                },
                {
                    type: 'input',
                    name: 'total_area',
                    prefix: '',
                    message: `${BOLD}Общая площадь (м2)* ${RESET}\n ${CYAN}(Пример: 85)${RESET}\n >`,
                    validate: v => {
                        if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                        if (!/^\d+(\.\d+)?$/.test(v)) return `${RED}Введите положительное число${RESET}`;
                        return true;
                    }
                },

                {
                    type: 'input',
                    name: 'bedrooms',
                    prefix: '',
                    message: `${BOLD}Количество спален*${RESET}\n >`,
                    default: "1",
                    validate: v => {
                        if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                        if (!/^\d+$/.test(v) || Number(v) <= 0) return `${RED}Введите целое число больше 0${RESET}`;
                        return true;
                    }
                },
                {
                    type: 'input',
                    name: 'bathrooms',
                    prefix: '',
                    message: `${BOLD}Количество ванных комнат*${RESET}\n >`,
                    default: "1",
                    validate: v => {
                        if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                        if (!/^\d+$/.test(v) || Number(v) <= 0) return `${RED}Введите целое число больше 0${RESET}`;
                        return true;
                    }
                },
                {
                    type: 'input',
                    name: 'floor',
                    prefix: '',
                    message: `${BOLD}Этаж${RESET}\n >`,
                    default: "0",
                    validate: v => {
                        if (v.trim() === '') return `${RED}Поле не может быть пустым${RESET}`;
                        if (!/^\d+$/.test(v) || Number(v) < 0) return `${RED}Введите целое число, 0 или больше${RESET}`;
                        return true;
                    }
                },
                {
                    type: 'rawlist',
                    name: 'has_pool',
                    prefix: '',
                    message: `${BOLD}Наличие бассейна${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 1
                },
                {
                    type: 'rawlist',
                    name: 'has_ac',
                    prefix: '',
                    message: `${BOLD}Наличие кондиционера${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 1
                },
                {
                    type: 'rawlist',
                    name: 'has_internet',
                    prefix: '',
                    message: `${BOLD}Наличие интернета${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 1
                },
                {
                    type: 'rawlist',
                    name: 'furnished',
                    prefix: '',
                    message: `${BOLD}Наличие мебели${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 1
                },
                {
                    type: 'input',
                    name: 'address',
                    prefix: '',
                    message: `${BOLD}Вдрес* ${RESET}\n ${CYAN}(Пример: Calle de Mar, 12)${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Адрес обязателен!${RESET}`
                },
                {
                    type: 'input',
                    name: 'c_name',
                    prefix: '',
                    message: `${BOLD}Имя*${RESET}\n    ${CYAN}Пример: Иван${RESET}\n>`,
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
                    name: 'phone',
                    prefix: '',
                    message: `${BOLD}Телефон*${RESET}\n    ${CYAN}Пример: +44 XXXX XXXXX${RESET}\n>`,
                    validate: i => /^\+?[0-9\s-]{7,20}$/.test(i) ? true : `${RED}Неверный формат телефона!${RESET}`
                },
                {
                    type: 'input',
                    name: 'city',
                    prefix: '',
                    message: `${BOLD}Город* ${RESET}\n ${CYAN}(Пример: Адехе)${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Город обязателен!${RESET}`
                },
                {type: 'input', name: 'region', prefix: '', message: `${BOLD}Регион${RESET}\n >`, default: "Тенерифе"},
                {type: 'input', name: 'wa', prefix: '', message: `${BOLD}WhatsApp${RESET}\n >`},
                {
                    type: 'rawlist',
                    name: 'pref',
                    prefix: '',
                    message: `${BOLD}Где удобнее общаться?${RESET} `,
                    choices: [
                        {name: 'WhatsApp', value: 'whatsapp'},
                        {name: 'Telegram', value: 'telegram'},
                        {name: 'Телефон', value: 'phone'}
                    ],
                    default: 'whatsapp'
                },
                {
                    type: 'input',
                    name: 'imagesDir',
                    prefix: '',
                    message: `${BOLD}Путь к папке с фото объекта* ${RESET}\n ${CYAN}(Пример: ./images/villa-1)${RESET}\n >`,
                    validate: p => fs.existsSync(p) ? true : `${RED}Папка не найдена!${RESET}`
                }
            ]);

            const files = fs.readdirSync(answers.imagesDir)
                .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
                .map(f => path.join(answers.imagesDir, f));

            const imageIds = [];
            if (files.length > 0) {
                console.log(`\n${CYAN}>> Найдено фото ${files.length}. Загрузка...${RESET}`);
                for (const img of files) {
                    const stop = startLoading(`Загрузка ${path.basename(img)}...`);
                    try {
                        const id = await uploadImage(img);
                        imageIds.push(id);
                        stop();
                        console.log(`${GREEN}✔ ${path.basename(img)} загружен${RESET}`);
                    } catch (e) {
                        stop();
                        console.log(`${RED}✘ Ошибка: ${path.basename(img)}${RESET}`);
                    }
                }
            }

            const payload = {
                title: answers.title,
                description: answers.description,
                type: answers.type,
                property_status: answers.property_status,
                category: answers.category,
                featured: answers.featured,
                images: imageIds,
                price: {
                    amount: Number(answers.amount),
                    currency: answers.currency,
                    period: answers.period
                },
                specifications: {
                    total_area: Number(answers.total_area),
                    bedrooms: Number(answers.bedrooms),
                    bathrooms: Number(answers.bathrooms),
                    floor: Number(answers.floor)
                },
                features: {
                    has_pool: answers.has_pool,
                    has_air_conditioning: answers.has_ac,
                    has_internet: answers.has_internet,
                    furnished: answers.furnished
                },
                location: {
                    address: answers.address,
                    city: answers.city,
                    region: answers.region
                },
                contact: {
                    name: answers.c_name,
                    phone: answers.phone,
                    whatsapp: answers.wa,
                    preferred_contact: answers.pref
                }
            };

            const stopFinal = startLoading("Сохранение в базе данных...");
            const result = await createProperty(payload);
            stopFinal();
            console.log(`\n\x1b[30m\x1b[42m УСПЕХ \x1b[0m УСПЕШНО СОЗДАНО! ID: ${result.data.id}\n`);

            const {confirmAgain} = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'confirmAgain',
                    prefix: '',
                    message: `${BOLD}Желаете добавить еще один объект недвижимость?${RESET}`,
                    choices: [
                        { name: 'Да, продолжить', value: true },
                        { name: 'Нет, выйти', value: false }
                    ],
                    default: 1
                }
            ]);

            if (!confirmAgain) break;

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

    console.log(`${CYAN}Выход из программы...${RESET}`);
    process.exit();
}

main();