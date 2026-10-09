<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{ (e: 'filter-by-name', term: string): void }>();

const query = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

// Подія filter-by-name передається батьку із затримкою (debounce) 300 мс,
// щоб не фільтрувати таблицю на кожне окреме натискання клавіші.
watch(query, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim());
  }, 300);
});
</script>

<template>
  <input
    v-model="query"
    type="text"
    class="form-control mb-2"
    placeholder="Пошук учасника за іменем"
  >
</template>
