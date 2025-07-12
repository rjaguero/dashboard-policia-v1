import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Users, Activity, Brain, AlertTriangle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdvancedAnalyticsPanel = ({ data }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('correlations');

  if (!data) return <div>Cargando análisis avanzado...</div>;

  // Preparar datos para matrices de correlación
  const healthCorrelationData = data.health?.health_correlation_matrix || [];
  const genderServicesData = data.demographics?.gender_additional_services_cross || [];
  const hierarchyWorkloadData = data.demographics?.hierarchy_workload_analysis || [];
  const knowledgeUsageData = data.knowledge?.knowledge_usage_cross || [];
  const trainingAccidentsData = data.knowledge?.training_accidents_cross || [];

  // Preparar datos para análisis de factores por género
  const factorsGenderAnalysis = data.quality_of_life?.factors_gender_analysis || {};
  const factorsHierarchyAnalysis = data.quality_of_life?.factors_hierarchy_analysis || {};

  // Convertir análisis de factores a formato de gráfico
  const prepareFactorsData = (analysis, keyName) => {
    const result = [];
    Object.entries(analysis).forEach(([factor, distribution]) => {
      Object.entries(distribution).forEach(([key, count]) => {
        result.push({
          factor: factor.length > 20 ? factor.substring(0, 20) + '...' : factor,
          fullFactor: factor,
          [keyName]: key,
          count: count
        });
      });
    });
    return result;
  };

  const factorsGenderData = prepareFactorsData(factorsGenderAnalysis, 'gender');
  const factorsHierarchyData = prepareFactorsData(factorsHierarchyAnalysis, 'hierarchy');

  // Análisis de riesgo (combinando múltiples factores)
  const riskAnalysisData = [
    {
      category: 'Sobrecarga Laboral',
      value: data.kpis?.overload_index || 0,
      risk: 'Alto',
      color: '#FF8042'
    },
    {
      category: 'Equilibrio Vida-Trabajo',
      value: 100 - (data.kpis?.work_life_balance_index || 0),
      risk: 'Crítico',
      color: '#FF4444'
    },
    {
      category: 'Satisfacción Económica',
      value: 100 - (data.kpis?.economic_satisfaction_percentage || 0),
      risk: 'Crítico',
      color: '#FF0000'
    },
    {
      category: 'Accidentes Laborales',
      value: data.kpis?.work_accidents_rate || 0,
      risk: 'Medio',
      color: '#FFBB28'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con métricas críticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Satisfacción Económica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {data.kpis?.economic_satisfaction_percentage || 0}%
            </div>
            <p className="text-xs text-red-600">Nivel crítico</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sobrecarga Laboral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              {data.kpis?.overload_index || 0}%
            </div>
            <p className="text-xs text-orange-600">Nivel alto</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Salud Integral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {data.kpis?.integral_health_index || 0}%
            </div>
            <p className="text-xs text-blue-600">Física + Mental</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Clima Organizacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {data.kpis?.organizational_climate_index || 0}%
            </div>
            <p className="text-xs text-purple-600">Índice compuesto</p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis avanzados */}
      <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="correlations">Correlaciones</TabsTrigger>
          <TabsTrigger value="cross-analysis">Análisis Cruzado</TabsTrigger>
          <TabsTrigger value="factors">Factores por Perfil</TabsTrigger>
          <TabsTrigger value="risk">Análisis de Riesgo</TabsTrigger>
        </TabsList>

        <TabsContent value="correlations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Correlación Salud Física vs Mental */}
            <Card>
              <CardHeader>
                <CardTitle>Correlación Salud Física vs Mental</CardTitle>
                <CardDescription>Relación entre ambos tipos de salud</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={healthCorrelationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="physical_health" />
                    <YAxis dataKey="mental_health" />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${props.payload.count} personas`,
                        `${props.payload.physical_health} (Física) - ${props.payload.mental_health} (Mental)`
                      ]}
                    />
                    <Scatter dataKey="count" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Género vs Servicios Adicionales */}
            <Card>
              <CardHeader>
                <CardTitle>Género vs Servicios Adicionales</CardTitle>
                <CardDescription>Distribución por género</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genderServicesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="gender" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conocimiento vs Utilización */}
            <Card>
              <CardHeader>
                <CardTitle>Conocimiento vs Utilización de Servicios</CardTitle>
                <CardDescription>¿Conocer lleva a usar?</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={knowledgeUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="knows_services" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Capacitación vs Accidentes */}
            <Card>
              <CardHeader>
                <CardTitle>Capacitación vs Accidentes Laborales</CardTitle>
                <CardDescription>¿La capacitación previene accidentes?</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trainingAccidentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="received_training" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cross-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Jerarquía vs Carga Laboral */}
            <Card>
              <CardHeader>
                <CardTitle>Jerarquía vs Carga Laboral</CardTitle>
                <CardDescription>Servicios adicionales y recargos por rango</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hierarchyWorkloadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hierarchy" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="additional_services" fill="#0088FE" name="Servicios Adicionales" />
                    <Bar dataKey="service_overload" fill="#FF8042" name="Recargos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Componentes del Clima Laboral */}
            <Card>
              <CardHeader>
                <CardTitle>Componentes del Clima Organizacional</CardTitle>
                <CardDescription>Desglose del índice compuesto</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { component: 'Reconocimiento', percentage: data.kpis?.climate_components?.recognition_percentage || 0 },
                    { component: 'Comunicación', percentage: data.kpis?.climate_components?.communication_percentage || 0 },
                    { component: 'Desarrollo', percentage: data.kpis?.climate_components?.development_percentage || 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="component" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                    <Bar dataKey="percentage" fill="#8884D8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Factores a Mejorar por Género */}
            <Card>
              <CardHeader>
                <CardTitle>Factores a Mejorar por Género</CardTitle>
                <CardDescription>¿Qué prioriza cada género?</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={factorsGenderData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="factor" type="category" width={100} />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} menciones`,
                        `${props.payload.fullFactor} - ${props.payload.gender}`
                      ]}
                    />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Factores a Mejorar por Jerarquía */}
            <Card>
              <CardHeader>
                <CardTitle>Factores a Mejorar por Jerarquía</CardTitle>
                <CardDescription>Prioridades según el rango</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={factorsHierarchyData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="factor" type="category" width={100} />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} menciones`,
                        `${props.payload.fullFactor} - ${props.payload.hierarchy}`
                      ]}
                    />
                    <Bar dataKey="count" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análisis de Riesgo */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Riesgo Organizacional</CardTitle>
                <CardDescription>Factores críticos identificados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value, name, props) => [`${value}%`, `Riesgo: ${props.payload.risk}`]} />
                    <Bar dataKey="value">
                      {riskAnalysisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución de Riesgo */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Niveles de Riesgo</CardTitle>
                <CardDescription>Clasificación por severidad</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Crítico', value: 2, color: '#FF0000' },
                        { name: 'Alto', value: 1, color: '#FF8042' },
                        { name: 'Medio', value: 1, color: '#FFBB28' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskAnalysisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recomendaciones */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Recomendaciones Críticas</CardTitle>
              <CardDescription className="text-yellow-700">Acciones prioritarias basadas en el análisis</CardDescription>
            </CardHeader>
            <CardContent className="text-yellow-800">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <strong>Urgente - Satisfacción Económica (6.35%):</strong> Revisar estructura salarial y beneficios económicos.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <strong>Alto - Sobrecarga Laboral (59.26%):</strong> Redistribuir servicios adicionales y recargos.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <strong>Mejorar - Equilibrio Vida-Trabajo (27.51%):</strong> Implementar políticas de flexibilidad laboral.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <strong>Fortalecer - Comunicación de Servicios:</strong> 0% de utilización indica falta de comunicación efectiva.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsPanel;

