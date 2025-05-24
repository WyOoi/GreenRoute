import { NextResponse } from 'next/server';

// Mock weather data - in production, this would integrate with OpenWeatherMap or similar
function generateMockWeatherData(lat, lon) {
  // Simulate weather variation based on location and time
  const baseTemp = 22 + Math.sin(lat * 0.1) * 8; // Temperature variation by latitude
  const timeOfDay = new Date().getHours();
  const dailyVariation = Math.sin((timeOfDay - 6) * Math.PI / 12) * 6; // Daily temperature cycle
  
  const temperature = Math.round((baseTemp + dailyVariation) * 10) / 10;
  const humidity = Math.round((60 + Math.random() * 30) * 10) / 10;
  const pressure = Math.round((1013 + (Math.random() - 0.5) * 20) * 10) / 10;
  const windSpeed = Math.round((5 + Math.random() * 15) * 10) / 10;
  const windDirection = Math.round(Math.random() * 360);
  
  // UV Index calculation (simplified)
  const uvIndex = Math.max(0, Math.round(8 * Math.sin((timeOfDay - 6) * Math.PI / 12)));
  
  // Air quality impact from weather
  const weatherImpact = {
    dispersion: windSpeed > 10 ? 'good' : windSpeed > 5 ? 'moderate' : 'poor',
    inversions: temperature < 15 && humidity > 80 ? 'likely' : 'unlikely'
  };

  return {
    temperature,
    humidity,
    pressure,
    windSpeed,
    windDirection,
    uvIndex,
    weatherImpact,
    conditions: getWeatherCondition(temperature, humidity, windSpeed),
    timestamp: new Date().toISOString()
  };
}

function getWeatherCondition(temp, humidity, windSpeed) {
  if (humidity > 90) return 'foggy';
  if (temp > 30) return 'hot';
  if (temp < 5) return 'cold';
  if (windSpeed > 20) return 'windy';
  if (humidity < 30) return 'dry';
  return 'clear';
}

function calculateHeatIndex(temperature, humidity) {
  // Simplified heat index calculation
  if (temperature < 27) return temperature;
  
  const c1 = -8.78469475556;
  const c2 = 1.61139411;
  const c3 = 2.33854883889;
  const c4 = -0.14611605;
  const c5 = -0.012308094;
  const c6 = -0.0164248277778;
  const c7 = 0.002211732;
  const c8 = 0.00072546;
  const c9 = -0.000003582;
  
  const T = temperature;
  const R = humidity;
  
  const heatIndex = c1 + (c2 * T) + (c3 * R) + (c4 * T * R) + 
                   (c5 * T * T) + (c6 * R * R) + (c7 * T * T * R) + 
                   (c8 * T * R * R) + (c9 * T * T * R * R);
  
  return Math.round(heatIndex * 10) / 10;
}

function calculateComfortScore(temp, humidity, windSpeed, uvIndex) {
  // Ideal temperature range: 18-24°C
  let tempScore = 1 - Math.abs(temp - 21) / 20;
  tempScore = Math.max(0, Math.min(1, tempScore));
  
  // Ideal humidity range: 40-60%
  let humidityScore = 1 - Math.abs(humidity - 50) / 50;
  humidityScore = Math.max(0, Math.min(1, humidityScore));
  
  // Wind score (gentle breeze is good)
  let windScore = windSpeed > 25 ? 0.3 : windSpeed > 15 ? 0.7 : windSpeed > 5 ? 1 : 0.8;
  
  // UV score (lower is better for comfort)
  let uvScore = uvIndex > 8 ? 0.3 : uvIndex > 5 ? 0.7 : 1;
  
  // Weighted average
  const comfort = (tempScore * 0.4 + humidityScore * 0.3 + windScore * 0.2 + uvScore * 0.1);
  return Math.round(comfort * 100) / 100;
}

function getComfortLevel(score) {
  if (score >= 0.8) return 'very comfortable';
  if (score >= 0.6) return 'comfortable';
  if (score >= 0.4) return 'moderate';
  if (score >= 0.2) return 'uncomfortable';
  return 'very uncomfortable';
}

function getComfortRecommendations(score, weather) {
  const recommendations = [];
  
  if (weather.temperature > 28) {
    recommendations.push('Seek shade and stay hydrated');
  }
  if (weather.temperature < 10) {
    recommendations.push('Dress warmly');
  }
  if (weather.uvIndex > 6) {
    recommendations.push('Use sun protection');
  }
  if (weather.humidity > 80) {
    recommendations.push('Expect muggy conditions');
  }
  if (weather.windSpeed > 20) {
    recommendations.push('Expect windy conditions');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great weather for outdoor activities!');
  }
  
  return recommendations;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lon = parseFloat(searchParams.get('lon'));
    
    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ 
        error: 'Valid lat and lon parameters are required' 
      }, { status: 400 });
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json({ 
        error: 'Invalid coordinates. Lat must be between -90 and 90, lon between -180 and 180' 
      }, { status: 400 });
    }

    const weatherData = generateMockWeatherData(lat, lon);
    const heatIndex = calculateHeatIndex(weatherData.temperature, weatherData.humidity);
    
    // Calculate comfort score (0-1, where 1 is most comfortable)
    const comfortScore = calculateComfortScore(
      weatherData.temperature, 
      weatherData.humidity, 
      weatherData.windSpeed,
      weatherData.uvIndex
    );

    const response = {
      location: {
        latitude: lat,
        longitude: lon
      },
      current: {
        temperature: weatherData.temperature,
        temperatureUnit: 'C',
        humidity: weatherData.humidity,
        pressure: weatherData.pressure,
        pressureUnit: 'hPa',
        wind: {
          speed: weatherData.windSpeed,
          direction: weatherData.windDirection,
          unit: 'km/h'
        },
        uvIndex: weatherData.uvIndex,
        heatIndex: heatIndex,
        conditions: weatherData.conditions,
        comfort: {
          score: comfortScore,
          level: getComfortLevel(comfortScore),
          recommendations: getComfortRecommendations(comfortScore, weatherData)
        }
      },
      environmental: {
        airQualityImpact: weatherData.weatherImpact,
        pollutionDispersion: weatherData.weatherImpact.dispersion,
        thermalComfort: comfortScore > 0.7 ? 'comfortable' : comfortScore > 0.4 ? 'moderate' : 'uncomfortable'
      },
      timestamp: weatherData.timestamp
    };

    // Add forecast for next few hours (simplified)
    response.forecast = [];
    for (let i = 1; i <= 6; i++) {
      const futureHour = new Date();
      futureHour.setHours(futureHour.getHours() + i);
      
      const forecastData = generateMockWeatherData(lat, lon);
      // Add some temporal variation
      forecastData.temperature += (Math.random() - 0.5) * 2;
      
      response.forecast.push({
        time: futureHour.toISOString(),
        temperature: Math.round(forecastData.temperature * 10) / 10,
        humidity: forecastData.humidity,
        conditions: forecastData.conditions,
        comfort: calculateComfortScore(forecastData.temperature, forecastData.humidity, forecastData.windSpeed, forecastData.uvIndex)
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 