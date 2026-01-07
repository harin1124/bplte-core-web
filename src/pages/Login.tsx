import Logo from '@/pages/Logo.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useForm } from 'react-hook-form';

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
  const { register } = method;

  return (
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
                  <Input id="userId" type="text" {...register('userId')} maxLength={30} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                  <Input id="password" type="password" {...register('password')} required />
                </Field>
                <Field>
                  <Button type="button" onClick={() => {}}>
                    로그인
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
