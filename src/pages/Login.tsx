import Logo from '@/pages/Logo.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import coreApi from '@/lib/api';
import { RESPONSE } from '@/constants/api.ts';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AlertConfig } from '@/components/custom/Alert.ts';

type LoginFormValue = {
  userId: string;
  password: string;
};

const initFormValue: LoginFormValue = {
  userId: '',
  password: '',
};

const Login = () => {
  const method = useForm<LoginFormValue>({
    defaultValues: initFormValue,
  });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register } = method;

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: '',
    description: '',
    onClose: () => {},
  });

  const onSubmit = async () => {
    const response = await coreApi.post('/auth/login', method.getValues());
    const data = response.data;

    if (data.resultCode === RESPONSE.SUCCESS) {
      // HttpOnly 쿠키 방식에서는 토큰이 자동으로 쿠키에 설정됨
      // 서버에서 반환된 사용자 정보를 localStorage에 저장
      const responseData = data.data;

      // 서버 응답 구조에 따라 사용자 정보 추출
      const userInfo = {
        userId: responseData.user?.userId || responseData.userId,
        userName: responseData.user?.userName || responseData.userName,
      };

      login(userInfo);

      setAlertConfig({
        title: '성공',
        description: '로그인에 성공하였습니다.',
        onClose: () => {
          setAlertOpen(false);
          navigate('/'); // 홈페이지로 리다이렉트
        },
      });
      setAlertOpen(true);
    } else {
      setAlertConfig({
        title: '오류',
        description: '로그인 중 오류가 발생하였습니다.\n' + data.resultMessage,
        onClose: () => setAlertOpen(false),
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription style={{ whiteSpace: 'pre-wrap' }}>
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={alertConfig.onClose}>닫기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex w-full flex-col" style={{ width: '500px' }}>
          <Logo />
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">로그인</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="userId">사용자 아이디</FieldLabel>
                    <Input
                      id="userId"
                      type="text"
                      {...register('userId')}
                      maxLength={30}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                    <Input id="password" type="password" {...register('password')} required />
                  </Field>
                  <Field>
                    <Button type="button" onClick={onSubmit}>
                      로그인
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
