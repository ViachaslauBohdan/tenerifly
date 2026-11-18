# Автоматическое определение районов апартаментов / Automatic District Detection for Apartments

## Описание проблемы / Problem Description

**RU:** В базе данных хранятся апартаменты с адресами и городами, но районы (муниципалитеты) не заполнены или указаны как "Tenerife" (слишком общее значение). Это создает проблемы для:
- Фильтрации апартаментов по районам на сайте
- Синхронизации с Битрикс24 (B24)
- Удобства работы менеджеров и клиентов

**EN:** Apartments in the database have addresses and cities, but districts (municipalities) are not filled or marked as "Tenerife" (too generic). This creates problems for:
- Filtering apartments by district on the website
- Synchronization with Bitrix24 (B24)
- Convenience for managers and clients

## Решение / Solution

Реализована система автоматического определения района на основе города и адреса апартамента. Система включает:

### 1. Библиотека определения районов / District Detection Library

**Файл:** `src/lib/districtDetection.ts`

Содержит:
- Полный справочник районов Тенерифе и их городов
- Функцию `detectDistrict()` для автоматического определения района
- Вспомогательные функции для работы с районами

**Пример использования / Usage Example:**

```typescript
import { detectDistrict } from '@/lib/districtDetection';

// Определение района по городу
const district = detectDistrict('Los Gigantes', '');
// Результат: "Santiago del Teide"

// Определение района по адресу
const district2 = detectDistrict('Tenerife', 'Playa de las Americas');
// Результат: "Costa Adeje"

// Если район не может быть определен
const district3 = detectDistrict('Unknown City', '');
// Результат: null
```

### 2. Скрипты для анализа и обновления / Analysis and Update Scripts

#### Анализ текущего состояния / Current State Analysis

**Файл:** `scripts/analyze-apartment-locations.js`

```bash
node scripts/analyze-apartment-locations.js
```

**Что делает:**
- Загружает все апартаменты из Strapi
- Анализирует адреса и города
- Определяет районы автоматически
- Показывает статистику и проблемные апартаменты
- Сохраняет результаты в `data/location-analysis.json`

**Результат последнего анализа:**
- Всего апартаментов: 130
- С городом: 130 (100%)
- С адресом: 66 (51%)
- Район автоматически определен: 127 (98%)
- Требуют ручной проверки: 3 (2%)

#### Обновление районов / District Update

**Файл:** `scripts/update-apartment-districts.js`

```bash
node scripts/update-apartment-districts.js
```

**Что делает:**
- Загружает все апартаменты
- Определяет районы автоматически
- Показывает что будет изменено
- Запрашивает подтверждение
- Обновляет районы в Strapi
- Сохраняет лог изменений

**⚠️ ВАЖНО:** Скрипт обновляет данные в базе! Перед запуском убедитесь, что проверили результаты анализа.

## Покрытие районов / District Coverage

### Южные районы / South Districts

- **Costa Adeje** (60 апартаментов)
  - Costa Adeje, Playa de las Américas, Las Americas
  - Playa del Duque, El Duque
  - Playa Paraiso, San Eugenio
  - Fañabé, Torviscas

- **Santiago del Teide** (44 апартамента)
  - Puerto de Santiago
  - Los Gigantes
  - Playa de la Arena
  - Tamaimo

- **Arona** (6 апартаментов)
  - Los Cristianos
  - Chayofa
  - Los Abrigos
  - Las Galletas, Palm-Mar

- **Adeje** (6 апартаментов)
  - Adeje
  - Callao Salvaje
  - Los Menores, La Jaca
  - La Caleta

- **Guía de Isora** (4 апартамента)
  - Playa San Juan / Playa de San Juan
  - Alcalá

### Другие районы / Other Districts

- San Miguel de Abona (Golf del Sur, Amarilla Golf)
- Granadilla de Abona (El Médano)
- Puerto de la Cruz
- La Orotava
- Santa Cruz de Tenerife
- La Laguna
- И другие северные и центральные районы

## Использование в коде / Using in Code

### 1. Определение района при загрузке данных

```typescript
// В компонентах каталога
import { detectDistrict } from '@/lib/districtDetection';

properties.forEach(property => {
  if (property.location) {
    const autoDistrict = detectDistrict(
      property.location.city,
      property.location.address
    );
    
    // Использовать autoDistrict для фильтрации или отображения
    if (!property.location.region || property.location.region === 'Tenerife') {
      property.location.region = autoDistrict || 'Tenerife';
    }
  }
});
```

### 2. Интеграция с фильтрами

```typescript
// В ApartmentsFilter.tsx
import { getAllDistricts, detectDistrict } from '@/lib/districtDetection';

// Получить все доступные районы для селекта
const districts = getAllDistricts();

// При фильтрации учитывать автоопределение
const matchesDistrict = (property: Property, filterDistrict: string) => {
  const currentDistrict = property.location?.region;
  const autoDistrict = detectDistrict(
    property.location?.city,
    property.location?.address
  );
  
  return currentDistrict === filterDistrict || autoDistrict === filterDistrict;
};
```

### 3. Валидация при импорте

```typescript
// При импорте новых апартаментов
import { detectDistrict, isValidDistrict } from '@/lib/districtDetection';

function validatePropertyLocation(property: Property) {
  const { city, address, region } = property.location;
  
  // Автоопределение района
  const autoDistrict = detectDistrict(city, address);
  
  if (autoDistrict && region !== autoDistrict) {
    console.warn(`District mismatch: ${region} vs ${autoDistrict}`);
    property.location.region = autoDistrict;
  }
  
  if (!autoDistrict && !isValidDistrict(region)) {
    console.warn(`Cannot determine district for ${city}`);
  }
}
```

## Интеграция с Битрикс24 / Bitrix24 Integration

После обновления районов в Strapi, данные будут корректно синхронизироваться с B24:

```javascript
// При экспорте в Битрикс24
const propertyForB24 = {
  title: property.title,
  address: property.location.address,
  city: property.location.city,
  district: property.location.region, // Теперь содержит правильный район
  // ... другие поля
};
```

## Проблемные апартаменты / Problem Apartments

После обновления останется несколько апартаментов, которые требуют ручной проверки:

1. **ID 482** - "Apartment" как город (некорректные данные)
2. **ID 2420** - "Tenerife" как город (нужно уточнить локацию)
3. **ID 318** - Возможно, нужно добавить в справочник

**Рекомендация:** Проверить эти апартаменты вручную и обновить их данные.

## Расширение справочника / Extending the Dictionary

Если нужно добавить новые локации:

1. Откройте `src/lib/districtDetection.ts`
2. Найдите нужный район в объекте `TENERIFE_DISTRICTS`
3. Добавьте новый город/локацию в массив
4. Также обновите скрипты:
   - `scripts/analyze-apartment-locations.js`
   - `scripts/update-apartment-districts.js`

**Пример:**

```typescript
export const TENERIFE_DISTRICTS = {
  "Costa Adeje": [
    "Costa Adeje",
    // ... существующие
    "Новый Город", // Добавить сюда
  ],
  // ...
};
```

## Тестирование / Testing

Запуск тестов:

```bash
npm test -- src/lib/districtDetection.test.ts
```

Все 21 тест должны проходить успешно.

## Workflow / Рабочий процесс

### Разовое обновление существующих данных:

1. **Анализ:**
   ```bash
   node scripts/analyze-apartment-locations.js
   ```

2. **Проверка результатов:**
   - Открыть `data/location-analysis.json`
   - Проверить проблемные апартаменты
   - При необходимости расширить справочник

3. **Обновление:**
   ```bash
   node scripts/update-apartment-districts.js
   ```

4. **Проверка на сайте:**
   - Перезапустить фронтенд
   - Проверить фильтры по районам
   - Убедиться, что апартаменты корректно отображаются

### При добавлении новых апартаментов:

1. Импортировать апартаменты как обычно
2. Запустить `analyze-apartment-locations.js`
3. При необходимости обновить справочник
4. Запустить `update-apartment-districts.js`

## Поддержка / Support

При возникновении вопросов или необходимости добавления новых районов:

1. Проверить логи анализа в `data/location-analysis.json`
2. Проверить тесты: `npm test -- districtDetection`
3. Расширить справочник районов при необходимости

## Статистика покрытия / Coverage Statistics

**Текущее состояние (после обновления):**
- ✅ 98% апартаментов с корректными районами
- ✅ 100% апартаментов имеют города
- ✅ 51% апартаментов имеют подробные адреса
- ⚠️ 2% требуют ручной проверки

**Основные туристические районы покрыты на 100%:**
- Costa Adeje ✅
- Santiago del Teide ✅
- Arona ✅
- Adeje ✅
- Guía de Isora ✅
