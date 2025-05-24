'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  Award, 
  MapPin, 
  Shield, 
  TrendingUp, 
  Calendar, 
  Clock,
  Route,
  Star,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const [userStats, setUserStats] = useState({
    totalDistance: 45.2,
    routesPlanned: 28,
    greenPoints: 1250,
    pollutionAvoided: 85, // percentage
    co2Saved: 12.4
  });

  const [recentRoutes, setRecentRoutes] = useState([
    {
      id: 1,
      from: "Union Square",
      to: "Golden Gate Park",
      date: "2024-01-15",
      distance: 3.2,
      pollutionScore: 0.25,
      shadeScore: 0.85,
      category: "most-shaded"
    },
    {
      id: 2,
      from: "Mission District",
      to: "Embarcadero",
      date: "2024-01-14",
      distance: 2.8,
      pollutionScore: 0.15,
      shadeScore: 0.45,
      category: "low-pollution"
    },
    {
      id: 3,
      from: "Castro",
      to: "Chinatown",
      date: "2024-01-13",
      distance: 4.1,
      pollutionScore: 0.35,
      shadeScore: 0.65,
      category: "balanced"
    }
  ]);

  const [badges, setBadges] = useState([
    {
      id: 1,
      name: "First Steps",
      description: "Planned your first green route",
      icon: "🌱",
      earned: true,
      earnedDate: "2024-01-10"
    },
    {
      id: 2,
      name: "Clean Air Champion",
      description: "Avoided high pollution areas 10 times",
      icon: "💨",
      earned: true,
      earnedDate: "2024-01-12"
    },
    {
      id: 3,
      name: "Shade Seeker",
      description: "Chose shaded routes 15 times",
      icon: "🌳",
      earned: true,
      earnedDate: "2024-01-14"
    },
    {
      id: 4,
      name: "Green Explorer",
      description: "Plan 50 routes",
      icon: "🗺️",
      earned: false,
      progress: 28,
      target: 50
    },
    {
      id: 5,
      name: "Eco Warrior",
      description: "Save 25kg of CO2",
      icon: "🌍",
      earned: false,
      progress: 12.4,
      target: 25
    }
  ]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'low-pollution':
        return 'bg-blue-100 text-blue-800';
      case 'most-shaded':
        return 'bg-green-100 text-green-800';
      case 'balanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'low-pollution':
        return <Shield className="h-4 w-4" />;
      case 'most-shaded':
        return <Leaf className="h-4 w-4" />;
      case 'balanced':
        return <Target className="h-4 w-4" />;
      default:
        return <Route className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">GreenRoute</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/search" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Plan Route
              </Link>
              <Link href="/dashboard" className="text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Green Journey</h1>
          <p className="mt-2 text-gray-600">Track your progress and celebrate your contribution to a healthier city</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Distance</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalDistance} km</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Route className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Routes Planned</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.routesPlanned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Green Points</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.greenPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">CO₂ Saved</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.co2Saved} kg</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Routes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Routes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentRoutes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getCategoryIcon(route.category)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {route.from} → {route.to}
                          </p>
                          <p className="text-xs text-gray-500">{route.distance} km</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(route.category)}`}>
                        {route.category.replace('-', ' ')}
                      </span>
                      <p className="text-xs text-gray-500">{route.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/search" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Plan another route →
                </Link>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Achievements</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`p-4 rounded-lg border-2 ${
                      badge.earned 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <h3 className={`font-medium text-sm ${
                        badge.earned ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {badge.name}
                      </h3>
                      <p className={`text-xs mt-1 ${
                        badge.earned ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {badge.description}
                      </p>
                      {!badge.earned && badge.progress && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {badge.progress} / {badge.target}
                          </p>
                        </div>
                      )}
                      {badge.earned && (
                        <p className="text-xs text-green-600 mt-1">
                          Earned {badge.earnedDate}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/search" className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <MapPin className="h-6 w-6 text-green-600" />
              <span className="ml-3 text-sm font-medium text-green-900">Plan New Route</span>
            </Link>
            <button className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="ml-3 text-sm font-medium text-blue-900">View Route History</span>
            </button>
            <button className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <Award className="h-6 w-6 text-purple-600" />
              <span className="ml-3 text-sm font-medium text-purple-900">View All Badges</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 