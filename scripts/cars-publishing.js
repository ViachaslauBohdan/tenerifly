const STRAPI_URL = "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";
const CONTENT_TYPE = 'cars';

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
};

async function processStrictlyOnlyEnglishCars() {
    try {
        const localesRes = await fetch(`${STRAPI_URL}/api/i18n/locales`, { headers });
        const localesData = await localesRes.json();
        const allCodes = localesData.map(l => l.code);
        console.log(`🌍 Языки в системе: ${allCodes.join(', ')}`);

        let allCars = [];
        let page = 1;
        let pageCount = 1;

        console.log('📦 Загружаю список машин для проверки...');

        while (page <= pageCount) {
            const url = `${STRAPI_URL}/api/${CONTENT_TYPE}?locale=en&populate=localizations&pagination[page]=${page}&pagination[pageSize]=100`;
            const res = await fetch(url, { headers });
            const result = await res.json();

            allCars = allCars.concat(result.data);
            pageCount = result.meta.pagination.pageCount;
            page++;
        }

        const carsToProcess = allCars.filter(car => {
            const existingLocalesCount = car.localizations ? car.localizations.length : 0;
            return existingLocalesCount === 0;
        });

        console.log(`🚗 Всего машин в базе: ${allCars.length}`);
        console.log(`🎯 Машин "Только English" (без переводов): ${carsToProcess.length}`);

        if (carsToProcess.length === 0) {
            console.log('✅ Машин без переводов не осталось.');
            return;
        }

        for (let i = 0; i < carsToProcess.length; i++) {
            const car = carsToProcess[i];
            const docId = car.documentId;
            const carName = car.title || car.Name || "Unknown Car";

            console.log(`\n[${i + 1}/${carsToProcess.length}] 🛠 Загрузка...: "${carName}"`);

            for (const locale of allCodes) {
                if (locale === 'en') continue;

                try {
                    const putUrl = `${STRAPI_URL}/api/${CONTENT_TYPE}/${docId}?locale=${locale}`;
                    const response = await fetch(putUrl, {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify({
                            data: {
                                title: carName,
                                publishedAt: new Date().toISOString()
                            }
                        })
                    });

                    if (response.ok) {
                        console.log(`   ✅ [${locale}] - OK`);
                    } else {
                        console.log(`   ❌ [${locale}] - Ошибка статуса: ${response.status}`);
                    }
                } catch (err) {
                    console.error(`   ❌ [${locale}] - Ошибка:`, err.message);
                }
            }
        }

        console.log('\n✨ Готово! Все "одинокие" английские карточки теперь переведены.');

    } catch (e) {
        console.error('💥 Ошибка:', e.message);
    }
}

processStrictlyOnlyEnglishCars();