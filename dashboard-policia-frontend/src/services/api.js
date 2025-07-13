const API_BASE_URL = 'https://dashboard-policia-backend.onrender.com/api';

class ApiService {
  async fetchData(endpoint, params = {}) {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
      
      // Add query parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== 'all') {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all data
  async getAllData() {
    return this.fetchData('/data');
  }

  // Get filtered data
  async getFilteredData(filters) {
    return this.fetchData('/filtered-data', filters);
  }

  // Get KPIs
  async getKPIs() {
    return this.fetchData('/kpis');
  }

  // Get demographics
  async getDemographics() {
    return this.fetchData('/demographics');
  }

  // Get habits
  async getHabits() {
    return this.fetchData('/habits');
  }

  // Get health data
  async getHealth() {
    return this.fetchData('/health');
  }

  // Get knowledge data
  async getKnowledge() {
    return this.fetchData('/knowledge');
  }

  // Get quality of life data
  async getQualityOfLife() {
    return this.fetchData('/quality-of-life');
  }

  // Get filter options
  async getFilterOptions() {
    return this.fetchData('/filter-options');
  }
}

export default new ApiService();

