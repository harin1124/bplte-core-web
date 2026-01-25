import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BUTTON } from '@/constants/message.ts';
import type { AlertConfig } from '@/types/alert';
import { AlertContext } from '@/contexts/alert-context';

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    description: '',
  });

  // 버튼 ref 추가
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig({
      ...config,
      title: config.title || '확인',
      onClose: config.onClose
        ? () => {
            hideAlert(); // 항상 먼저 Alert를 닫고
            config.onClose?.(); // 사용자 정의 onClose 실행
          }
        : hideAlert,
    });
    setAlertOpen(true);
  };

  const hideAlert = () => {
    setAlertOpen(false);
  };

  // Alert가 열릴 때 버튼에 포커스
  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        actionButtonRef.current?.focus();
      }, 100); // 애니메이션 완료 후 포커스

      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  const handleClose = () => {
    if (alertConfig.onClose) {
      alertConfig.onClose();
    }
  };

  const handleOk = () => {
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
  };

  // Confirm 모드인지 확인 (onConfirm가 있으면 Confirm 모드)
  const isConfirmMode = !!alertConfig.onConfirm;

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription style={{ whiteSpace: 'pre-wrap' }}>
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {isConfirmMode ? (
              <>
                <AlertDialogCancel className={'cursor-pointer'} onClick={handleClose}>
                  {BUTTON.CANCEL}
                </AlertDialogCancel>
                <AlertDialogAction
                  ref={actionButtonRef}
                  className={'cursor-pointer'}
                  onClick={handleOk}
                >
                  {BUTTON.OK}
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction
                ref={actionButtonRef}
                className={'cursor-pointer'}
                onClick={handleClose}
              >
                {BUTTON.CLOSE}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
};
