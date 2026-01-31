export interface AlertConfig {
  type: 'alert' | 'confirm';
  title?: string;
  description: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export interface AlertContextType {
  showAlert: (config: AlertConfig) => void;
  hide: () => void;
}
