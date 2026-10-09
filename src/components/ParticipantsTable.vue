<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import SearchBar from './SearchBar.vue';
import ModalWindow from './ModalWindow.vue';
import AppInput from './AppInput.vue';
import AppButton from './AppButton.vue';
import { useParticipants } from '../composables/useParticipants';
import { useWinners } from '../composables/useWinners';
import { validateParticipant, hasErrors, type FieldErrors } from '../utils/validators';
import type { Participant, ParticipantFormData } from '../types/participant';

const { participants, updateParticipant, isEmailTaken } = useParticipants();
const { winners, removeParticipant } = useWinners();

//пошук (фільтрація за іменем)
const searchTerm = ref('');
function onFilterByName(term: string): void {
  searchTerm.value = term.toLowerCase();
}

//сортування
type SortKey = 'name' | 'dob' | null;
const sortKey = ref<SortKey>(null);
const sortDir = ref<'asc' | 'desc'>('asc');

function toggleSort(key: Exclude<SortKey, null>): void {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDir.value = 'asc';
  }
}

// Спочатку фільтрація, потім сортування — початковий список участників не змінюється
const visibleParticipants = computed<Participant[]>(() => {
  const filtered = participants.value.filter((p) => p.name.toLowerCase().includes(searchTerm.value));

  if (!sortKey.value) return filtered;

  const dir = sortDir.value === 'asc' ? 1 : -1;
  return [...filtered].sort((a, b) => {
    if (sortKey.value === 'name') return a.name.localeCompare(b.name, 'uk') * dir;
    return (a.dob > b.dob ? 1 : a.dob < b.dob ? -1 : 0) * dir;
  });
});

function isWinner(id: string): boolean {
  return winners.value.some((w) => w.id === id);
}

//редагування учасника
const editTarget = ref<Participant | null>(null);
const editForm = reactive<ParticipantFormData>({ name: '', dob: '', email: '', phone: '' });
const editErrors = ref<FieldErrors>({});

function openEdit(participant: Participant): void {
  editTarget.value = participant;
  Object.assign(editForm, {
    name: participant.name,
    dob: participant.dob,
    email: participant.email,
    phone: participant.phone,
  });
  editErrors.value = {};
}

function closeEdit(): void {
  editTarget.value = null;
}

function submitEdit(): void {
  if (!editTarget.value) return;
  const fieldErrors = validateParticipant(editForm);

  // Власний email учасника при редагуванні не вважається дублікатом
  if (isEmailTaken(editForm.email, editTarget.value.id)) {
    fieldErrors.email = 'Учасник з такою поштою вже зареєстрований';
  }

  editErrors.value = fieldErrors;
  if (hasErrors(fieldErrors)) return;

  updateParticipant(editTarget.value.id, { ...editForm });
  closeEdit();
}

//  видалення учасника
const deleteTarget = ref<Participant | null>(null);

function openDelete(participant: Participant): void {
  deleteTarget.value = participant;
}

function closeDelete(): void {
  deleteTarget.value = null;
}

function confirmDelete(): void {
  if (!deleteTarget.value) return;
  removeParticipant(deleteTarget.value.id);
  closeDelete();
}
</script>

<template>
  <section class="panel">
    <SearchBar @filter-by-name="onFilterByName" />

    <table class="table align-middle">
      <thead>
        <tr>
          <th>#</th>
          <th
            class="sortable"
            @click="toggleSort('name')"
          >
            Name
            <span v-if="sortKey === 'name'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th
            class="sortable"
            @click="toggleSort('dob')"
          >
            Date of Birth
            <span v-if="sortKey === 'dob'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th>Email</th>
          <th>Phone number</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-if="visibleParticipants.length === 0">
          <td
            colspan="7"
            class="text-center text-muted"
          >
            Список учасників пустий
          </td>
        </tr>
        <tr
          v-for="(participant, index) in visibleParticipants"
          :key="participant.id"
        >
          <td>{{ index + 1 }}</td>
          <td>
            {{ participant.name }}
            <span
              v-if="isWinner(participant.id)"
              class="winner-mark"
              title="Переможець"
            >★</span>
          </td>
          <td>{{ participant.dob }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td>
            <AppButton
              label="Редагувати дані"
              variant="outline"
              @click="openEdit(participant)"
            />
          </td>
          <td>
            <AppButton
              label="Видалити учасника"
              variant="danger"
              @click="openDelete(participant)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    // Модальне вікно редагування
    <ModalWindow
      v-if="editTarget"
      title="Редагувати дані"
      @close="closeEdit"
    >
      <AppInput
        v-model="editForm.name"
        label="Name"
        :error="editErrors.name"
        @enter="submitEdit"
      />
      <AppInput
        v-model="editForm.dob"
        label="Date of Birth"
        type="date"
        :error="editErrors.dob"
        @enter="submitEdit"
      />
      <AppInput
        v-model="editForm.email"
        label="Email"
        type="email"
        :error="editErrors.email"
        @enter="submitEdit"
      />
      <AppInput
        v-model="editForm.phone"
        label="Phone number"
        type="tel"
        :error="editErrors.phone"
        @enter="submitEdit"
      />

      <template #footer>
        <AppButton
          label="Скасувати"
          variant="outline"
          @click="closeEdit"
        />
        <AppButton
          label="Оновити дані"
          @click="submitEdit"
        />
      </template>
    </ModalWindow>

    // Модальне вікно підтвердження видалення
    <ModalWindow
      v-if="deleteTarget"
      title="Підтвердження"
      @close="closeDelete"
    >
      <p>
        Ви дійсно бажаєте видалити учасника "{{ deleteTarget.name }}", "{{ deleteTarget.email }}"?
      </p>

      <template #footer>
        <AppButton
          label="Ні"
          variant="outline"
          @click="closeDelete"
        />
        <AppButton
          label="Так"
          variant="danger"
          @click="confirmDelete"
        />
      </template>
    </ModalWindow>
  </section>
</template>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}

.winner-mark {
  color: #f0b400;
  margin-left: 0.25rem;
}
</style>
