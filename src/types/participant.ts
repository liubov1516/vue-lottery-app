export interface Participant {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
}

export type ParticipantFormData = Omit<Participant, 'id'>;
