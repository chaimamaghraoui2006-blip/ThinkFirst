import { StudentDraft } from '../types';

const STORAGE_KEY = 'think_first_student_workspace_v1';

export const loadStoredDraft = (): StudentDraft | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentDraft;
  } catch (err) {
    console.error('Failed to load draft from local storage:', err);
    return null;
  }
};

export const saveDraftToStorage = (draft: StudentDraft): void => {
  try {
    draft.lastSaved = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('Failed to save draft to local storage:', err);
  }
};

export const clearStoredDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear stored draft:', err);
  }
};
