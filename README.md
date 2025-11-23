# Interactive Urban Navigation System for Icherisheher 🏰📍

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Neo4j_|_PostgreSQL_|_Docker-blue)

> A master's thesis project transforming urban navigation in historic districts through dual-database architecture and gamified geocaching.

## 📄 Thesis Document
[Download Full Master's Thesis (PDF)](./Master's%20Thesis%20-%20Interactive%20Urban%20Navigation%20System%20for%20Icherisheher.pdf)

*Click above to read the detailed research, methodology, and results.*

---

## 📖 About The Project
Traditional navigation apps (like Google Maps) often fail in complex historical environments like **Icherisheher** (Baku, Azerbaijan). They treat all paths equally and lack cultural context
This project is a specialized **Interactive Urban Navigation System** that combines:
1.  **Smart Routing:** Optimized for the narrow, winding streets of the Old City.
2.  **Cultural Exploration:** A "Historical Route" option that prioritizes landmarks over speed.
3.  **Gamification:** A Geocaching mode where users find hidden spots and validate them using AI.

## 🌟 Key Features

### 🗺️ Advanced Navigation
* **Quickest Route:** Uses A* algorithms for the fastest path.
* **Historical Route:** Weighted pathfinding that guides users past culturally significant landmarks.
* **Category Filtering:** Filter map by Museums, Parks, Restaurants, and Emergency Points.

### 💎 Geocaching & AI Validation
* **Gamified Discovery:** Users solve riddles to find specific locations (Easy, Medium, Hard).
* **Computer Vision:** Integrated **Image Validation System** using **ResNet50**. Users take a photo of the location, and the system verifies it against reference images with >75% accuracy
---

## 🏗️ System Architecture

The system utilizes a **Dual-Database Architecture** running in Docker containers.

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React + Leaflet + Tailwind | [cite_start]Responsive map interface and user interaction[cite: 732]. |
| **Spatial DB** | PostgreSQL + PostGIS | [cite_start]Stores building data, POIs, and metadata[cite: 505]. |
| **Graph DB** | Neo4j | [cite_start]Handles road networks and weighted routing algorithms[cite: 506]. |
| **AI Model** | ResNet50 / Python | [cite_start]Validates user-uploaded images for geocaching[cite: 852]. |

---

## 🚀 Installation & Setup

This project uses **Docker Compose** for easy deployment.

### Prerequisites
* Docker & Docker Compose
* Node.js (for local frontend development)

### Steps
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/hurualqayeva/urban_master_thesis.git](https://github.com/hurualqayeva/urban_master_thesis.git)
    cd urban_master_thesis
    ```

2.  **Start the Containers**
    Initialize the PostgreSQL and Neo4j databases.
    ```bash
    docker-compose up -d
    ```

3.  **Run the Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```


---

## 📊 Performance Results
* **Route Calculation:** Quickest routes calculate in ~78ms; Historical routes in ~195ms
* **Image Validation:** Average processing time of ~1.3 seconds with 80% True Positive rate

## 👥 Authors
* **Huru Algayeva** - *M.S.Computer Science & Data Analytics, ADA University*
* **Abbas Aliyev** - *M.S.Computer Science & Data Analytics, ADA University*

## 🏫 Acknowledgments
* **Advisor:** Stephen Kaisler 
* **Institution:** ADA University & George Washington University
