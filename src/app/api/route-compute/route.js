import { NextResponse } from 'next/server';

// Mock route computation with environmental factors
// In production, this would integrate with routing APIs like OSRM, GraphHopper, or Mapbox Directions

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function simulateRouteVariants(origin, destination, weights) {
  const baseDistance = calculateDistance(
    origin.latitude, origin.longitude,
    destination.latitude, destination.longitude
  );

  // Generate 3 different route variants
  const routes = [];

  // Route 1: Low pollution priority
  routes.push({
    category: 'low-pollution',
    polyline: `mock_polyline_${Date.now()}_1`,
    metrics: {
      distance_km: baseDistance * 1.15, // 15% longer for cleaner air
      time_minutes: Math.round(baseDistance * 1.15 * 12), // ~12 min/km walking
      pollution_score: 0.15, // Very low pollution exposure
      shade_score: 0.45, // Moderate shade
      carbon_savings: Math.round(baseDistance * 0.15 * 100) / 100,
      route_efficiency: 0.85
    },
    description: 'Takes you through areas with the cleanest air quality, avoiding high-traffic roads and industrial zones.',
    highlights: ['Low PM2.5 exposure', 'Avoids busy roads', 'Good for sensitive individuals']
  });

  // Route 2: Most shaded priority
  routes.push({
    category: 'most-shaded',
    polyline: `mock_polyline_${Date.now()}_2`,
    metrics: {
      distance_km: baseDistance * 1.08, // 8% longer for shade
      time_minutes: Math.round(baseDistance * 1.08 * 12),
      pollution_score: 0.35, // Moderate pollution
      shade_score: 0.85, // Excellent shade coverage
      carbon_savings: Math.round(baseDistance * 0.08 * 100) / 100,
      route_efficiency: 0.92
    },
    description: 'Maximizes tree canopy coverage and shade, perfect for hot sunny days.',
    highlights: ['High tree coverage', 'Cool micro-climate', 'UV protection']
  });

  // Route 3: Balanced optimization
  routes.push({
    category: 'balanced',
    polyline: `mock_polyline_${Date.now()}_3`,
    metrics: {
      distance_km: baseDistance * 1.05, // 5% longer for balance
      time_minutes: Math.round(baseDistance * 1.05 * 12),
      pollution_score: 0.25, // Good pollution avoidance
      shade_score: 0.65, // Good shade coverage
      carbon_savings: Math.round(baseDistance * 0.05 * 100) / 100,
      route_efficiency: 0.95
    },
    description: 'Optimal balance of clean air, shade, and reasonable distance.',
    highlights: ['Best overall experience', 'Balanced environmental factors', 'Efficient routing']
  });

  // Apply user preference weights to reorder routes
  routes.forEach(route => {
    route.weightedScore = calculateWeightedScore(route.metrics, weights);
  });

  // Sort by weighted score (higher is better)
  routes.sort((a, b) => b.weightedScore - a.weightedScore);

  return routes;
}

function calculateWeightedScore(metrics, weights) {
  // Convert pollution score to "cleanliness" score (invert it)
  const cleanlinessScore = 1 - metrics.pollution_score;
  
  // Normalize distance to a 0-1 score (shorter is better)
  const distanceScore = Math.max(0, 1 - (metrics.distance_km - 1) / 10); // Assume 1km baseline
  
  const score = 
    (cleanlinessScore * weights.pollution) +
    (metrics.shade_score * weights.shade) +
    (distanceScore * weights.distance);
    
  return Math.round(score * 1000) / 1000; // Round to 3 decimal places
}

function enhanceRouteWithRealTimeData(route, origin, destination) {
  // Simulate real-time enhancements
  const now = new Date();
  const hour = now.getHours();
  
  // Adjust pollution based on time of day (rush hour effects)
  if (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19) {
    route.metrics.pollution_score *= 1.3; // Increase pollution during rush hours
    route.metrics.pollution_score = Math.min(1, route.metrics.pollution_score);
  }
  
  // Add real-time alerts
  route.alerts = [];
  
  if (route.metrics.pollution_score > 0.4) {
    route.alerts.push({
      type: 'pollution',
      severity: 'moderate',
      message: 'Moderate air pollution detected along this route'
    });
  }
  
  if (route.metrics.shade_score < 0.3 && hour >= 11 && hour <= 16) {
    route.alerts.push({
      type: 'heat',
      severity: 'warning',
      message: 'Limited shade available during peak sun hours'
    });
  }
  
  // Add estimated air quality improvement
  const baseline_exposure = 0.5; // Baseline pollution exposure for typical route
  const exposure_reduction = ((baseline_exposure - route.metrics.pollution_score) / baseline_exposure) * 100;
  route.metrics.air_quality_improvement = Math.max(0, Math.round(exposure_reduction));
  
  return route;
}

function generateRouteSummary(routes) {
  const best_route = routes[0];
  const total_distance = routes.reduce((sum, route) => sum + route.metrics.distance_km, 0) / routes.length;
  const avg_pollution = routes.reduce((sum, route) => sum + route.metrics.pollution_score, 0) / routes.length;
  const avg_shade = routes.reduce((sum, route) => sum + route.metrics.shade_score, 0) / routes.length;
  
  return {
    recommended_route: best_route.category,
    total_routes_analyzed: routes.length,
    average_distance_km: Math.round(total_distance * 100) / 100,
    best_air_quality_score: Math.round((1 - Math.min(...routes.map(r => r.metrics.pollution_score))) * 100),
    best_shade_score: Math.round(Math.max(...routes.map(r => r.metrics.shade_score)) * 100),
    estimated_walking_time: `${Math.round(best_route.metrics.time_minutes)} minutes`,
    carbon_footprint_avoided: `${routes.reduce((sum, route) => sum + route.metrics.carbon_savings, 0).toFixed(2)} kg CO₂`
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { origin, destination, weights } = body;

    // Validate required fields
    if (!origin || !destination) {
      return NextResponse.json({
        error: 'Origin and destination coordinates are required'
      }, { status: 400 });
    }

    if (!origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
      return NextResponse.json({
        error: 'Origin and destination must have latitude and longitude'
      }, { status: 400 });
    }

    // Validate coordinates
    if (Math.abs(origin.latitude) > 90 || Math.abs(destination.latitude) > 90 ||
        Math.abs(origin.longitude) > 180 || Math.abs(destination.longitude) > 180) {
      return NextResponse.json({
        error: 'Invalid coordinates provided'
      }, { status: 400 });
    }

    // Set default weights if not provided
    const routeWeights = {
      pollution: weights?.pollution || 0.4,
      shade: weights?.shade || 0.4,
      distance: weights?.distance || 0.2
    };

    // Validate weights sum to approximately 1
    const weightSum = routeWeights.pollution + routeWeights.shade + routeWeights.distance;
    if (Math.abs(weightSum - 1) > 0.1) {
      return NextResponse.json({
        error: 'Route preference weights must sum to approximately 1.0'
      }, { status: 400 });
    }

    // Check if origin and destination are too close
    const distance = calculateDistance(
      origin.latitude, origin.longitude,
      destination.latitude, destination.longitude
    );

    if (distance < 0.1) { // Less than 100 meters
      return NextResponse.json({
        error: 'Origin and destination are too close. Minimum distance is 100 meters.'
      }, { status: 400 });
    }

    if (distance > 50) { // More than 50 km
      return NextResponse.json({
        error: 'Route distance too long. Maximum supported distance is 50 km.'
      }, { status: 400 });
    }

    // Generate route variants
    let routes = simulateRouteVariants(origin, destination, routeWeights);
    
    // Enhance routes with real-time data
    routes = routes.map(route => enhanceRouteWithRealTimeData(route, origin, destination));

    // Generate summary
    const summary = generateRouteSummary(routes);

    const response = {
      success: true,
      routes: routes,
      summary: summary,
      preferences: routeWeights,
      metadata: {
        origin: {
          latitude: origin.latitude,
          longitude: origin.longitude
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude
        },
        straight_line_distance: Math.round(distance * 100) / 100,
        computation_time: new Date().toISOString(),
        algorithm_version: '1.0.0'
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error computing routes:', error);
    return NextResponse.json({ 
      error: 'Internal server error during route computation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 