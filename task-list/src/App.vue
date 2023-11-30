<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';

const links = [
  {
    name: 'Início',
    path: '/tasks',
  },
  {
    name: 'Nova Tarefa',
    path: '/tasks/add',
  },
];

const getUrl = computed(() => {
  return useRoute().path;
})
</script>

<template>
  <div>
    <nav class="flex justify-center sticky top-0 text-section drop-shadow-md bg-white z-50 h-nav">
      <div class="w-center_container flex gap-6 align-center">
        <router-link
          :class="{ 'text-details': link.path == useRoute().path }"
          v-for="link in links" :to="link.path">{{
            link.name }}</router-link>
      </div>
    </nav>
    <div class="h-complementary">
      <router-view :key="getUrl"/>
    </div>
  </div>
</template>
