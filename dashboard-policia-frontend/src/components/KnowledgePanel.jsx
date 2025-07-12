import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A28DFF', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9'];

const KnowledgePanel = ({ data }) => {
  if (!data) return <div>Cargando datos de conocimiento...</div>;

  // Preparar datos para gráficos
  const safetyTrainingData = Object.entries(data.safety_training_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const occupationalHealthKnowledgeData = Object.entries(data.occupational_health_knowledge_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const serviceUsageData = Object.entries(data.service_usage_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const serviceSatisfactionData = Object.entries(data.service_satisfaction_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const equipmentAccessData = Object.entries(data.equipment_access_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const professionalDevelopmentData = Object.entries(data.professional_development_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  // Filtrar 'No aplica' y limitar longitud de nombre para Known Services
  const knownServicesData = Object.entries(data.known_services_distribution || {})
    .filter(([key, value]) => key !== 'No aplica' && key !== 'nan')
    .map(([key, value]) => ({
      name: key.length > 30 ? key.substring(0, 30) + '...' : key,
      fullName: key,
      value: value
    }));

  // Filtrar 'No aplica' y limitar longitud de nombre para Training Topics
  const trainingTopicsData = Object.entries(data.training_topics_distribution || {})
    .filter(([key, value]) => key !== 'No aplica' && key !== 'nan')
    .map(([key, value]) => ({
      name: key.length > 30 ? key.substring(0, 30) + '...' : key,
      fullName: key,
      value: value
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Capacitación en Seguridad y Salud */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capacitación en Seguridad</CardTitle>
            <CardDescription>Últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={safetyTrainingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {safetyTrainingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conocimiento de Servicios de Salud Ocupacional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conocimiento Servicios</CardTitle>
            <CardDescription>Salud ocupacional institucional</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={occupationalHealthKnowledgeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {occupationalHealthKnowledgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Acceso a Equipos y Herramientas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acceso a Equipos</CardTitle>
            <CardDescription>Herramientas adecuadas para funciones</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={equipmentAccessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Utilización de Servicios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Utilización de Servicios</CardTitle>
            <CardDescription>Uso de servicios de salud ocupacional</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={serviceUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Satisfacción con Servicios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Satisfacción con Servicios</CardTitle>
            <CardDescription>Conformidad con servicios utilizados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={serviceSatisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Oportunidades de Desarrollo Profesional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desarrollo Profesional</CardTitle>
            <CardDescription>Oportunidades de ascenso</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={professionalDevelopmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Servicios Conocidos (Horizontal Bar Chart) */}
      {knownServicesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Servicios de Salud Ocupacional Conocidos</CardTitle>
            <CardDescription>Servicios más mencionados por los encuestados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(300, knownServicesData.length * 40)}>
              <BarChart data={knownServicesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip 
                  formatter={(value, name, props) => [value, props.payload.fullName]}
                />
                <Bar dataKey="value" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Temáticas de Capacitación (Horizontal Bar Chart) */}
      {trainingTopicsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Temáticas de Capacitación</CardTitle>
            <CardDescription>Temas de capacitación recibidos (excluyendo 'No aplica')</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(300, trainingTopicsData.length * 40)}>
              <BarChart data={trainingTopicsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip 
                  formatter={(value, name, props) => [value, props.payload.fullName]}
                />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgePanel;


