# 🗺️ OpenLeaf Map Application

A modern, interactive map application built with Next.js, Leaflet, and MapLibre GL that provides multiple map styles and real-time location tracking.

## ✨ Features

-   **Fullscreen Map Display** - Immersive full-screen map experience
-   **Multiple Map Styles** - Switch between 4 different map styles:
    -   🌙 **Positron** - Clean, minimal light theme
    -   ☀️ **Bright** - Vibrant, colorful map style
    -   🗺️ **Liberty** - Classic map design
    -   📦 **3D** - Interactive 3D perspective view
-   **Real-time Location Tracking** - GPS-based location with animated markers
-   **Location Radius** - Visual 500m radius circle around your position
-   **Responsive Design** - Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn package manager

### Installation

1. **Clone or download the project**

    ```bash
    cd openleaf
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🎮 Usage

### Map Style Controls

-   Located in the **top-left corner**
-   Click any style button to switch map appearance
-   Each style offers a unique visual experience

### Location Services

-   **"Enable Location"** button in the **top-right corner**
-   Click to activate GPS tracking
-   Requires browser location permission
-   Shows animated blue marker at your position
-   Displays a 500m radius circle around you

### Navigation

-   **Zoom**: Use mouse wheel or pinch gestures
-   **Pan**: Click and drag to move around the map
-   **3D Mode**: Use mouse to rotate and tilt the view

## 🛠️ Tech Stack

-   **Next.js 15** - React framework with App Router
-   **React 19** - Modern React with hooks
-   **TypeScript** - Type-safe development
-   **Tailwind CSS** - Utility-first styling
-   **Leaflet** - Interactive 2D maps
-   **MapLibre GL** - 3D map rendering
-   **Lucide React** - Beautiful icons
-   **OpenFreeMap** - Free map tile provider

## 📁 Project Structure

```
openleaf/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page with location logic
├── components/
│   └── MapComponent.tsx     # Core map component
├── public/                  # Static assets
├── package.json             # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS configuration
└── README.md               # This file
```

## 🎯 Key Components

### `app/page.tsx`

-   Main application entry point
-   Handles geolocation API integration
-   Manages location state and permissions
-   Provides location data to map component

### `components/MapComponent.tsx`

-   Core map rendering logic
-   Handles both Leaflet (2D) and MapLibre GL (3D) maps
-   Manages map style switching
-   Renders user location markers and radius circles

## 🔧 Configuration

### Map Styles

Map styles are configured in `components/MapComponent.tsx`:

```typescript
const mapStyles = {
	positron: "https://tiles.openfreemap.org/styles/positron",
	bright: "https://tiles.openfreemap.org/styles/bright",
	liberty: "https://tiles.openfreemap.org/styles/liberty",
	"3d": "https://tiles.openfreemap.org/styles/liberty",
};
```

### Default Location

Default map center is set to Philippines:

-   Latitude: 14.8833
-   Longitude: 120.2833
-   Zoom: 13

## 📱 Browser Compatibility

-   **Chrome/Edge**: Full support including 3D features
-   **Firefox**: Full support including 3D features
-   **Safari**: Full support including 3D features
-   **Mobile browsers**: Touch gestures supported

## 🔒 Privacy & Permissions

-   Location data is only used locally for map display
-   No location data is stored or transmitted to external servers
-   Location permission can be revoked at any time through browser settings

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npx vercel deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Location Not Working

-   Ensure HTTPS or localhost for location services
-   Check browser location permissions
-   Verify GPS is enabled on your device

### Map Not Loading

-   Check internet connection
-   Verify OpenFreeMap service availability
-   Clear browser cache and reload

### Performance Issues

-   Try switching to a lighter map style (Positron)
-   Disable location tracking if not needed
-   Check browser developer console for errors

---

**Built with ❤️ using modern web technologies**
