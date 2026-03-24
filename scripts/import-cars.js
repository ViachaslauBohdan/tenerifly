import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import FormData from "form-data";
import fetch from "node-fetch";

const STRAPI_URL = "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";
const LOCALES = ['en', 'ru', 'uk', 'fr', 'pl', 'es', 'de'];

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";

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

async function askPaths() {
    return inquirer.prompt([
        {
            type: "input",
            name: "jsonPath",
            message: "Enter path to JSON file:",
            default: './imports/cars/Aliscars/cars_with_locales.json'
        },
        {
            type: "input",
            name: "imagesPath",
            message: "Enter path to images folder:",
            default: './imports/cars/Aliscars/images'
        },
    ]);
}

async function uploadImageToStrapi(filePath) {
    try {
        const formData = new FormData();
        formData.append("files", fs.createReadStream(filePath));
        const res = await fetch(`${STRAPI_URL}/api/upload`, {
            method: "POST",
            headers: {"Authorization": `Bearer ${API_TOKEN}`, ...formData.getHeaders()},
            body: formData
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data[0]?.id;
    } catch (e) {
        console.error(`\n${RED}Ошибка: ${e.message}${RESET}`);
        return [];
    }
}
async function findImageBySlug(slug, directoryPath) {
    try {
        const files = await fs.promises.readdir(directoryPath);
        const slugRegex = new RegExp(slug.replaceAll("-", "_"), 'i');
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const foundImage = files.find(file => {
            const ext = path.extname(file).toLowerCase();
            return slugRegex.test(file) && imageExtensions.includes(ext);
        });

        if (foundImage) {
            const imagePath = path.join(directoryPath, foundImage);
            return {
                found: true,
                filename: foundImage,
                path: imagePath,
                fullPath: path.resolve(imagePath)
            };
        } else {
            console.log(`❌ Изображение для "${slug.replaceAll("-", "_")}" не найдено в директории ${directoryPath}`);
            return {
                found: false,
                message: `Изображение для "${slug.replaceAll("-", "_")}" не найдено`
            };
        }
    } catch (error) {
        console.error(`❌ Ошибка при чтении директории ${directoryPath}:`, error.message);
        return {
            found: false,
            error: error.message
        };
    }
}

async function getImagesByCar(directory, car) {
    try {
        const image = await findImageBySlug(car.slug, directory);
        if (image?.found === true) {
            return [image.fullPath];
        }
        let formatedFolder = formatCarImageFolderName(car);
        let folderPath = path.join(directory, formatedFolder);

        if (fs.existsSync(folderPath)) {
            return fs.readdirSync(folderPath)
                .filter(file => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase()))
                .map(file => path.join(folderPath, file));
        }
        if (car.specifications.transmission === 'automatic') {
            const manualCar = {
                ...car,
                specifications: {
                    ...car.specifications,
                    transmission: 'manual'
                }
            };

            const manualFolder = formatCarImageFolderName(manualCar);
            const manualFolderPath = path.join(directory, manualFolder);

            if (fs.existsSync(manualFolderPath)) {
                console.log(`${CYAN}⚠️ Using manual folder for automatic car: ${manualFolder}${RESET}`);
                return fs.readdirSync(manualFolderPath)
                    .filter(file => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase()))
                    .map(file => path.join(manualFolderPath, file));
            }
        }
        console.error(`❌ Directory not found: ${folderPath}`);
        return [];

    } catch (error) {
        console.error('❌ Error on read directory:', error.message);
        return [];
    }
}

const formatCarImageFolderName = (car) => {
    if (!car?.specifications) return '';

    const {make, model, transmission, year} = car.specifications;
    if (!make || !model || !year) return '';

    const processedMake = make === 'Volkswagen' ? 'VW' : make;
    const baseString = `${processedMake}_${model}`.replace(/\s+/g, '_');

    if (transmission?.toLowerCase() === 'automatic') {
        return `${baseString}_${year}_Automatic`;
    }

    return `${baseString}_${year}`;
};

async function uploadImages(dir, car) {
    const imagesIds = [];
    const images = await getImagesByCar(dir, car);
    console.log(images);
    if (images.length > 0) {
        for (const img of images) {
            const stopUploadSpinner = createSpinner(`Upload images to strapi...`);
            const imgId = await uploadImageToStrapi(img);
            stopUploadSpinner();
            if (imgId) {
                imagesIds.push(imgId);
            } else {
                console.log(`${RED} ❌ ${img} - Ошибка${RESET}`);
            }
        }
    }
    return imagesIds;
}

async function createAndPublish(car, imageIds) {
    const slug_prefix = '';
    const payload = {
        title: car.title,
        slug: slug_prefix + car.slug,
        description: car.description.en,
        type: car.type,
        car_status: "available",
        images: imageIds,
        rental_prices: {
            currency: car.rental_prices.currency,
            day_1: Number(car.rental_prices.day_1),
            day_2: Number(car.rental_prices.day_2),
            day_3: Number(car.rental_prices.day_3),
            day_4: Number(car.rental_prices.day_4),
            day_5: Number(car.rental_prices.day_5),
            day_6: Number(car.rental_prices.day_6),
            day_7: Number(car.rental_prices.day_7),
        },
        specifications: {
            make: car.specifications.make,
            model: car.specifications.model,
            year: Number(car.specifications.year),
            fuel: car.specifications.fuel,
            transmission: car.specifications.transmission,
            seats: Number(car.specifications.seats)
        },
        rental_terms: {
            min_rental_period: Number(car.rental_terms.min_rental_period),
            period_unit: car.rental_terms.period_unit,
            deposit_amount: Number(car.rental_terms.deposit_amount),
            includes_insurance: Boolean(car.rental_terms.includes_insurance),
        },
        contact: {
            name: car.contact.name,
            phone: car.contact.phone
        }
    };

    try {
        const spinner = createSpinner("Creating ...");
        const draft = await createCarRequest(payload);
        spinner();
        console.log(`${GREEN} Successfully Created ${RESET}`);
        for (const locale of LOCALES) {
            if (locale === 'en') {
                continue;
            }
            const spinner = createSpinner(`Creating Locale: ${locale} ...`);
            payload.description = car.description[locale];
            await createCarLocaleRequest(payload, draft.data.documentId, locale);
            spinner();
        }

        return draft.data.documentId
    } catch (error) {
        console.error('❌ Create Error:', error.message);
        return process.exit(1);
    }
}

async function createCarRequest(data) {
    const res = await fetch(`${STRAPI_URL}/api/cars`, {
        method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${API_TOKEN}`},
        body: JSON.stringify({data}),
    });
    if (!res.ok) throw new Error(`Ошибка сервера: ${await res.text()}`);
    return res.json();
}

async function createCarLocaleRequest(data, documentId, locale) {
    const res = await fetch(`${STRAPI_URL}/api/cars/${documentId}?locale=${locale}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${API_TOKEN}`},
        body: JSON.stringify({data}),
    });
    if (!res.ok) throw new Error(`Ошибка сервера: ${await res.text()}`);
    return res.json();
}

async function processImportCars() {
    const {jsonPath, imagesPath} = await askPaths();
    const cars = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    for (const car of cars) {
        console.log(`${GREEN} ${car.title} ${RESET}`);
        const imagesIds = await uploadImages(imagesPath, car);
        if (imagesIds.length > 0) {
            const id = await createAndPublish(car, imagesIds.reverse());
            console.log(`${GREEN} DocID: ${id} ${RESET}`);
            console.log(`${GREEN} --- Successfully published ---  ${RESET}`);
        }else{
            console.log(`${RED} !!! images did not uploaded  !!!  ${RESET}`);
        }
    }
}

processImportCars()
    .then(() => console.log('DONE'))
    .catch(err => console.dir(err.response?.data || err, {depth: null}));