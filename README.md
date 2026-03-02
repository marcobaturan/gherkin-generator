# Gherkin Test Case Generator

> AI-powered web app that generates **BDD test cases in Gherkin format** from plain-text functional descriptions.

[![Live Demo](https://img.shields.io/badge/demo-vercel-black?logo=vercel)](https://gherkin-generator.vercel.app)
[![Built with](https://img.shields.io/badge/built%20with-React%20%2B%20Gemini%20AI-6366f1)](https://github.com/marcobaturan/gherkin-generator)

---

## ✨ What it does

1. You **describe a feature** in plain English (e.g. _"The user can log in with email and password"_).
2. The app sends it to **Google Gemini AI** with a BDD-expert prompt.
3. You get back **3–5 ready-to-use Gherkin scenarios** — happy path, negative cases, and edge cases.

### Example output

```gherkin
Feature: User Login

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters a valid email and password
    Then the user is redirected to the dashboard

  Scenario: Login with invalid password
    Given the user is on the login page
    When the user enters a valid email and an incorrect password
    Then an error message "Invalid credentials" is displayed

  Scenario: Login with empty email field
    Given the user is on the login page
    When the user leaves the email field empty and clicks login
    Then an error message "Email is required" is displayed
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| AI | Google Gemini API (`gemini-1.5-flash`) |
| Hosting | Vercel (serverless functions + static) |
| Styling | Tailwind CSS (CDN) |

---

## 🏗 Architecture

```
React App (Vercel)  →  /api/generate (Serverless)  →  Google Gemini API
```

The Gemini API key lives **only** as a server-side environment variable — never exposed to the client.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/marcobaturan/gherkin-generator.git
cd gherkin-generator

# Install dependencies
npm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
├── api/
│   └── generate.js          # Vercel serverless function (Gemini proxy)
├── src/
│   ├── App.jsx              # Root component
│   ├── components/
│   │   ├── InputPanel.jsx   # Description textarea + generate button
│   │   └── OutputPanel.jsx  # Gherkin display + copy button
│   └── main.jsx             # React entry point
├── index.html               # HTML shell with Tailwind CDN
├── vite.config.js           # Vite configuration
└── package.json
```

---

## 📜 License

MIT © [marcobaturan](https://github.com/marcobaturan)
