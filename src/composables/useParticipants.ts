import { ref, watch } from 'vue';
import type { Participant, ParticipantFormData } from '../types/participant';

const STORAGE_KEY = 'lottery-participants';

function loadFromStorage(): Participant[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Participant[];
  } catch {
    return [];
  }
}

// Синглтон: один і той самий реактивний стан для всіх компонентів,
// які викликають useParticipants() — без передачі через безліч props.
const participants = ref<Participant[]>(loadFromStorage());

// Збереження у localStorage через watcher з опцією deep
watch(
  participants,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  { deep: true },
);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isEmailTaken(email: string, excludeId?: string): boolean {
  const normalized = email.trim().toLowerCase();
  return participants.value.some(
    (p) => p.id !== excludeId && p.email.trim().toLowerCase() === normalized,
  );
}

function addParticipant(data: ParticipantFormData): void {
  participants.value.push({ id: generateId(), ...data });
}

function updateParticipant(id: string, data: ParticipantFormData): void {
  const index = participants.value.findIndex((p) => p.id === id);
  if (index !== -1) {
    participants.value[index] = { id, ...data };
  }
}

function removeParticipant(id: string): void {
  participants.value = participants.value.filter((p) => p.id !== id);
}

export function useParticipants() {
  return {
    participants,
    addParticipant,
    updateParticipant,
    removeParticipant,
    isEmailTaken,
  };
}
