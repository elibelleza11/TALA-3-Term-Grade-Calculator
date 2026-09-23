# TALA: Three-Term Academic Learning Analyzer
### 3-Term Grade Calculator & Academic Progress Planner · By Eli Belleza
*Compliant with DepEd Order No. 15, s. 2026 · Mascot: Tali the Tarsier*

---

## 1. Why GitHub Alone Works With 100% Privacy & Zero Overrides

You asked:
> *"Multiple users should access the site individually at the same time without overriding any data or seeing duplicate data from others. Can't I just use GitHub and upload a file there?"*

**The answer is YES! In fact, that is the exact way TALA is now built.**

### How Client-Side Isolation Works:
When you deploy this website to **GitHub Pages**:
1. **Zero Database Needed:** GitHub Pages only serves the static files (`index.html`, `js`, `css`) to the user's browser.
2. **Device Sandbox:** When **Student A** in Manila opens your website on their phone, and **Student B** in Cebu opens it on their tablet:
   - Student A gets their own private sandbox in their phone's browser memory.
   - Student B gets their own private sandbox in their tablet's browser memory.
   - Student A's inputs (scores, WW, PT, TE, student name) and their calculation history are saved **ONLY in Student A's device storage (`localStorage`)**.
   - Student B **NEVER** sees Student A's scores.
   - Student B **CANNOT** override Student A's scores or data.
   - 1,000 students or parents can calculate their grades at the exact same second across the Philippines, and each person only sees their own private results.

---

## 2. The 3 Files Needed for GitHub Pages

To publish TALA on GitHub Pages, you only need to run:

```bash
npm run build
```

Vite will compile the app and create a folder named **`dist`** containing:
1. **`index.html`** (The webpage shell)
2. **`assets/index-[hash].js`** (All the DepEd calculation logic, DO 15 descriptors, and UI)
3. **`assets/index-[hash].css`** (Tailwind styling and animations)

Upload these files directly to your GitHub repository (into the root or `gh-pages` branch), turn on **GitHub Pages** in your repository settings, and your website is live worldwide!

---

## 3. How Visitor Tracking Works (Without Collecting Student Grades)

The only global information is the **Visitor Count** (how many people opened your website).

- **GoatCounter** is embedded directly into `index.html`.
- It is a 100% privacy-preserving analytics tool that uses **no tracking cookies** and complies with the Philippine Data Privacy Act (RA 10173) and GDPR.
- It only increments the pageview counter when someone visits the site. It **NEVER** reads, collects, or transmits student names, test scores, or grades.
- The **Traffic Stats Banner** in TALA displays this live visitor count in real time!
