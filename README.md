Football Stats App
A full-stack football statistics web application with live API integration, team comparison tools, and an analytics dashboard.
Built with Node.js and Express, consuming real-time data from the API-Football service.

Features

Live Data — real-time football data powered by API-Football
Team Comparison — compare any two teams across leagues and seasons, with head-to-head stats
League Support — Premier League, La Liga, Bundesliga, Serie A, Ligue 1, AFCON, and more
Analytics Dashboard — wins, losses, goals scored/conceded, and average goals per game
Dynamic Team Search — teams load automatically based on selected league and season
Error Handling — graceful handling of API rate limits, invalid keys, and network errors


Tech Stack
Layer Technology
Runtime Node.js
Framework  Express.js
Templating  EJS
HTTP Client  Axios
Styling  CSS3
API  API-Football (v3)
Config  dotenv

Project Structure
football-stats/
├── public/
│   ├── css/          # Stylesheets
│   └── js/           # Client-side JavaScript
├── routes/
│   ├── index.js      # Home route
│   └── compare.js    # Team comparison routes
├── services/
│   ├── apiFootballClient.js   # API-Football integration
│   └── comparisonService.js  # Comparison logic
├── views/
│   ├── partials/     # Header and footer
│   ├── index.ejs     # Home page
│   ├── compare.ejs   # Comparison page
│   └── error.ejs     # Error page
├── server.js         # Entry point
└── package.json

Getting Started

Prerequisites
Node.js (v14 or higher)
A free API key from API-Football

Installation
Clone the repository:

bash   git clone https://github.com/1410017/football-stats.git
   cd football-stats

Install dependencies:

bash   npm install

Create a .env file in the root directory:

   FOOTBALL_API_KEY=your_api_key_here
   FOOTBALL_API_HOST=v3.football.api-sports.io
   PORT=3000

Start the server:

bash   node server.js

Open your browser and go to http://localhost:3000


API Endpoints Used
Endpoint  Description
/leagues  Fetch available leagues
/teams    Fetch teams by league and season
/teams/statistics  Fetch team stats
/fixtures  Fetch match fixtures
/fixtures/headtohead  Head-to-head results
/standings League standings

Screenshots
Coming soon

Author
Gerson Cravid
BSc Computer Science — University Academy 92, Manchester
