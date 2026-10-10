# alchni.bg — Технологичен стак

> Документът е жив. Решенията тук са основата за спецификациите в `specs/`.

## Цел

Една кодова база, която работи production-ready на:
- **десктоп и лаптоп** (браузър);
- **телефон** (нативни приложения в App Store и Google Play + мобилен браузър).

Разликите между платформите са минимални. Избран подход: **Expo (React Native) универсално приложение с Expo Router**.

## Стак

| Слой | Избор | Защо |
|---|---|---|
| Език | **TypeScript** (strict) навсякъде | Общи типове между клиента, бекенда и AI схемите |
| App framework | **Expo (последен стабилен SDK) + Expo Router** | Един код за iOS/Android/уеб, файлово рутиране, deep links, уеб със static/server rendering |
| UI | **NativeWind** (Tailwind за RN) + **react-native-reusables** (shadcn стил) | Едни и същи класове и компоненти на уеб и native, адаптивни breakpoints |
| Иконки / шрифтове | `lucide-react-native`, `expo-font` | Работят на всички платформи |
| Данни на клиента | **TanStack Query** + `supabase-js` | Кеш, retry, еднакво поведение навсякъде |
| Форми / валидация | **react-hook-form + zod** | Zod схемите се споделят с бекенда и AI изхода |
| Локално състояние | `zustand` (само UI състояние) | Леко, без платформени разлики |
| Карта | **MapLibre**: `@maplibre/maplibre-react-native` (native), `react-map-gl/maplibre` (уеб) | Еднакъв стил и данни зад общ компонент |
| Тайлове | **Protomaps PMTiles** (OSM) в обектно хранилище + CDN; алтернатива MapTiler | Публичните OSM тайлове не са за production |
| Камера / файлове | `expo-image-picker`, `expo-document-picker` (PDF), `expo-image-manipulator` (компресия) | Един API на всички платформи |
| Бекенд / БД | **Supabase**: PostgreSQL + **PostGIS**, Auth, Storage, Edge Functions, Queues (pgmq), Realtime | Managed, RLS сигурност, един SDK за уеб и native, гео заявки |
| AI | **Claude API**: `claude-sonnet-5-5` (vision разчитане, structured output), `claude-haiku-5-5` (нормализиране на продукти) | Извиква се само от сървъра |
| Геокодиране | Google Geocoding API (или Geoapify) + кеш в БД | Nominatim public има строга usage policy |
| Автентикация | Supabase Auth: Google, **Sign in with Apple**, имейл (magic link/OTP) | Apple е задължителен в iOS, щом има Google |
| i18n | `i18next` + `react-i18next` + `expo-localization` | Български от старта, готово за EN/DE/RO |
| Наблюдение | **Sentry** (`@sentry/react-native`) + **PostHog** | Грешки, аналитика и feature flags за всички платформи |
| Build / дистрибуция | **EAS Build, EAS Submit, EAS Update** (OTA) | Store билдове и бързи JS фиксове |
| Уеб хостинг | **EAS Hosting**; алтернатива Vercel/Cloudflare | Поддържа Expo Router server output и API routes |
| Монорепо | **pnpm workspaces + Turborepo** | Отделя приложение, бекенд и общи пакети |
| Тестове | Jest + React Native Testing Library, **Playwright** (уеб E2E), **Maestro** (mobile E2E), Deno test (Edge Functions) | |
| CI/CD | GitHub Actions + EAS Workflows | lint, typecheck, тестове, preview билдове за всеки PR |

## Структура на репото

```
alchni.bg/
├── IDEA.md                 # описание на продукта
├── TECH_STACK.md           # този документ
├── specs/                  # спецификации на фийчърите (шаблон: specs/template.md)
├── apps/
│   └── app/                # Expo универсално приложение (iOS, Android, уеб)
│       └── src/
│           ├── app/        # Expo Router маршрути (само екрани и layout-и)
│           ├── components/ # напр. map/PriceMap.native.tsx / PriceMap.web.tsx
│           └── lib/        # напр. auth/ с .native.ts / .web.ts
├── packages/
│   └── shared/             # (по-късно) zod схеми, типове от БД, ценови утилити
└── supabase/               # (по-късно) migrations/ и functions/
```

Папките се създават от спека, който ги въвежда за първи път.

## Принципи

### Минимални разлики между платформите
Платформен код е позволен само чрез `.native.tsx` / `.web.tsx` файлове зад общ интерфейс. Очаква се само на 3 места:
- картата;
- OAuth входът;
- евентуално bottom sheet.

Всичко останало е общо.

### Адаптивен layout
- **Телефон:** карта на цял екран, долни табове и плъзгащ се списък с обекти.
- **Десктоп:** странична лента с филтри и списък вляво, карта вдясно.

Екраните и компонентите са едни и същи. Сменя се само подредбата.

### Сигурност
- API ключовете за Claude и геокодирането са само в Supabase secrets, никога в клиента.
- Достъпът до данните се контролира с RLS. Публично се виждат само публикуваните агрегирани данни. Бележките и снимките се виждат само от собственика им.
- Има отделни среди `development`, `preview` и `production`, всяка със свой Supabase проект и EAS канал.

### SEO
Публичните страници на обектите и страниците с цени по град и продукт се рендерират на сървъра през Expo Router server output. Имат мета тагове, sitemap и JSON-LD. Ако server-side зареждането на данни в избрания SDK още не е стабилно, резервният вариант е static rendering и периодичен rebuild.

## Етапи (ориентировъчно)

1. Основа: монорепо, Expo приложение, NativeWind, адаптивен layout, CI
2. Бекенд: схема, PostGIS, RLS, seed данни
3. Автентикация
4. Карта и филтри
5. Качване на бележка и AI разчитане
6. Нормализиране на продукти, търсене и сравнение
7. Страница на обект и SEO страници
8. Доверие и защита от фалшиви бележки
9. Production: наблюдение, store публикуване, правни страници

Всеки етап се описва като спецификация в `specs/` преди имплементацията.
