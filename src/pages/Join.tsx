import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import Logo from '@/pages/Logo.tsx';
import { useForm } from 'react-hook-form';

type JoinFormValue = {
  name: string;
  email: string;
  password: string;
};

const initFormValue: JoinFormValue = {
  name: '',
  email: '',
  password: '',
};

const Join = () => {
  const method = useForm({
    defaultValues: initFormValue,
  });
  const { register } = method;

  const onSubmit = () => {
    console.log('join data ::: ', method.getValues());
  };

  return (
    <div>
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
                  <FieldLabel htmlFor="name">이름</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    {...register('name')}
                    placeholder="John Doe"
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
