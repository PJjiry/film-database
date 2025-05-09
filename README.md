# Film Database App

Jednoduchá webová aplikace pro správu filmů ve stylu ČSFD/IMDb.  
Postavena na stacku: **Node.js**, **Hono**, **EJS**, **Drizzle ORM**, **SQLite**.

---

## 🧰 Použité technologie

- [Hono](https://hono.dev/) 
- [EJS](https://ejs.co/) 
- [Drizzle ORM](https://orm.drizzle.team/) 
- [SQLite](https://www.sqlite.org/)
- Čisté **HTML/CSS**

---

## ⚙️ Instalace a spuštění

1. Naklonuj repozitář z githubu:

```bash
git clone https://github.com/PJjiry/film-database.git
```
2. Nainstaluj závislosti:
```bash
cd film-database
npm install
```
3. Proveď migrace:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```
4. Přidej uživatele admin a vzorové filmy:
```bash
node seedAdmin.js
node seedMovies.js
```
5. Aplikaci spustíš lokálně:
```bash
npm run dev
```