# 001 — Основа на проекта (монорепо + Expo приложение)

| Поле | Стойност |
|---|---|
| Статус | Готова |
| Автор | Kaloyan |
| Дата | 2026-10-11 |
| Зависи от | — |

## 1. Контекст и проблем
Проектът започва от нулата. Преди да пишем фийчъри, ни трябва основа, която:
- стартира едно и също приложение на уеб, iOS и Android (`TECH_STACK.md` → „Цел“);
- е подредена като монорепо, защото по-късно ще добавим `packages/shared` и `supabase/`;
- има качествени проверки (lint, typecheck, formatting) от първия ден.

## 2. Цели
- Едно Expo приложение, което стартира в браузър и на телефон с една команда.
- Монорепо с pnpm workspaces и Turborepo, готово за нови пакети.
- Еднакви правила за код: TypeScript strict, ESLint, Prettier, EditorConfig.
- CI, който пуска lint и typecheck при всеки push/PR.

## 3. Извън обхвата
- NativeWind, UI компоненти, тема и адаптивен layout → спек 002.
- Supabase, БД и автентикация → отделни спекове.
- `packages/shared` → създава се, когато имаме първия общ код.
- EAS Build, development builds, store публикуване → по-късен спек. В този спек мобилното тестване е през **Expo Go**.
- Unit/E2E тестова инфраструктура → добавя се с първия фийчър, който има логика за тестване.

## 4. Потребителски истории
- Като **разработчик** искам с една команда да пусна приложението в браузъра и на телефона си, за да проверявам промените веднага на всички платформи.
- Като **разработчик** искам CI да ми казва, ако кодът не минава lint или typecheck, за да не влизат грешки в основния клон.

## 5. Функционални изисквания
- **FR-1** Репото е pnpm workspace. Приложенията живеят в `apps/*`, а бъдещите пакети в `packages/*`.
- **FR-2** Expo приложението е в `apps/app` и използва Expo Router. Маршрутите са в `apps/app/src/app/`, а останалият код в `apps/app/src/`.
- **FR-3** Приложението има един начален екран „alchni.bg“ с кратко описание. Демо кодът от шаблона е премахнат.
- **FR-4** Идентификатори на приложението:
  - име: `alchni.bg`;
  - slug: `alchni`;
  - URL scheme: `alchni`;
  - iOS bundle ID и Android package: `bg.alchni.app`.
- **FR-5** Коренни скриптове (през Turborepo или pnpm filter):

  | Скрипт | Какво прави |
  |---|---|
  | `pnpm dev` | стартира Expo dev сървъра |
  | `pnpm web` | стартира приложението в браузъра |
  | `pnpm lint` | пуска ESLint |
  | `pnpm typecheck` | пуска TypeScript проверката |
  | `pnpm format` / `pnpm format:check` | форматира / проверява форматирането с Prettier |

## 6. Нефункционални изисквания
- **NFR-1** Версията на Node е фиксирана в `.nvmrc`. Версията на pnpm е фиксирана в `packageManager`.
- **NFR-2** Native зависимостите се добавят само с `npx expo install`, за да са съвместими с SDK-то.
- **NFR-3** Папките `ios/` и `android/` не се commit-ват (Continuous Native Generation).
- **NFR-4** `npx expo-doctor` минава без грешки.

## 7. Технически дизайн
- **Генериране:** `create-expo-app` с шаблона `default` (Expo SDK 57, React Native 0.86, React 19.2, TypeScript 6). Шаблонът вече включва Expo Router, typed routes, React Compiler и web `output: "static"`.
- **Конфигурация:** `app.json`, без да се минава към `app.config.ts`. Ще преминем, когато имаме нужда от env променливи (Supabase спек).
- **Монорепо:**
  - корен: `package.json` (private), `pnpm-workspace.yaml`, `turbo.json`;
  - Expo SDK 57 разпознава монорепото автоматично, така че не е нужна ръчна Metro конфигурация.
- **Lint:** `eslint-config-expo` (flat config), добавен с `npx expo lint`. Prettier е отделен (`eslint-config-prettier`), за да не се дублират правила.
- **CI:** GitHub Actions `.github/workflows/ci.yml`. Стъпки: checkout → pnpm → Node от `.nvmrc` → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm typecheck` → `pnpm format:check`.
- **Платформени разлики:** няма.

## 8. UX
Един екран, центриран, с:
- заглавие „alchni.bg“;
- подзаглавие „Колко струва? Реални цени от касови бележки.“;
- текущата платформа (`ios` / `android` / `web`) като помощ при проверката.

Поддържа светла и тъмна тема. Използва safe area на телефона.

## 9. Критерии за приемане
- [x] **AC-1** Даден чист клон, когато пусна `pnpm install`, тогава инсталацията минава без грешки.
- [x] **AC-2** Даден инсталиран проект, когато пусна `pnpm web`, тогава началният екран се отваря в браузъра и показва „web“.
- [x] **AC-3** Даден пуснат `pnpm dev`, когато сканирам QR кода с Expo Go на iPhone, тогава виждам началния екран с „ios“. *(ръчна проверка от разработчика)*
- [x] **AC-4** Същото като AC-3, но на Android телефон и с „android“. *(ръчна проверка от разработчика)*
- [x] **AC-5** `pnpm lint`, `pnpm typecheck` и `pnpm format:check` минават без грешки.
- [x] **AC-6** `npx expo export --platform all` минава, т.е. JS бъндълите за web, iOS и Android се билдват.
- [x] **AC-7** `npx expo-doctor` минава.

## 10. План за тестване
- Автоматично: AC-5, AC-6 и AC-7 (локално и в CI за AC-5).
- Ръчно: AC-2 в браузър (десктоп и тесен прозорец), AC-3 и AC-4 с Expo Go на реален телефон. На машината няма Xcode и Android SDK, затова не ползваме симулатори.

## 11. Задачи
- [x] T1 Генериране на Expo приложение в `apps/app` с шаблона `default`.
- [x] T2 Премахване на демо кода и файловете от шаблона, които не са ни нужни.
- [x] T3 Начален екран (FR-3) и идентификатори (FR-4).
- [x] T4 Монорепо: `pnpm-workspace.yaml`, `turbo.json`, коренен `package.json`.
- [x] T5 ESLint, Prettier, EditorConfig, `.nvmrc`, `.gitignore`.
- [x] T6 CI workflow.
- [x] T7 README с команди за стартиране.
- [x] T8 Проверка на критериите за приемане.

## 12. Рискове и отворени въпроси
- Expo Go поддържа само вградените native модули. MapLibre и Google Sign-In ще изискват **development build** (EAS). Това е планирано в отделен спек.
- Домейнът `alchni.bg` и bundle ID `bg.alchni.app` трябва да се потвърдят, преди да регистрираме приложението в App Store и Google Play.

## 13. Definition of Done
- [x] Приложението стартира в **уеб** и на **мобилно** (iOS и Android през Expo Go). Обхваща AC-2, AC-3 и AC-4.
- [x] `lint`, `typecheck` и `format:check` минават.
- [x] README описва как се стартира проектът.
- [x] Статусът на спека е „Готова“ след ръчната проверка на телефон.
