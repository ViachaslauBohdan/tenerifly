import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch";
import inquirer from "inquirer";
import { localizeProperty } from "./lib/propertyLocales.mjs";

const API_URL = "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const RED = "\x1b[31m", GREEN = "\x1b[32m", CYAN = "\x1b[36m", RESET = "\x1b[0m", BOLD = "\x1b[1m";

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

async function uploadImageFromUrl(imageUrl) {
    try {
        const response = await axios.get(imageUrl, {responseType: 'arraybuffer', timeout: 15000});
        const buffer = Buffer.from(response.data);
        const fileName = path.basename(imageUrl.split('?')[0]) || "property.jpg";
        const formData = new FormData();
        formData.append("files", buffer, {filename: fileName});
        const res = await fetch(`${API_URL}/api/upload`, {
            method: "POST",
            headers: {"Authorization": `Bearer ${API_TOKEN}`, ...formData.getHeaders()},
            body: formData,
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data[0].id;
    } catch (e) {
        return null;
    }
}

async function createProperty(data) {
    const res = await fetch(`${API_URL}/api/properties`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${API_TOKEN}`},
        body: JSON.stringify({data}),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function main() {
    console.clear();
    console.log(`${BOLD}${GREEN}--- ИМПОРТ ПАРСИНГА В TENERIFE JOY ---${RESET}\n`);

    const {folderPath} = await inquirer.prompt([{
        type: 'input',
        name: 'folderPath',
        prefix: '',
        message: 'Введите путь к папке с результатами парсинга:',
        validate: (input) => {
            if (!input.trim()) return `${RED}Путь не может быть пустым!${RESET}`;
            return fs.existsSync(input) ? true : `${RED}Путь не существует!${RESET}`;
        }
    }]);

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
        console.log(`${RED}В этой папке нет JSON файлов!${RESET}`);
        return;
    }

    const {selectedFile} = await inquirer.prompt([{
        type: 'rawlist',
        name: 'selectedFile',
        prefix: '',
        message: 'Выберите файл для загрузки:',
        choices: files.sort().reverse(),
        default: 0
    }]);

    const fullPath = path.join(folderPath, selectedFile);
    const rawData = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    console.log(`\n${CYAN}Загружаем данные из: ${fullPath}${RESET}\n`);

    for (let k = 0; k < rawData.length; k++) {
        const item = rawData[k];
        console.log(`${BOLD}[${k + 1}/${rawData.length}] Объект: ${item.title}${RESET}`);

        const imageIds = [];
        if (item.images?.length > 0) {
            process.stdout.write(`${CYAN}Загрузка: ${RESET}`);
            const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

            for (const imgUrl of item.images.slice(0, 12)) {
                let frameIndex = 0;

                const loadingInterval = setInterval(() => {
                    process.stdout.write(`\r${CYAN}Загрузка:${RESET} ${imageIds.length > 0 ? GREEN + '•'.repeat(imageIds.length) + RESET : ''}${CYAN}${frames[frameIndex]}${RESET}`);
                    frameIndex = (frameIndex + 1) % frames.length;
                }, 80);

                const id = await uploadImageFromUrl(imgUrl);

                clearInterval(loadingInterval);

                if (id) {
                    imageIds.push(id);
                    process.stdout.write(`\r  ${CYAN}Загрузка:${RESET} ${GREEN}${'•'.repeat(imageIds.length)}${RESET}`);
                } else {
                    process.stdout.write(`\r  ${CYAN}Загрузка:${RESET} ${GREEN}${'•'.repeat(imageIds.length)}${RESET}${RED}x${RESET}`);
                }
            }
            console.log(` ${GREEN}Готово!${RESET}`);
        }

        const isRent = item.price.toLowerCase().includes('night') || item.price.toLowerCase().includes('week');

        const payload = {
            title: item.title,
            description: item.description,
            type: isRent ? 'rent' : 'sale',
            property_status: 'available',
            category: 'apartment',
            images: imageIds,
            price: {
                amount: parseInt(item.price.replace(/[^\d]/g, '')) || 0,
                currency: 'EUR',
                period: isRent ? 'day' : 'total'
            },
            specifications: {
                total_area: parseInt(item.details?.property_size) || 0,
                bedrooms: parseInt(item.details?.bedrooms) || 1,
                bathrooms: parseInt(item.details?.bathrooms) || 1
            },
            location: {
                address: item.location?.address || "Tenerife",
                city: item.location?.city || "Adeje",
                region: "Tenerife"
            },
            contact: {
                name: "Name",
                phone: "+00000000000",
                whatsapp: "+00000000000",
                preferred_contact: "whatsapp"
            }
        };

        const stop = startLoading("Создание в Strapi...");
        try {
            const res = await createProperty(payload);
            stop();
            console.log(`${GREEN}УСПЕХ! ID: ${res.data.id}${RESET}`);
            const documentId = res.data?.documentId;
            if (documentId) {
                const locStop = startLoading("Локали title/description...");
                try {
                    const loc = await localizeProperty({
                        apiUrl: API_URL,
                        token: API_TOKEN,
                        documentId,
                        dryRun: false,
                    });
                    locStop();
                    const written = loc.results.filter((row) => row.status === "written").length;
                    const failed = loc.results.filter((row) => row.status === "error").length;
                    console.log(`${GREEN}Локали записаны: ${written}, ошибок: ${failed}${RESET}\n`);
                } catch (locErr) {
                    locStop();
                    console.log(`${RED}EN создан, локали не записались: ${locErr.message}${RESET}\n`);
                }
            } else {
                console.log("");
            }
        } catch (e) {
            stop();
            console.log(`${RED}ОШИБКА: ${e.message}${RESET}\n`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log(`${BOLD}${GREEN}ГОТОВО!${RESET}`);
}

main();