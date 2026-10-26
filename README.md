# Distraction-Free YouTube (Local Extension)

A lightweight, high-performance browser extension (Manifest V3) that eliminates YouTube distractions so you can watch intentionally without getting trapped in algorithmic rabbit holes.

---

## ✨ Features

- **Hide Home Feed**: Completely removes the algorithmic recommendation grid, category pills, and infinite scroll from `youtube.com/`.
- **Hide Left Navigation Sidebar**: Hides the left guide drawer, mini-guide icon strip, and the hamburger button, maximizing video workspace.
- **Hide Video Watch Sidebar**: Eliminates recommended and "Up Next" videos beside the video player, automatically centering the video.
- **Zen Home Screen**: Injects a clean, distraction-free search hub on the home page with quick shortcuts to your intentional destinations:
  - Subscriptions (`/feed/subscriptions`)
  - Library (`/feed/library`)
  - Watch Later (`/playlist?list=WL`)
  - History (`/feed/history`)
- **Hide Shorts Shelves**: Removes Shorts carousels, tabs, and recommendation tiles from search and channel pages.
- **Convert Shorts to Normal Video**: Automatically opens `/shorts/ID` URLs in the standard distraction-free player (`/watch?v=ID`) instead of the endless vertical doomscroll.
- **Hide Endscreen Cards**: Stops distracting video preview tiles from covering the video before it finishes.
- **Hide Comments**: Automatically hides the video comment section (both standard comment list and side engagement panels).
- **Playback-Aware Comment Control**: Optional sub-toggle to hide comments specifically while the video is playing, and reveal them if you pause.
- **Zero-Flicker Injection**: Injects synchronously at document start with no recommendation flash.
- **Live Real-Time Control**: Changes in the popup update active YouTube tabs instantly without needing to reload.

---

## 🚀 How to Install Locally (Takes 30 Seconds)

### For Chrome, Brave, Edge, and Chromium Browsers:

1. Open your browser and navigate to the Extensions management page:
   - **Chrome**: `chrome://extensions`
   - **Brave**: `brave://extensions`
   - **Edge**: `edge://extensions`
2. Enable **"Developer mode"** (toggle located in the top-right corner).
3. Click the **"Load unpacked"** button in the top-left toolbar.
4. Select this directory:
   ```
   /home/romeyn/Projects/Personal/dfyoutube
   ```
5. *(Recommended)* Click the puzzle piece icon on your browser toolbar and pin **Distraction Free YouTube** for quick 1-click access to settings.

### For Firefox:

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select the `manifest.json` file inside this directory.

---

## ⚙️ Extension Settings & Controls

Click the extension icon in your browser toolbar to access the popup menu:

| Setting | Default | Description |
| :--- | :--- | :--- |
| **Focus Mode Master Switch** | **ON** | Instantly toggles all distraction-free features on or off. |
| **Hide Home Feed** | **ON** | Hides the recommended video grid on the home page. |
| **Hide Left Sidebar** | **ON** | Hides the left navigation bar, drawer, and hamburger button. |
| **Hide Watch Sidebar** | **ON** | Hides recommendations next to video players and centers video. |
| **Hide Comments** | **ON** | Hides video comments (including slide-out comment panels). |
| **Only While Video Plays** | **OFF** | Sub-option: hides comments while playing; reveals when paused. |
| **Zen Home Screen** | **ON** | Replaces empty home void with a clean search prompt & shortcuts. |
| **Hide Shorts Shelves** | **ON** | Blocks algorithmic Shorts carousels and tabs. |
| **Convert Shorts to Video** | **ON** | Plays Shorts in the normal distraction-free player. |
| **Hide Endscreen Tiles** | **ON** | Stops "Next Video" tiles from popping up at the end of videos. |

---

## 📁 File Structure

```
dfyoutube/
├── manifest.json         # Extension Manifest V3 configuration
├── content/
│   ├── content.css       # Targeted CSS selectors for YouTube DOM elements
│   └── content.js        # Fast startup, SPA navigation handler, Zen screen injector
├── popup/
│   ├── popup.html        # Glassmorphic dark popup user interface
│   ├── popup.css         # Modern styling & smooth switch animations
│   └── popup.js          # Settings synchronization and tab messaging
├── icons/
│   ├── icon16.png        # Toolbar icon (16x16)
│   ├── icon48.png        # Extension manager icon (48x48)
│   └── icon128.png       # Web Store / HiDPI icon (128x128)
├── generate_icons.py     # Script to regenerate crisp icons
└── README.md             # Documentation & installation instructions
```
