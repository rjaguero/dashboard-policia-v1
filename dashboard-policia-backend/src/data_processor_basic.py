import pandas as pd
import numpy as np
from collections import Counter
import os

class DataProcessor:
    def __init__(self, excel_path):
        self.excel_path = excel_path
        self.df = None
        self.load_data()
    
    def load_data(self):
        """Carga los datos del archivo Excel"""
        try:
            self.df = pd.read_excel(self.excel_path)
            self.clean_data()
        except Exception as e:
            print(f"Error loading data: {e}")
            raise
    
    def clean_data(self):
        """Limpia y prepara los datos"""
        if self.df is None:
            return
        
        # Limpiar espacios en blanco en columnas de texto
        for col in self.df.select_dtypes(include=['object']).columns:
            self.df[col] = self.df[col].astype(str).str.strip()
        
        # Reemplazar 'nan' strings con NaN
        self.df = self.df.replace('nan', np.nan)
    
    def get_demographics_data(self):
        """Retorna datos demográficos"""
        if self.df is None:
            return {}
        
        # Distribución por género
        gender_dist = self.df['Género'].value_counts().to_dict()
        
        # Distribución por edad (usando columna 'Edad' en lugar de 'Rango etario')
        age_dist = self.df['Edad'].value_counts().to_dict()
        
        # Distribución por jerarquía
        hierarchy_dist = self.df['Jerarquía'].value_counts().to_dict()
        
        # Distribución por distrito
        district_dist = self.df['Distrito'].value_counts().to_dict()
        
        # Estado civil
        civil_status_dist = self.df['Estado Civil'].value_counts().to_dict()
        
        # Promedio de antigüedad (usando 'Antigüedad de Servicio' - mostrar distribución en lugar de promedio)
        seniority_dist = self.df['Antigüedad de Servicio'].value_counts().to_dict()
        avg_seniority = 0  # No podemos calcular promedio de rangos de texto
        
        # Distribución por edad y jerarquía
        age_hierarchy = self.df.groupby(['Edad', 'Jerarquía']).size().reset_index(name='count')
        age_hierarchy_data = []
        for _, row in age_hierarchy.iterrows():
            age_hierarchy_data.append({
                'age_range': row['Edad'],
                'hierarchy': row['Jerarquía'],
                'count': row['count']
            })
        
        return {
            'gender_distribution': gender_dist,
            'age_distribution': age_dist,
            'hierarchy_distribution': hierarchy_dist,
            'district_distribution': district_dist,
            'civil_status_distribution': civil_status_dist,
            'seniority_distribution': seniority_dist,
            'average_seniority': avg_seniority,
            'age_hierarchy_distribution': age_hierarchy_data
        }
    
    def get_habits_data(self):
        """Retorna datos de hábitos y bienestar"""
        if self.df is None:
            return {}
        
        # ¿Realiza actividad física?
        physical_activity = self.df['¿Realiza algún tipo de actividad física?'].value_counts().to_dict()
        
        # Frecuencia de actividad física
        frequency = self.df['¿Con qué frecuencia?'].value_counts().to_dict()
        
        # ¿Tiene hijos?
        has_children = self.df['¿Tiene hijos?'].value_counts().to_dict()
        
        # Cantidad de hijos (usando '¿Cantidad de hijos?')
        children_count = self.df['¿Cantidad de hijos?'].value_counts().to_dict()
        
        # Cruce actividad física vs calidad de vida
        activity_quality_cross = self.df.groupby(['¿Realiza algún tipo de actividad física?', 
                                                 ' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?']).size().reset_index(name='count')
        
        activity_quality_data = []
        for _, row in activity_quality_cross.iterrows():
            activity_quality_data.append({
                'physical_activity': row['¿Realiza algún tipo de actividad física?'],
                'needs_improvement': row[' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?'],
                'count': row['count']
            })
        
        return {
            'physical_activity_distribution': physical_activity,
            'frequency_distribution': frequency,
            'has_children_distribution': has_children,
            'children_count_distribution': children_count,
            'activity_quality_cross': activity_quality_data
        }
    
    def get_quality_of_life_data(self):
        """Retorna datos de percepción de calidad de vida"""
        if self.df is None:
            return {}
        
        # ¿Considera que debe mejorar factores?
        needs_improvement = self.df[' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?'].value_counts().to_dict()
        
        # Factores más mencionados
        factors_columns = ['*¿Cuáles?', 'Columna1', 'Columna2', 'Columna3', 'Columna4', 'Columna5', 'Columna6']
        all_factors = []
        
        for col in factors_columns:
            if col in self.df.columns:
                factors = self.df[col].dropna().astype(str)
                factors = factors[factors != 'nan']
                all_factors.extend(factors.tolist())
        
        # Contar factores
        factor_counts = Counter(all_factors)
        top_factors = dict(factor_counts.most_common(10))
        
        # Relación jerarquía vs percepción
        hierarchy_quality = self.df.groupby(['Jerarquía', 
                                           ' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?']).size().reset_index(name='count')
        
        hierarchy_quality_data = []
        for _, row in hierarchy_quality.iterrows():
            hierarchy_quality_data.append({
                'hierarchy': row['Jerarquía'],
                'needs_improvement': row[' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?'],
                'count': row['count']
            })
        
        return {
            'needs_improvement_distribution': needs_improvement,
            'top_factors': top_factors,
            'hierarchy_quality_cross': hierarchy_quality_data
        }
    
    def get_kpis(self):
        """Retorna indicadores clave de rendimiento"""
        if self.df is None:
            return {}
        
        total_responses = len(self.df)
        
        # % personas que hacen actividad física
        physical_activity_yes = len(self.df[self.df['¿Realiza algún tipo de actividad física?'] == 'Sí'])
        physical_activity_percentage = round((physical_activity_yes / total_responses) * 100, 2)
        
        # % que cree que debe mejorar algo
        needs_improvement_yes = len(self.df[self.df[' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?'] == 'Sí'])
        needs_improvement_percentage = round((needs_improvement_yes / total_responses) * 100, 2)
        
        # Principales factores a mejorar
        factors_columns = ['*¿Cuáles?', 'Columna1', 'Columna2', 'Columna3', 'Columna4', 'Columna5', 'Columna6']
        all_factors = []
        
        for col in factors_columns:
            if col in self.df.columns:
                factors = self.df[col].dropna().astype(str)
                factors = factors[factors != 'nan']
                all_factors.extend(factors.tolist())
        
        factor_counts = Counter(all_factors)
        top_3_factors = dict(factor_counts.most_common(3))
        
        return {
            'total_responses': total_responses,
            'physical_activity_percentage': physical_activity_percentage,
            'needs_improvement_percentage': needs_improvement_percentage,
            'top_factors_to_improve': top_3_factors
        }
    
    def get_filtered_data(self, filters):
        """Retorna datos filtrados según los parámetros"""
        if self.df is None:
            return {}
        
        filtered_df = self.df.copy()
        
        # Aplicar filtros
        if filters.get('distrito') and filters['distrito'] != 'all':
            filtered_df = filtered_df[filtered_df['Distrito'] == filters['distrito']]
        
        if filters.get('genero') and filters['genero'] != 'all':
            filtered_df = filtered_df[filtered_df['Género'] == filters['genero']]
        
        if filters.get('edad') and filters['edad'] != 'all':
            filtered_df = filtered_df[filtered_df['Edad'] == filters['edad']]
        
        if filters.get('jerarquia') and filters['jerarquia'] != 'all':
            filtered_df = filtered_df[filtered_df['Jerarquía'] == filters['jerarquia']]
        
        if filters.get('estado_civil') and filters['estado_civil'] != 'all':
            filtered_df = filtered_df[filtered_df['Estado Civil'] == filters['estado_civil']]
        
        if filters.get('actividad_fisica') and filters['actividad_fisica'] == 'true':
            filtered_df = filtered_df[filtered_df['¿Realiza algún tipo de actividad física?'] == 'Sí']
        
        # Crear un procesador temporal con los datos filtrados
        temp_processor = DataProcessor.__new__(DataProcessor)
        temp_processor.df = filtered_df
        temp_processor.excel_path = self.excel_path
        
        return {
            'demographics': temp_processor.get_demographics_data(),
            'habits': temp_processor.get_habits_data(),
            'quality_of_life': temp_processor.get_quality_of_life_data(),
            'kpis': temp_processor.get_kpis()
        }
    
    def get_filter_options(self):
        """Retorna las opciones disponibles para los filtros"""
        if self.df is None:
            return {}
        
        return {
            'distritos': sorted(self.df['Distrito'].dropna().unique().tolist()),
            'generos': sorted(self.df['Género'].dropna().unique().tolist()),
            'edades': sorted(self.df['Edad'].dropna().unique().tolist()),
            'jerarquias': sorted(self.df['Jerarquía'].dropna().unique().tolist()),
            'estados_civiles': sorted(self.df['Estado Civil'].dropna().unique().tolist())
        }

