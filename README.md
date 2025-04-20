# Rummy 500 Score Tracker

A modern web application for tracking scores in Rummy 500 card games. This app allows you to:

- Create games with multiple players
- Set custom target scores (default: 500)
- Record scores for each round
- Track game progress and history
- View player standings and round history
- Store game data locally in your browser

## Technology

This project is built with:

- Next.js
- TypeScript
- Tailwind CSS
- Local Storage for data persistence

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Features

- **Create Games**: Add players and set a target score
- **Record Scores**: Add scores for each round of play
- **Track Progress**: See current standings and round history
- **Game History**: View and resume past games
- **Local Storage**: All game data is saved in your browser

## How to Use

1. Start a new game by entering a game name, target score, and player names
2. Add scores after each round
3. The app will track totals and determine when someone reaches the target score
4. View past games from the game history list

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
