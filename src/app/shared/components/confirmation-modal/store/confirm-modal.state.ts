export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirmAction: (() => void) | null;
}

export const initialConfirmModalState: ConfirmModalState = {
  isOpen: false,
  title: '',
  message: '',
  onConfirmAction: null,
};
