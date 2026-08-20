import fs from "fs";
import readline from  "readline";
import inquirer from "inquirer";

const API_URL = "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

const RED = "\x1b[31m", GREEN = "\x1b[32m", RESET = "\x1b[0m", YELLOW = "\x1b[33m", CYAN = "\x1b[36m", DIM = "\x1b[2m";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));


function isEmpty(field, val) {
    if (!val) return true;
    if (typeof val === 'object') {
        if (Object.keys(val).length === 0) return true;
        if (field === 'specifications') return !val.total_area && !val.bedrooms;
        if (field === 'location') return !val.address || val.address.length < 3;
    }
    return false;
}

function cleanData(field, data) {
    if (!data) return null;

    if (field === 'features') {
        return {
            has_pool: !!data.has_pool,
            has_air_conditioning: !!(data.has_ac || data.has_air_conditioning),
            has_internet: !!data.has_internet,
            furnished: !!data.furnished
        };
    }

    if (field === 'specifications') {
        return {
            total_area: parseFloat(data.total_area) || 0,
            bedrooms: parseInt(data.bedrooms) || 0,
            bathrooms: parseInt(data.bathrooms) || 0,
            floor: parseInt(data.floor) || 0
        };
    }

    if (field === 'location') {
        let rawAddr = String(data.address || "");
        let cleanAddr = rawAddr.split(/[\n\t\r]/)[0].trim();
        const parts = cleanAddr.split(',');
        if (parts.length > 4 && parts[0].trim() === parts[Math.floor(parts.length/2)].trim()) {
            cleanAddr = parts.slice(0, Math.floor(parts.length/2)).join(',').trim();
        }

        return {
            address: cleanAddr || "Tenerife",
            city: String(data.city || "").split(/[\n\t]/)[0].trim(),
            region: String(data.region || "Tenerife").trim()
        };
    }

    if (field === 'contact') {
        return {
            name:'Adam Savytskyi',
            phone:"+34604972372",
            whatsapp:"+34604972372",
            email:"adamsavitskiy@gmail.com",
            telegram:"@adamsvts",
            preferred_contact:"telegram",
        };
    }
    return data;
}

async function main() {
    console.log(`${CYAN}Загрузка...${RESET}`);
    const res = await fetch(`${API_URL}/api/properties?populate=*&pagination[limit]=100`, {
        headers: { "Authorization": `Bearer ${API_TOKEN}` }
    });
    const { data: props } = await res.json();

    const targets = props.filter(p => {
        const a = p.attributes || p;
        return ['description', 'specifications', 'features', 'location', 'contact'].some(f => isEmpty(f, a[f]));
    }).map(p => {
        const a = p.attributes || p;
        return { id: p.id, docId: p.documentId || p.id, title: a.title, attr: a };
    });

    if (targets.length === 0) {
        console.log(`${GREEN}Все данные заполнены.${RESET}`);
        process.exit();
    }
    console.log(`${YELLOW}Найдены с пустыми полями:${RESET}`);

    targets.forEach((t, i) => console.log(`${DIM} ${t.title}${RESET}`));
    const confirm = await ask(`\n${YELLOW}Заполнить эти объекты? (Y/N): ${RESET}`);
    if (!['д', 'y', 'Y','l', 'да', 'yes'].includes(confirm.toLowerCase())) {
        console.log("Отменено.");
        process.exit();
    }

    const { filePath } = await inquirer.prompt([{
        type: 'input',
        name: 'filePath',
        prefix: '',
        message: 'Введите путь к файле (*.json) :',
        default: './data/properties.json'
    }]);
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        for (const item of targets) {
            data.some(apart => {
                if(apart?.title === item.title) {
                    let updateData = {};
                    ['description', 'specifications', 'features', 'location', 'contact'].forEach(f => {
                        if (isEmpty(f, item.attr[f]) && apart[f]) {
                            updateData[f] = cleanData(f, apart[f]);
                        }
                    });
                    const updated = save(item.docId, updateData);
                    if(updated) {
                        console.log(`${GREEN}[ОБНОВЛЕНО]${RESET} ${item.title}`);
                    }else{
                        console.log(`${GREEN}[ОШИБКА]${RESET} ${item.title}`);
                    }
                    return true;
                }
                return false;
            });
        }
    } catch (err) {
        console.error('JSON error:', err.message);
        return;
    }
    process.exit();
}
async function save(id, data)
{
    console.log(`${GREEN}[save...]${RESET}`);
    try {
        const putRes = await fetch(`${API_URL}/api/properties/${id}`, {
            method: 'PUT',
            headers: { "Authorization": `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify({ data: data })
        });

        if (putRes.ok) {
            console.log(`${GREEN}[ОБНОВЛЕНО]${RESET} ${id}`);
            return true;
        } else {
            const err = await putRes.json();
            console.log(`${RED}[ОШИБКА ${putRes.status}]${RESET} ${id}`);
            console.log(`${DIM}Причина: ${err.error?.message || "Internal Error"}${RESET}`);
        }
    } catch (e) {
        console.log(`${RED}[ОШИБКА] ${e.error?.message} ${RESET} ${id}`);
    }
    return false;
}

main().catch(console.error);