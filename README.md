# alchni.bg

Реални цени от касови бележки. Едно приложение за уеб, iOS и Android.

- Идея на продукта: [`IDEA.md`](IDEA.md)
- Технологичен стак: [`TECH_STACK.md`](TECH_STACK.md)
- Спецификации: [`specs/`](specs/) (шаблон: [`specs/template.md`](specs/template.md))

## Изисквания

- Node (версията е в `.nvmrc`)
- pnpm (версията е в `packageManager` в `package.json`)
- [Expo Go](https://expo.dev/go) на телефона за мобилно тестване

## Стартиране

```bash
pnpm install
pnpm web    # уеб в браузъра
pnpm dev    # Expo dev сървър: сканирай QR кода с Expo Go (iOS/Android)
```

Телефонът и компютърът трябва да са в една и съща мрежа. Ако не са, стартирай с `pnpm dev -- --tunnel`.

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm format:check   # pnpm format за автоматично форматиране
```

## Структура

```
apps/app/      Expo приложение (Expo Router, маршрути в src/app/)
specs/         Спецификации на фийчърите
```

Native зависимости се добавят с `npx expo install <пакет>` от `apps/app/`.
