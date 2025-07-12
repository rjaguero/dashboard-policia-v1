import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from './ui/badge';
import { TrendingUp, AlertCircle, Users, Target } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#a855f7', '#ec4899', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const FactorTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg max-w-sm">
        <p className="font-medium">{data.fullName}</p>
        <p style={{ color: payload[0].color }}>
          Menciones: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const QualityOfLifePanel = ({ data }) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare data for charts
  const needsImprovementData = Object.entries(data.needs_improvement_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value,
    percentage: ((value / Object.values(data.needs_improvement_distribution || {}).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
  }));

  const topFactorsData = Object.entries(data.top_factors || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([key, value]) => ({
      name: key.length > 30 ? key.substring(0, 30) + '...' : key,
      fullName: key,
      value: value
    }));

  // Hierarchy-Quality cross data
  const hierarchyQualityData = {};
  (data.hierarchy_quality_cross || []).forEach(item => {
    if (!hierarchyQualityData[item.hierarchy]) {
      hierarchyQualityData[item.hierarchy] = {};
    }
    hierarchyQualityData[item.hierarchy][item.needs_improvement] = item.count;
  });

  const hierarchyQualityChartData = Object.keys(hierarchyQualityData).map(hierarchy => {
    const item = { hierarchy: hierarchy };
    Object.keys(hierarchyQualityData[hierarchy]).forEach(needsImprovement => {
      item[needsImprovement] = hierarchyQualityData[hierarchy][needsImprovement];
    });
    return item;
  });

  // Factors by Gender data
  const factorsGenderChartData = Object.entries(data.factors_gender_analysis || {}).map(([factor, genders]) => {
    const total = Object.values(genders).reduce((sum, count) => sum + count, 0);
    return {
      factor: factor,
      Masculino: (genders['Masculino'] || 0),
      Femenino: (genders['Femenino'] || 0),
      total: total
    };
  }).sort((a, b) => b.total - a.total);

  // Factors by Hierarchy data
  const factorsHierarchyChartData = Object.entries(data.factors_hierarchy_analysis || {}).map(([factor, hierarchies]) => {
    const item = { factor: factor };
    Object.entries(hierarchies).forEach(([hierarchy, count]) => {
      item[hierarchy] = count;
    });
    return item;
  }).sort((a, b) => {
    const totalA = Object.values(a).filter(val => typeof val === 'number').reduce((sum, count) => sum + count, 0);
    const totalB = Object.values(b).filter(val => typeof val === 'number').reduce((sum, count) => sum + count, 0);
    return totalB - totalA;
  });

  // Extract all unique hierarchies for the legend
  const allHierarchies = Array.from(new Set(
    Object.values(data.factors_hierarchy_analysis || {}).flatMap(hierarchies => Object.keys(hierarchies))
  )).sort();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-full">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Desean Mejorar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {needsImprovementData.find(item => item.name === 'Sí')?.percentage || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-full">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Factores Identificados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(data.top_factors || {}).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-full">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Menciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(data.top_factors || {}).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Improvement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>¿Considera que debe Mejorar Factores?</span>
            </CardTitle>
            <CardDescription>Distribución de respuestas sobre la necesidad de mejora.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={needsImprovementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {needsImprovementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Principales Factores a Mejorar</span>
            </CardTitle>
            <CardDescription>Los 10 factores más mencionados para mejorar la calidad de vida.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(300, topFactorsData.length * 30)}>
              <BarChart data={topFactorsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<FactorTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hierarchy vs Quality Cross */}
        {hierarchyQualityChartData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Jerarquía vs Percepción de Calidad de Vida</span>
              </CardTitle>
              <CardDescription>Muestra cómo varía la percepción sobre la necesidad de mejorar factores de calidad de vida según la jerarquía.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hierarchyQualityChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hierarchy" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {Object.keys(hierarchyQualityData[Object.keys(hierarchyQualityData)[0]] || {}).map((needsImprovement, index) => (
                    <Bar
                      key={needsImprovement}
                      dataKey={needsImprovement}
                      stackId="a"
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Factors by Gender */}
        {factorsGenderChartData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span>Factores a Mejorar por Género</span>
              </CardTitle>
              <CardDescription>Comparación de los factores más mencionados por género.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={Math.max(300, factorsGenderChartData.length * 40)}>
                <BarChart data={factorsGenderChartData} layout="vertical" stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <YAxis type="category" dataKey="factor" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value, name) => [`${(value / (payload[0].payload.Masculino + payload[0].payload.Femenino) * 100).toFixed(2)}%`, name]} />
                  <Legend />
                  <Bar dataKey="Masculino" fill="#3b82f6" stackId="a" name="Masculino" />
                  <Bar dataKey="Femenino" fill="#ec4899" stackId="a" name="Femenino" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600">
                <p>Este gráfico de barras apiladas muestra la proporción de menciones de cada factor por género. Cada barra representa un factor, y la longitud de las secciones de color indica la proporción de hombres y mujeres que lo mencionaron. Puedes ver qué factores son más relevantes para cada género.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Factors by Hierarchy */}
        {factorsHierarchyChartData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Factores a Mejorar por Jerarquía</span>
              </CardTitle>
              <CardDescription>Comparación de los factores más mencionados por jerarquía.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={Math.max(300, factorsHierarchyChartData.length * 40)}>
                <BarChart data={factorsHierarchyChartData} layout="vertical" stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <YAxis type="category" dataKey="factor" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value, name, props) => [`${(value / props.payload.total * 100).toFixed(2)}%`, name]} />
                  <Legend />
                  {allHierarchies.map((hierarchy, index) => (
                    <Bar key={hierarchy} dataKey={hierarchy} fill={COLORS[index % COLORS.length]} stackId="a" name={hierarchy} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600">
                <p>Este gráfico de barras apiladas muestra la proporción de menciones de cada factor por jerarquía. Cada barra representa un factor, y las secciones de color indican la proporción de cada jerarquía que lo mencionó. Esto permite identificar qué factores son más relevantes para cada nivel jerárquico.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Factors Word Cloud Alternative */}
      {Object.keys(data.top_factors || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              <span>Todos los Factores Mencionados</span>
            </CardTitle>
            <CardDescription>Visualización alternativa de todos los factores mencionados, con el tamaño del badge indicando la frecuencia.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.top_factors || {})
                .sort(([,a], [,b]) => b - a)
                .map(([factor, count], index) => (
                  <Badge
                    key={factor}
                    variant={index < 3 ? "default" : index < 6 ? "secondary" : "outline"}
                    className="text-sm py-1 px-3"
                    style={{
                      fontSize: Math.max(12, Math.min(24, 12 + (count / Math.max(...Object.values(data.top_factors || {}))) * 12))
                    }}
                  >
                    {factor} ({count})
                  </Badge>
                ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Los factores están ordenados por frecuencia de mención. El tamaño del badge refleja la importancia relativa.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualityOfLifePanel;


