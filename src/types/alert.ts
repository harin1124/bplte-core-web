export interface AlertConfig {
  title?: string;
  description: string;
  onClose?: () => void;
  onConfirm?: () => void;
  autoClose?: boolean;
}

export interface AlertContextType {
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}