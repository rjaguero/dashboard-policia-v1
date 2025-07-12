import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, Users, Target } from 'lucide-react';

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

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];

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
                  {needsImprovementData.find(item => item.name === 'Si')?.percentage || 0}%
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
              <span>¿Debe Mejorar Factores?</span>
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topFactorsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  tick={{ fontSize: 10 }}
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
              <div className="mt-4 text-sm text-gray-600">
                <p>Este gráfico muestra cómo varía la percepción sobre la necesidad de mejorar factores de calidad de vida según la jerarquía.</p>
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
                      fontSize: Math.max(12, Math.min(16, 12 + (count / Math.max(...Object.values(data.top_factors || {}))) * 4))
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

