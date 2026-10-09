<script setup lang="ts">
import { onMounted, ref } from 'vue';

withDefaults(defineProps<{ title?: string }>(), { title: '' });
const emit = defineEmits<{ (e: 'close'): void }>();

const windowRef = ref<HTMLDivElement | null>(null);

function close(): void {
  emit('close');
}

// Автофокус, щоб @keyup.esc на вікні спрацьовував одразу після відкриття.
onMounted(() => {
  windowRef.value?.focus();
});
</script>

<template>
  <Transition name="modal-fade">
    <div
      class="modal-backdrop-custom"
      @click.self="close"
      @keyup.esc="close"
    >
      <div
        ref="windowRef"
        class="modal-window"
        tabindex="0"
        @keyup.esc="close"
      >
        <header class="modal-window__header">
          <slot name="header">
            <h5 class="m-0">
              {{ title }}
            </h5>
          </slot>
          <button
            type="button"
            class="btn-close"
            aria-label="Закрити"
            @click="close"
          />
        </header>

        <div class="modal-window__body">
          <slot />
        </div>

        <footer class="modal-window__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-window {
  background: #fff;
  border-radius: 8px;
  width: min(420px, 92vw);
  padding: 1rem 1.25rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
}

.modal-window__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.modal-window__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
