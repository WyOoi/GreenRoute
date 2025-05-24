# 🔑 API Setup Guide for GreenRoute

This guide explains how to obtain and configure API keys for enhanced functionality in production.

## 🗺️ Required APIs

### Mapbox (Required for Maps)
**Status**: ✅ **Already configured**
- **Purpose**: Interactive maps, routing, geocoding
- **Get API Key**: https://account.mapbox.com/
- **Environment Variable**: `NEXT_PUBLIC_MAPBOX_TOKEN`
- **Free Tier**: 50,000 map loads/month
- **Cost**: $5 per 1,000 additional requests

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_actual_mapbox_token_here
```

## 🌤️ Weather APIs

### OpenWeatherMap (Optional)
**Status**: 🟡 **Optional - currently using mock data**
- **Purpose**: Real weather data, UV index, comfort calculations
- **Get API Key**: https://openweathermap.org/api
- **Environment Variable**: `OPENWEATHER_API_KEY`
- **Free Tier**: 1,000 calls/day
- **Cost**: $40/month for 100,000 calls

```env
OPENWEATHER_API_KEY=your_openweather_key_here
```

## 🌬️ Air Quality APIs

### PurpleAir (Recommended)
**Status**: 🟡 **Optional - currently using mock data**
- **Purpose**: Real-time PM2.5 data from citizen sensors
- **Get API Key**: https://www2.purpleair.com/
- **Environment Variable**: `PURPLEAIR_API_KEY`
- **Free Tier**: Limited requests
- **Cost**: Contact for pricing

```env
PURPLEAIR_API_KEY=your_purpleair_key_here
```

### World Air Quality Index (WAQI)
**Status**: 🟡 **Optional**
- **Purpose**: Global air quality data
- **Get API Key**: https://aqicn.org/data-platform/token/
- **Environment Variable**: `WAQI_API_KEY`
- **Free Tier**: 1,000 requests/day
- **Cost**: Free for non-commercial use

```env
WAQI_API_KEY=your_waqi_token_here
```

### EPA AQS API (US Only)
**Status**: 🟡 **Optional**
- **Purpose**: Official EPA air quality data
- **Get API Key**: https://aqs.epa.gov/aqsweb/documents/data_api.html
- **Environment Variable**: `EPA_AQS_API_KEY`
- **Free Tier**: Unlimited (government data)

```env
EPA_AQS_API_KEY=your_epa_key_here
```

## 🚗 Enhanced Routing APIs

### Google Maps Platform
**Status**: 🟡 **Optional**
- **Purpose**: Alternative routing, traffic data, places
- **Get API Key**: https://console.cloud.google.com/google/maps-apis
- **Environment Variable**: `GOOGLE_MAPS_API_KEY`
- **Free Tier**: $200 credit monthly
- **Cost**: Variable by service

```env
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

### GraphHopper
**Status**: 🟡 **Optional**
- **Purpose**: Open-source routing with custom profiles
- **Get API Key**: https://www.graphhopper.com/
- **Environment Variable**: `GRAPHHOPPER_API_KEY`
- **Free Tier**: 500 requests/day
- **Cost**: €0.50 per 1,000 requests

```env
GRAPHHOPPER_API_KEY=your_graphhopper_key_here
```

## 🛠️ Setup Instructions

### 1. Development Setup
For development, only the Mapbox token is required:

```bash
# Copy environment template
cp env-example.txt .env.local

# Edit .env.local and add your Mapbox token
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

### 2. Production Setup
For production with real data:

1. **Sign up for required services** (at minimum Mapbox)
2. **Get API keys** from each service
3. **Add keys to your deployment environment**:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Docker: Use environment file or Docker secrets

### 3. Cost Estimation
For a medium-scale deployment (1000 users/month):

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Mapbox | $5-50 | Depends on map loads |
| OpenWeather | $0-40 | Free tier usually sufficient |
| PurpleAir | Contact | Varies by usage |
| WAQI | Free | Non-commercial use |
| Google Maps | $0-200 | $200 monthly credit |
| GraphHopper | €15-50 | For enhanced routing |

**Total estimated cost**: $20-340/month

## 🔒 Security Best Practices

### Client-Side vs Server-Side Keys
- **Client-side** (NEXT_PUBLIC_): Mapbox token only
- **Server-side**: All other API keys (hidden from browser)

### API Key Restrictions
1. **Mapbox**: Restrict to your domain(s)
2. **Google Maps**: Enable only required APIs
3. **Others**: Set usage limits and monitoring

### Environment Management
```bash
# Development
.env.local

# Production
# Use your hosting platform's environment variable system
# Never commit API keys to version control
```

## 🚀 Implementation Priority

### Phase 1: Basic Functionality ✅
- [x] Mapbox integration
- [x] Mock environmental data
- [x] Route computation

### Phase 2: Real Weather Data 🟡
- [ ] OpenWeatherMap integration
- [ ] Real-time comfort scoring
- [ ] Weather-based route recommendations

### Phase 3: Real Air Quality Data 🟡
- [ ] PurpleAir sensor integration
- [ ] EPA/Government data integration
- [ ] Real-time pollution alerts

### Phase 4: Enhanced Routing 🟡
- [ ] Multiple routing providers
- [ ] Traffic-aware routing
- [ ] Custom routing profiles

## 📊 Monitoring & Analytics

### Usage Tracking
Monitor API usage to avoid unexpected costs:
- Set up billing alerts
- Implement rate limiting
- Cache responses when possible
- Use webhook monitoring

### Performance Optimization
- Cache air quality data (5-15 minutes)
- Cache weather data (30-60 minutes)
- Implement request batching
- Use CDN for static map tiles

---

**Note**: The current implementation uses mock data for development. Follow this guide to integrate real APIs for production deployment. 