import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ModulesAPI = {
  getAllModules: () => api.get('/modules'),
  getAllTemplates: () => api.get('/templates'),
  getTemplate: (id: string) => api.get(`/templates/${id}`),
  getAllWorkflows: () => api.get('/workflows'),
  getWorkflow: (id: string) => api.get(`/workflows/${id}`),
  createWorkflow: (workflow: any) => api.post('/workflows', workflow),
  updateWorkflow: (id: string, workflow: any) => api.put(`/workflows/${id}`, workflow),
  deleteWorkflow: (id: string) => api.delete(`/workflows/${id}`),
  executeWorkflow: (id: string, file?: File) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    return api.post(`/workflows/${id}/execute`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getExecutions: (workflowId: string) => api.get(`/workflows/${workflowId}/executions`),
  getExecution: (id: string) => api.get(`/executions/${id}`),
  getWorkflowYaml: (id: string) => api.get(`/workflows/${id}/yaml`, {
    responseType: 'blob',
  }),
};

export default api;