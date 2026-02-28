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

async function createCar(data) {
    const res = await fetch(`${API_URL}/api/cars`, {
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

    while (true) {
        console.clear();
        console.log(`${BOLD}${GREEN}--- ДОБАВЛЕНИЯ АВТОМОБИЛЯ ---${RESET}\n`);

        try {
            const answers = await prompt([
                // 1. Car Основное
                {
                    type: 'input',
                    name: 'title',
                    prefix: '',
                    message: `${BOLD}Название* ${RESET}\n ${CYAN}Пример: BMW 4 Convertible 2023 - Белый комфорт${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Заголовок обязателен!${RESET}`
                },
                {
                    type: 'input',
                    name: 'description',
                    prefix: '',
                    message: `${BOLD}Описание* ${RESET}\n ${CYAN}Пример: Идеальное состояние, полная комплектация${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Описание обязательно!${RESET}`
                },
                {
                    type: 'rawlist',
                    name: 'type',
                    prefix: '',
                    message: `${BOLD}Тип${RESET}`,
                    choices: [
                        {name: 'Аренда', value: 'rent'},
                        {name: 'Продажа', value: 'sale'}
                    ],
                    default: 'rent'
                },
                {
                    type: 'rawlist',
                    name: 'car_status',
                    prefix: '',
                    message: `${BOLD}Статус${RESET}`,
                    choices: [
                        {name: 'Доступно', value: 'available'},
                        {name: 'Занята', value: 'rented'},
                        {name: 'Продана', value: 'sold'}
                    ],
                    default: 'available'
                },
                {
                    type: 'rawlist',
                    name: 'featured',
                    prefix: '',
                    message: `${BOLD}Рекомендуемый?${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 2
                },

                // 2. Цены
                {
                    type: 'rawlist',
                    name: 'currency',
                    prefix: '',
                    message: `${BOLD}Валюта${RESET}`,
                    choices: ['EUR', 'USD'],
                    default: 'EUR'
                },
                {
                    type: 'input',
                    name: 'day_1',
                    prefix: '',
                    message: `${BOLD}Цена за 1 день*${RESET}\n ${CYAN}Пример: 150${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_2',
                    prefix: '',
                    message: `${BOLD}Цена за 2 день*${RESET}\n ${CYAN}Пример: 250${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_3',
                    prefix: '',
                    message: `${BOLD}Цена за 3 день*${RESET}\n ${CYAN}Пример: 350${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_4',
                    prefix: '',
                    message: `${BOLD}Цена за 4 день*${RESET}\n ${CYAN}Пример: 450${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_5',
                    prefix: '',
                    message: `${BOLD}Цена за 5 день*${RESET}\n ${CYAN}Пример: 550${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_6',
                    prefix: '',
                    message: `${BOLD}Цена за 6 день*${RESET}\n ${CYAN}Пример: 650${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_7',
                    prefix: '',
                    message: `${BOLD}Цена за 7 день*${RESET}\n ${CYAN}Пример: 700${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_8',
                    prefix: '',
                    message: `${BOLD}Цена за 8 день*${RESET}\n ${CYAN}Пример: 800${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_9',
                    prefix: '',
                    message: `${BOLD}Цена за 9 день*${RESET}\n ${CYAN}Пример: 900${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },
                {
                    type: 'input',
                    name: 'day_10',
                    prefix: '',
                    message: `${BOLD}Цена за 10 день*${RESET}\n ${CYAN}Пример: 1000${RESET}\n >`,
                    validate: v => /^\d+$/.test(v) ? true : `${RED}Введите целое положительное число!${RESET}`
                },

                // 3. Спецификации
                {
                    type: 'input',
                    name: 'make',
                    prefix: '',
                    message: `${BOLD}Марка* ${RESET}\n ${CYAN}Пример: Mercedes-Benz${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Марка обязательна!${RESET}`
                },
                {
                    type: 'input',
                    name: 'model',
                    prefix: '',
                    message: `${BOLD}Модель* ${RESET}\n ${CYAN}Пример: C-Class${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Модель обязательна!${RESET}`
                },
                {
                    type: 'input',
                    name: 'year',
                    prefix: '',
                    message: `${BOLD}Год выпуска* ${RESET}\n ${CYAN}Пример: 2022${RESET}\n >`,
                    validate: v => {
                        const year = parseInt(v);
                        const currentYear = new Date().getFullYear();

                        if (!/^\d+$/.test(v)) {
                            return `${RED}Введите только положительное число! (Минус запрещен)${RESET}`;
                        }
                        if (year < 1900 || year > currentYear + 1) {
                            return `${RED}Введите корректный год (от 1900 до ${currentYear + 1})${RESET}`;
                        }
                        return true;
                    }
                },
                {
                    type: 'rawlist',
                    name: 'fuel',
                    prefix: '',
                    message: `${BOLD}Тип двигателя${RESET}`,
                    choices: [
                        {name: 'Бензин', value: 'petrol'},
                        {name: 'Дизель', value: 'diesel'},
                        {name: 'Гибрид', value: 'hybrid'},
                        {name: 'Электро', value: 'electric'}
                    ],
                    default: 'petrol'
                },
                {
                    type: 'rawlist',
                    name: 'transmission',
                    prefix: '',
                    message: `${BOLD}Коробка передач${RESET}`,
                    choices: [
                        {name: 'Автомат', value: 'automatic'},
                        {name: 'Механика', value: 'manual'}
                    ],
                    default: 'automatic'
                },
                {
                    type: 'input',
                    name: 'seats',
                    prefix: '',
                    message: `${BOLD}Количество мест* ${RESET}\n ${CYAN}Пример: 2 или 5${RESET}\n >`,
                    default: "5"
                },

                // 4. Опции
                {
                    type: 'rawlist',
                    name: 'ac',
                    prefix: '',
                    message: `${BOLD}Есть кондиционер?${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 1
                },
                {
                    type: 'rawlist',
                    name: 'nav',
                    prefix: '',
                    message: `${BOLD}Есть навигатор (GPS)?${RESET}`,
                    choices: [
                        { name: 'Да', value: true },
                        { name: 'Нет', value: false }
                    ],
                    default: 1
                },
                // 5. Локация
                {
                    type: 'input',
                    name: 'address',
                    prefix: '',
                    message: `${BOLD}Адрес* ${RESET}\n ${CYAN}Пример: Calle de Mendez, 15${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Адрес обязателен!${RESET}`
                },
                {
                    type: 'input',
                    name: 'city',
                    prefix: '',
                    message: `${BOLD}Город* ${RESET}\n ${CYAN}Пример: Adeje${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Город обязателен!${RESET}`
                },

                // 6. Контакты
                {
                    type: 'input',
                    name: 'c_name',
                    prefix: '',
                    message: `${BOLD}Имя* ${RESET}\n >`,
                    validate: i => i.trim() ? true : `${RED}Имя обязательно!${RESET}`
                },
                {
                    type: 'input',
                    name: 'phone',
                    prefix: '',
                    message: `${BOLD}Телефон*${RESET}\n   ${CYAN}Формат: +44 xxxx xxxxxx${RESET}\n   >`,
                    validate: i => /^\+?[0-9\s-]{7,20}$/.test(i) ? true : `${RED}Неверный формат!${RESET}`
                },
                {
                    type: 'rawlist',
                    name: 'pref',
                    prefix: '',
                    message: `${BOLD}Удобный способ связи${RESET}`,
                    choices: [
                        {name: 'WhatsApp', value: 'whatsapp'},
                        {name: 'Telegram', value: 'telegram'},
                        {name: 'Телефон', value: 'phone'}
                    ],
                    default: 'whatsapp'
                },

                // 7. Фотографии
                {
                    type: 'input',
                    name: 'imagesDir',
                    prefix: '',
                    message: `${BOLD}Путь к папке с фото этого авто* ${RESET}\n ${CYAN}Пример: ./photos/bmw${RESET}\n >`,
                    validate: p => fs.existsSync(p) && fs.lstatSync(p).isDirectory() ? true : `${RED}Папка не найдена!${RESET}`
                }
            ]);

            const files = fs.readdirSync(answers.imagesDir)
                .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
                .map(f => path.join(answers.imagesDir, f));

            const imageIds = [];
            if (files.length > 0) {
                console.log(`\n${CYAN}>> Найдено фото: ${files.length}. Начинаю загрузку...${RESET}`);
                for (const img of files) {
                    const stop = startLoading(`Загрузка ${path.basename(img)}...`);
                    try {
                        const id = await uploadImage(img);
                        imageIds.push(id);
                        stop();
                        console.log(`${GREEN}   Успешно: ${path.basename(img)}${RESET}`);
                    } catch (e) {
                        stop();
                        console.log(`${RED}   Ошибка: ${path.basename(img)}${RESET}`);
                    }
                }
            }

            const payload = {
                title: answers.title,
                description: answers.description,
                type: answers.type,
                car_status: answers.car_status,
                featured: answers.featured,
                images: imageIds,
                rental_prices: {
                    currency: answers.currency,
                    day_1: Number(answers.day_1),
                    day_2: Number(answers.day_2),
                    day_3: Number(answers.day_3),
                    day_4: Number(answers.day_4),
                    day_5: Number(answers.day_5),
                    day_6: Number(answers.day_6),
                    day_7: Number(answers.day_7),
                    day_8: Number(answers.day_8),
                    day_9: Number(answers.day_9),
                    day_10: Number(answers.day_10),
                },
                specifications: {
                    make: answers.make,
                    model: answers.model,
                    year: Number(answers.year),
                    fuel: answers.fuel,
                    transmission: answers.transmission,
                    seats: Number(answers.seats)
                },
                features: {
                    air_conditioning: answers.ac,
                    navigation: answers.nav
                },
                location: {
                    address: answers.address,
                    city: answers.city
                },
                contact: {
                    name: answers.c_name,
                    phone: answers.phone,
                    preferred_contact: answers.pref
                }
            };

            const stopFinal = startLoading("Сохранение в базу данных...");
            const result = await createCar(payload);
            stopFinal();

            console.log(`\n\x1b[30m\x1b[42m УСПЕХ \x1b[0m УСПЕШНО СОЗДАНО! ID: ${result.data.id}\n`);

            const { repeat } = await prompt([{
                type: 'rawlist',
                name: 'repeat',
                prefix: '',
                message: `${BOLD}Желаете добавить еще один automobile автомобиль?${RESET}`,
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

            const { repeat } = await prompt([{
                type: 'rawlist',
                name: 'repeat',
                prefix: '',
                message: `${BOLD}Желаете попробовать снова?${RESET}`,
                choices: [
                    { name: 'Да, попробовать еще раз', value: true },
                    { name: 'Нет, завершить работу', value: false }
                ],
                default: 1
            }]);

            if (!repeat) break;
        }
    }
    process.exit();
}

main();