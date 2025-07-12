import pandas as pd
from src.data_processor import DataProcessor

processor = DataProcessor("data/Dashboard_Encuesta_Base.xlsx")

habits_data = processor.get_habits_data()
print("\n--- Habits Data ---")
print("Children Physical Activity Cross:", habits_data.get("children_physical_activity_cross"))

kpis = processor.get_comprehensive_kpis()
print("\n--- KPIs ---")
print(kpis)

health_data = processor.get_health_data()
print("\n--- Health Data ---")
print("Health Correlation Matrix:", health_data.get("health_correlation_matrix"))

knowledge_data = processor.get_knowledge_data()
print("\n--- Knowledge Data ---")
print("Known Services Distribution:", knowledge_data.get("known_services_distribution"))
print("Training Topics Distribution:", knowledge_data.get("training_topics_distribution"))
print("Knowledge Usage Cross:", knowledge_data.get("knowledge_usage_cross"))
print("Training Accidents Cross:", knowledge_data.get("training_accidents_cross"))

quality_data = processor.get_quality_of_life_data()
print("\n--- Quality of Life Data ---")
print("Top Factors:", quality_data.get("top_factors"))
print("Factors Gender Analysis:", quality_data.get("factors_gender_analysis"))
print("Factors Hierarchy Analysis:", quality_data.get("factors_hierarchy_analysis"))


