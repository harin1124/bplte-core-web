import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Logo from '@/pages/Logo.tsx';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

type JoinFormValue = {
  userId: string;
  userName: string;
  email: string;
  password: string;
};

const initFormValue: JoinFormValue = {
  userId: '',
  userName: '',
  email: '',
  password: '',
};

const Join = () => {
  const method = useForm({
    defaultValues: initFormValue,
  });
  const { register } = method;
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const onSubmit = async () => {
    await axios
      .post('http://localhost:8080/bplte/core/auth/join', method.getValues())
      .catch((e) => {
        setAlertOpen(true);
        setAlertMessage('회원가입 중 오류가 발생하였습니다.\n' + e.message);
      });
  };

  return (
    <div>
      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>오류</AlertDialogTitle>
            <AlertDialogDescription style={{ whiteSpace: 'pre-wrap' }}>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>닫기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex w-full max-w-sm flex-col gap-6" style={{ width: '500px' }}>
        <Logo />
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">회원가입</CardTitle>
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
                    placeholder="john.doe"
                    maxLength={30}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="userName">이름</FieldLabel>
                  <Input
                    id="userName"
                    type="text"
                    {...register('userName')}
                    placeholder="John Doe"
                    maxLength={30}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">이메일</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                  <Input id="password" type="password" {...register('password')} required />
                  <FieldDescription>비밀번호는 10자 이상입니다.</FieldDescription>
                </Field>
                <Field>
                  <Button type="button" onClick={onSubmit}>
                    회원가입
                  </Button>
                  <FieldDescription className="text-center">
                    이미 회원가입을 하셨나요? <a href="#">로그인</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Join;
