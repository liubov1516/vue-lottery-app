<script setup lang="ts">
import WinnerBadge from './WinnerBadge.vue';
import AppButton from './AppButton.vue';
import { useWinners } from '../composables/useWinners';

const { winners, canPickWinner, pickWinner, removeWinner } = useWinners();
</script>

<template>
  <section class="panel">
    <div class="winners-row">
      <div class="winners-input">
        <WinnerBadge
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="removeWinner"
        />
        <span
          v-if="winners.length === 0"
          class="winners-placeholder"
        >Winners</span>
      </div>
      <AppButton
        label="New winner"
        :disabled="!canPickWinner"
        @click="pickWinner"
      />
    </div>
  </section>
</template>

<style scoped>
.winners-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.winners-input {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  min-height: 2.5rem;
  padding: 0.3rem 0.6rem;
}

.winners-placeholder {
  color: #9ca3af;
}
</style>
