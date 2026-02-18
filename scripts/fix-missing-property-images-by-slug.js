import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import fetch from "node-fetch";
import FormData from "form-data";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const HEADERS = { "Authorization": `Bearer ${API_TOKEN}` };

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";

function slugify(text) {
    return text
        .toString()                     // Cast to string
        .toLowerCase()                  // Convert the string to lowercase letters
        .normalize('NFD')               // Split accented letters into the base letter and the accent
        .replace(/[\u0300-\u036f]/g, '') // Remove all previously split accents (diacritical marks)
        .replace(/[^a-z0-9 -]/g, '')    // Remove all chars not letters, numbers, and spaces (to be replaced)
        .trim()                         // Trim leading and trailing whitespace
        .replace(/\s+/g, '-')           // Replace spaces with a single hyphen
        .replace(/-+/g, '-');           // Replace multiple hyphens with a single hyphen
}

function findMatchingFolder(propertySlug, basePath) {
    // const normalizedTitle = slugify(propertySlug);
    // if (!normalizedTitle) return null;
    try {
        const folders = fs.readdirSync(basePath, { withFileTypes: true }).filter(item => item.isDirectory());
        for (const folder of folders) {
            const normalizedFolder = slugify(folder.name);
            if (normalizedFolder === propertySlug || normalizedFolder.includes(propertySlug) || propertySlug.includes(normalizedFolder)) {
                console.log(folder.name)
                return path.join(basePath, folder.name);
            }
        }
    } catch (e) { return null; }
    return null;
}

function getPhotosFromFolder(folderPath) {
    try {
        return fs.readdirSync(folderPath)
            .filter(file => ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(path.extname(file).toLowerCase()))
            .map(file => path.join(folderPath, file));
    } catch (e) { return []; }
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

async function uploadImageToStrapi(filePath) {
    try {
        const formData = new FormData();
        formData.append("files", fs.createReadStream(filePath));
        const res = await fetch(`${API_URL}/api/upload`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${API_TOKEN}`, ...formData.getHeaders() },
            body: formData
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data[0]?.id;
    } catch (e) { return null; }
}

async function updatePropertyImages(property, imageIds) {
    const targetId = property.documentId || property.id;
    const url = `${API_URL}/api/properties/${targetId}`;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify({ data: { images: imageIds } }),
        });
        return res.ok;
    } catch (error) { return false; }
}

async function main() {
    console.clear();
    const stopInitialLoad = createSpinner("Загрузка данных из Strapi...");

    try {
        const response = await fetch(`${API_URL}/api/properties?pagination[pageSize]=1000&populate=*`, { headers: HEADERS });
        const json = await response.json();
        stopInitialLoad();

        const properties = json.data || [];

        const broken = properties.filter(p => {
            const attr = p.attributes || p;
            const imagesData = attr.images?.data || attr.images;
            if (!imagesData || (Array.isArray(imagesData) && imagesData.length === 0)) return true;
            const firstImg = Array.isArray(imagesData) ? imagesData[0] : imagesData;
            const url = firstImg?.attributes?.url || firstImg?.url || "";
            return url.startsWith('/uploads/');
        });

        if (broken.length === 0) {
            console.log(`${GREEN}Все изображения в порядке.${RESET}`);
            return;
        }

        console.log(`\nНАЙДЕНО ${broken.length} ОБЪЕКТОВ СО СЛОМАННЫМИ ФОТО:`);
        broken.forEach((p, i) => {
            const attr = p.attributes || p;
            console.log(`${i + 1}. [ID: ${p.id}] ${attr.title || 'Без названия'}`);
        });

        const { photosPath } = await inquirer.prompt([{
            type: 'input',
            name: 'photosPath',
            prefix: '',
            message: 'Введите путь к папке с изображениями:',
            default: '../images'
        }]);

        const absolutePath = path.resolve(photosPath);

        const { confirmAction } = await inquirer.prompt([{
            type: 'rawlist',
            name: 'confirmAction',
            prefix: '',
            message: `Начать обновление ${broken.length} объектов?`,
            choices: [
                { name: 'Да', value: true },
                { name: 'Нет', value: false }
            ],
            default: 0
        }]);

        if (!confirmAction) return;

        let successCount = 0;

        for (const [index, prop] of broken.entries()) {
            const attr = prop.attributes || prop;
            const slug = attr.slug;
            const folder = findMatchingFolder(slug, absolutePath);
            console.log(folder + " folder");
            if (!folder) {
                console.log(`${RED}  ❌[${index + 1}/${broken.length}] По названию ${slug} папка не обнаружена в  указанной папке.${RESET}`);
                continue;
            }

            const localPhotos = getPhotosFromFolder(folder);

            if (localPhotos.length === 0) {
                console.log(`${RED}  ❌ Фото не найдены в папке: ${path.basename(folder)}${RESET}`);
                continue;
            }

            console.log(`${CYAN}  📸 Найдено ${localPhotos.length} фото. Подготовка к загрузке...${RESET}`);

            const uploadedIds = [];
            for (const photoPath of localPhotos) {
                const fileName = path.basename(photoPath);
                const stopUploadSpinner = createSpinner(`Загрузка ${fileName}...`);

                const id = await uploadImageToStrapi(photoPath);
                stopUploadSpinner();

                if (id) {
                    uploadedIds.push(id);
                    console.log(`${GREEN}    ${fileName} - OK${RESET}`);
                } else {
                    console.log(`${RED}    ❌ ${fileName} - Ошибка${RESET}`);
                }
            }

            if (uploadedIds.length > 0) {
                const stopUpdateSpinner = createSpinner("Привязка фото к апартаменту...");
                const success = await updatePropertyImages(prop, uploadedIds);
                stopUpdateSpinner();

                if (success) {
                    console.log(`${GREEN} Успешно обновлено!${RESET}`);
                    successCount++;
                } else {
                    console.log(`${RED}  ❌ Ошибка финального сохранения в Strapi${RESET}`);
                }
            }
        }

        console.log(`ОБРАБОТКА ЗАВЕРШЕНА!`);
        console.log(`Обновлено объектов: ${successCount}`);
        console.log(`Пропущено: ${broken.length - successCount}`);

    } catch (err) {
        stopInitialLoad();
        console.error(`\n${RED}Ошибка: ${err.message}${RESET}`);
    }
}

main();
