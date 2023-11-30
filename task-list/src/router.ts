import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import TaskForm from './views/TaskForm.vue';

const routes = [
  {
    path: '/',
    redirect: '/tasks'
  },
  {
    path: '/tasks',
    component: Home,
  },
  {
    name: 'Edit',
    path: '/tasks/:id',
    component: TaskForm
  },
  {
    name: 'Add',
    path: '/tasks/add',
    component: TaskForm
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;