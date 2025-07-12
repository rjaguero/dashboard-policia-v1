import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Heart, TrendingUp } from 'lucide-react';
import ApiService from '../services/api';
import Filters from './Filters';
import ProfilePanel from './ProfilePanel';
import HabitsPanel from './HabitsPanel';
import QualityOfLifePanel from './QualityOfLifePanel';
import KPIPanel from './KPIPanel';

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
    loadInitialData();
  }, []);

  useEffect(() => {
    if (data) {
      loadFilteredData();
    }
  }, [filters, data]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllData();
      setData(response);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      const response = await ApiService.getFilteredData(filters);
      setFilteredData(response);
    } catch (err) {
      console.error('Error loading filtered data:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentData = filteredData || data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Policía Catamarca
              </h1>
              <p className="text-gray-600 mt-1">
                Encuesta de Bienestar y Calidad de Vida
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600">
                <Users className="w-4 h-4 mr-1" />
                {currentData?.kpis?.total_responses || 0} Encuestados
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={data?.filter_options}
          />
        </div>

        {/* KPI Panel */}
        <div className="mb-8">
          <KPIPanel data={currentData?.kpis} />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Perfil Demográfico</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Hábitos y Bienestar</span>
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Calidad de Vida</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfilePanel data={currentData?.demographics} />
          </TabsContent>

          <TabsContent value="habits">
            <HabitsPanel data={currentData?.habits} />
          </TabsContent>

          <TabsContent value="quality">
            <QualityOfLifePanel data={currentData?.quality_of_life} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500">
            <p>Dashboard de Encuesta - Policía de Catamarca</p>
            <p className="text-sm mt-1">
              Datos actualizados automáticamente
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

