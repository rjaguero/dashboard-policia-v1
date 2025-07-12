from flask import Blueprint, jsonify, request
import os
from src.data_processor import DataProcessor

dashboard_bp = Blueprint('dashboard', __name__)

# Inicializar el procesador de datos
excel_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'Dashboard_Encuesta_Base.xlsx')
data_processor = DataProcessor(excel_path)

@dashboard_bp.route('/data', methods=['GET'])
def get_all_data():
    """Retorna todos los datos procesados de la encuesta"""
    try:
        data = {
            'demographics': data_processor.get_demographics_data(),
            'habits': data_processor.get_habits_data(),
            'health': data_processor.get_health_data(),
            'knowledge': data_processor.get_knowledge_data(),
            'quality_of_life': data_processor.get_quality_of_life_data(),
            'kpis': data_processor.get_kpis(),
            'filter_options': data_processor.get_filter_options()
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/filtered-data', methods=['GET'])
def get_filtered_data():
    """Retorna datos filtrados según los parámetros"""
    try:
        filters = {
            'distrito': request.args.get('distrito', 'all'),
            'genero': request.args.get('genero', 'all'),
            'edad': request.args.get('edad', 'all'),
            'jerarquia': request.args.get('jerarquia', 'all'),
            'estado_civil': request.args.get('estado_civil', 'all'),
            'actividad_fisica': request.args.get('actividad_fisica', 'false')
        }
        
        data = data_processor.get_filtered_data(filters)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/kpis', methods=['GET'])
def get_kpis():
    """Retorna indicadores clave de rendimiento"""
    try:
        kpis = data_processor.get_kpis()
        return jsonify(kpis)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/demographics', methods=['GET'])
def get_demographics():
    """Retorna datos demográficos agregados"""
    try:
        demographics = data_processor.get_demographics_data()
        return jsonify(demographics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/habits', methods=['GET'])
def get_habits():
    """Retorna datos de hábitos y bienestar"""
    try:
        habits = data_processor.get_habits_data()
        return jsonify(habits)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/health', methods=['GET'])
def get_health():
    """Retorna datos específicos de salud"""
    try:
        health = data_processor.get_health_data()
        return jsonify(health)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/knowledge', methods=['GET'])
def get_knowledge():
    """Retorna datos específicos de conocimiento y capacitación"""
    try:
        knowledge = data_processor.get_knowledge_data()
        return jsonify(knowledge)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/quality-of-life', methods=['GET'])
def get_quality_of_life():
    """Retorna datos de percepción de calidad de vida"""
    try:
        quality_of_life = data_processor.get_quality_of_life_data()
        return jsonify(quality_of_life)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/filter-options', methods=['GET'])
def get_filter_options():
    """Retorna las opciones disponibles para los filtros"""
    try:
        options = data_processor.get_filter_options()
        return jsonify(options)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

