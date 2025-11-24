🏥 AfriCare Health Finder

![Leaflet.js](https://img.shields.io/badge/Leaflet.js-4CAF50?style=flat&logo=leaflet&logoColor=white)

Demo Video: [Watch the AfriCare Health Finder Demo](https://youtu.be/fjt7J8J3Uls?si=FgI634y5P8C0pl1G)

AfriCare Health Finder, a user-friendly web application to find healthcare facilities across Africa.
Right now based on 8 countries ( Rwanda, Kenya, Egypt, Uganda, South Africa, Tanzania, Nigeria, Ghana)

This Application helps you locate hospitals, clinics, pharmacies, and doctors in your city or neighborhood by using **interactive maps** and **detailed facility cards**.

## 🌍 Features

**\* 1. Search & Filter by:
-  **city or neighborhood** (example., Kigali, Kimironko)
-  **country\*\* from provided list of African nations

- **facility type**: Hospital, Clinic, Doctor, Pharmacy, or All facilities

\*\*\* 2. Facility Details depending on those that are currently available:

- 📍  **address**
- 📞 **Phone number**
- 🌐 **Website** link
- 🏢 **Operator / Network**
- 🕒 **Opening hours**
- 🗺️ **Google Maps directions**(on all cards)

\*\*\* 3. Interactive Map

- View all facilities as **markers on a Leaflet.js map**
- Hover on a marker → highlights the corresponding facility card
- Fully **responsive and mobile-friendly**

\*4. 🛠 How It Works

1. User enters --city/neighborhood-- and selects **country** & **facility type**.
2. App uses **OpenStreetMap Nominatim API** to fetch coordinates.
3. Then, **Overpass API** finds nearby health facilities depending on the one you chose.
4. Results are shown as **cards** and **map markers**, giving you both info and navigation.

- 💻 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript
* **Mapping:** Leaflet.js
* \**APIs:*OpenStreetMap Nominatim → Geocoding, Overpass API → Health facilities\*
* Fully responsive & optimized for mobile

## 📁 Project Structure

AfriCare-health_finder/
│
├── index.html
├── css/
│ └── styles.css 
├── scripts/
│ ├── api.js 
│ ├── app.js 
│ └── map.js
└── tests.html

## 🚀 Run Locally

1. Clone the repo:

```bash
git clone <https://github.com/Umutoni123-aa/AfriCare-health_finder.git>
```

2. Open `index.html` in a browser.
3. Make sure you are **online** to fetch API data.
4. Start searching for health facilities!

Use VS Code **Live Server** or `npx serve .` for a local server.

-🌟 Why AfriCare?

- Fast access to healthcare info
- Works on **any device**
- Perfect for residents, travelers, and newcomers

## About the Developer

**Nada** – Passionate about creating accessible and practical solutions.
Student at **African Leadership University**, building tools for real-world problems.

## Server & API Info

the application runs on three Ubuntu servers with load balancing

----Load Balancer(6933-lb-01): IP: 44.201.201.53 (Public access URL: http://44.201.201.53)
----Web Server 1 (6933-web-01): IP: 44.203.40.15 (Direct URL: http://44.203.40.15)
----Web Server 2 (6933-web-02): IP: 13.221.14.191 (Direct URL: http://13.221.14.191)

## 📚 Credits & Thanks

- **OpenStreetMap** → Nominatim & Overpass APIs
- **Leaflet.js** → Interactive maps
- Inspired by ALU youth projects and initiatives in Africa

Thanks for checking out **AfriCare Health Finder**! 💙
Your next healthcare facility is just a few clicks away. mbyee!!🗺️
