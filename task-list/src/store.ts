import { createStore } from 'vuex';
import { Task } from './models/Task';
import TaskService from './services/TaskService';

export default createStore({
    state: {
        tasks: [] as Task[],
        selectedTask: Task
    },
    mutations: {
        setTasks(state, tasks) {
            state.tasks = tasks;
        },
        setSelectedTask(state, task) {
            state.selectedTask = task;
        },
        addTask(state, task) {
            state.tasks.push(task);
        },
        editTask(state, updatedTask) {
            const index = state.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                state.tasks.splice(index, 1, updatedTask);
            }
        },
        deleteTask(state, taskId) {
            state.tasks = state.tasks.filter(task => task.id !== taskId);
        },
    },
    actions: {
        async fetchTasks({ commit }) {
            try {
                const tasks = await TaskService.fetchTasks();
                commit('setTasks', tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        },

        async getTask({ commit }, taskId) {
            try {
                const task = await TaskService.getTask(taskId);
                commit('setSelectedTask', task);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        },

        async addTask({ commit }, newTask) {
            try {
                const addedTask = await TaskService.addTask(newTask);
                commit('addTask', addedTask);
            } catch (error) {
                console.error('Error adding task:', error);
            }
        },

        async editTask({ commit }, updatedTask) {
            try {
                const editedTask = await TaskService.editTask(updatedTask);
                commit('editTask', editedTask);
            } catch (error) {
                console.error('Error editing task:', error);
            }
        },

        async deleteTask({ commit }, taskId) {
            try {
                await TaskService.deleteTask(taskId);
                commit('deleteTask', taskId);
            } catch (error) {
                console.error('Error excluding task:', error);
            }
        },
    },
});