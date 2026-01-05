
import { ReferenceImage } from '../types';
import { INITIAL_SEED } from '../constants';

const STORAGE_KEY = 'panel_reference_library_data';

export const getReferences = (): ReferenceImage[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED));
    return INITIAL_SEED;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse local storage", e);
    return INITIAL_SEED;
  }
};

export const saveReference = (ref: ReferenceImage) => {
  const refs = getReferences();
  const existingIndex = refs.findIndex(r => r.id === ref.id);
  
  if (existingIndex > -1) {
    refs[existingIndex] = ref;
  } else {
    refs.unshift(ref);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(refs));
};

export const deleteReference = (id: string) => {
  const refs = getReferences().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(refs));
};

export const resetData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED));
  window.location.reload();
};
