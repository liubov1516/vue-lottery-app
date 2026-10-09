<script setup lang="ts">
import WinnersPanel from './components/WinnersPanel.vue';
import RegisterForm from './components/RegisterForm.vue';
import ParticipantsTable from './components/ParticipantsTable.vue';
</script>

<template>
  <main class="app-shell">
    <WinnersPanel />
    <RegisterForm />
    <ParticipantsTable />
  </main>
</template>
