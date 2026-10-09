import { computed, ref } from 'vue';
import type { Participant } from '../types/participant';
import { useParticipants } from './useParticipants';

const MAX_WINNERS = 3;

// Теж синглтон — переможці мають бути доступні і блоку переможців, і таблиці учасників.
const winnerIds = ref<string[]>([]);

export function useWinners() {
  const { participants, removeParticipant: removeParticipantFromList } = useParticipants();

  const winners = computed<Participant[]>(() =>
    winnerIds.value
      .map((id) => participants.value.find((p) => p.id === id))
      .filter((p): p is Participant => Boolean(p)),
  );

  const availableCandidates = computed<Participant[]>(() =>
    participants.value.filter((p) => !winnerIds.value.includes(p.id)),
  );

  const canPickWinner = computed<boolean>(
    () => winnerIds.value.length < MAX_WINNERS && availableCandidates.value.length > 0,
  );

  function pickWinner(): void {
    if (!canPickWinner.value) return;
    const pool = availableCandidates.value;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    winnerIds.value.push(chosen.id);
  }

  function removeWinner(id: string): void {
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id);
  }

  // Якщо учасника видаляють зовсім зі списку — він має зникнути і з переможців.
  function removeParticipant(id: string): void {
    removeParticipantFromList(id);
    removeWinner(id);
  }

  return { winners, canPickWinner, pickWinner, removeWinner, removeParticipant };
}
