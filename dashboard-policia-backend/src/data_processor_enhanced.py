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
        
        # Distribución de antigüedad (usando 'Antigüedad de Servicio' - mostrar distribución en lugar de promedio)
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
        
        # Hábitos de vida sano
        healthy_habits = self.df['¿Consideras que tienen hábitos tendientes a un estilo de  vida sano?'].value_counts().to_dict()
        
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
            'healthy_habits_distribution': healthy_habits,
            'activity_quality_cross': activity_quality_data
        }
    
    def get_health_data(self):
        """Retorna datos específicos de salud"""
        if self.df is None:
            return {}
        
        # Salud física actual
        physical_health = self.df['Salud física actual'].value_counts().to_dict()
        
        # Salud mental actual
        mental_health = self.df['Salud mental actual'].value_counts().to_dict()
        
        # Padecimientos base o crónicos
        chronic_conditions = self.df['Padecimiento base o crónico'].value_counts().to_dict()
        
        # Chequeos médicos en los últimos 12 meses
        medical_checkups = self.df['¿Se ha realizado algún chequeo en los últimos 12 meses?'].value_counts().to_dict()
        
        # Motivos de chequeos médicos
        checkup_reasons = self.df['En caso afirmativo, ¿Cuál fue el motivo?'].value_counts().to_dict()
        
        # Tipos de tratamiento
        treatment_types = self.df['Tipo de Tratamiento'].value_counts().to_dict()
        psychological_treatment = self.df['Tipo de Tratamiento Psicológico'].value_counts().to_dict()
        
        # Incidentes o accidentes laborales
        work_incidents = self.df['¿Has experimentado algún incidente o accidente laboral en los últimos 12 meses?'].value_counts().to_dict()
        
        # Equilibrio vida laboral-personal
        work_life_balance = self.df['¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?'].value_counts().to_dict()
        
        return {
            'physical_health_distribution': physical_health,
            'mental_health_distribution': mental_health,
            'chronic_conditions_distribution': chronic_conditions,
            'medical_checkups_distribution': medical_checkups,
            'checkup_reasons_distribution': checkup_reasons,
            'treatment_types_distribution': treatment_types,
            'psychological_treatment_distribution': psychological_treatment,
            'work_incidents_distribution': work_incidents,
            'work_life_balance_distribution': work_life_balance
        }
    
    def get_knowledge_data(self):
        """Retorna datos específicos de conocimiento y capacitación"""
        if self.df is None:
            return {}
        
        # Capacitación en seguridad y salud en el trabajo
        safety_training = self.df['¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?'].value_counts().to_dict()
        
        # Temáticas de capacitación
        training_topics = self.df['¿Sobre qué temática?'].value_counts().to_dict()
        
        # Conocimiento de servicios de salud ocupacional
        occupational_health_knowledge = self.df['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?'].value_counts().to_dict()
        
        # Servicios conocidos (agregando todas las columnas "Señale cuales")
        known_services = []
        service_columns = ['Señale cuales', 'Señale cuales2', 'Señale cuales3', 'Señale cuales4', 'Señale cuales5']
        
        for col in service_columns:
            if col in self.df.columns:
                services = self.df[col].dropna().astype(str)
                services = services[services != 'nan']
                known_services.extend(services.tolist())
        
        known_services_count = Counter(known_services)
        known_services_dict = dict(known_services_count.most_common(10))
        
        # Utilización de servicios
        service_usage = self.df['¿Los ha utilizado?'].value_counts().to_dict()
        
        # Conformidad con servicios
        service_satisfaction = self.df['¿Esta conforme?'].value_counts().to_dict()
        
        # Acceso a equipos y herramientas
        equipment_access = self.df['¿Tienes acceso a equipos y herramientas adecuadas para realizar sus funciones?'].value_counts().to_dict()
        
        # Oportunidades de desarrollo profesional
        professional_development = self.df['¿Tienes oportunidades para el desarrollo profesional y el ascenso?'].value_counts().to_dict()
        
        return {
            'safety_training_distribution': safety_training,
            'training_topics_distribution': training_topics,
            'occupational_health_knowledge_distribution': occupational_health_knowledge,
            'known_services_distribution': known_services_dict,
            'service_usage_distribution': service_usage,
            'service_satisfaction_distribution': service_satisfaction,
            'equipment_access_distribution': equipment_access,
            'professional_development_distribution': professional_development
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
        
        # Satisfacción económica
        economic_satisfaction = self.df['¿Te sientes satisfecho con la situación económica de su hogar?'].value_counts().to_dict()
        
        # Valoración y reconocimiento
        recognition = self.df['¿Te sientes valorado y reconocido por tus superiores?'].value_counts().to_dict()
        
        # Comunicación con superiores
        communication = self.df['¿Te sientes cómodo comunicándote con tus superiores y compañeros?'].value_counts().to_dict()
        
        return {
            'needs_improvement_distribution': needs_improvement,
            'top_factors': top_factors,
            'hierarchy_quality_cross': hierarchy_quality_data,
            'economic_satisfaction_distribution': economic_satisfaction,
            'recognition_distribution': recognition,
            'communication_distribution': communication
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
        
        # % que recibió capacitación en seguridad y salud
        safety_training_yes = len(self.df[self.df['¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?'] == 'Sí'])
        safety_training_percentage = round((safety_training_yes / total_responses) * 100, 2)
        
        # % que conoce servicios de salud ocupacional
        occupational_knowledge_yes = len(self.df[self.df['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?'] == 'Sí'])
        occupational_knowledge_percentage = round((occupational_knowledge_yes / total_responses) * 100, 2)
        
        # % que se realizó chequeos médicos
        medical_checkup_yes = len(self.df[self.df['¿Se ha realizado algún chequeo en los últimos 12 meses?'] == 'Sí'])
        medical_checkup_percentage = round((medical_checkup_yes / total_responses) * 100, 2)
        
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
            'safety_training_percentage': safety_training_percentage,
            'occupational_knowledge_percentage': occupational_knowledge_percentage,
            'medical_checkup_percentage': medical_checkup_percentage,
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
            'health': temp_processor.get_health_data(),
            'knowledge': temp_processor.get_knowledge_data(),
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

