# 🏛️ BILIMDON: Educational Intelligence Platform (Spec)

> **Note:** While this documentation is in English for better accessibility, the application interface and content are fully in **Uzbek (O'zbek tili)**.

**Bilimdon** is a high-performance, interactive educational platform designed to test and enhance knowledge across 5 core subjects through an adaptive learning experience.

---

## 1. Project Objective
To provide a gamified academic experience that tracks user progress and adapts question difficulty based on the learner's individual rank (Adaptive Learning).

## 2. Technology Stack
- **Frontend:** React.js (Vite)
- **Styling:** Vanilla CSS with Glassmorphism design principles.
- **Data Handling:** Modular JSON dynamic loaders.
- **Storage:** LocalStorage (Offline-first approach).

---

## 3. The Adaptive Question Engine (Generator Logic)
This is the core of the application, responsible for selecting and delivering questions based on user proficiency.

### 3.1. Selection Logic (Subject + Level)
The generator operates on a two-tier selection process:
1.  **Subject Filter:** The engine identifies the selected subject (e.g., Matematika, Fizika).
2.  **Rank Detection:** It retrieves the user's points for that specific subject from `localStorage` and maps them to one of the 5 difficulty levels.
3.  **Dynamic Loading:** Instead of loading the entire database, it asynchronously imports only the specific JSON file needed (e.g., `fizika/level3.json`).

### 3.2. Fisher-Yates Shuffle Algorithm
To ensure every game session is unique and non-repeating:
- **Pool Extraction:** All questions from the loaded level are placed in a temporary pool.
- **True Randomization:** The pool is shuffled using the Fisher-Yates algorithm, ensuring an unbiased distribution.
- **Unique Selection:** The engine picks exactly 10 unique questions from the shuffled pool.
- **Integrity:** If a level file is empty or missing, the system gracefully falls back to Level 1.

---

## 4. Data Architecture
Questions are structured in a hierarchical folder system for maximum scalability.

### 4.1. File Structure
Paths: `src/data/questions/{subject}/level{1-5}.json`
- **Level 1 (Student):** Fundamental basics.
- **Level 2 (Undergrad):** Intermediate complexity.
- **Level 3 (Master):** Advanced academic depth.
- **Level 4 (Aspirant):** Research-level logic.
- **Level 5 (Professor):** Expert mastery.

### 4.2. Current Subjects
- Mathematics (Matematika)
- History (Tarix)
- Physics (Fizika)
- Russian Language (Rus tili)
- Chemistry (Kimyo)
-
-

---

## 5. Gamification & Ranks
Each subject has its own independent progression path:
- **Student (O'quvchi):** 0 - 2,000 pts
- **Undergrad (Talaba):** 2,000 - 8,000 pts
- **Master (Magistr):** 8,000 - 18,000 pts
- **Aspirant (Aspirant):** 18,000 - 35,000 pts
- **Doctor (Doktor):** 35,000 - 60,000 pts
- **Professor (Professor):** 60,000+ pts

---

## 6. Premium Features & UI
- **Interactive Mascot:** An owl character that reacts emotionally (neutral, happy, sad) to user answers.
- **Lifelines:** 
    - `50/50`: Removes two incorrect options.
    - `Freeze`: Stops the 15-second countdown timer.
- **Mistakes Laboratory:** A special mode that allows users to practice only the questions they answered incorrectly in the past.

---

## 7. Roadmap
- [ ] **Multiplayer Duels:** Real-time knowledge battles.
- [ ] **Cloud Synchronization:** Sync progress across devices via Supabase.
- [ ] **AI Tutor:** Personalized feedback on why an answer was wrong.

---

**Version:** 1.3.0
**Lead Dev:** Antigravity AI & User
**Date:** 2026-04-29
