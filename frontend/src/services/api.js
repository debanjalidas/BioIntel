import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bioApi = {
  // Dashboard Master Aggregate
  getDashboardData: async () => {
    try {
      const res = await apiClient.get('/dashboard');
      return res.data;
    } catch (err) {
      console.warn('Backend offline, using fallback dashboard data:', err);
      return null;
    }
  },

  // Legacy dashboard stats
  getDashboardStats: async () => {
    try {
      const res = await apiClient.get('/analytics/dashboard-stats');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  // Species Catalog
  getSpecies: async (params = {}) => {
    try {
      const res = await apiClient.get('/species', { params });
      return res.data;
    } catch (err) {
      console.warn('API fallback for species:', err);
      return { total: 0, items: [] };
    }
  },

  getSpeciesById: async (id) => {
    try {
      const res = await apiClient.get(`/species/${id}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  addSpecies: async (data) => {
    const res = await apiClient.post('/species', data);
    return res.data;
  },

  // Observations Workflow
  getObservations: async (params = {}) => {
    try {
      const res = await apiClient.get('/observations', { params });
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  createObservation: async (payload) => {
    const res = await apiClient.post('/observations', payload);
    return res.data;
  },

  identifyImage: async (filename, category) => {
    const res = await apiClient.post('/observations/identify', null, {
      params: { filename, category_hint: category },
    });
    return res.data;
  },

  verifyObservation: async (id, action = 'verify') => {
    const res = await apiClient.post(`/observations/${id}/verify`, null, {
      params: { action },
    });
    return res.data;
  },

  // Map
  getMapObservations: async (params = {}) => {
    try {
      const res = await apiClient.get('/map/observations', { params });
      return res.data;
    } catch (err) {
      return { total_points: 0, points: [], campus_zones: [] };
    }
  },

  // Analytics & Health Score
  getAnalyticsOverview: async () => {
    try {
      const res = await apiClient.get('/analytics/overview');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getBiodiversityTrends: async () => {
    try {
      const res = await apiClient.get('/analytics/trends');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getHealthScore: async () => {
    try {
      const res = await apiClient.get('/analytics/health-score');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getEnvironmentalData: async () => {
    try {
      const res = await apiClient.get('/analytics/environmental');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getDataQuality: async () => {
    try {
      const res = await apiClient.get('/analytics/quality');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getAnomalies: async () => {
    try {
      const res = await apiClient.get('/analytics/anomalies');
      return res.data;
    } catch (err) {
      return { total_anomalies: 0, items: [] };
    }
  },

  // Alerts
  getAlerts: async () => {
    try {
      const res = await apiClient.get('/alerts');
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  resolveAlert: async (id) => {
    const res = await apiClient.post(`/alerts/${id}/resolve`);
    return res.data;
  },

  // AI & RAG
  askAiAssistant: async (query) => {
    const res = await apiClient.post('/ai/chat', { query });
    return res.data;
  },

  getAiInsights: async () => {
    try {
      const res = await apiClient.get('/ai/insights');
      return res.data;
    } catch (err) {
      return { total: 0, insights: [] };
    }
  },

  // Digital Twin & What-If Simulation
  getCampusZones: async () => {
    try {
      const res = await apiClient.get('/digital-twin/zones');
      return res.data;
    } catch (err) {
      return { total_zones: 0, zones: [] };
    }
  },

  simulateScenario: async (payload) => {
    const res = await apiClient.post('/digital-twin/simulate', payload);
    return res.data;
  },

  // Recommendations
  getRecommendations: async () => {
    try {
      const res = await apiClient.get('/recommendations');
      return res.data;
    } catch (err) {
      return { total: 0, recommendations: [] };
    }
  },

  // Reports
  getReportData: async () => {
    try {
      const res = await apiClient.get('/reports');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  generateExecutiveReport: async (payload) => {
    const res = await apiClient.post('/reports/generate', payload);
    return res.data;
  },

  // Admin & Verification Queue
  getVerificationQueue: async () => {
    try {
      const res = await apiClient.get('/admin/verification-queue');
      return res.data;
    } catch (err) {
      return { pending_count: 0, items: [] };
    }
  },

  getAdminStats: async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  // Knowledge Documents
  getKnowledgeDocs: async () => {
    try {
      const res = await apiClient.get('/rag/documents');
      return res.data;
    } catch (err) {
      return { total: 0, documents: [] };
    }
  },

  addKnowledgeDoc: async (data) => {
    const res = await apiClient.post('/rag/documents', data);
    return res.data;
  },

  // Acoustic Predictor
  predictAcoustic: async (inputs) => {
    const res = await apiClient.post('/ml/predict/acoustic', inputs);
    return res.data;
  },

  // Legacy chart helpers
  getDataSourcesBreakdown: async () => {
    try {
      const res = await apiClient.get('/analytics/data-sources');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getHabitatConditions: async () => {
    try {
      const res = await apiClient.get('/analytics/habitat-conditions');
      return res.data;
    } catch (err) {
      return null;
    }
  },
};
