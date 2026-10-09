<script setup lang="ts">
import { reactive, ref } from 'vue';
import AppInput from './AppInput.vue';
import AppButton from './AppButton.vue';
import { useParticipants } from '../composables/useParticipants';
import { validateParticipant, hasErrors, type FieldErrors } from '../utils/validators';
import type { ParticipantFormData } from '../types/participant';

const { addParticipant, isEmailTaken } = useParticipants();

function emptyForm(): ParticipantFormData {
  return { name: '', dob: '', email: '', phone: '' };
}

const form = reactive<ParticipantFormData>(emptyForm());
const errors = ref<FieldErrors>({});

function resetForm(): void {
  Object.assign(form, emptyForm());
  errors.value = {};
}

function handleSubmit(): void {
  const fieldErrors = validateParticipant(form);

  if (isEmailTaken(form.email)) {
    fieldErrors.email = 'Учасник з такою поштою вже зареєстрований';
  }

  errors.value = fieldErrors;
  if (hasErrors(fieldErrors)) return;

  addParticipant({ ...form });
  resetForm();
}
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      Register form
    </div>
    <div class="panel-subtitle">
      Please fill in all the fields.
    </div>

    <form @submit.prevent>
      <AppInput
        v-model="form.name"
        label="Name"
        placeholder="Enter user name"
        :error="errors.name"
        @enter="handleSubmit"
      />
      <AppInput
        v-model="form.dob"
        label="Date of Birth"
        type="date"
        :error="errors.dob"
        @enter="handleSubmit"
      />
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="Enter email"
        :error="errors.email"
        @enter="handleSubmit"
      />
      <AppInput
        v-model="form.phone"
        label="Phone number"
        type="tel"
        placeholder="+380XXXXXXXXX"
        :error="errors.phone"
        @enter="handleSubmit"
      />

      <div class="d-flex justify-content-end">
        <AppButton
          label="Save"
          type="button"
          @click="handleSubmit"
        />
      </div>
    </form>
  </section>
</template>
