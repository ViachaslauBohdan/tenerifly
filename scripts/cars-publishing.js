import inquirer from "inquirer";
import fetch from "node-fetch";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

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

async function getDraftCars() {
    const res = await fetch(`${API_URL}/api/cars?publicationState=preview&filters[publishedAt][$null]=true`, {
        headers: { "Authorization": `Bearer ${API_TOKEN}` }
    });
    if (!res.ok) throw new Error("Ошибка при получении списка черновиков");
    const json = await res.json();
    return json.data || [];
}

async function publishCar(documentId) {
    const res = await fetch(`${API_URL}/api/cars/${documentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
            data: {
                publishedAt: new Date().toISOString()
            }
        }),
    });
    return res.ok;
}

async function main() {
    console.clear();
    console.log(`${BOLD}${YELLOW}--- ПУБЛИКАЦИЯ ЧЕРНОВИКОВ (CARS) ---${RESET}\n`);

    const stopLoading = createSpinner("Поиск машин в статусе Draft...");
    let drafts = [];
    try {
        drafts = await getDraftCars();
    } catch (err) {
        stopLoading();
        console.error(`${RED}Ошибка: ${err.message}${RESET}`);
        return;
    }
    stopLoading();

    if (drafts.length === 0) {
        console.log(`${GREEN}Все машины уже опубликованы!${RESET}`);
        return;
    }

    console.log(`${CYAN}Найдено черновиков: ${drafts.length}${RESET}`);
    drafts.forEach((car, i) => {
        const attr = car.attributes || car;
        console.log(`${i + 1}. [ID: ${car.id}] ${attr.title}`);
    });

    const { confirmPublish } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmPublish',
        message: `Вы уверены, что хотите опубликовать все эти машины (${drafts.length} шт.)?`,
        default: false
    }]);

    if (!confirmPublish) {
        console.log(`${YELLOW}Действие отменено.${RESET}`);
        return;
    }

    let successCount = 0;
    for (const car of drafts) {
        const attr = car.attributes || car;
        const docId = car.documentId || car.id;

        const stopSpinner = createSpinner(`Публикация: ${attr.title}...`);
        const success = await publishCar(docId);
        stopSpinner();

        if (success) {
            console.log(`${GREEN}  ✓ ${attr.title} опубликована${RESET}`);
            successCount++;
        } else {
            console.log(`${RED}  ❌ Ошибка при публикации ${attr.title}${RESET}`);
        }
    }

    console.log(`\n${BOLD}${GREEN}Готово! Опубликовано: ${successCount} из ${drafts.length}${RESET}`);
}

main();