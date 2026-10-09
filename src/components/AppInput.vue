<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    type?: 'text' | 'email' | 'tel' | 'date';
    placeholder?: string;
    error?: string;
  }>(),
  { type: 'text', label: '', placeholder: '', error: '' },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'enter'): void;
}>();

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="mb-2">
    <label
      v-if="label"
      class="form-label"
    >{{ label }}</label>
    <input
      class="form-control"
      :class="{ 'is-invalid': error }"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
      @keyup.enter="emit('enter')"
    >
    <div
      v-if="error"
      class="field-error"
    >
      {{ error }}
    </div>
  </div>
</template>
