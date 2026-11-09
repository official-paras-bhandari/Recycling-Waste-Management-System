<div align="center">

# ♻️ EcoTrack

### Waste & Recycling Management System

**Know what's due. Know which bin. Never miss bin day again.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

</div>

---

## 📖 About

EcoTrack is a resident-facing web app that makes household waste and recycling simple. Enter your address and EcoTrack shows which bins go out, when, and what belongs in each, then reminds you before collection day.

It is built with plain HTML, CSS and JavaScript. There is no framework, no build step and no dependencies.

## 💡 Motivation

Bin day is easy to forget and surprisingly easy to get wrong:

- **Missed collections.** Schedules live on council PDFs and change around public holidays.
- **Contaminated loads.** People aren't sure whether a pizza box or a yoghurt pot is recyclable, so the wrong things end up in the wrong bin.
- **Fragmented info.** Councils run 2, 3 or 4-bin systems, each with its own rules.

Every missed pickup and contaminated load costs residents convenience and costs councils money. EcoTrack puts the answers in one fast, friendly place.

## 🎯 Goals

1. **Make collection dates impossible to miss** with address-based schedules, holiday shifts and reminders.
2. **Make sorting effortless** with instant search that tells you which bin an item goes in.
3. **Reduce contamination and missed bins** for households and councils alike.
4. **Stay lightweight and accessible** so it works on any device, loads instantly and needs no setup.

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 📍 | **Address lookup** | Find your street and see your collection schedule |
| 🗓️ | **Schedule & dynamic dates** | Upcoming collections with relative dates and a full month view |
| 🎄 | **Holiday notices** | Flags when pickups shift around public holidays |
| 🔔 | **Reminders** | Choose when and how you want to be notified, with toast feedback |
| 📆 | **Calendar sync** | Download `.ics` events for your calendar app |
| 🔍 | **Recycling search** | Instant "which bin does it go in?" lookup with how-to guidance |
| 🗑️ | **2, 3 and 4-bin systems** | Adapts to different council setups |
| 🛎️ | **Other services** | Quick access to secondary council services |
| 👤 | **Resident portal** | Home, Schedule, Recycle and Account screens |

## 🚀 Getting Started

No install needed.

```bash
git clone https://github.com/<your-username>/Recycling-Waste-Management-System.git
cd Recycling-Waste-Management-System

# open directly...
open index.html

# ...or serve locally
python3 -m http.server 8000   # then visit http://localhost:8000
```

## 🗂️ Project Structure

```
├── index.html   # Markup for the landing page, onboarding and resident portal
├── style.css    # Styling and design system
├── script.js    # Screen routing, schedules, search, reminders, calendar export
├── onboarding.js # Address search and first-run onboarding flow
├── assets/ images/  # Item photos used by the recycling search
└── vercel.json  # Vercel config: clean URLs and security headers
```

## ☁️ Deployment

The app is static and deploys to [Vercel](https://vercel.com) as-is. `vercel.json` enables clean URLs and sets security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).

## 🛣️ Roadmap

- Live council data integration in place of the demo schedules
- Real push, SMS and email reminders
- Multi-council and multi-language support
- Council dashboard for contamination and missed-bin insights

## 📄 License

No license has been specified yet. Add one before accepting contributions.

---

<div align="center">Made with 💚 for cleaner streets and a greener planet.</div>
