# Riot Games API Search

This is a simple web application that uses the Riot Games API to fetch and display information about a League of Legends player.

## Features

- Search for a player by their username and tag.
- Display the player's summoner name, summoner level, and highest two champion masteries.
- Display the champion name and icon for each champion mastery.

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root directory and add your Riot Games API key:
4. Run `npm start` to start the application.
5. Open `http://localhost:3000` in your browser.

## Usage

Enter a username and tag in the search form and click "Search". The application will fetch and display the player's summoner name, summoner level, and champion mastery.

## Dependencies

- Node.js
- Express
- axios
- dotenv
- ejs