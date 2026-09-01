import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bioApi = {
  // Species
  getSpecies: async (params = {}) => {
    try {
      const res = await apiClient.get('/species', { params });
      return res.data;
    } catch (err) {
      console.warn('API fallback for species:', err);
      return { total: 0, items: [] };
    }
  },

  getSpeciesStats: async () => {
    try {
      const res = await apiClient.get('/species/summary/stats');
      return res.data;
    } catch (err) {
      return {};
    }
  },

  // eDNA
  getEdnaSamples: async (params = {}) => {
    try {
      const res = await apiClient.get('/edna/samples', { params });
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  getEdnaDetections: async (params = {}) => {
    try {
      const res = await apiClient.get('/edna/detections', { params });
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  getEdnaMetrics: async () => {
    try {
      const res = await apiClient.get('/edna/summary/metrics');
      return res.data;
    } catch (err) {
      return {};
    }
  },

  // Bioacoustics
  getAcousticDetections: async (params = {}) => {
    try {
      const res = await apiClient.get('/acoustics/detections', { params });
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  getAudioRecordings: async () => {
    try {
      const res = await apiClient.get('/acoustics/recordings');
      return res.data;
    } catch (err) {
      return { total: 0, recordings: [] };
    }
  },

  getAcousticStats: async () => {
    try {
      const res = await apiClient.get('/acoustics/summary/stats');
      return res.data;
    } catch (err) {
      return {};
    }
  },

  // Satellite & Remote Sensing
  getSatelliteTimeseries: async (params = {}) => {
    try {
      const res = await apiClient.get('/satellite/timeseries', { params });
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  getMonitoringSites: async () => {
    try {
      const res = await apiClient.get('/satellite/sites');
      return res.data;
    } catch (err) {
      return { type: 'FeatureCollection', features: [] };
    }
  },

  getSatelliteStats: async () => {
    try {
      const res = await apiClient.get('/satellite/summary/stats');
      return res.data;
    } catch (err) {
      return {};
    }
  },

  // Ground Surveys
  getSurveys: async (params = {}) => {
    try {
      const res = await apiClient.get('/surveys', { params });
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  getSurveyStats: async () => {
    try {
      const res = await apiClient.get('/surveys/summary/stats');
      return res.data;
    } catch (err) {
      return {};
    }
  },

  // Threat Alerts
  getAlerts: async (params = {}) => {
    try {
      const res = await apiClient.get('/alerts', { params });
      return res.data;
    } catch (err) {
      return { total: 0, items: [] };
    }
  },

  createAlert: async (payload) => {
    const res = await apiClient.post('/alerts', payload);
    return res.data;
  },

  resolveAlert: async (alertId) => {
    const res = await apiClient.patch(`/alerts/${alertId}/resolve`);
    return res.data;
  },

  // Analytics & Dashboard
  getDashboardStats: async () => {
    try {
      const res = await apiClient.get('/analytics/dashboard-stats');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getBiodiversityTrends: async () => {
    try {
      const res = await apiClient.get('/analytics/biodiversity-trends');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  getDataSourcesBreakdown: async () => {
    try {
      const res = await apiClient.get('/analytics/data-sources-breakdown');
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

  // Machine Learning Live Inference
  predictAcoustic: async (payload) => {
    const res = await apiClient.post('/ml/predict/acoustic', payload);
    return res.data;
  },

  predictEdna: async (payload) => {
    const res = await apiClient.post('/ml/predict/edna', payload);
    return res.data;
  },

  predictCanopy: async (payload) => {
    const res = await apiClient.post('/ml/predict/canopy', payload);
    return res.data;
  },

  triggerRetraining: async () => {
    const res = await apiClient.post('/ml/train');
    return res.data;
  },

  // Reports
  generateReport: async (payload) => {
    const res = await apiClient.post('/reports/generate', payload);
    return res.data;
  },
};

export default apiClient;
