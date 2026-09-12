# Tonight

A mobile app that tells you what to cook from food you already bought, before it dies.

Households throw away most of the world’s food waste — about 631 million tonnes a year, more than a billion meals a day — while people still go hungry. Tonight does not try to fix the food system. It ranks three dinners by what expires first, allows at most two missing staples, and records the money and weight you keep out of the bin.

## What it does

- **Tonight** — three dinners scored against your pantry, dying food first
- **Pantry** — inventory grouped by *use tonight / this week / fresh / staple*
- **Add** — tap a catalog, search, or start from a fridge photo
- **Shop** — only the one or two things dinner is missing
- **Saved** — meals cooked, dollars kept, kilograms not wasted

The matching engine is local. No account. No feed.

## Run it

```bash
npm install
npm test
npm run web
```

On a phone, use Expo Go:

```bash
npx expo start
```

Then scan the QR code.

## Design choices

Prevention apps fail because logging a fridge is chores. Tonight seeds a typical fridge on first run so the first screen is already dinner, and adding food is a tap grid rather than a spreadsheet.

Redistribution apps (Too Good To Go, Olio) catch surplus after it leaves the kitchen. Tonight tries to stop the surplus forming.

## Stack

Expo 57, React Native, TypeScript, Zustand + AsyncStorage, Jest for the matcher.
