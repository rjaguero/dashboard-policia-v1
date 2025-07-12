import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ProfilePanel = ({ data }) => {
  if (!data) return <div>Cargando datos demográficos...</div>;

  // Datos básicos
  const genderData = Object.entries(data.gender_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const ageData = Object.entries(data.age_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const hierarchyData = Object.entries(data.hierarchy_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const districtData = Object.entries(data.district_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const seniorityData = Object.entries(data.seniority_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const civilStatusData = Object.entries(data.civil_status_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  // NUEVOS DATOS DE CONEXIONES
  const genderServicesData = data.gender_additional_services_cross || [];
  const hierarchyWorkloadData = data.hierarchy_workload_analysis || [];
  const seniorityKnowledgeData = data.seniority_knowledge_cross || [];
  const ageHierarchyData = data.age_hierarchy_distribution || [];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Antigüedad Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {data.average_seniority || 0} años
            </div>
            <p className="text-sm text-gray-600">Experiencia en servicio</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Encuestados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Object.values(data.gender_distribution || {}).reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-sm text-gray-600">Respuestas válidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distritos Cubiertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {Object.keys(data.district_distribution || {}).length}
            </div>
            <p className="text-sm text-gray-600">Ubicaciones geográficas</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuciones básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Distribución por Género */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Género</CardTitle>
            <CardDescription>Composición de la muestra</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Edad */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Edad</CardTitle>
            <CardDescription>Rangos etarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Jerarquía */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Jerarquía</CardTitle>
            <CardDescription>Niveles jerárquicos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hierarchyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Distrito */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Distrito</CardTitle>
            <CardDescription>Ubicación geográfica</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Antigüedad */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Antigüedad</CardTitle>
            <CardDescription>Años de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={seniorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estado Civil */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado Civil</CardTitle>
            <CardDescription>Situación civil</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={civilStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {civilStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* NUEVAS CONEXIONES DEMOGRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Género vs Servicios Adicionales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Género vs Servicios Adicionales</CardTitle>
            <CardDescription>¿Quién realiza más servicios extra?</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderServicesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} personas`,
                    `${props.payload.additional_services} servicios adicionales`
                  ]}
                />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Jerarquía vs Carga Laboral */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jerarquía vs Carga Laboral</CardTitle>
            <CardDescription>Servicios adicionales y recargos por rango</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hierarchyWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hierarchy" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="additional_services" fill="#00C49F" name="Servicios Adicionales" />
                <Bar dataKey="service_overload" fill="#FF8042" name="Recargos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Antigüedad vs Conocimiento de Servicios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Antigüedad vs Conocimiento de Servicios</CardTitle>
            <CardDescription>¿La experiencia mejora el conocimiento?</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seniorityKnowledgeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="seniority" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} personas`,
                    `${props.payload.knows_services} conoce servicios`
                  ]}
                />
                <Bar dataKey="count" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Matriz Edad vs Jerarquía */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Matriz Edad vs Jerarquía</CardTitle>
            <CardDescription>Distribución cruzada</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageHierarchyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_range" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} personas`,
                    `${props.payload.hierarchy} - ${props.payload.age_range}`
                  ]}
                />
                <Bar dataKey="count" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights demográficos */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Insights Demográficos</CardTitle>
          <CardDescription className="text-blue-700">Hallazgos clave del análisis</CardDescription>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Perfil Predominante:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Antigüedad promedio: {data.average_seniority || 0} años</li>
                <li>• Mayor concentración en rangos medios</li>
                <li>• Distribución equilibrada por distritos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Patrones Identificados:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Correlación antigüedad-conocimiento de servicios</li>
                <li>• Diferencias de carga laboral por jerarquía</li>
                <li>• Variaciones por género en servicios adicionales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePanel;

