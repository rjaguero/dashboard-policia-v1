import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, Users, TrendingUp, Heart, Brain, Stethoscope } from 'lucide-react';

const KPIPanel = ({ data }) => {
  if (!data) return <div>Cargando KPIs...</div>;

  const kpis = [
    {
      title: 'Total Encuestados',
      value: data.total_responses || 0,
      icon: Users,
      description: 'Respuestas totales',
      color: 'text-blue-600'
    },
    {
      title: 'Actividad Física',
      value: `${data.physical_activity_percentage || 0}%`,
      icon: Activity,
      description: 'Realizan ejercicio',
      color: 'text-green-600'
    },
    {
      title: 'Deseo de Mejora',
      value: `${data.needs_improvement_percentage || 0}%`,
      icon: TrendingUp,
      description: 'Quieren mejorar factores',
      color: 'text-orange-600'
    },
    {
      title: 'Capacitación Seguridad',
      value: `${data.safety_training_percentage || 0}%`,
      icon: Brain,
      description: 'Recibieron capacitación',
      color: 'text-purple-600'
    },
    {
      title: 'Conocimiento Servicios',
      value: `${data.occupational_knowledge_percentage || 0}%`,
      icon: Heart,
      description: 'Conocen servicios de salud',
      color: 'text-red-600'
    },
    {
      title: 'Chequeos Médicos',
      value: `${data.medical_checkup_percentage || 0}%`,
      icon: Stethoscope,
      description: 'Se realizaron chequeos',
      color: 'text-indigo-600'
    }
  ];

  const topFactors = data.top_factors_to_improve || {};
  const factorsList = Object.entries(topFactors).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Factors to Improve */}
      {factorsList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Principales Factores a Mejorar</CardTitle>
            <CardDescription>Los 3 factores más mencionados para mejorar la calidad de vida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {factorsList.map(([factor, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-red-500' : 
                      index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium">{factor}</span>
                  </div>
                  <span className="text-sm text-gray-600">{count} menciones</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KPIPanel;

