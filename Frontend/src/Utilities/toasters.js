// 📁 Utilities/toasters.js
import { toast as sonnerToast } from 'sonner';

export const toast = sonnerToast; // ✅ Add this line

export const defaultMessage = (message) => {
  sonnerToast(`${message}`);
};

export const successMessage = (message) => {
  sonnerToast.success(`${message}`);
};

export const errorMessage = (message) => {
  sonnerToast.error(`${message}`);
};

export const infoMessage = (message) => {
  sonnerToast.info(`${message}`);
};

export const warningMessage = (message) => {
  sonnerToast.warning(`${message}`);
};

export const descriptionMessage = (message, description) => {
  sonnerToast.message(message, {
    description: description,
  });
};
