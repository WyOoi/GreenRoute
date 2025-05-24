# 🌱 GreenRoute - Smart Route Planner for Healthier, Greener Commutes

GreenRoute is a Next.js-powered Progressive Web App (PWA) that demonstrates intelligent route planning for urban pedestrians and cyclists. The application prioritizes environmental factors like air quality and shade coverage alongside traditional distance-based routing.

## ✨ Current Features

### 🗺️ Interactive Mapping
- **OpenStreetMap Integration**: Free, open-source mapping with no API keys required
- **Interactive Route Planning**: Click-to-set origin and destination points
- **Custom Markers**: Visual distinction between start points, destinations, and environmental data
- **Responsive Map Controls**: Zoom, pan, and navigate with smooth interactions

### 🌬️ Environmental Data Visualization
- **Mock Air Quality Sensors**: Displays PM2.5 values with color-coded indicators
  - Green (0-12 μg/m³): Good air quality
  - Yellow (13-35 μg/m³): Moderate air quality  
  - Red (36+ μg/m³): Unhealthy air quality
- **Tree Canopy Overlay**: Shaded areas representing potential shade coverage
- **Interactive Data Points**: Click sensors for detailed pollution information

### 🛣️ Smart Route Optimization
- **Three Route Variants**:
  - **Clean Air Route**: Prioritizes areas with lower pollution exposure
  - **Shaded Route**: Maximizes tree coverage and shade
  - **Balanced Route**: Optimal combination of environmental factors
- **Preference Weighting**: Adjustable sliders for pollution, shade, and distance priorities
- **Route Scoring**: Algorithmic evaluation based on environmental and distance factors

### 🎯 User Experience Features
- **Preference Customization**: Real-time adjustment of route priorities
- **Route Comparison**: Side-by-side analysis of different route options
- **Environmental Metrics**: Detailed scoring for air quality, shade, and distance
- **Quick Presets**: One-click preference settings (Clean Air, Max Shade, Shortest)

### 📱 Progressive Web App
- **Installable**: Add to home screen on mobile devices
- **Offline-Ready**: Service worker caching for core functionality
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Fast Loading**: Optimized performance with Next.js

### 📊 User Dashboard
- **Personal Statistics**: Track total distance, routes planned, and environmental impact
- **Achievement System**: Gamified badges for route planning milestones
- **Route History**: Visual history of previously planned routes
- **Environmental Impact**: CO₂ savings and pollution avoidance metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/WyOoi/GreenRoute.git
   cd greenroute
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
   Navigate to [http://localhost:3000](http://localhost:3000)

**Note**: No API keys required for basic functionality! OpenStreetMap provides free mapping services.

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 15**: React framework with server-side rendering
- **React 19**: Component-based UI development
- **Tailwind CSS**: Utility-first styling framework
- **React-Leaflet**: OpenStreetMap integration for React
- **Lucide React**: Clean, customizable icons

### Backend Implementation
- **Next.js API Routes**: Server-side logic for route computation
- **Mock Data APIs**: Simulated environmental and weather data
- **Route Algorithm**: Custom scoring system for multi-factor optimization

### Key Components
```
src/
├── app/
│   ├── page.js              # Landing page
│   ├── search/page.js       # Main route planning interface
│   ├── dashboard/page.js    # User statistics and achievements
│   └── api/                 # Backend API endpoints
├── components/
│   ├── OpenStreetMap.js     # Interactive map component
│   ├── RouteInputForm.js    # Origin/destination input
│   ├── RouteOptionsPanel.js # Route comparison display
│   └── PreferenceSlider.js  # Priority adjustment controls
```

## 🔧 Configuration

### Environment Setup
The application works out-of-the-box with OpenStreetMap. For enhanced features:

```bash
# Optional: Copy environment template
cp env-example.txt .env.local

# Add optional API keys for future enhancements
OPENWEATHER_API_KEY=your_key_here  # For real weather data
```

### Customization Options
- **Map Center**: Modify default location in `src/app/search/page.js`
- **Mock Data**: Update environmental data in `src/components/OpenStreetMap.js`
- **Styling**: Customize colors and layout in Tailwind classes
- **Route Algorithm**: Adjust scoring weights in `src/app/api/route-compute/route.js`

## 📊 API Endpoints

### Route Computation
**POST** `/api/route-compute`
```json
{
  "origin": { "latitude": 37.7749, "longitude": -122.4194 },
  "destination": { "latitude": 37.7849, "longitude": -122.4094 },
  "weights": { "pollution": 0.4, "shade": 0.4, "distance": 0.2 }
}
```

### Mock Environmental Data
**GET** `/api/air-quality?bbox=minLon,minLat,maxLon,maxLat`
**GET** `/api/weather?lat=37.7749&lon=-122.4194`

## 🎮 How to Use

### Planning a Route
1. **Visit the Search page** (`/search`)
2. **Click on the map** to set your starting point (green marker)
3. **Click again** to set your destination (red marker)
4. **Adjust preferences** using the sliders in the sidebar
5. **Compare route options** with different environmental priorities
6. **Select your preferred route** based on the displayed metrics

### Understanding the Data
- **Air Quality Markers**: Color-coded circles showing pollution levels
- **Route Lines**: Different colors for Clean Air, Shaded, and Balanced routes
- **Environmental Scores**: Percentage-based ratings for air quality and shade
- **Distance & Time**: Estimated walking/cycling duration and distance

## 🔮 Current Limitations & Future Potential

### What's Mock Data
- **Air Quality Sensors**: Uses simulated PM2.5 values for demonstration
- **Weather Information**: Generated environmental comfort data
- **Tree Canopy**: Placeholder shade coverage areas
- **Route Computation**: Algorithmic simulation rather than real traffic data

### Production-Ready Features
- ✅ Interactive mapping with OpenStreetMap
- ✅ Route planning and optimization algorithms
- ✅ User preference system and route comparison
- ✅ Progressive Web App functionality
- ✅ Responsive design and mobile optimization

### Enhancement Opportunities
For production deployment, consider integrating:
- Real air quality APIs (PurpleAir, EPA, local government)
- Actual weather services (OpenWeatherMap)
- Live traffic and routing data (GraphHopper, OSRM)
- Real tree canopy data (municipal GIS systems)

See **[API_SETUP.md](API_SETUP.md)** for detailed integration guidance.

## 🤝 Contributing

This project demonstrates environmental-aware route planning concepts. Contributions welcome for:
- Real API integrations
- Enhanced route algorithms
- Additional environmental factors
- UI/UX improvements
- Performance optimizations

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Built with 💚 for healthier urban mobility**

Demo: https://greenroute.vercel.app (if deployed)
Repository: https://github.com/WyOoi/GreenRoute.git
