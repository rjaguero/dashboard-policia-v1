# Dashboard Policía Catamarca - Encuesta de Bienestar

Dashboard interactivo para visualizar datos de encuesta de bienestar realizada a policías de Catamarca.

## Características

- **Análisis Demográfico**: Distribución por género, edad, jerarquía, distrito y estado civil
- **Hábitos y Bienestar**: Actividad física, frecuencia, situación familiar
- **Calidad de Vida**: Percepción de factores a mejorar y análisis por jerarquía
- **Filtros Dinámicos**: Por distrito, género, edad, jerarquía, estado civil y actividad física
- **KPIs**: Indicadores clave de rendimiento actualizados en tiempo real

## Tecnologías

### Backend
- Flask (Python 3.11)
- Pandas para procesamiento de datos
- Flask-CORS para comunicación frontend-backend

### Frontend
- React con Vite
- Recharts para gráficos
- Tailwind CSS para estilos
- Shadcn/UI para componentes

## Instalación y Uso

### Requisitos
- Python 3.11+
- Node.js 20+
- pnpm

### Backend
```bash
cd dashboard-policia-backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python src/main.py
```

### Frontend (Desarrollo)
```bash
cd dashboard-policia-frontend
pnpm install
pnpm run dev
```

### Producción
El frontend ya está compilado y servido por Flask desde `/static/`.

## Estructura de Datos

### Archivo Excel
- **Ubicación**: `data/Dashboard_Encuesta_Base.xlsx`
- **Registros**: 189 encuestas
- **Columnas**: 69 campos de información

### API Endpoints
- `GET /api/data` - Todos los datos
- `GET /api/filtered-data` - Datos filtrados
- `GET /api/kpis` - Indicadores clave
- `GET /api/demographics` - Datos demográficos
- `GET /api/habits` - Hábitos y bienestar
- `GET /api/quality-of-life` - Calidad de vida
- `GET /api/filter-options` - Opciones de filtros

## KPIs Principales

- **Total Encuestados**: 189
- **Actividad Física**: 77.78% realiza ejercicio
- **Deseo de Mejora**: 77.25% quiere mejorar factores
- **Principales Factores**:
  - Tiempo de descanso (114 menciones)
  - Actividad física (80 menciones)
  - Alimentación saludable (72 menciones)

## Actualización de Datos

1. Reemplace el archivo `data/Dashboard_Encuesta_Base.xlsx`
2. Mantenga la misma estructura de columnas
3. Reinicie el servidor Flask
4. Los datos se actualizarán automáticamente

## Desarrollo

### Agregar Nuevos Gráficos
1. Modifique `src/data_processor.py` para nuevos cálculos
2. Agregue endpoints en `src/routes/dashboard.py`
3. Cree componentes React en `frontend/src/components/`

### Nuevos Filtros
1. Actualice `get_filter_options()` en el procesador
2. Modifique el componente `Filters.jsx`
3. Ajuste la lógica de filtrado en `get_filtered_data()`

## Troubleshooting

### Error de Importación
- Verifique que todas las dependencias estén instaladas
- Active el entorno virtual antes de ejecutar

### Datos No Cargan
- Verifique que el archivo Excel esté en `data/`
- Revise los logs de Flask para errores de procesamiento
- Confirme que las columnas tengan los nombres correctos

### Frontend No Responde
- Verifique que Flask esté ejecutándose en puerto 5000
- Confirme que CORS esté habilitado
- Revise la consola del navegador para errores

## Licencia

Proyecto desarrollado para la Policía de Catamarca.

