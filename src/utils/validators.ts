import type { ParticipantFormData } from '../types/participant';

export type FieldErrors = Partial<Record<keyof ParticipantFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+380\d{9}$/;

function required(value: string): string | null {
  return value.trim() ? null : "Це поле є обов'язковим";
}

function validateEmailField(value: string): string | null {
  const req = required(value);
  if (req) return req;
  return EMAIL_REGEX.test(value.trim()) ? null : 'Некоректний формат email';
}

function validatePhoneField(value: string): string | null {
  const req = required(value);
  if (req) return req;
  return PHONE_REGEX.test(value.trim()) ? null : 'Телефон має бути у форматі +380XXXXXXXXX';
}

function validateDobField(value: string): string | null {
  const req = required(value);
  if (req) return req;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Некоректна дата';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today ? 'Дата народження не може бути у майбутньому' : null;
}

export function validateParticipant(data: ParticipantFormData): FieldErrors {
  const errors: FieldErrors = {};
  const nameErr = required(data.name);
  const dobErr = validateDobField(data.dob);
  const emailErr = validateEmailField(data.email);
  const phoneErr = validatePhoneField(data.phone);
  if (nameErr) errors.name = nameErr;
  if (dobErr) errors.dob = dobErr;
  if (emailErr) errors.email = emailErr;
  if (phoneErr) errors.phone = phoneErr;
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
