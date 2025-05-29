import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const taskService = {
  async getTasks() {
    const response = await axios.get(`${API_URL}/api/tasks`, getAuthHeader());
    return response.data;
  },

  async createTask(task) {
    const response = await axios.post(`${API_URL}/api/tasks`, task, getAuthHeader());
    return response.data;
  },

  async updateTask(id, updates) {
    const response = await axios.patch(
      `${API_URL}/api/tasks/${id}`,
      updates,
      getAuthHeader()
    );
    return response.data;
  },

  async deleteTask(id) {
    await axios.delete(`${API_URL}/api/tasks/${id}`, getAuthHeader());
  }
};
