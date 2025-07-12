import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const HealthPanel = ({ data }) => {
  if (!data) return <div>Cargando datos de salud...</div>;

  // Preparar datos para gráficos
  const physicalHealthData = Object.entries(data.physical_health_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const mentalHealthData = Object.entries(data.mental_health_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const medicalCheckupsData = Object.entries(data.medical_checkups_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const workIncidentsData = Object.entries(data.work_incidents_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const workLifeBalanceData = Object.entries(data.work_life_balance_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const chronicConditionsData = Object.entries(data.chronic_conditions_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  })).filter(item => item.name !== 'nan' && item.name !== 'No');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Salud Física Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Salud Física Actual</CardTitle>
            <CardDescription>Percepción de la salud física</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={physicalHealthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {physicalHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Salud Mental Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Salud Mental Actual</CardTitle>
            <CardDescription>Percepción de la salud mental</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mentalHealthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mentalHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chequeos Médicos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chequeos Médicos</CardTitle>
            <CardDescription>Últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={medicalCheckupsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incidentes Laborales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incidentes Laborales</CardTitle>
            <CardDescription>Últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workIncidentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equilibrio Vida Laboral-Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Equilibrio Vida Laboral</CardTitle>
            <CardDescription>Comodidad con el equilibrio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workLifeBalanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Padecimientos Crónicos */}
        {chronicConditionsData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Padecimientos Crónicos</CardTitle>
              <CardDescription>Condiciones base reportadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chronicConditionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthPanel;

