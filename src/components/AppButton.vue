<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    disabled?: boolean;
  }>(),
  { type: 'button', variant: 'primary', disabled: false },
);

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>();

function onClick(event: MouseEvent): void {
  emit('click', event);
}
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant === 'outline' ? 'outline-secondary' : variant}`]"
    :disabled="disabled"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>
