# Dress Sense – AI Weather Advisor

**What should I wear today?** Dress Sense reads live weather for your city and recommends a complete outfit, with a plain-language reason for every suggestion. The page background changes with the weather (sun, cloud, rain, storm, snow, night).

## Features
- Live weather by city name or browser location (Open-Meteo, no API key)
- Outfit for casual, office, workout and travel days
- Personal comfort setting (feel cold or hot easily)
- Explainable rule-based AI with a 0–100 comfort score
- Gen Z / plain-English vibe toggle with a matching icon for each clothing piece
- 5-day forecast, °C / °F toggle, light and dark mode, responsive layout
- Security hardening: Content-Security-Policy, input validation, no `innerHTML`

## Project structure
```
dress-sense-website/
├── index.html        Page structure and content
├── css/style.css     Styles, weather scenes, glass effect
├── js/engine.js      Weather labels + recommendation engine (rules)
├── js/app.js         API calls, input handling, rendering
└── README.md
```

## Run locally
Open `index.html` in a browser (internet required). For the "Use my location" button, start a small server:
```
python -m http.server 8000
```
then open http://localhost:8000

## Deploy free on GitHub Pages
1. Create a new repository on GitHub and upload all files, keeping the folder structure.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`.

## How the AI works
A weighted rule-based expert system. The feels-like temperature is adjusted for activity (workout +5°) and personal comfort (±3°), then mapped to clothing bands. Rain chance, UV index, wind and humidity add accessories and warnings. Each rule contributes a sentence to the "Why this outfit" list.

## Security notes
- CSP allows connections only to the two Open-Meteo hosts and blocks inline scripts and styles.
- City input is filtered by an allow-list and limited to 60 characters.
- Output is written with `textContent`, so there is no XSS surface.
- No API keys, cookies or tracking. Only the last searched city is stored in `localStorage`.

## Future scope
Decision-tree model trained on user feedback, wardrobe inventory, hourly forecast, LLM-written advice, offline PWA.

## Team
- Your name (Team lead)
- Member two
- Member three

Department of Computer Science and Engineering.

Weather data by [Open-Meteo](https://open-meteo.com/).
