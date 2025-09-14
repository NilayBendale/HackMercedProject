# HackMercedProject
This Program is our submission for the MercedHacks hackathon.
# GhostWrite

A minimal web app that hides a short message inside any text using Unicode steganography — then pulls it back out on demand. Built for demos, coursework, and playful experiments in text‑based data hiding.

---

## ✨ Features

* **Encode/Decode in the browser**: No backend — just open `index.html`.
* **Steganography via Unicode**: Embeds data using high code points (e.g., `U+FE00` and above) so the text looks unchanged to humans.
* **One‑click UI**: Paste text, add a hidden message, click **Encode** / **Decode**.
* **Hidden character viewer**: Toggle to see which code points carry the payload.
* **Dark neon UI**: Cyberpunk vibes with an Orbitron font.

> ⚠️ **Note**: This is **steganography**, not cryptography. Anyone with the decoder (or who inspects code points) can recover the message. For sensitive data, encrypt *before* embedding.

---

## 🚀 Quick Start

1. Clone or download the repo.
2. Open `index.html` in any modern browser.
3. Type **Original Text** and a **Data to Encode** message.
4. Click **Encode**. Copy the **Encoded Text** and share it.
5. To recover the message, paste the encoded text and click **Decode**.

> Tip: If your browser blocks local fonts or modules, use a simple static server (e.g., VS Code **Live Server** or `python -m http.server`).

```bash
# from the project root
python3 -m http.server 8080  # then open http://localhost:8080
```

---

## 🧠 How It Works ( a little bit detailed)

* **Input**: `inputText` (carrier) + `hiddenData` (payload).
* **Encode**: `appendData(text, payloadCodePoints)` returns an augmented string containing extra Unicode code points (≥ `0xFE00`).
* **Decode**: `dataFromRawText(encoded)` scans characters and extracts the payload as an array of code points.
* **View**: Hidden characters are displayed as `U+XXXX` labels for inspection.

This project intentionally keeps the embedding visible to developers (via code points) while imperceptible to casual readers.

---

## 🧩 Project Structure

```
.
├── index.html              # Main UI (GhostWrite)
└── src/
    ├── utils.js            # Shared helpers
    ├── wordSubstitution.js # appendData(...), dataFromRawText(...)
    ├── trackerData.js      # (optional) telemetry/data helpers
    └── varSelectorUtils.js # utilities for variation-selector mapping
```

> The HTML references all `src/*.js` files; ensure paths are correct when deploying.

---

## 🖱️ Using the UI

1. **Original Text**: Paste any visible text (email, post, paragraph).
2. **Data to Encode**: A short hidden message (ASCII/Unicode).
3. Click **Encode** → *Encoded Text* appears.
4. Click **Decode** → *Decoded Hidden Data* appears.
5. **Show Hidden Unicode Data** → toggles a list of embedded code points.

---

## 🔐 Security & Limitations

* **Not encrypted**: Use real crypto (AES, libsodium, Web Crypto) *before* embedding if secrecy matters.
* **Normalization risk**: Some platforms (CMS, chat apps, PDFs) normalize or strip high code points, which can destroy the payload. Test your target platform. We were pressed for time so we were forced to work around these limitations.
* **Copy/Paste hazards**: Text editors and word processors may reflow/normalize characters.
* **Length constraints**: Payload size is limited — large messages increase the chance of corruption and visibility.

---

## 🧪 Developer Notes

### Core API (from `src/wordSubstitution.js`)

```js
// Encode: returns an encoded string that visually resembles the original
const encoded = appendData(rawText, [...hiddenMessage].map(ch => ch.charCodeAt(0)));

// Decode: returns an array of arrays of code points (implementation‑dependent)
const arrays = dataFromRawText(encoded);
const decoded = arrays.map(codeArr => String.fromCharCode(...codeArr)).join("");
```

### Browser Support

* Works on modern Chromium/Firefox/Safari.
* Avoid environments that aggressively normalize Unicode.

### Local Dev

```bash
# install live server if using npm
yarn global add live-server # or: npm i -g live-server
live-server
```

---

## 📦 Deploy

* **GitHub Pages**: Push to `main`, enable Pages → set root to `/`.
* **Any static host**: Netlify, Vercel, Cloudflare Pages — just deploy the static files.

---

## 📝 Example

```
Original:  "Meet at 7. Bring snacks."
Hidden:    "alpha42"
Encoded:   visually identical (contains hidden U+FE0x markers)
Decoded:   "alpha42"
```

---


## 📄 License

Unlicenced

> Built **GhostWrite**, a browser‑based Unicode‑steganography tool that embeds and recovers hidden messages from plain text with a clean UI and zero backend.
