# Interactive Urban Navigation System for Icherisheher 🏰📍

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Neo4j_|_PostgreSQL_|_Docker-blue)

> A master's thesis project transforming urban navigation in historic districts through dual-database architecture and gamified geocaching.

## 📄 Thesis Document
**[Download Full Master's Thesis (PDF)](./"(./Master's%20Thesis%20-%20Interactive%20Urban%20Navigation%20System%20for%20Icherisheher.pdf)*
*Click above to read the detailed research, methodology, and results.*

---

## 📖 About The Project
Traditional navigation apps (like Google Maps) often fail in complex historical environments like **Icherisheher** (Baku, Azerbaijan). [cite_start]They treat all paths equally and lack cultural context[cite: 376, 377].

This project is a specialized **Interactive Urban Navigation System** that combines:
1.  [cite_start]**Smart Routing:** Optimized for the narrow, winding streets of the Old City[cite: 301].
2.  [cite_start]**Cultural Exploration:** A "Historical Route" option that prioritizes landmarks over speed[cite: 825].
3.  [cite_start]**Gamification:** A Geocaching mode where users find hidden spots and validate them using AI[cite: 297].

## 🌟 Key Features

### 🗺️ Advanced Navigation
* [cite_start]**Quickest Route:** Uses A* algorithms for the fastest path[cite: 823].
* [cite_start]**Historical Route:** Weighted pathfinding that guides users past culturally significant landmarks[cite: 825].
* [cite_start]**Category Filtering:** Filter map by Museums, Parks, Restaurants, and Emergency Points[cite: 837].

### 💎 Geocaching & AI Validation
* [cite_start]**Gamified Discovery:** Users solve riddles to find specific locations (Easy, Medium, Hard)[cite: 675].
* **Computer Vision:** Integrated **Image Validation System** using **ResNet50**. [cite_start]Users take a photo of the location, and the system verifies it against reference images with >75% accuracy[cite: 852, 859].

---

## 🏗️ System Architecture

[cite_start]The system utilizes a **Dual-Database Architecture** running in Docker containers[cite: 508, 611].

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React + Leaflet + Tailwind | [cite_start]Responsive map interface and user interaction[cite: 732]. |
| **Spatial DB** | PostgreSQL + PostGIS | [cite_start]Stores building data, POIs, and metadata[cite: 505]. |
| **Graph DB** | Neo4j | [cite_start]Handles road networks and weighted routing algorithms[cite: 506]. |
| **AI Model** | ResNet50 / Python | [cite_start]Validates user-uploaded images for geocaching[cite: 852]. |

![System Architecture](./images/architecture_diagram.png)
*(Note: You should upload Figure 3.1 from your thesis to an 'images' folder and reference it here)*

---

## 🚀 Installation & Setup

[cite_start]This project uses **Docker Compose** for easy deployment[cite: 611].

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

4.  **Access the App**
    [cite_start]Open `http://localhost:5173` in your browser[cite: 840].

---

## 📊 Performance Results
* **Route Calculation:** Quickest routes calculate in ~78ms; [cite_start]Historical routes in ~195ms[cite: 907].
* [cite_start]**Image Validation:** Average processing time of ~1.3 seconds with 80% True Positive rate[cite: 912, 914].

## 👥 Authors
* **Huru Algayeva** - *M.S. [cite_start]Computer Science & Data Analytics, ADA University* [cite: 285]
* [cite_start]**Abbas Aliyev** - *Data Processing & Route Generation* [cite: 536]

## 🏫 Acknowledgments
* [cite_start]**Advisor:** Stephen Kaisler [cite: 6]
* [cite_start]**Institution:** ADA University & George Washington University [cite: 1, 4]
