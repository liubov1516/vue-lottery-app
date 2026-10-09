<script setup lang="ts">
import type { Participant } from '../types/participant';

defineProps<{ winner: Participant }>();
const emit = defineEmits<{ (e: 'remove', id: string): void }>();
</script>

<template>
  <span class="winner-badge">
    {{ winner.name }}
    <button
      type="button"
      class="winner-badge__remove"
      aria-label="Видалити переможця"
      @click="emit('remove', winner.id)"
    >
      ×
    </button>
  </span>
</template>

<style scoped>
.winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #2d9cdb;
  color: #fff;
  border-radius: 999px;
  padding: 0.15rem 0.6rem;
  font-size: 0.85rem;
}

.winner-badge__remove {
  border: none;
  background: transparent;
  color: #fff;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
</style>
