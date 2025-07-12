import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Filters = ({ filters, onFilterChange, filterOptions }) => {
  const handleSelectChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleSwitchChange = (checked) => {
    onFilterChange({
      ...filters,
      actividad_fisica: checked ? 'true' : 'false'
    });
  };

  const clearFilters = () => {
    onFilterChange({
      distrito: 'all',
      genero: 'all',
      edad: 'all',
      jerarquia: 'all',
      estado_civil: 'all',
      actividad_fisica: 'false'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== 'false');

  if (!filterOptions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <CardTitle>Filtros</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Distrito */}
          <div className="space-y-2">
            <Label htmlFor="distrito">Distrito</Label>
            <Select
              value={filters.distrito}
              onValueChange={(value) => handleSelectChange('distrito', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los distritos</SelectItem>
                {filterOptions.distritos?.map((distrito) => (
                  <SelectItem key={distrito} value={distrito}>
                    {distrito}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Género */}
          <div className="space-y-2">
            <Label htmlFor="genero">Género</Label>
            <Select
              value={filters.genero}
              onValueChange={(value) => handleSelectChange('genero', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los géneros</SelectItem>
                {filterOptions.generos?.map((genero) => (
                  <SelectItem key={genero} value={genero}>
                    {genero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Edad */}
          <div className="space-y-2">
            <Label htmlFor="edad">Rango Etario</Label>
            <Select
              value={filters.edad}
              onValueChange={(value) => handleSelectChange('edad', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar edad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las edades</SelectItem>
                {filterOptions.edades?.map((edad) => (
                  <SelectItem key={edad} value={edad}>
                    {edad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jerarquía */}
          <div className="space-y-2">
            <Label htmlFor="jerarquia">Jerarquía</Label>
            <Select
              value={filters.jerarquia}
              onValueChange={(value) => handleSelectChange('jerarquia', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar jerarquía" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las jerarquías</SelectItem>
                {filterOptions.jerarquias?.map((jerarquia) => (
                  <SelectItem key={jerarquia} value={jerarquia}>
                    {jerarquia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado Civil */}
          <div className="space-y-2">
            <Label htmlFor="estado_civil">Estado Civil</Label>
            <Select
              value={filters.estado_civil}
              onValueChange={(value) => handleSelectChange('estado_civil', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {filterOptions.estados_civiles?.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actividad Física */}
          <div className="space-y-2">
            <Label htmlFor="actividad_fisica">Solo con Actividad Física</Label>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="actividad_fisica"
                checked={filters.actividad_fisica === 'true'}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="actividad_fisica" className="text-sm text-gray-600">
                {filters.actividad_fisica === 'true' ? 'Sí' : 'No'}
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;

