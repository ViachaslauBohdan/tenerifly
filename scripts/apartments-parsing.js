import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import inquirer from "inquirer";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";

const axiosConfig = {
    headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
};

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

async function scrapeFullSinglePage(url) {
    try {
        const {data} = await axios.get(url, axiosConfig);
        const $ = cheerio.load(data);

        const apartment = {
            sourceUrl: url,
            title: $('h1').first().text().trim(),
            price: $('.item-price').first().text().trim(),
            description: $('.block-content-wrap').first().text().trim(),
            details: {},
            amenities: [],
            location: {
                address: $('.property-address').text().trim(),
                city: '',
                area: ''
            },
            images: []
        };

        $('.property-meta.list-unstyled li').each((_, el) => {
            const label = $(el).find('strong').text().replace(':', '').trim().toLowerCase().replace(/\s+/g, '_');
            const value = $(el).text().split(':').pop().trim();
            if (label) apartment.details[label] = value;
        });

        $('.list-features li').each((_, el) => {
            const amenity = $(el).text().trim();
            if (amenity) apartment.amenities.push(amenity);
        });

        $('.breadcrumb li').each((i, el) => {
            const text = $(el).text().trim();
            if (i === 1) apartment.location.city = text;
            if (i === 2) apartment.location.area = text;
        });

        const photoSet = new Set();
        $('a[data-fancybox], img').each((_, el) => {
            let src = $(el).attr('href') || $(el).attr('src') || $(el).attr('data-lazy-src') || $(el).attr('data-src');
            if (src && src.includes('/uploads/')) {
                let originalSize = src.split('?')[0].replace(/-\d+x\d+(\.(jpg|jpeg|png|webp))$/i, '$1');
                if (!originalSize.includes('logo') && !originalSize.includes('avatar')) {
                    photoSet.add(originalSize);
                }
            }
        });
        apartment.images = Array.from(photoSet);

        return apartment;
    } catch (e) {
        return null;
    }
}

async function main() {
    console.clear();

    const {targetUrl} = await inquirer.prompt([{
        type: 'input',
        name: 'targetUrl',
        prefix: '',
        message: 'Введите URL страницы со списком апартаментов:',
        validate: (input) => {
            if (!input.trim()) return `${RED}Ошибка: Ссылка не может быть пустой!${RESET}`;
            if (!input.startsWith('http')) return `${RED}Ошибка: Введите корректный URL${RESET}`;
            return true;
        }
    }]);

    const stopList = createSpinner("Сканирование...");

    try {
        const {data} = await axios.get(targetUrl, axiosConfig);
        const $ = cheerio.load(data);
        const links = [];

        $('.item-title a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('/property/')) links.push(href);
        });

        stopList();

        if (links.length === 0) {
            console.log(`${RED}На этой странице объекты не найдены.${RESET}`);
            return;
        }

        console.log(`${GREEN}Найдено ссылок: ${links.length}${RESET}\n`);

        const db = [];

        for (let i = 0; i < links.length; i++) {
            const currentUrl = links[i];
            const stopSingle = createSpinner(`[${i + 1}/${links.length}] парсинг: ${path.basename(currentUrl)}`);

            const fullData = await scrapeFullSinglePage(currentUrl);
            stopSingle();

            if (fullData && fullData.title) {
                db.push(fullData);
                console.log(`${GREEN}  ✓ ${fullData.title} | ${fullData.images.length} фото${RESET}`);
            }

            await new Promise(r => setTimeout(r, 1200));
        }

        const folderName = "parsed_apartments_data";
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }

        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        const fileName = `${dateStr}.json`;
        const outputPath = path.join(folderName, fileName);

        fs.writeFileSync(outputPath, JSON.stringify(db, null, 4), 'utf-8');

        console.log(`\n${CYAN}ЗАВЕРШЕНО!${RESET}`);
        console.log(`Папка: ${GREEN}${folderName}${RESET}`);
        console.log(`Файл: ${GREEN}${fileName}${RESET}`);

    } catch (err) {
        console.error(`\n${RED}Ошибка запроса: ${err.message}${RESET}`);
    }
}

main();