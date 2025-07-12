import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, Users, Heart, Brain, TrendingUp, BarChart3 } from 'lucide-react';

import Filters from './Filters';
import KPIPanel from './KPIPanel';
import ProfilePanel from './ProfilePanel';
import HabitsPanel from './HabitsPanel';
import HealthPanel from './HealthPanel';
import KnowledgePanel from './KnowledgePanel';
import QualityOfLifePanel from './QualityOfLifePanel';
import AdvancedAnalyticsPanel from './AdvancedAnalyticsPanel';

import ApiService from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    distrito: 'all',
    genero: 'all',
    edad: 'all',
    jerarquia: 'all',
    estado_civil: 'all',
    actividad_fisica: 'false'
  });

  useEffect(() => {
    console.log('Dashboard: Initializing data load...');
    loadInitialData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log('Dashboard: Data changed, applying filters...');
      applyFilters();
    }
  }, [filters, data]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const result = await ApiService.getAllData();
      console.log('Dashboard: Initial data loaded:', result);
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error('Dashboard: Error loading initial data:', err);
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      console.log('Dashboard: Applying filters with:', filters);
      const result = await ApiService.getFilteredData(filters);
      console.log('Dashboard: Filtered data received:', result);
      setFilteredData(result);
    } catch (err) {
      console.error('Dashboard: Error applying filters:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('Dashboard: Filter change detected:', newFilters);
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Policía Catamarca
          </h1>
          <p className="text-lg text-gray-600">
            Encuesta de Bienestar y Calidad de Vida - Análisis Comprehensivo
          </p>
        </div>

        {/* Filters */}
        <Filters 
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={data?.filter_options || {}}
        />

        {/* KPIs */}
        <KPIPanel data={filteredData?.kpis || data?.kpis} />

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Hábitos
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Salud
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Conocimiento
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Calidad de Vida
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Análisis Avanzado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfilePanel data={filteredData?.demographics || data?.demographics} />
          </TabsContent>

          <TabsContent value="habits">
            <HabitsPanel data={filteredData?.habits || data?.habits} />
          </TabsContent>

          <TabsContent value="health">
            <HealthPanel data={filteredData?.health || data?.health} />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgePanel data={filteredData?.knowledge || data?.knowledge} />
          </TabsContent>

          <TabsContent value="quality">
            <QualityOfLifePanel data={filteredData?.quality_of_life || data?.quality_of_life} />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalyticsPanel data={filteredData || data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;



