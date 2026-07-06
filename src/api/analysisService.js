import axiosInstance from './axiosInstance';

const analysisService = {
    getHistory: async () => {
    const { data } = await axiosInstance.get(
      import.meta.env.VITE_HISTORY_ENDPOINT || '/history/'
    );
    return data;
  },
  getDashboardStats: async () => {
    const { data } = await axiosInstance.get('/dashboard/stats/');
    return data;
  },
  getRecentAnalyses: async () => {
    const { data } = await axiosInstance.get('/analyses/recent/');
    return data;
  },
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axiosInstance.post('/analyses/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    return data;
  },
  startAnalysis: async (id) => {
    const { data } = await axiosInstance.post(`/analyses/${id}/start/`);
    return data;
  },
  // يُستخدم في صفحة الـ Loading للـ Polling الدوري (كل 3 ثواني)
  // يرجع كائن خفيف فيه status فقط: 'processing' | 'completed' | 'failed'
  getStatus: async (id) => {
    const { data } = await axiosInstance.get(`/analyses/${id}/status/`);
    return data;
  },
  getResults: async (id) => {
    const { data } = await axiosInstance.get(`/analyses/${id}/results/`);
    return data;
  },
  downloadPdf: async (id) => {
    const res = await axiosInstance.get(`/analyses/${id}/report/pdf/`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `report_${id}.pdf`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  },
};

export default analysisService;