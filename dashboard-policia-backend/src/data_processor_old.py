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
    
    def convert_seniority_to_numeric(self, seniority_text):
        """Convierte rangos de antigüedad a valores numéricos (punto medio del rango)"""
        if pd.isna(seniority_text) or seniority_text == 'nan':
            return np.nan
        
        seniority_map = {
            'Menos de 1 año': 0.5,
            '1 a 5 años': 3,
            '6 a 10 años': 8,
            '11 a 15 años': 13,
            '16 a 20 años': 18,
            '21 a 25 años': 23,
            '26 a 30 años': 28,
            'Más de 30 años': 35
        }
        
        return seniority_map.get(seniority_text, np.nan)
    
    def get_demographics_data(self):
        """Retorna datos demográficos con conexiones avanzadas"""
        if self.df is None:
            return {}
        
        # Distribuciones básicas
        gender_dist = self.df['Género'].value_counts().to_dict()
        age_dist = self.df['Edad'].value_counts().to_dict()
        hierarchy_dist = self.df['Jerarquía'].value_counts().to_dict()
        district_dist = self.df['Distrito'].value_counts().to_dict()
        civil_status_dist = self.df['Estado Civil'].value_counts().to_dict()
        seniority_dist = self.df['Antigüedad de Servicio'].value_counts().to_dict()
        
        # Promedio de antigüedad
        numeric_seniority = self.df['Antigüedad de Servicio'].apply(self.convert_seniority_to_numeric)
        avg_seniority = round(numeric_seniority.mean(), 1) if not numeric_seniority.isna().all() else 0
        
        # NUEVAS CONEXIONES DEMOGRÁFICAS
        
        # Género vs Servicios Adicionales
        gender_additional_services = self.df.groupby(['Género', '¿Realiza servicios adicionales?']).size().reset_index(name='count')
        gender_services_data = []
        for _, row in gender_additional_services.iterrows():
            gender_services_data.append({
                'gender': row['Género'],
                'additional_services': row['¿Realiza servicios adicionales?'],
                'count': row['count']
            })
        
        # Jerarquía vs Carga Laboral (servicios adicionales + recargos)
        hierarchy_workload = self.df.groupby('Jerarquía').agg({
            '¿Realiza servicios adicionales?': lambda x: (x == 'Sí').sum(),
            '¿Tiene recargo de servicios?': lambda x: (x == 'Sí').sum()
        }).reset_index()
        hierarchy_workload_data = []
        for _, row in hierarchy_workload.iterrows():
            hierarchy_workload_data.append({
                'hierarchy': row['Jerarquía'],
                'additional_services': row['¿Realiza servicios adicionales?'],
                'service_overload': row['¿Tiene recargo de servicios?']
            })
        
        # Antigüedad vs Conocimiento de Servicios
        seniority_knowledge = self.df.groupby(['Antigüedad de Servicio', '¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?']).size().reset_index(name='count')
        seniority_knowledge_data = []
        for _, row in seniority_knowledge.iterrows():
            seniority_knowledge_data.append({
                'seniority': row['Antigüedad de Servicio'],
                'knows_services': row['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?'],
                'count': row['count']
            })
        
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
            'age_hierarchy_distribution': age_hierarchy_data,
            'gender_additional_services_cross': gender_services_data,
            'hierarchy_workload_analysis': hierarchy_workload_data,
            'seniority_knowledge_cross': seniority_knowledge_data
        }
    
    def get_habits_data(self):
        """Retorna datos de hábitos y bienestar con conexiones avanzadas"""
        if self.df is None:
            return {}
        
        # Distribuciones básicas
        physical_activity = self.df['¿Realiza algún tipo de actividad física?'].value_counts().to_dict()
        frequency = self.df['¿Con qué frecuencia?'].value_counts().to_dict()
        has_children = self.df['¿Tiene hijos?'].value_counts().to_dict()
        children_count = self.df['¿Cantidad de hijos?'].value_counts().to_dict()
        healthy_habits = self.df['¿Consideras que tienen hábitos tendientes a un estilo de  vida sano?'].value_counts().to_dict()
        additional_services = self.df['¿Realiza servicios adicionales?'].value_counts().to_dict()
        service_overload = self.df['¿Tiene recargo de servicios?'].value_counts().to_dict()
        extra_paid_activity = self.df['¿Realizas alguna actividad remunerada extra?'].value_counts().to_dict()
        hobbies = self.df['¿Tiene algún hobbies?'].value_counts().to_dict()
        
        # NUEVAS CONEXIONES DE HÁBITOS
        
        # Hijos vs Servicios Adicionales
        children_services = self.df.groupby(['¿Tiene hijos?', '¿Realiza servicios adicionales?']).size().reset_index(name='count')
        children_services_data = []
        for _, row in children_services.iterrows():
            children_services_data.append({
                'has_children': row['¿Tiene hijos?'],
                'additional_services': row['¿Realiza servicios adicionales?'],
                'count': row['count']
            })
        
        # Actividad Física vs Equilibrio Vida-Trabajo
        activity_balance = self.df.groupby(['¿Realiza algún tipo de actividad física?', '¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?']).size().reset_index(name='count')
        activity_balance_data = []
        for _, row in activity_balance.iterrows():
            activity_balance_data.append({
                'physical_activity': row['¿Realiza algún tipo de actividad física?'],
                'work_life_balance': row['¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?'],
                'count': row['count']
            })
        
        # Servicios Adicionales vs Equilibrio Vida-Trabajo
        services_balance = self.df.groupby(['¿Realiza servicios adicionales?', '¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?']).size().reset_index(name='count')
        services_balance_data = []
        for _, row in services_balance.iterrows():
            services_balance_data.append({
                'additional_services': row['¿Realiza servicios adicionales?'],
                'work_life_balance': row['¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?'],
                'count': row['count']
            })
        
        # Hábitos Saludables vs Actividad Física
        healthy_activity = self.df.groupby(['¿Consideras que tienen hábitos tendientes a un estilo de  vida sano?', '¿Realiza algún tipo de actividad física?']).size().reset_index(name='count')
        healthy_activity_data = []
        for _, row in healthy_activity.iterrows():
            healthy_activity_data.append({
                'healthy_habits': row['¿Consideras que tienen hábitos tendientes a un estilo de  vida sano?'],
                'physical_activity': row['¿Realiza algún tipo de actividad física?'],
                'count': row['count']
            })
        
        # Cruce actividad física vs calidad de vida (existente)
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
            'additional_services_distribution': additional_services,
            'service_overload_distribution': service_overload,
            'extra_paid_activity_distribution': extra_paid_activity,
            'hobbies_distribution': hobbies,
            'activity_quality_cross': activity_quality_data,
            'children_services_cross': children_services_data,
            'activity_balance_cross': activity_balance_data,
            'services_balance_cross': services_balance_data,
            'healthy_activity_cross': healthy_activity_data
        }
    
    def get_health_data(self):
        """Retorna datos específicos de salud con conexiones avanzadas"""
        if self.df is None:
            return {}
        
        # Distribuciones básicas
        physical_health = self.df['Salud física actual'].value_counts().to_dict()
        mental_health = self.df['Salud mental actual'].value_counts().to_dict()
        chronic_conditions = self.df['Padecimiento base o crónico'].value_counts().to_dict()
        medical_checkups = self.df['¿Se ha realizado algún chequeo en los últimos 12 meses?'].value_counts().to_dict()
        checkup_reasons = self.df['En caso afirmativo, ¿Cuál fue el motivo?'].value_counts().to_dict()
        treatment_types = self.df['Tipo de Tratamiento'].value_counts().to_dict()
        psychological_treatment = self.df['Tipo de Tratamiento Psicológico'].value_counts().to_dict()
        work_incidents = self.df['¿Has experimentado algún incidente o accidente laboral en los últimos 12 meses?'].value_counts().to_dict()
        work_life_balance = self.df['¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?'].value_counts().to_dict()
        
        # NUEVAS CONEXIONES DE SALUD
        
        # Salud Física vs Mental (correlación)
        health_correlation = self.df.groupby(['Salud física actual', 'Salud mental actual']).size().reset_index(name='count')
        health_correlation_data = []
        for _, row in health_correlation.iterrows():
            health_correlation_data.append({
                'physical_health': row['Salud física actual'],
                'mental_health': row['Salud mental actual'],
                'count': row['count']
            })
        
        # Salud vs Carga Laboral
        health_workload = self.df.groupby(['Salud física actual', '¿Realiza servicios adicionales?']).size().reset_index(name='count')
        health_workload_data = []
        for _, row in health_workload.iterrows():
            health_workload_data.append({
                'physical_health': row['Salud física actual'],
                'additional_services': row['¿Realiza servicios adicionales?'],
                'count': row['count']
            })
        
        # Salud vs Actividad Física
        health_activity = self.df.groupby(['Salud física actual', '¿Realiza algún tipo de actividad física?']).size().reset_index(name='count')
        health_activity_data = []
        for _, row in health_activity.iterrows():
            health_activity_data.append({
                'physical_health': row['Salud física actual'],
                'physical_activity': row['¿Realiza algún tipo de actividad física?'],
                'count': row['count']
            })
        
        # Accidentes vs Jerarquía
        accidents_hierarchy = self.df.groupby(['Jerarquía', '¿Has experimentado algún incidente o accidente laboral en los últimos 12 meses?']).size().reset_index(name='count')
        accidents_hierarchy_data = []
        for _, row in accidents_hierarchy.iterrows():
            accidents_hierarchy_data.append({
                'hierarchy': row['Jerarquía'],
                'work_accident': row['¿Has experimentado algún incidente o accidente laboral en los últimos 12 meses?'],
                'count': row['count']
            })
        
        # Salud Mental vs Equilibrio Vida-Trabajo
        mental_balance = self.df.groupby(['Salud mental actual', '¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?']).size().reset_index(name='count')
        mental_balance_data = []
        for _, row in mental_balance.iterrows():
            mental_balance_data.append({
                'mental_health': row['Salud mental actual'],
                'work_life_balance': row['¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?'],
                'count': row['count']
            })
        
        return {
            'physical_health_distribution': physical_health,
            'mental_health_distribution': mental_health,
            'chronic_conditions_distribution': chronic_conditions,
            'medical_checkups_distribution': medical_checkups,
            'checkup_reasons_distribution': checkup_reasons,
            'treatment_types_distribution': treatment_types,
            'psychological_treatment_distribution': psychological_treatment,
            'work_incidents_distribution': work_incidents,
            'work_life_balance_distribution': work_life_balance,
            'health_correlation_matrix': health_correlation_data,
            'health_workload_cross': health_workload_data,
            'health_activity_cross': health_activity_data,
            'accidents_hierarchy_cross': accidents_hierarchy_data,
            'mental_balance_cross': mental_balance_data
        }
    
    def get_knowledge_data(self):
        """Retorna datos específicos de conocimiento y capacitación con conexiones avanzadas"""
        if self.df is None:
            return {}
        
        # Distribuciones básicas
        safety_training = self.df['¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?'].value_counts().to_dict()
        training_topics = self.df['¿Sobre qué temática?'].value_counts().to_dict()
        occupational_health_knowledge = self.df['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?'].value_counts().to_dict()
        service_usage = self.df['¿Los ha utilizado?'].value_counts().to_dict()
        service_satisfaction = self.df['¿Esta conforme?'].value_counts().to_dict()
        equipment_access = self.df['¿Tienes acceso a equipos y herramientas adecuadas para realizar sus funciones?'].value_counts().to_dict()
        professional_development = self.df['¿Tienes oportunidades para el desarrollo profesional y el ascenso?'].value_counts().to_dict()
        recognition = self.df['¿Te sientes valorado y reconocido por tus superiores?'].value_counts().to_dict()
        communication = self.df['¿Te sientes cómodo comunicándote con tus superiores y compañeros?'].value_counts().to_dict()
        
        # Servicios conocidos (agregando todas las columnas)
        known_services = []
        service_columns = ['Señale cuales', 'Señale cuales2', 'Señale cuales3', 'Señale cuales4', 'Señale cuales5']
        
        for col in service_columns:
            if col in self.df.columns:
                services = self.df[col].dropna().astype(str)
                services = services[services != 'nan']
                known_services.extend(services.tolist())
        
        known_services_count = Counter(known_services)
        known_services_dict = dict(known_services_count.most_common(10))
        
        # NUEVAS CONEXIONES DE CONOCIMIENTO
        
        # Capacitación vs Jerarquía
        training_hierarchy = self.df.groupby(['Jerarquía', '¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?']).size().reset_index(name='count')
        training_hierarchy_data = []
        for _, row in training_hierarchy.iterrows():
            training_hierarchy_data.append({
                'hierarchy': row['Jerarquía'],
                'received_training': row['¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?'],
                'count': row['count']
            })
        
        # Conocimiento vs Utilización de Servicios
        knowledge_usage = self.df.groupby(['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?', '¿Los ha utilizado?']).size().reset_index(name='count')
        knowledge_usage_data = []
        for _, row in knowledge_usage.iterrows():
            knowledge_usage_data.append({
                'knows_services': row['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?'],
                'used_services': row['¿Los ha utilizado?'],
                'count': row['count']
            })
        
        # Capacitación vs Accidentes Laborales
        training_accidents = self.df.groupby(['¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?', '¿Has experimentado algún incidente o accidente laboral en los últimos 12 meses?']).size().reset_index(name='count')
        training_accidents_data = []
        for _, row in training_accidents.iterrows():
            training_accidents_data.append({
                'received_training': row['¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?'],
                'work_accident': row['¿Has experimentado algún incidente o accidente laboral en los últimos 12 meses?'],
                'count': row['count']
            })
        
        # Reconocimiento vs Jerarquía
        recognition_hierarchy = self.df.groupby(['Jerarquía', '¿Te sientes valorado y reconocido por tus superiores?']).size().reset_index(name='count')
        recognition_hierarchy_data = []
        for _, row in recognition_hierarchy.iterrows():
            recognition_hierarchy_data.append({
                'hierarchy': row['Jerarquía'],
                'feels_recognized': row['¿Te sientes valorado y reconocido por tus superiores?'],
                'count': row['count']
            })
        
        # Comunicación vs Conocimiento de Servicios
        communication_knowledge = self.df.groupby(['¿Te sientes cómodo comunicándote con tus superiores y compañeros?', '¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?']).size().reset_index(name='count')
        communication_knowledge_data = []
        for _, row in communication_knowledge.iterrows():
            communication_knowledge_data.append({
                'comfortable_communication': row['¿Te sientes cómodo comunicándote con tus superiores y compañeros?'],
                'knows_services': row['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?'],
                'count': row['count']
            })
        
        return {
            'safety_training_distribution': safety_training,
            'training_topics_distribution': training_topics,
            'occupational_health_knowledge_distribution': occupational_health_knowledge,
            'known_services_distribution': known_services_dict,
            'service_usage_distribution': service_usage,
            'service_satisfaction_distribution': service_satisfaction,
            'equipment_access_distribution': equipment_access,
            'professional_development_distribution': professional_development,
            'recognition_distribution': recognition,
            'communication_distribution': communication,
            'training_hierarchy_cross': training_hierarchy_data,
            'knowledge_usage_cross': knowledge_usage_data,
            'training_accidents_cross': training_accidents_data,
            'recognition_hierarchy_cross': recognition_hierarchy_data,
            'communication_knowledge_cross': communication_knowledge_data
        }
    
    def get_quality_of_life_data(self):
        """Retorna datos de percepción de calidad de vida con conexiones avanzadas"""
        if self.df is None:
            return {}
        
        # Distribuciones básicas
        needs_improvement = self.df[' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?'].value_counts().to_dict()
        economic_satisfaction = self.df['¿Te sientes satisfecho con la situación económica de su hogar?'].value_counts().to_dict()
        risk_effort_remuneration = self.df['¿Sientes que hay congruencias entre el riesgo y el esfuerzo en relación a la remuneración recibida?'].value_counts().to_dict()
        
        # Factores más mencionados
        factors_columns = ['*¿Cuáles?', 'Columna1', 'Columna2', 'Columna3', 'Columna4', 'Columna5', 'Columna6']
        all_factors = []
        
        for col in factors_columns:
            if col in self.df.columns:
                factors = self.df[col].dropna().astype(str)
                factors = factors[factors != 'nan']
                all_factors.extend(factors.tolist())
        
        factor_counts = Counter(all_factors)
        top_factors = dict(factor_counts.most_common(10))
        
        # NUEVAS CONEXIONES DE CALIDAD DE VIDA
        
        # Satisfacción Económica vs Jerarquía
        economic_hierarchy = self.df.groupby(['Jerarquía', '¿Te sientes satisfecho con la situación económica de su hogar?']).size().reset_index(name='count')
        economic_hierarchy_data = []
        for _, row in economic_hierarchy.iterrows():
            economic_hierarchy_data.append({
                'hierarchy': row['Jerarquía'],
                'economic_satisfaction': row['¿Te sientes satisfecho con la situación económica de su hogar?'],
                'count': row['count']
            })
        
        # Satisfacción Económica vs Servicios Adicionales
        economic_services = self.df.groupby(['¿Realiza servicios adicionales?', '¿Te sientes satisfecho con la situación económica de su hogar?']).size().reset_index(name='count')
        economic_services_data = []
        for _, row in economic_services.iterrows():
            economic_services_data.append({
                'additional_services': row['¿Realiza servicios adicionales?'],
                'economic_satisfaction': row['¿Te sientes satisfecho con la situación económica de su hogar?'],
                'count': row['count']
            })
        
        # Factores a Mejorar vs Género
        factors_gender = {}
        for factor in top_factors.keys():
            if factor != 'nan':
                gender_counts = {}
                for col in factors_columns:
                    if col in self.df.columns:
                        factor_df = self.df[self.df[col] == factor]
                        if not factor_df.empty:
                            gender_dist = factor_df['Género'].value_counts().to_dict()
                            for gender, count in gender_dist.items():
                                gender_counts[gender] = gender_counts.get(gender, 0) + count
                factors_gender[factor] = gender_counts
        
        # Factores a Mejorar vs Jerarquía
        factors_hierarchy = {}
        for factor in list(top_factors.keys())[:5]:  # Top 5 factores
            if factor != 'nan':
                hierarchy_counts = {}
                for col in factors_columns:
                    if col in self.df.columns:
                        factor_df = self.df[self.df[col] == factor]
                        if not factor_df.empty:
                            hierarchy_dist = factor_df['Jerarquía'].value_counts().to_dict()
                            for hierarchy, count in hierarchy_dist.items():
                                hierarchy_counts[hierarchy] = hierarchy_counts.get(hierarchy, 0) + count
                factors_hierarchy[factor] = hierarchy_counts
        
        # Relación jerarquía vs percepción (existente)
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
            'economic_satisfaction_distribution': economic_satisfaction,
            'risk_effort_remuneration_distribution': risk_effort_remuneration,
            'hierarchy_quality_cross': hierarchy_quality_data,
            'economic_hierarchy_cross': economic_hierarchy_data,
            'economic_services_cross': economic_services_data,
            'factors_gender_analysis': factors_gender,
            'factors_hierarchy_analysis': factors_hierarchy
        }
    
    def get_comprehensive_kpis(self):
        """Retorna KPIs comprehensivos con nuevas métricas"""
        if self.df is None:
            return {}
        
        total_responses = len(self.df)
        
        # KPIs básicos existentes
        physical_activity_yes = len(self.df[self.df['¿Realiza algún tipo de actividad física?'] == 'Sí'])
        physical_activity_percentage = round((physical_activity_yes / total_responses) * 100, 2)
        
        needs_improvement_yes = len(self.df[self.df[' ¿Considera que debe mejorar algunos de estos factores para contribuir a una mejor calidad de vida?'] == 'Sí'])
        needs_improvement_percentage = round((needs_improvement_yes / total_responses) * 100, 2)
        
        safety_training_yes = len(self.df[self.df['¿Has recibido capacitación en seguridad y salud en el trabajo en los últimos 12 meses?'] == 'Sí'])
        safety_training_percentage = round((safety_training_yes / total_responses) * 100, 2)
        
        occupational_knowledge_yes = len(self.df[self.df['¿Tiene conocimiento  de los servicios relacionados a la salud ocupacional que proporciona la institución policial?'] == 'Sí'])
        occupational_knowledge_percentage = round((occupational_knowledge_yes / total_responses) * 100, 2)
        
        medical_checkup_yes = len(self.df[self.df['¿Se ha realizado algún chequeo en los últimos 12 meses?'] == 'Sí'])
        medical_checkup_percentage = round((medical_checkup_yes / total_responses) * 100, 2)
        
        additional_services_yes = len(self.df[self.df['¿Realiza servicios adicionales?'] == 'Sí'])
        additional_services_percentage = round((additional_services_yes / total_responses) * 100, 2)
        
        # NUEVOS KPIs COMPREHENSIVOS
        
        # Índice de Salud Integral (física + mental buena)
        good_physical_health = len(self.df[self.df['Salud física actual'] == 'Buena'])
        good_mental_health = len(self.df[self.df['Salud mental actual'] == 'Buena'])
        both_good_health = len(self.df[(self.df['Salud física actual'] == 'Buena') & (self.df['Salud mental actual'] == 'Buena')])
        integral_health_index = round((both_good_health / total_responses) * 100, 2)
        
        # Índice de Sobrecarga Laboral
        overloaded = len(self.df[(self.df['¿Realiza servicios adicionales?'] == 'Sí') & (self.df['¿Tiene recargo de servicios?'] == 'Sí')])
        overload_index = round((overloaded / total_responses) * 100, 2)
        
        # Índice de Equilibrio Vida-Trabajo
        good_balance = len(self.df[self.df['¿Te sientes cómodo con el equilibrio entre tu vida laboral y personal?'] == 'Sí'])
        work_life_balance_index = round((good_balance / total_responses) * 100, 2)
        
        # Índice de Clima Laboral (reconocimiento + comunicación + desarrollo)
        good_recognition = len(self.df[self.df['¿Te sientes valorado y reconocido por tus superiores?'] == 'Sí'])
        good_communication = len(self.df[self.df['¿Te sientes cómodo comunicándote con tus superiores y compañeros?'] == 'Sí'])
        good_development = len(self.df[self.df['¿Tienes oportunidades para el desarrollo profesional y el ascenso?'] == 'Sí'])
        
        climate_components = [
            round((good_recognition / total_responses) * 100, 2),
            round((good_communication / total_responses) * 100, 2),
            round((good_development / total_responses) * 100, 2)
        ]
        organizational_climate_index = round(sum(climate_components) / len(climate_components), 2)
        
        # Satisfacción Económica
        economic_satisfaction_yes = len(self.df[self.df['¿Te sientes satisfecho con la situación económica de su hogar?'] == 'Sí'])
        economic_satisfaction_percentage = round((economic_satisfaction_yes / total_responses) * 100, 2)
        
        # Tasa de Accidentes Laborales
        work_accidents_yes = len(self.df[self.df['¿Has experimentado algún incidente o accidente laboral en los últimos 12 meses?'] == 'Sí'])
        work_accidents_rate = round((work_accidents_yes / total_responses) * 100, 2)
        
        # Utilización de Servicios de Salud Ocupacional
        service_usage_yes = len(self.df[self.df['¿Los ha utilizado?'] == 'Sí '])
        service_usage_percentage = round((service_usage_yes / total_responses) * 100, 2)
        
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
            'additional_services_percentage': additional_services_percentage,
            'integral_health_index': integral_health_index,
            'overload_index': overload_index,
            'work_life_balance_index': work_life_balance_index,
            'organizational_climate_index': organizational_climate_index,
            'economic_satisfaction_percentage': economic_satisfaction_percentage,
            'work_accidents_rate': work_accidents_rate,
            'service_usage_percentage': service_usage_percentage,
            'top_factors_to_improve': top_3_factors,
            'climate_components': {
                'recognition_percentage': climate_components[0],
                'communication_percentage': climate_components[1],
                'development_percentage': climate_components[2]
            }
        }
    
    def get_kpis(self):
        """Alias para mantener compatibilidad"""
        return self.get_comprehensive_kpis()
    
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
            'kpis': temp_processor.get_comprehensive_kpis()
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

