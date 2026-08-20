import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import inquirer from "inquirer";
import puppeteer from 'puppeteer';

const GREEN = "\x1b[32m", RESET = "\x1b[0m", CYAN = "\x1b[36m", RED = "\x1b[31m", YELLOW = "\x1b[33m";

const axiosConfig = {
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'referer': 'https://www.google.com/'
    }
};

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
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function downloadImage(url, folder, name) {
    try {
        let imageUrl = url;
        if (url.startsWith('//')) {
            imageUrl = 'https:' + url;
        } else if (url.startsWith('/')) {
            const baseDomain = new URL(url).origin;
            imageUrl = baseDomain + url;
        }

        const res = await axios.get(imageUrl, {
            ...axiosConfig,
            responseType: "arraybuffer",
            timeout: 15000,
            maxContentLength: 10 * 1024 * 1024
        });

        const filePath = path.join(folder, name);
        fs.writeFileSync(filePath, res.data);
        return name;
    } catch (err) {
        console.log(`${RED}ERROR: ${err} ${RESET}`);
        return null;
    }
}

async function scrapeDetails(url) {
    try {
        const { data } = await axios.get(url, axiosConfig);
        const $ = cheerio.load(data);

        const title = $('h1').first().text().trim();

        if (!title || title.length < 2) {
            console.log(`${RED}Пустой title${RESET}`);
            return null;
        }

        const bodyText = $('body').text();

        const getPropertyID = () => {
            const patterns = [
                () => {
                    const idMatch = bodyText.match(/Property\s*ID[:\s]*([\d\w-]+)/i);
                    return idMatch ? idMatch[1].trim() : "";
                },
                () => {
                    const overview = $('.property-overview, .overview, .property-details').first();
                    if (overview.length) {
                        const overviewText = overview.text();
                        const idMatch = overviewText.match(/Property\s*ID[:\s]*([\d\w-]+)/i);
                        if (idMatch) return idMatch[1].trim();
                    }
                    return "";
                },
                () => {
                    const idElements = $('[class*="id"], [class*="ID"]').filter((i, el) => {
                        const text = $(el).text().toLowerCase();
                        return text.includes('property id') || text.includes('property-id');
                    });
                    if (idElements.length) {
                        const text = idElements.first().text();
                        const idMatch = text.match(/(\d+)/);
                        return idMatch ? idMatch[1].trim() : "";
                    }
                    return "";
                },
                () => {
                    const dtElement = $('dt:contains("Property ID"), dt:contains("Property-ID")').first();
                    if (dtElement.length) {
                        const ddText = dtElement.next('dd').text().trim();
                        return ddText || "";
                    }
                    return "";
                },
                () => {
                    const strongElement = $('strong:contains("Property ID"), b:contains("Property ID")').first();
                    if (strongElement.length) {
                        const parentText = strongElement.parent().text();
                        const idMatch = parentText.match(/Property\s*ID[:\s]*([\d\w-]+)/i);
                        return idMatch ? idMatch[1].trim() : "";
                    }
                    return "";
                }
            ];

            for (const pattern of patterns) {
                const result = pattern();
                if (result && result.length > 0) {
                    return result;
                }
            }

            return "";
        };

        const getValByLabel = (label) => {
            const selectors = [
                $(`*:contains("${label}")`).filter((i, el) => {
                    const text = $(el).text().toLowerCase();
                    return text.includes(label.toLowerCase()) && text.length < 100;
                }),
                $('.property-info, .property-details, .property-overview, .overview').find(`*:contains("${label}")`),
                $(`.detail-${label.toLowerCase()}, .${label.toLowerCase()}-details`),
                $(`dt:contains("${label}") + dd`),
                $(`strong:contains("${label}")`).parent()
            ];

            for (const selector of selectors) {
                if (selector.length > 0) {
                    const element = selector.first();
                    const text = element.text().trim();
                    const numbers = text.match(/[\d,.]+/g);
                    if (numbers && numbers.length > 0) {
                        return numbers[0].replace(/[^\d.]/g, '').trim();
                    }
                    const siblingValue = element.next().text().trim() ||
                        element.parent().find('.value, .figure, .number').text().trim();
                    const siblingNumbers = siblingValue.match(/[\d,.]+/g);
                    if (siblingNumbers && siblingNumbers.length > 0) {
                        return siblingNumbers[0].replace(/[^\d.]/g, '').trim();
                    }
                }
            }

            return "";
        };

        const parseOverview = () => {
            const specs = {
                total_area: 0,
                bedrooms: 0,
                bathrooms: 0,
                year_built: null,
                property_id: "",
                property_type: ""
            };

            const overviewSelectors = [
                '.property-overview',
                '.overview',
                '.property-details',
                '.property-meta',
                '.specifications',
                '[class*="overview"]',
                '[class*="details"]'
            ];

            for (const selector of overviewSelectors) {
                if ($(selector).length > 0) {
                    const overviewHtml = $(selector).html();

                    const idMatch = overviewHtml.match(/Property\s*ID[:\s]*([\d\w-]+)/i) ||
                        bodyText.match(/Property\s*ID[:\s]*([\d\w-]+)/i);
                    if (idMatch) specs.property_id = idMatch[1].trim();

                    const typeMatch = overviewHtml.match(/Property\s*Type[:\s]*([^<]+)/i) ||
                        overviewHtml.match(/Property\s*Type.*?([\w\s]+)<|Property\s*Type.*?:\s*([\w\w\s]+)/i);
                    if (typeMatch) {
                        specs.property_type = (typeMatch[1] || typeMatch[2] || "").trim();
                    }

                    const bedMatch = overviewHtml.match(/Bedrooms.*?(\d+)/i) ||
                        bodyText.match(/(\d+)\s*Bedrooms?/i);
                    if (bedMatch) specs.bedrooms = parseInt(bedMatch[1]);

                    const bathMatch = overviewHtml.match(/Bathrooms.*?(\d+)/i) ||
                        bodyText.match(/(\d+)\s*Bathrooms?/i);
                    if (bathMatch) specs.bathrooms = parseInt(bathMatch[1]);

                    const areaMatch = overviewHtml.match(/(?:Area\s*Size|Property\s*Size|Size).*?([\d,.]+)\s*(?:sqm|m²|sq\s*ft|m2)/i) ||
                        bodyText.match(/([\d,.]+)\s*(?:sqm|m²|sq\s*ft|m2)/i);
                    if (areaMatch) {
                        specs.total_area = parseFloat(areaMatch[1].replace(/,/g, ''));
                    }

                    const yearMatch = overviewHtml.match(/Year\s*Built.*?(\d{4})/i) ||
                        bodyText.match(/Built.*?(\d{4})|Year.*?(\d{4})/i);
                    if (yearMatch) specs.year_built = parseInt(yearMatch[1] || yearMatch[2]);

                    break;
                }
            }

            return specs;
        };

        const parseLocation = () => {
            let address = "";
            let city = "";
            let zip = "";

            const addressSelectors = [
                '.property-address',
                '.address',
                '[class*="address"]',
                '.location',
                '.detail-address',
                'h1 + p',
                'h1 ~ p',
                '.hz-address',
                '[itemprop="address"]'
            ];

            for (const selector of addressSelectors) {
                if ($(selector).length > 0) {
                    const addressText = $(selector).text().trim();
                    if (addressText && addressText.length > 5) {
                        address = addressText;

                        const addressParts = address.split(',').map(p => p.trim());
                        if (addressParts.length > 1) {
                            city = addressParts[addressParts.length - 2] || "";
                            zip = addressParts[addressParts.length - 1] || "";

                            if (zip.match(/^\d{5}$/)) {
                                city = addressParts[addressParts.length - 3] || "";
                            }
                        }
                        break;
                    }
                }
            }

            if (!address) {
                const addressPatterns = [
                    /Street\s+([^,\n]+)/i,
                    /Address[:\s]+([^,\n]+)/i,
                    /Location[:\s]+([^,\n]+)/i
                ];

                for (const pattern of addressPatterns) {
                    const match = bodyText.match(pattern);
                    if (match && match[1]) {
                        address = match[1].trim();
                        break;
                    }
                }
            }

            const zipMatch = bodyText.match(/\b\d{5}\b/);
            if (zipMatch) zip = zipMatch[0];

            return { address, city: city || "Tenerife", zip };
        };

        const overviewData = parseOverview();
        const locationData = parseLocation();

        const propertyID = getPropertyID() || overviewData.property_id || getValByLabel("Property ID") || "";

        // const safeTitle = title.substring(0, 30);
        // const apartmentSlug = `${slugify(safeTitle)}`;
        const apartmentSlug = slugify(`${propertyID}-${title}`);

        // const apartmentFolder = path.join("data", "images", title);
        const apartmentFolder = path.join("data", "images", `${title}`);

        if (!fs.existsSync(apartmentFolder)) {
            fs.mkdirSync(apartmentFolder, { recursive: true });
        }

        const images = [];
        let imgSources = [];
        imgSources = await getImagesUrls(url);

        let idx = 1;
        for (const imgUrl of imgSources) {
            try {
                const urlObj = new URL(imgUrl);
                const pathname = urlObj.pathname;
                const originalExt = path.extname(pathname).toLowerCase();

                const ext = originalExt || '.jpg';
                const fileName = `${idx}${ext}`;

                const saved = await downloadImage(imgUrl, apartmentFolder, fileName);
                if (saved) {
                    images.push(`${title}/${fileName}`);
                }
                idx++;
                await delay(300);
            } catch (err) {
                console.log(`${RED}ERROR: ${err} ${RESET}`);
                continue;
            }
        }

        let priceAmount = 0;
        const priceSelectors = [
            '.property-price',
            '.price',
            '.item-price',
            '[class*="price"]',
            '.amount',
            'meta[property="price"]'
        ];

        for (const selector of priceSelectors) {
            if ($(selector).length > 0) {
                const priceText = $(selector).first().text();
                const priceMatch = priceText.match(/[\d,]+\.?\d*/);
                if (priceMatch) {
                    priceAmount = parseFloat(priceMatch[0].replace(/,/g, ''));
                    break;
                }
            }
        }

        if (!priceAmount) {
            const priceRegex = /(?:€|EUR|euro)\s*([\d,]+\.?\d*)/i;
            const match = bodyText.match(priceRegex);
            if (match) priceAmount = parseFloat(match[1].replace(/,/g, ''));
        }

        let description = "";

        const descriptionSelectors = [
            '.property-description-content',
            '.description-content',
            '.block-content-wrap',
            '.property-description',
            '[class*="description"]',
            '.entry-content',
            '.content'
        ];

        for (const selector of descriptionSelectors) {
            const descElement = $(selector).first();
            if (descElement.length > 0) {
                const textContent = descElement.find('p, h2, h3, h4, span, div').map((i, el) => {
                    return $(el).text().trim();
                }).get().join('\n\n');

                if (textContent && textContent.length > 100) {
                    description = textContent;
                    break;
                }

                const fullText = descElement.text().trim();
                if (fullText && fullText.length > 100) {
                    description = fullText;
                    break;
                }
            }
        }

        if (!description || description.length < 100) {
            const descriptionHeader = $('h2:contains("Description"), h3:contains("Description")').first();
            if (descriptionHeader.length > 0) {
                const nextContent = descriptionHeader.nextUntil('h2, h3').text().trim();
                if (nextContent && nextContent.length > 100) {
                    description = nextContent;
                }
            }
        }

        if (!description || description.length < 100) {
            description = $('body').text()
                .replace(/\t/g, ' ')
                .replace(/\n\s*\n/g, '\n')
                .replace(/[ \t]+/g, ' ')
                .trim()
                .substring(0, 2000);
        } else {
            description = description
                .replace(/\t/g, ' ')
                .replace(/\n\s*\n/g, '\n')
                .replace(/[ \t]+/g, ' ')
                .trim()
                .substring(0, 3000);
        }

        description = description
            .replace(/\+?\d[\d\s\-\(\)]{7,}\d/g, '')
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
            .replace(/\s{3,}/g, ' ')
            .trim();

        return {
            title,
            slug: apartmentSlug,
            property_id: propertyID, // ДОБАВЛЕНО: Property ID как отдельное поле
            description: description,
            images: images,
            image_folder: apartmentFolder,
            type: url.includes('rent') ? "rent" : "sale",
            property_status: "available",
            price: {
                amount: priceAmount || Number(getValByLabel("Price")) || 0,
                currency: "EUR"
            },
            specifications: {
                total_area: overviewData.total_area || Number(getValByLabel("Property Size")) || Number(getValByLabel("Area Size")) || 0,
                bedrooms: overviewData.bedrooms || Number(getValByLabel("Bedrooms")) || 0,
                bathrooms: overviewData.bathrooms || Number(getValByLabel("Bathrooms")) || 0,
                year_built: overviewData.year_built || Number(getValByLabel("Year Built")) || null,
                property_type: overviewData.property_type || getValByLabel("Property Type") || "",
                property_id: propertyID || ""
            },
            features: {
                has_pool: bodyText.toLowerCase().includes('pool') && !bodyText.toLowerCase().includes('no pool'),
                has_terrace: bodyText.toLowerCase().includes('terrace') || bodyText.toLowerCase().includes('balcony'),
                has_garage: bodyText.toLowerCase().includes('garage') || bodyText.toLowerCase().includes('parking'),
                has_garden: bodyText.toLowerCase().includes('garden'),
                has_ac: bodyText.toLowerCase().includes('air conditioning') || bodyText.toLowerCase().includes('a/c'),
                furnished: bodyText.toLowerCase().includes('furnished') && !bodyText.toLowerCase().includes('unfurnished'),
                sea_view: bodyText.toLowerCase().includes('sea view') || bodyText.toLowerCase().includes('ocean view')
            },
            location: {
                address: locationData.address || "Tenerife",
                city: locationData.city,
                region: "Tenerife",
                postal_code: locationData.zip
            },
            contact: {
                phone: "+34604972372",
                whatsapp: "+34604972372",
                telegram: "@adamsvts",
                email: 'adamsavitskiy@gmail.com'
            },
            source_url: url,
            scraped_at: new Date().toISOString()
        };
    } catch (err) {
        console.log(`${RED}ERROR: ${err} ${RESET}`);
        return null;
    }
}

async function getAllLinks(startUrl) {
    const allLinks = new Set();
    let page = 1;
    const baseUrl = startUrl.split('?')[0].replace(/\/page\/\d+\//, '/');
    const query = startUrl.includes('?') ? startUrl.substring(startUrl.indexOf('?')) : '';

    while (true) {
        const url = page === 1 ? `${baseUrl}${query}` : `${baseUrl}page/${page}/${query}`;
        try {
            const { data } = await axios.get(url, axiosConfig);
            const $ = cheerio.load(data);
            const pageLinks = [];

            $('a[href*="/property/"], .property-link, .item a, h3 a, .title a, .listing-title a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.includes('/property/')) {
                    const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
                    pageLinks.push(fullUrl);
                }
            });

            if (pageLinks.length === 0) break;
            const sizeBefore = allLinks.size;
            pageLinks.forEach(l => allLinks.add(l));
            if (allLinks.size === sizeBefore && page > 1) break;
            page++;
            await delay(500);
        } catch (e) {
            break;
        }
    }
    return Array.from(allLinks);
}

async function main() {
    console.clear();

    const { url } = await inquirer.prompt([{
        type: 'input',
        name: 'url',
        message: 'Введите URL:',
        prefix: '',
        validate: input => input.includes('http') ? true : 'Пожалуйста, введите корректный URL'
    }]);

    const mainDataFolder = "./data";
    const mainImagesFolder = "./data/images";

    if (!fs.existsSync(mainDataFolder)) {
        fs.mkdirSync(mainDataFolder, { recursive: true });
    }

    if (!fs.existsSync(mainImagesFolder)) {
        fs.mkdirSync(mainImagesFolder, { recursive: true });
    }

    console.log(`${CYAN}Поиск...${RESET}`);
    const links = await getAllLinks(url);

    if (links.length === 0) {
        console.log(`${RED}Не найдено ссылок${RESET}`);
        return;
    }

    console.log(`${GREEN}Найдено: ${links.length}${RESET}\n`);

    const results = [];
    for (let i = 0; i < links.length; i++) {
        console.log(`\r${CYAN}Парсинг ${i + 1}/${links.length}${RESET}`);
        const res = await scrapeDetails(links[i]);
        if (res && res.title && res.title.length > 2) {
            results.push(res);
        }
        await delay(800);
    }

    results.forEach(item => {
        if (item.images.length === 0 && item.image_folder) {
            const folderPath = path.join("data", "images", item.image_folder);
            if (fs.existsSync(folderPath)) {
                try {
                    fs.rmdirSync(folderPath, { recursive: true });
                } catch (e) {
                }
            }
        }
    });
    const output = `./data/properties.json`;
    fs.writeFileSync(output, JSON.stringify(results, null, 4));

    console.log(`\n${GREEN}ГОТОВО!${RESET}`);
    console.log(`${CYAN}Объектов сохранено: ${results.length}${RESET}`);

    const totalImages = results.reduce((sum, item) => sum + item.images.length, 0);
    console.log(`${CYAN}Изображений скачано: ${totalImages}${RESET}`);
    console.log(`${CYAN}Файл: ${output}${RESET}`);
}

async function getImagesUrls(url)
{
    let images = [];
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000
    });

    images = await page.$$eval(
        'ul.lSPager.lSGallery img',
        imgs => imgs.map(img => img.src)
    );

    if(images.length !== 0 ){
        images = images.map(src =>
            src
                .replace(/\?.*$/, '')
                .replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp))/i, '')
        );
    }
    await browser.close();
    return images?? [];
}

main();