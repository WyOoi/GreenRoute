# 🌱 GreenRoute - Smart Route Planner for Healthier, Greener Commutes

GreenRoute is a Next.js-powered Progressive Web App (PWA) that helps urban dwellers plan walking and cycling routes that minimize pollution exposure and maximize shade coverage. By combining real-time environmental data with intelligent route optimization, GreenRoute makes every journey healthier and more comfortable.

![GreenRoute Screenshot](https://via.placeholder.com/800x400/10b981/ffffff?text=GreenRoute+Map+Interface)

## ✨ Features

### 🌬️ Real-Time Air Quality Integration
- Live PM2.5, NO2, and O3 measurements from city sensors
- Visual pollution heatmap overlay on interactive maps
- Air Quality Index (AQI) calculations and health recommendations
- Rush hour pollution pattern awareness

### 🌳 Shade & Temperature Optimization
- Tree canopy coverage analysis from satellite imagery
- Heat index calculations with comfort scoring
- UV exposure minimization for outdoor safety
- Temperature-aware route recommendations

### 🗺️ Smart Route Planning
- **Clean Air Routes**: Minimize pollution exposure
- **Shaded Routes**: Maximize tree coverage and comfort
- **Balanced Routes**: Optimal combination of factors
- Customizable preference weighting system

### 📱 Progressive Web App (PWA)
- Offline route planning capabilities
- Install as native mobile app
- Background sync for real-time updates
- Push notifications for air quality alerts

### 🎯 Gamification & Personal Tracking
- Green Points reward system
- Achievement badges (Clean Air Champion, Shade Seeker, etc.)
- Route history and personal statistics
- CO₂ savings calculator

### 🔔 Smart Notifications
- Air quality spike alerts at departure times
- Weather-based route recommendations
- Personalized health and safety tips

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/greenroute.git
   cd greenroute
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env-example.txt .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   # Mapbox API Token (Get from https://account.mapbox.com/)
   # Important: Must be prefixed with NEXT_PUBLIC_ for client-side access
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here
   
   # OpenWeatherMap API Key (Get from https://openweathermap.org/api)
   OPENWEATHER_API_KEY=your_openweather_key_here
   
   # For production deployments
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see GreenRoute in action!

## 🏗️ Architecture

### Frontend (Next.js + React)
- **Pages**: Home landing, route search, user dashboard
- **Components**: Interactive map, route options panel, preference sliders
- **State Management**: React Context for user preferences and route data
- **Styling**: Tailwind CSS for responsive, modern UI

### Backend (Next.js API Routes)
- **`/api/air-quality`**: Fetches real-time pollution data
- **`/api/weather`**: Provides weather and comfort information  
- **`/api/route-compute`**: Core route optimization algorithm

### Map & Visualization
- **Mapbox GL JS**: Interactive maps with custom layers
- **GeoJSON**: Environmental data visualization
- **React Map GL**: React integration for map components

### PWA Features
- **next-pwa**: Service worker and offline capabilities
- **Web Push**: Notifications for air quality alerts
- **IndexedDB**: Local storage for offline route caching

## 🔧 Configuration

### Map Tiles & Routing
GreenRoute uses Mapbox for map tiles and basic routing. For production use:

1. **Get a Mapbox Token**: Sign up at [mapbox.com](https://mapbox.com)
2. **Add to environment**: Set `NEXT_PUBLIC_MAPBOX_TOKEN` in your `.env.local`
3. **Customize styles**: Modify map styles in `src/app/search/page.js`

### Environmental Data Sources
The current implementation uses mock data for demonstration. For production:

- **Air Quality**: Integrate with local government APIs or PurpleAir
- **Tree Canopy**: Use municipal GIS data or satellite imagery services
- **Weather**: Connect to OpenWeatherMap or local meteorological services

## 📊 API Documentation

### Route Computation API
**POST** `/api/route-compute`

```json
{
  "origin": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "destination": {
    "latitude": 37.7849,
    "longitude": -122.4094
  },
  "weights": {
    "pollution": 0.4,
    "shade": 0.4,
    "distance": 0.2
  }
}
```

**Response:**
```json
{
  "success": true,
  "routes": [
    {
      "category": "low-pollution",
      "metrics": {
        "distance_km": 2.3,
        "time_minutes": 28,
        "pollution_score": 0.15,
        "shade_score": 0.45,
        "carbon_savings": 0.35
      },
      "description": "Takes you through areas with the cleanest air quality...",
      "highlights": ["Low PM2.5 exposure", "Avoids busy roads"]
    }
  ],
  "summary": {
    "recommended_route": "low-pollution",
    "best_air_quality_score": 85,
    "estimated_walking_time": "28 minutes"
  }
}
```

### Air Quality API
**GET** `/api/air-quality?bbox=minLon,minLat,maxLon,maxLat`

Returns sensor data within the specified bounding box with AQI calculations.

### Weather API  
**GET** `/api/weather?lat=37.7749&lon=-122.4194`

Provides current weather, comfort scores, and environmental impact data.

## 🎮 User Experience

### Route Planning Flow
1. **Set Origin**: Click map or use current location
2. **Set Destination**: Click map or search address  
3. **Adjust Preferences**: Use sliders to prioritize air quality, shade, or distance
4. **Compare Routes**: View 3 optimized route options with environmental scores
5. **Select & Navigate**: Choose your preferred route and start your healthy journey

### Environmental Layers
- **Air Quality Sensors**: Color-coded circles showing PM2.5 levels
- **Tree Canopy**: Green shaded areas indicating shade coverage
- **Temperature Zones**: Heat warnings and comfort indicators

## 🌍 Environmental Impact

GreenRoute promotes sustainable urban mobility by:

- **Reducing Pollution Exposure**: Protecting respiratory health through cleaner route choices
- **Encouraging Active Transportation**: Making walking and cycling more appealing
- **Raising Environmental Awareness**: Visualizing air quality and urban heat islands
- **Supporting Green Infrastructure**: Highlighting the value of urban trees and green spaces

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork the repository and clone your fork
git clone https://github.com/your-username/greenroute.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push to your fork and create a Pull Request
git push origin feature/amazing-feature
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mapbox** for mapping services and routing capabilities
- **OpenWeatherMap** for weather data APIs
- **Urban environmental researchers** for air quality measurement methodologies
- **Open source community** for the fantastic tools and libraries that make this possible

## 📞 Support

- **Documentation**: [docs.greenroute.app](https://docs.greenroute.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/greenroute/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/greenroute/discussions)
- **Email**: support@greenroute.app

---

Made with 💚 for healthier cities and happier commuters.

**[Try GreenRoute Live Demo →](https://greenroute.vercel.app)**
