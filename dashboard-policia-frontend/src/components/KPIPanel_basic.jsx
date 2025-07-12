import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';

const KPIPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total de Encuestados',
      value: data.total_responses || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Respuestas totales'
    },
    {
      title: 'Realizan Actividad Física',
      value: `${data.physical_activity_percentage || 0}%`,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Del total de encuestados'
    },
    {
      title: 'Desean Mejorar Factores',
      value: `${data.needs_improvement_percentage || 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Buscan mejorar calidad de vida'
    },
    {
      title: 'Principales Factores',
      value: Object.keys(data.top_factors_to_improve || {}).length,
      icon: AlertCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Áreas de mejora identificadas'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {kpi.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {kpi.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Factors to Improve */}
      {data.top_factors_to_improve && Object.keys(data.top_factors_to_improve).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>Principales Factores a Mejorar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.top_factors_to_improve)
                .sort(([,a], [,b]) => b - a)
                .map(([factor, count], index) => (
                  <Badge
                    key={factor}
                    variant={index === 0 ? "default" : "secondary"}
                    className="text-sm py-1 px-3"
                  >
                    {factor} ({count})
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KPIPanel;

