import axios from 'axios';
import { Task } from '../models/Task';

const apiBaseURL = 'http://localhost:5083/';

export default {
  async fetchTasks() {
    try {
      const response = await axios.get(`${apiBaseURL}Task`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  async getTask(taskId: number) {
    try {
      const response = await axios.get(`${apiBaseURL}Task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  async addTask(newTask: Task) {
    try {
      const response = await axios.post(`${apiBaseURL}Task`, newTask);
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  async editTask(updatedTask: Task) {
    try {
      const response = await axios.put(`${apiBaseURL}Task/${updatedTask.id}`, updatedTask);
      return response.data;
    } catch (error) {
      console.error('Error editing task:', error);
      throw error;
    }
  },

  async deleteTask(taskId: number) {
    try {
      const response = await axios.delete(`${apiBaseURL}Task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error excluding task:', error);
      throw error;
    }
  },
};