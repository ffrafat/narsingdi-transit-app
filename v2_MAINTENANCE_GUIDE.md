# Rail Transit v2.1 - Maintenance & Design Guide

This document serves as a reference for the design system, architecture, and build processes established in the version 2.0/2.1 update.

## 🎨 Design System

The v2.x updates introduced a "Premium Emerald" aesthetic, focusing on clean white surfaces, soft shadows, and dynamic brand visuals.

### Core Colors
| Element | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Primary (Accent)** | `#075d37` (Deep Emerald) | `#41ab5d` (Bright Emerald) |
| **Background** | `#f7fbf1` (Mint White) | `#0a1f0f` (Dark Forest) |
| **Surface (Cards)** | `#f7fbf1` (White) | `#0f2817` (Deep Green) |
| **Icon Tints** | `rgba(65, 171, 93, 0.08)` | `rgba(65, 171, 93, 0.15)` |

### Typography
The app uses **Anek Bangla** globally.
- **Headers**: `AnekBangla_800ExtraBold` or `700Bold`
- **Body**: `AnekBangla_400Regular` or `500Medium`
- **Navigation**: `AnekBangla_700Bold`

### Key Components
- **`ThemedHeader.js`**: Reusable header with dynamic background images and color overlays. Height is matched to the Settings page (95dp total with insets).
- **`TicketBottomNav.js`**: Persistent navigation for the e-ticket section with 5 shortcuts (Home, Ticket, Profile, History, Verify).

---

## 🛠️ Build Commands (EAS)

Commands to generate build artifacts for Android.

### 1. Build APK (For Testing)
Use the `preview` profile to generate a `.apk` file that can be manually installed.

**Local Build (Recommended - Free):**
```bash
eas build --platform android --profile preview --local
```

**Cloud Build (Expo Servers):**
```bash
eas build --platform android --profile preview
```

### 2. Build AAB (For Google Play Store)
Use the `production` profile to generate a `.aab` file for store submission.

```bash
eas build --platform android --profile production
```

---

## 📁 Project Structure Notes
- `ticketscreens/`: Contains all WebView-based railway pages.
- `constants/heroThemes.js`: Configuration for the dynamic background themes (Default, Islamic, Abstract).
- `ThemeContext.js`: Manages both the Material Design mode (Light/Dark) and the Hero Background theme.

---

**Version**: 2.1
**Maintained by**: Faisal Faruque Rafat
