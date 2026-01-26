import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import fetch from "node-fetch";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const HEADERS = {
    "Authorization": `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json"
};

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";

function normalizeString(str) {
    if (!str) return "";
    return str.toLowerCase().trim()
        .replace(/[^\w\s-а-яё]/gi, '')
        .replace(/\s+/g, ' ');
}

function findMatchingFolder(propertyTitle, basePath) {
    const normalizedTitle = normalizeString(propertyTitle);
    if (!normalizedTitle) return null;
    try {
        const folders = fs.readdirSync(basePath, { withFileTypes: true }).filter(item => item.isDirectory());
        for (const folder of folders) {
            const normalizedFolder = normalizeString(folder.name);
            if (normalizedFolder === normalizedTitle || normalizedFolder.includes(normalizedTitle) || normalizedTitle.includes(normalizedFolder)) {
                return path.join(basePath, folder.name);
            }
        }
    } catch (e) { return null; }
    return null;
}

function createSpinner(text) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${CYAN}${frames[i++ % frames.length]}${RESET} ${text}`);
    }, 80);
    return () => {
        clearInterval(interval);
        process.stdout.write('\r\x1b[K');
    };
}

async function updatePropertyData(property, jsonData) {
    const targetId = property.documentId || property.id;
    const url = `${API_URL}/api/properties/${targetId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify({
                data: {
                    address: jsonData.address,
                    specifications: jsonData.specifications,
                    contact: jsonData.contact,
                }
            }),
        });
        return res.ok;
    } catch (error) { return false; }
}

async function main() {
    console.clear();
    const stopInitialLoad = createSpinner("Загрузка данных из Strapi...");

    try {
        const response = await fetch(`${API_URL}/api/properties?pagination[pageSize]=1000`, { headers: HEADERS });
        const json = await response.json();
        stopInitialLoad();

        const properties = json.data || [];

        const emptyFields = properties.filter(p => {
            const attr = p.attributes || p;
            return !attr.address || !attr.specifications;
        });

        if (emptyFields.length === 0) {
            console.log(`${GREEN}Все объекты уже заполнены данными.${RESET}`);
            return;
        }

        console.log(`\nНАЙДЕНО ${emptyFields.length} ОБЪЕКТОВ С ПУСТЫМИ ПОЛЯМИ:`);
        emptyFields.forEach((p, i) => {
            const attr = p.attributes || p;
            console.log(`${i + 1}. [ID: ${p.id}] ${attr.title || 'Без названия'}`);
        });

        const { textsPath } = await inquirer.prompt([{
            type: 'input',
            name: 'textsPath',
            prefix: '',
            message: 'Введите путь к папке:',
            validate: (input) => {
                if (!input || !input.trim()) {
                    return 'Путь не может быть пустым';
                }
                return true;
            }
        }]);

        const absolutePath = path.resolve(textsPath);

        const { confirmAction } = await inquirer.prompt([{
            type: 'rawlist',
            name: 'confirmAction',
            message: `Начать заполнение данных для ${emptyFields.length} объектов?`,
            prefix: '',
            choices: [
                {
                    name: 'Да',
                    value: true
                },
                {
                    name: 'Нет',
                    value: false
                }
            ],
            default: 0,
        }]);

        if (!confirmAction) return;

        let successCount = 0;

        for (const [index, prop] of emptyFields.entries()) {
            const attr = prop.attributes || prop;
            const title = attr.title || `ID: ${prop.id}`;
            console.log(`\n[${index + 1}/${emptyFields.length}] Обработка: ${title}`);

            const folder = findMatchingFolder(title, absolutePath);

            if (!folder) {
                console.log(`${RED}  ❌ Папка для "${title}" не найдена в ${absolutePath}${RESET}`);
                continue;
            }

            const jsonFilePath = path.join(folder, 'info.json');

            if (!fs.existsSync(jsonFilePath)) {
                console.log(`${RED}  ❌ Файл info.json не найден в ${path.basename(folder)}${RESET}`);
                continue;
            }

            try {
                const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
                const jsonData = JSON.parse(fileContent);

                const stopUpdateSpinner = createSpinner("Обновление данных в Strapi...");
                const success = await updatePropertyData(prop, jsonData);
                stopUpdateSpinner();

                if (success) {
                    console.log(`${GREEN}Данные успешно обновлены!${RESET}`);
                    successCount++;
                } else {
                    console.log(`${RED}  ❌ Ошибка при сохранении в Strapi${RESET}`);
                }
            } catch (err) {
                console.log(`${RED}  ❌ Ошибка чтения JSON: ${err.message}${RESET}`);
            }
        }

        console.log(`\n${GREEN}ОБРАБОТКА ЗАВЕРШЕНА!${RESET}`);
        console.log(`Обновлено объектов: ${successCount}`);
        console.log(`Пропущено: ${emptyFields.length - successCount}`);

    } catch (err) {
        console.error(`\n${RED}Критическая ошибка: ${err.message}${RESET}`);
    }
}

main();